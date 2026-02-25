import net from "node:net";
import os from "node:os";
import path from "node:path";
import { execFile, spawn, type ChildProcess } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

interface RunningProcess {
  child: ChildProcess;
}

const frontendDir = path.resolve(__dirname, "../..");
const backendDir = path.resolve(__dirname, "../../../backend");
const schemaPath = path.resolve(__dirname, "../../../shared/schema/schema.sql");
const seedPath = path.resolve(__dirname, "../../../shared/schema/seed.sql");

const mysqlHost = process.env.TEST_MYSQL_HOST ?? "127.0.0.1";
const mysqlPort = Number(process.env.TEST_MYSQL_PORT ?? "3306");
const mysqlUser = process.env.TEST_MYSQL_USER ?? "root";
const mysqlPassword = process.env.TEST_MYSQL_PASSWORD ?? "";
const mysqlDatabase = process.env.TEST_MYSQL_DATABASE ?? "tve_month_db";

const phpHost = process.env.TEST_PHP_HOST ?? "127.0.0.1";
const phpPort = Number(process.env.TEST_PHP_PORT ?? "8000");
const phpBaseUrl = `http://${phpHost}:${phpPort}`;

const viteHost = process.env.TEST_VITE_HOST ?? "127.0.0.1";
const vitePort = Number(process.env.TEST_VITE_PORT ?? "5173");
const appBaseUrl = `http://${viteHost}:${vitePort}`;

function splitArgs(raw: string): string[] {
  if (!raw.trim()) return [];
  const parts: string[] = [];
  const re = /[^\s"]+|"([^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(raw)) !== null) {
    parts.push(match[1] ?? match[0]);
  }

  return parts;
}

async function isPortOpen(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const done = (result: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(600);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
    socket.connect(port, host);
  });
}

async function waitForPort(port: number, host: string, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortOpen(port, host)) {
      return;
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for ${host}:${port}`);
}

async function waitForHttp(url: string, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) {
        return;
      }
    } catch {
      // retry
    }
    await delay(300);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function spawnManagedProcess(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): RunningProcess {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout?.on("data", (chunk) => process.stdout.write(String(chunk)));
  child.stderr?.on("data", (chunk) => process.stderr.write(String(chunk)));

  return { child };
}

async function stopProcess(processRef: RunningProcess | null) {
  if (!processRef || processRef.child.killed || processRef.child.pid == null) {
    return;
  }

  const pid = processRef.child.pid;
  processRef.child.stdout?.removeAllListeners();
  processRef.child.stderr?.removeAllListeners();

  if (process.platform === "win32") {
    try {
      await execFileAsync("taskkill", ["/PID", String(pid), "/T", "/F"]);
      return;
    } catch {
      // fallback below
    }
  }

  processRef.child.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolve) => processRef.child.once("close", () => resolve())),
    delay(2_000),
  ]);
}

async function seedDatabase() {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "vitest-ptr-seed-"));
  const seedRunnerPath = path.join(tmpDir, "seed.php");
  const script = `<?php
$host = getenv('TEST_MYSQL_HOST') ?: '127.0.0.1';
$port = (int)(getenv('TEST_MYSQL_PORT') ?: '3306');
$user = getenv('TEST_MYSQL_USER') ?: 'root';
$password = getenv('TEST_MYSQL_PASSWORD') ?: '';
$schemaFile = getenv('TEST_SCHEMA_PATH');
$seedFile = getenv('TEST_SEED_PATH');

$db = new mysqli($host, $user, $password, '', $port);
if ($db->connect_error) {
    fwrite(STDERR, "MySQL connection failed: " . $db->connect_error . PHP_EOL);
    exit(1);
}

foreach ([$schemaFile, $seedFile] as $file) {
    $sql = file_get_contents($file);
    if ($sql === false) {
        fwrite(STDERR, "Failed reading SQL file: " . $file . PHP_EOL);
        exit(1);
    }

    if (!$db->multi_query($sql)) {
        fwrite(STDERR, "SQL error: " . $db->error . PHP_EOL);
        exit(1);
    }

    do {
        $result = $db->store_result();
        if ($result instanceof mysqli_result) {
            $result->free();
        }
    } while ($db->more_results() && $db->next_result());

    if ($db->errno) {
        fwrite(STDERR, "SQL execution error: " . $db->error . PHP_EOL);
        exit(1);
    }
}

$db->close();
`;

  await writeFile(seedRunnerPath, script, "utf8");

  try {
    await execFileAsync("php", [seedRunnerPath], {
      env: {
        ...process.env,
        TEST_MYSQL_HOST: mysqlHost,
        TEST_MYSQL_PORT: String(mysqlPort),
        TEST_MYSQL_USER: mysqlUser,
        TEST_MYSQL_PASSWORD: mysqlPassword,
        TEST_SCHEMA_PATH: schemaPath,
        TEST_SEED_PATH: seedPath,
      },
    });
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

export default async function globalSetup() {
  process.env.PUPPETEER_BASE_URL = appBaseUrl;

  let mysqlProcess: RunningProcess | null = null;
  let phpProcess: RunningProcess | null = null;
  let viteProcess: RunningProcess | null = null;
  let mysqlSpawned = false;

  const mysqlOpen = await isPortOpen(mysqlPort, mysqlHost);
  if (!mysqlOpen) {
    const mysqlCommand = process.env.TEST_MYSQLD_COMMAND ?? "mysqld";
    const mysqlArgs = [
      ...splitArgs(process.env.TEST_MYSQLD_ARGS ?? ""),
      `--port=${mysqlPort}`,
    ];
    mysqlProcess = spawnManagedProcess(mysqlCommand, mysqlArgs);
    mysqlSpawned = true;
    await waitForPort(mysqlPort, mysqlHost, 30_000);
  }

  await seedDatabase();

  const phpOpen = await isPortOpen(phpPort, phpHost);
  if (!phpOpen) {
    const phpCommand = process.env.TEST_PHP_COMMAND ?? "php";
    phpProcess = spawnManagedProcess(
      phpCommand,
      ["-S", `${phpHost}:${phpPort}`, "dev_router.php"],
      {
        cwd: backendDir,
        env: {
          ...process.env,
          MYSQL_HOST: mysqlHost,
          MYSQL_PORT: String(mysqlPort),
          MYSQL_USER: mysqlUser,
          MYSQL_PASSWORD: mysqlPassword,
          MYSQL_DATABASE: mysqlDatabase,
        },
      },
    );
    await waitForHttp(`${phpBaseUrl}/test`, 15_000);
  }

  const viteOpen = await isPortOpen(vitePort, viteHost);
  if (!viteOpen) {
    const pnpmCommand =
      process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    viteProcess = spawnManagedProcess(
      pnpmCommand,
      ["vite", "--host", viteHost, "--port", String(vitePort), "--strictPort"],
      { cwd: frontendDir },
    );
    await waitForHttp(`${appBaseUrl}/login`, 25_000);
  }

  return async () => {
    await stopProcess(viteProcess);
    await stopProcess(phpProcess);
    if (mysqlSpawned) {
      await stopProcess(mysqlProcess);
    }
  };
}

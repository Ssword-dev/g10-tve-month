# run as administrator

# -------------------------
# paths
# -------------------------

$projectRoot = [System.IO.Path]::GetDirectoryName("$PSScriptRoot")
$runtimeFolder = [System.IO.Path]::Combine($projectRoot, "runtime")
$cacheFolder = [System.IO.Path]::Combine($projectRoot, "cache")
$archivesFolder = [System.IO.Path]::Combine($cacheFolder, "archives")

# -------------------------
# ensure folder helper
# -------------------------
function Ensure-Directory([string]$path) {
    if (-not [System.IO.Directory]::Exists($path)) {
        [System.IO.Directory]::CreateDirectory($path) | Out-Null
    }
}

# -------------------------
# Archive class (Zip Abstraction)
# -------------------------
class Archive {
    [string]$ArchiveName

    Archive([string]$archiveName) {
        $this.ArchiveName = $archiveName
    }

    [string]ComputeRealPath() {
        return [System.IO.Path]::Combine($global:archivesFolder, $this.ArchiveName)
    }

    [void]ExtractInto([string]$destination) {
        if (-not (Test-Path $this.ComputeRealPath())) {
            Write-Host "Archive not found: $($this.ArchiveName)"
            return
        }

        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($this.ComputeRealPath(), $destination)
        Write-Host "Extracted $($this.ArchiveName) into $destination"
    }

    static [void]Download([string]$archiveName, [string]$archiveLink, [bool] $useBrowserUserAgent) {
        $destination = [System.IO.Path]::Combine($global:archivesFolder, $archiveName)

        if (-not (Test-Path $destination)) {
            Write-Host "Downloading $archiveLink ..."
            $wc = New-Object System.Net.WebClient
            
            <# Fool the servers in thinking we are on a browser if needed #>
            if ($useBrowserUserAgent) {
                $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
            }

            <# Download the zip file. #>
            $wc.DownloadFile($archiveLink, $destination)
            $wc.Dispose()
            Write-Host "Saved to $destination"
        }
        else {
            Write-Host "Already exists: $destination"
        }
    }
}

# -------------------------
# prepare folders
# -------------------------
Ensure-Directory $runtimeFolder
Ensure-Directory $archivesFolder

# -------------------------
# list of runtimes to install
# -------------------------
$runtimes = @(
    @{ Name = "nginx-1.26.0.zip"; Url = "https://nginx.org/download/nginx-1.26.0.zip"; ExtractTo = [System.IO.Path]::Combine($runtimeFolder, "nginx") },
    @{ Name = "php-8.2.12.zip"; Url = "https://windows.php.net/downloads/releases/php-8.2.12-Win32-vs16-x64.zip"; ExtractTo = [System.IO.Path]::Combine($runtimeFolder, "php") },
    @{ Name = "mysql-9.6.0.zip"; Url = "https://cdn.mysql.com//Downloads/MySQL-9.6/mysql-9.6.0-winx64.zip"; ExtractTo = [System.IO.Path]::Combine($runtimeFolder, "mysql") }
)

# -------------------------
# orchestrate download + extract
# -------------------------
foreach ($runtime in $runtimes) {
    $archive = [Archive]::new($runtime.Name)

    # download (static method)
    [Archive]::Download($runtime.Name, $runtime.Url, $true)

    # ensure destination folder exists
    Ensure-Directory $runtime.ExtractTo

    # extract
    $archive.ExtractInto($runtime.ExtractTo)
}

Write-Host "All runtimes installed successfully!"

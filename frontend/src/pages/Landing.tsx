import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Skeleton from "@/components/Skeleton";
import Text from "@/components/Text";
import { motion } from "framer-motion";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import landingPageHeroBannerImageSource from "../assets/landing_page_hero_banner_image.png";
import landingPageTrustBannerImageSource from "../assets/landing_page_trust_banner_image.png";

/* ---------------------------------------------
 * animation factories
 * --------------------------------------------- */

type MotionDivProps = React.ComponentProps<typeof motion.div>;

const animationPresets = {
  fadeUp: ({
    y = 20,
    duration = 0.6,
    delay = 0,
    once = true,
  }: {
    y?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
  } = {}): MotionDivProps => ({
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once },
    transition: { duration, delay, ease: "easeOut" },
  }),

  slideInX: ({
    x = -100,
    duration = 0.75,
    delay = 0,
    once = true,
    amount = 0.2,
  }: {
    x?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    amount?: number;
  } = {}): MotionDivProps => ({
    initial: { opacity: 0, x },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once, amount },
    transition: { duration, delay, ease: "easeOut" },
  }),

  staggerContainer: ({
    stagger = 0.15,
    once = true,
    amount = 0.2,
  }: {
    stagger?: number;
    once?: boolean;
    amount?: number;
  } = {}): MotionDivProps => ({
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, amount },
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren: stagger },
      },
    },
  }),

  staggerItem: ({
    y = 30,
    duration = 0.6,
  }: {
    y?: number;
    duration?: number;
  } = {}): MotionDivProps => ({
    variants: {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0 },
    },
    transition: { duration, ease: "easeOut" },
  }),
};

/* ---------------------------------------------
 * hero
 * --------------------------------------------- */

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="h-screen flex items-center bg-background">
      <div className="w-1/2 grid grid-cols-1 lg:grid-cols-2 ml-12 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <Text size="2xl" className="font-bold" asChild>
            <motion.h1
              {...animationPresets.fadeUp({
                y: 30,
                duration: 2.4,
              })}
            >
              Empower Your School.
              <br />
              Manage Staff with Ease.
            </motion.h1>
          </Text>

          <motion.p
            className="text-lg text-text-muted"
            {...animationPresets.fadeUp({
              y: 20,
              duration: 2.4,
              delay: 0.2,
            })}
          >
            A secure, modern system to manage employee records, assignments, and
            professional development — without the overhead.
          </motion.p>

          <motion.div
            {...animationPresets.fadeUp({
              y: 10,
              duration: 2.4,
              delay: 0.4,
            })}
          >
            <Button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="h-full w-1/2 bg-surface"
        {...animationPresets.fadeUp({ delay: 0.5 })}
      >
        <img
          className="w-full h-full"
          src={landingPageHeroBannerImageSource}
        ></img>
      </motion.div>
    </section>
  );
}

/* ---------------------------------------------
 * features (full screen)
 * --------------------------------------------- */

const features = [
  {
    title: "Employee Records",
    description:
      "Maintain accurate profiles for all staff, including roles, departments, and contact info.",
  },
  {
    title: "Ease of Use",
    description:
      "Quickly search, filter, and manage staff data with an intuitive interface.",
  },
  {
    title: "Secure Access",
    description:
      "Role-based access control ensures sensitive employee data is protected.",
  },
];

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full p-6 rounded-xl border border-border bg-surface shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle asChild>
          <Text size="xl" className="text-center font-semibold">
            {title}
          </Text>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-text-muted text-center">{description}</p>
      </CardContent>
    </Card>
  );
}

function PostHeroSection() {
  return (
    <section className="min-h-screen px-6 flex items-center bg-surface">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center gap-12">
        <motion.div {...animationPresets.slideInX()}>
          <Text size="4xl" align="center" className="font-bold">
            Built for real school workflows
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
          {...animationPresets.staggerContainer()}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} {...animationPresets.staggerItem()}>
              <Feature {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
 * how it works
 * --------------------------------------------- */

function HowItWorksSection() {
  const steps = [
    {
      title: "Set up in minutes",
      text: "Create your school profile and invite staff.",
    },
    {
      title: "Organize everything",
      text: "Centralize records, roles, and courses.",
    },
    {
      title: "Stay in control",
      text: "Manage access and track updates effortlessly.",
    },
  ];

  return (
    <section className="min-h-screen px-6 flex items-center bg-background">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div {...animationPresets.fadeUp()}>
          <Text size="4xl" className="font-bold">
            How it works
          </Text>
        </motion.div>

        <motion.div {...animationPresets.staggerContainer()}>
          {steps.map((step) => (
            <motion.div
              key={step.title}
              className="mb-6"
              {...animationPresets.staggerItem({ y: 20 })}
            >
              <Text size="lg" weight="bold">
                {step.title}
              </Text>
              <Text className="text-text-muted">{step.text}</Text>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="w-screen h-screen px-6 flex flex-row items-center bg-background">
      <motion.div
        className="h-full w-1/2 flex flex-col gap-6 justify-center items-center"
        {...animationPresets.fadeUp()}
      >
        <Text size="4xl" className="font-bold">
          Built with security and reliability in mind
        </Text>

        <Text className="text-text-muted mt-4">
          Designed for schools that care about data privacy, long-term
          maintainability, and ease of adoption.
        </Text>
      </motion.div>
      <motion.div
        className="h-full w-1/2"
        {...animationPresets.fadeUp()}
      ></motion.div>
    </section>
  );
}

function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen w-screen px-6 flex items-center bg-background">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="flex flex-col gap-6"
          {...animationPresets.slideInX()}
        >
          <Text size="2xl" weight="bold">
            Ready to jump into action?
          </Text>

          <Text className="text-text-muted">
            Get your staff management under control in minutes — no training
            required.
          </Text>

          <Button
            className="self-start px-8 py-3 text-lg"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </motion.div>

        <motion.div {...animationPresets.fadeUp()}>
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
 * page
 * --------------------------------------------- */

export default function LandingPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-background text-text overflow-x-hidden">
      <HeroSection />
      <PostHeroSection />
      <TrustSection />
      {/* <HowItWorksSection /> */}
      <CallToAction />
    </main>
  );
}

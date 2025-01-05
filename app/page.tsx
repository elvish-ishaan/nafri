"use client"

import { Button } from "@/components/ui/button";
import Features from "@/components/ui/mianLanding/Features";
import Footer from "@/components/ui/mianLanding/Footer";
import Initials from "@/components/ui/mianLanding/Initials";
import { MotionCards } from "@/components/ui/mianLanding/MotionCards";
import Reviews from "@/components/ui/mianLanding/Reviews";
import NavBar from "@/components/ui/nav/NavBar";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section>
      <div className="min-h-screen">
        <NavBar />
        <Initials />
        <MotionCards />
        <div className="flex flex-col justify-center items-center my-14">
          <p className="text-muted-foreground">Get Free 20 GB Of Storage</p>
          <div className="flex justify-center mt-5 gap-5">
            <Link href={"/auth/sign-in"}>
              <Button>Get Started</Button>
            </Link>
            <Button variant="outline" onClick={scrollToFeatures}>
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Attach ref to the Features section */}
      <div ref={featuresRef}>
        <Features />
      </div>

      <Reviews />
      <Footer />
    </section>
  );
}

"use client";

import Features from "@/components/ui/mianLanding/Features";
import Footer from "@/components/ui/mianLanding/Footer";
import Initials from "@/components/ui/mianLanding/Initials";
import Reviews from "@/components/ui/mianLanding/Reviews";
import NavBar from "@/components/ui/nav/NavBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import HeroImg from "@/components/ui/mianLanding/HeroImg";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const {data: session} = useSession()
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  },[ session?.user, router])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section>
      <div className="min-h-screen relative">
        <div className="relative z-20">
          <NavBar />
          <Initials />
          <div className="flex flex-col justify-center items-center -mt-5">
            <p className="text-muted-foreground">Get Free 20 GB Of Storage</p>
            <div className="flex justify-center mt-5 gap-5">
              <Link href="/auth/sign-in" className="relative z-20">
                <Button className="relative pointer-events-auto">
                  <span>Get Started</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={scrollToFeatures}
                className="relative pointer-events-auto z-20"
              >
                Learn More
              </Button>
            </div>
          </div>
          <HeroImg/>
        </div>
        <BackgroundBeams className="absolute inset-0 z-10 pointer-events-none" />
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

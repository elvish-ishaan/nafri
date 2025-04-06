import React from "react";
import Image from "next/image";
import nafriShot from '@/app/assets/main/cardImg.png'

const HeroImg = () => {
  return (
    <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:h-screen bg-transparent overflow-hidden py-10 sm:py-0 sm:-mt-10 md:-mt-20">
      {/* Hide on mobile, show on medium screens and up */}
      <div className="hidden md:block shadow-2xl shadow-muted-foreground p-4 bg-muted rounded-md">
        <Image
          src={nafriShot}
          alt="Hero Image"
          width={800} 
          height={800} 
          className="relative z-10 max-w-3xl rounded-lg shadow-lg"
          priority
        />
      </div>
      
      {/* Mobile alternative content */}
      <div className="md:hidden flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-4">Secure Cloud Storage</h2>
        <p className="text-center text-muted-foreground">
          Access your files anywhere, anytime with NAFRI&apos;s cloud solution
        </p>
      </div>
    </div>
  );
};

export default HeroImg;
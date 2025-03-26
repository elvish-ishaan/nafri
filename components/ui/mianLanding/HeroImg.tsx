import React from "react";
import Image from "next/image";
import nafriShot from '@/app/assets/main/cardImg.png'

const HeroImg = () => {
  return (
    <div className=" -mt-20 relative flex items-center justify-center h-screen bg-transparent overflow-hidden">
      <div className=" shadow-2xl shadow-muted-foreground shad p-4 bg-muted rounded-md">
      <Image
        src={nafriShot}
        alt="Hero Image"
        width={800} 
        height={800} 
        className="relative z-10 max-w-3xl rounded-lg shadow-lg"
      />
      </div>
    </div>
  );
};

export default HeroImg;
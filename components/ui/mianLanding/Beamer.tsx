import Image from "next/image";
import React from "react";
import nafriShot from "@/app/assets/main/cardImg.png";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Card, CardContent } from "../card";

const Beamer = () => {
  return (
    <div className="relative mx-32 h-auto w-auto">
      <Card className="relative h-auto w-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-lg">
        <CardContent className="relative h-full w-full flex items-center justify-center p-0">
          <Image
            src={nafriShot}
            alt="nafriImg"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </CardContent>
        <BorderBeam duration={8} size={100} className="absolute inset-0" />
      </Card>
    </div>
  );
};

export default Beamer;

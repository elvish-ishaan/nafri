"use client"
import * as React from "react"
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageIcon, VideoIcon, FileTextIcon } from "lucide-react";

const cardsData = [
  {
    id: 1,
    title: "Images",
    description: "Store and share your photos seamlessly.",
    icon: <ImageIcon size={58} />,
  },
  {
    id: 2,
    title: "Videos",
    description: "Stream and share videos in real-time.",
    icon: <VideoIcon size={58} />,
  },
  {
    id: 3,
    title: "PDFs",
    description: "Organize and secure your documents.",
    icon: <FileTextIcon size={58} />,
  },
];

export function MotionCards() {
  return (
    <div className="flex flex-wrap justify-center gap-5 text-center my-5 px-4">
      {cardsData.map((card) => (
        <motion.div
          key={card.id}
          className="w-full sm:w-[300px] md:w-[320px] lg:w-[350px] h-auto"
          animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full flex justify-center items-center">
                {card.icon}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

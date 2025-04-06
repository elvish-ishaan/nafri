"use client"
import React from 'react'
import { mainPara } from "@/data/mainLanding";
import { motion } from "framer-motion";

const Initials = () => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center my-6 sm:my-8 md:my-10 px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-8xl text-center font-semibold leading-tight">
        Next-Gen Cloud <span className='text-blue-600'>Redefined</span>
      </h1>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-center text-muted-foreground mt-4 max-w-3xl">
        {mainPara}
      </p>
    </motion.div>
  )
}

export default Initials
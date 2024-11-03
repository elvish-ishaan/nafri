"use client"
import React from 'react'
import { mainPara } from "@/data/mainLanding";
import { motion } from "framer-motion";


const Initials = () => {
  return (
    <motion.div
         className=" flex flex-col justify-center items-center my-10"
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
       >
         <h1 className="text-8xl font-semibold">Next-Gen Cloud <span className=' text-blue-600'>Redefined</span></h1>
         <p className="text-muted-foreground">{mainPara}</p>
      </motion.div>
  )
}

export default Initials
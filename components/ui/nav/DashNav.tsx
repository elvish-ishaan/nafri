"use client"
import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Gift, LucideHeadphones } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const DashNav = () => {
  const { data } = useSession()
  const name = data?.user?.name?.slice(0,1).toUpperCase() || 'GU'
  return (
    <div className=' py-8 flex justify-end  w-full'>
        <div className='flex items-center gap-5 px-8'>
            <Gift/>
            <Link href={'/contactus'}><LucideHeadphones className=' hover:text-muted-foreground transition'/></Link>
            <Avatar>
             <AvatarImage src={data?.user?.image || ''} alt="@profile_url" />
             <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
        </div>
    </div>

  )
}

export default DashNav
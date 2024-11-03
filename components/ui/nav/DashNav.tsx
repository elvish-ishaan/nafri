import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Gift, LucideHeadphones } from 'lucide-react'

const DashNav = ({profileUrl, name}:{profileUrl?: string, name: string}) => {
  return (
    <div className=' py-8 flex justify-end  w-full'>
        <div className='flex items-center gap-5 px-8'>
            <Gift/>
            <LucideHeadphones className=' hover:text-muted-foreground transition'/>
            <Avatar>
             <AvatarImage src={profileUrl} alt="@profile_url" />
             <AvatarFallback>{name.slice(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
    </div>

  )
}

export default DashNav
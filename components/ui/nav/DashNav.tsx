"use client"
import React, { useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Gift, LucideHeadphones, Menu, Moon, Sun, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import SideBar from '../space/SideBar'
import { Button } from '../button'
import { useTheme } from 'next-themes'

const DashNav = () => {
  const { data } = useSession()
  const name = data?.user?.name?.slice(0,1).toUpperCase() || 'GU'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <div className='py-4 sm:py-8 flex items-center justify-between w-full px-4 sm:px-8'>
        {/* Mobile menu toggle button - only visible on small screens */}
        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          {/* Mobile logo */}
          <span className="ml-2 text-2xl font-semibold tracking-wider">NAFRI</span>
        </div>
        
        {/* Right side icons and avatar */}
        <div className='flex items-center gap-3 sm:gap-5'>
          {/* Dark mode toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Hide these icons on extra small screens */}
          <span className="hidden xs:block">
            <Gift className="h-5 w-5" />
          </span>
          <span className="hidden xs:block">
            <Link href={'/contactus'}>
              <LucideHeadphones className='hover:text-muted-foreground transition h-5 w-5' />
            </Link>
          </span>
          
          {/* Avatar - show only the fallback on mobile */}
          <Avatar>
            <AvatarImage src={data?.user?.image || ''} alt="@profile_url" className="hidden sm:block" />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile sidebar - shown only when menu is open on mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background">
          <div className="h-full overflow-y-auto">
            <SideBar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default DashNav
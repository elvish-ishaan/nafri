'use client'

import { Button } from '../button'
import { Cloud, Menu, X, Moon, Sun } from 'lucide-react'
import { landNavLinks } from '@/data/landingNavLinks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'

const NavBar = ({ extraClasses }: { extraClasses?: string }) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className={`w-full ${extraClasses}`}>
      {/* Desktop Navigation */}
      <div className="container mx-auto flex justify-between items-center py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
        <div className="flex items-center">
          <Cloud className="h-6 w-6 sm:h-8 sm:w-8 hover:text-muted-foreground" />
        </div>
        
        
        {/* Desktop-only nav links */}
        <div className="hidden md:flex gap-6 items-center">
          {landNavLinks.map((link) => (
            <Link
              className="hover:text-muted-foreground transition-colors"
              key={link.id}
              href={link.path}
            >
              {link.title}
            </Link>
          ))}
        </div>
        
        {/* Sign In button */}
        <div className="hidden ml-6 md:flex items-center md:gap-3">
               {/* Theme toggle visible on all screen sizes */}
               <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={toggleTheme}
                   className="ml-auto md:ml-0"
                   aria-label="Toggle theme"
                 >
                   {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button onClick={() => router.push('/auth/sign-in')}>Sign In</Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-[70px]">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {landNavLinks.map((link) => (
              <Link
                className="text-lg py-2 hover:text-muted-foreground transition-colors"
                key={link.id}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <div className="pt-4">
              <Button 
                className="w-full" 
                onClick={() => {
                  router.push('/auth/sign-in');
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar

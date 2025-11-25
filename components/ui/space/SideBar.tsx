"use client";

import React, { useEffect, useState } from 'react';
import { Home, Star, Trash2, Settings, LogOut, Cloud, BookOpenText, X, Sun, Moon } from 'lucide-react';
import UploadBtn from './Upload';
import StorageCells from './StorageCells';
import { Separator } from '../separator';
import { Button } from '../button';
import { signOut } from 'next-auth/react';
import { fetchUserData } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';
import PricingCards from './PricingCards';
import { PricingModal } from './PricingModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const links = [
  { title: 'My Space', path: '/dashboard', icon: Home },
  // { title: 'Recents', path: '/recents', icon: Clock },
  { title: 'Starred', path: '/starred', icon: Star },
  // { title: 'Share with me', path: '/shared', icon: Share2 },
  { title: 'Bin', path: '/bin', icon: Trash2 },
  { title: 'Docs', path: '/docs', icon: BookOpenText}
];


interface UserStorage {
  value: number,
  outOf: number
}

interface SideBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function SideBar({ isMobile = false, onClose }: SideBarProps) {
  const [userStorage, setUserStorage] = useState<UserStorage>({value: 0, outOf: 0})
  const {toast} = useToast()
  const [isUpgModelOpen, setIsUpgModelOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
   try {
    //fetch user
    const fetchUser = async () => {
      const userData = await fetchUserData()
      setUserStorage({
        value: Number(userData.user?.currentSpace) / (1024 * 1024 * 1024), // assuming 'currentStorage' is in bytes
        outOf: Number(userData.user?.totalSpace) / (1024 * 1024 * 1024), // assuming 'totalSpace' is in bytes
      });
    }
    //call func
    fetchUser()
   } catch (error) {
    console.log(error,'cant get user data')
    toast({
      title: 'cant fetch user data'
    })
   }
  },[toast])

  //hanlding upgrade
  const handleUpgrade = () => {
     //set modal to true
     setIsUpgModelOpen(true)
  }

  return (
    <div className="flex h-screen flex-col text-foreground w-full md:w-64 border-foreground-muted md:border-r-2">
      {/* upgrade modal */}
      <div className='w-full'>
      { isUpgModelOpen && <PricingModal open={isUpgModelOpen} onClose={() => setIsUpgModelOpen(false)}>
        <PricingCards userStorage={userStorage} setUserStorage={setUserStorage}/>
      </PricingModal> }
      </div>

      {/* Sidebar Header with close button for mobile */}
      <div className="px-4 py-4 border-b border-muted-foreground flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-wider">NAFRI</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <div className='my-5 mx-auto px-5'>
          <UploadBtn/>
        </div>
        <nav className="mt-4">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center px-4 py-2 transition-colors ${
                  isActive 
                    ? 'bg-muted text-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={isMobile && onClose ? onClose : undefined}
              >
                <link.icon className="mr-3 h-5 w-5" />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>
        <Separator className='my-2'/>
        <div className='flex flex-col px-4 my-5'>
           <div className='flex gap-2 text-muted-foreground'>
              <Cloud/><span>Storage</span>
           </div>
            <div className='px-1 mt-3 flex flex-col justify-between'>
               <StorageCells value={userStorage.value}
                outOf={userStorage.outOf}/>
               <Button onClick={handleUpgrade} variant={'outline'} className="w-full">Upgrade</Button>
            </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 py-4">
        <div>
          <Link 
            href="/settings" 
            className="flex items-center px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
        <div>
          <button
            onClick={() => {
              signOut();
              if (isMobile && onClose) onClose();
            }}
            className="flex items-center w-full px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

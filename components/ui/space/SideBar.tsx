"use client";

import React, { useEffect, useState } from 'react';
import { Home, Star, Trash2, Settings, LogOut, Cloud } from 'lucide-react';
import UploadBtn from './Upload';
import StorageCells from './StorageCells';
import { Separator } from '../separator';
import { Button } from '../button';
import { signOut } from 'next-auth/react';
import { fetchUserData } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';

const links = [
  { title: 'My Space', path: '/dashboard', icon: Home },
  // { title: 'Recents', path: '/recents', icon: Clock },
  { title: 'Starred', path: '/starred', icon: Star },
  // { title: 'Share with me', path: '/shared', icon: Share2 },
  { title: 'Bin', path: '/bin', icon: Trash2 },
];


interface  UserStorage {
  value: number,
  outOf: number
}
export default function SideBar() {
  const [userStorage, setUserStorage] = useState<UserStorage>({value: 0, outOf: 0})
  const {toast} = useToast()

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
  },[])
  return (
    <div className="flex h-screen flex-col text-foreground w-64 border-foreground-muted border-r-2">
      {/* Sidebar Header */}
      <div className="px-4 py-4 border-b border-muted-foreground">
        <h2 className=" text-2xl font-semibold">Next Cloud</h2>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1  overflow-y-auto">
        <div className=' my-5 mx-auto px-5' >
          <UploadBtn/>
        </div>
        <nav className="mt-4">
          {links.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="flex items-center px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground hover:text-white transition-colors"
            >
              <link.icon className="mr-3 h-5 w-5" />
              <span>{link.title}</span>
            </a>
          ))}
        </nav>
        <Separator className=' my-2'/>
        <div className=' flex flex-col px-4 my-5'>
           <div className=' flex gap-2 text-muted-foreground'>
              <Cloud/><span >Storage</span>
           </div>
            <div className=' px-1 mt-3 flex flex-col justify-between'>
               <StorageCells value={ userStorage.value }
                outOf={userStorage.outOf }/>
               <Button variant={'outline'}>Upgrade</Button>
            </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 py-4 ">
        <div>
          <a href="/settings" className="flex items-center px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground hover:text-white transition-colors">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </a>
        </div>
        <div>
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

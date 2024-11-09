"use client"
import React, { useState } from 'react'
import { DialogDescription, DialogTitle } from '../dialog'
import { Button } from '../button'
import { Download, Plus, Share2, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { addToStarred } from '@/app/actions/uploads'
import { useSession } from 'next-auth/react'

//refactor the whole props send filedetails as whole object and then
//extract other info from it

const FileModalNav = ({fileKey, uploadDate, fileId, starred, fileOwner}:
  {fileKey: string, uploadDate: string, fileId: string, starred: boolean, fileOwner: string}) => {
    const [addedToStarred, setAddedToStarred] = useState<boolean>(starred)
    const { toast } = useToast()
    const [copyStatus, setCopySatus] = useState<boolean>(false)
    const { data } = useSession()
    //handling add to starred
    const handleStarClk = async () => {
      try {
        await addToStarred(fileId)
        setAddedToStarred(true)
      } catch (error) {
        console.log(error,'error in updating starred file')
        toast({
          title: "please try again"
        })
      }
    }
    
    //handling share button
    const handleShare = (fileId: string) => {
       const baseUrl = process.env.BASE_URL || 'http://localhost:3000'   //fix this
       navigator.clipboard.writeText( baseUrl + "/share" + "/" + fileId)
       setCopySatus(true)
       setInterval(() => {
        setCopySatus(false)
       }, 2000);
    }
  return (
    <div className="flex justify-between items-center">
          <div className='flex flex-col mb-4'>
            <DialogTitle>{fileKey}</DialogTitle>
            <DialogDescription className=" mt-1">
              {new Date(uploadDate).toLocaleString()}
            </DialogDescription>
          </div>
           
           <div>
             {
              data?.user?.email !== fileOwner && <Button><Plus/> Add To Space</Button>
             }
           </div>

          <div className=' px-10 flex items-center gap-3'>
            <Button onClick={() => handleShare(fileId)}><Share2/>{ copyStatus ?  <p>copied</p> : <p>Share</p>}</Button>
            <Button><Download/>Download</Button>
            {
              addedToStarred ? <Button><Star fill='yellow'/></Button> 
              : <Button onClick={handleStarClk}><Star/></Button>
            }
          </div>
        </div>
  )
}

export default FileModalNav
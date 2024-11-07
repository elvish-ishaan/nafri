"use client"
import React, { useState } from 'react'
import { DialogDescription, DialogTitle } from '../dialog'
import { Button } from '../button'
import { Download, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { addToStarred } from '@/app/actions/uploads'

const FileModalNav = ({fileKey, uploadDate, fileId, starred}:{fileKey: string, uploadDate: string, fileId: string, starred: boolean}) => {
    const [addedToStarred, setAddedToStarred] = useState<boolean>(starred)
    const { toast } = useToast()
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
  return (
    <div className="flex justify-between items-center">
          <div className='flex flex-col mb-4'>
            <DialogTitle>{fileKey}</DialogTitle>
            <DialogDescription className=" mt-1">
              {new Date(uploadDate).toLocaleString()}
            </DialogDescription>
          </div>

          <div className=' px-10 flex items-center gap-3'>
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
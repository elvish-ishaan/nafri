"use client"
import React from 'react'
import { DialogDescription, DialogTitle } from '../dialog'
import { Button } from '../button'
import { Download, Star } from 'lucide-react'

const FileModalNav = ({fileKey, uploadDate}:{fileKey: string, uploadDate: string}) => {
    const starred = false
    //handling add to starred
    const handleStarClk = () => {}
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
            <Button onClick={ handleStarClk }>{
                starred ? <Star fill='yellow'/> : <Star/> 
                }</Button>
          </div>
        </div>
  )
}

export default FileModalNav
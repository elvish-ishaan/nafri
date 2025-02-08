"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { DialogDescription, DialogTitle } from '../dialog'
import { Button } from '../button'
import {  Download, Plus, Redo2, Share2, Star, } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { addFileToSpace, addToStarred, fetchSignedUrl, restoreFile } from '@/app/actions/uploads'
import { useSession } from 'next-auth/react'

//refactor the whole props send filedetails as whole object and then
//extract other info from it

const FileModalNav = ({fileKey, uploadDate, fileId, starred, fileOwner}:
  {fileKey: string, uploadDate: string, fileId: string, starred: boolean, fileOwner: string, fileUrl: string}) => {
    const [addedToStarred, setAddedToStarred] = useState<boolean>(starred)
    const { toast } = useToast()
    const [copyStatus, setCopySatus] = useState<boolean>(false)
    const { data } = useSession()
    const [addedFileStatus, setFileAddedStatus] = useState<boolean>(false)
    const [currentPath, setCurrentPath] = useState('');
    const [isRestored, setIsRestored] = useState<boolean>(false)
    const [downloadUrl, setDownloadUrl] = useState<string>('')


    const fetchDownLink = useCallback(async () => { 
      const res = await fetchSignedUrl(fileKey, true)
      setDownloadUrl(res?.signedUrl || '')
    }, [fileKey]); // Add fileKey as dependency

    useEffect(() => {
        // Get the full URL path on the client side
        setCurrentPath(window.location.pathname);
        //getting downloadable url
        fetchDownLink()
    },[fetchDownLink]);

    //handling add to starred
    const handleStarClk = async () => {
      try {
        const res = await addToStarred(fileId)
        if(res.success){
          setAddedToStarred(!addedToStarred)
          toast({
            title: !addedToStarred ? 'starred' : 'unstarred'
          })
        }
      } catch (error) {
        console.log(error,'error in updating starred file')
        toast({
          title: "please try again"
        })
      }
    }
    
    //handling share button
    const handleShare = (fileId: string) => {
       const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
       navigator.clipboard.writeText( baseUrl + "/share" + "/" + fileId)
       setCopySatus(true)
       setInterval(() => {
        setCopySatus(false)
       }, 2000);
    }

    //adding share file to own space
    const addToSpace = async (fileId: string) => {
        try {
          const res = await addFileToSpace(fileId, data?.user?.email || '')
          if(!res.success){
            toast({
              title: 'something went wrong'
            })
          }
          setFileAddedStatus(true)
        } catch (error) {
          console.log(error,'error in adding shared file to user space')
          toast({
            title: 'internal server error'
          })
        }
    }

    //hanlding file restoration
    const handleFileRes = async (fileId: string) => {
      try {
        const res = await restoreFile(fileId);

        if(res?.success){
          setIsRestored(true)
          toast({
            title: 'File Restored',
          })
        }else{
          toast({
            title: 'File Cant Be Restored',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.log(error,'error in restoring file')
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
           
           <div>
             {
              data?.user?.email !== fileOwner && <Button onClick={ () => addToSpace(fileId)}>
                {
                  !addedFileStatus ? <span className=' flex gap-2'><Plus/>Add To Space</span> :
                   <span className={addedFileStatus && 'text-green-600'}>Added</span>
                }
              </Button>
             }
           </div>
        

          <div className=' px-10 flex items-center gap-3'>
            {
              currentPath === '/bin' && data?.user?.email == fileOwner && <Button
               onClick={() => handleFileRes(fileId)}>{isRestored ?
                 <span className=' flex items-center gap-2'><Redo2/>Restored</span> 
                 : <span>Restore</span>}</Button>
            }

            <Button onClick={() => handleShare(fileId)}><Share2/>{ copyStatus ?  <p>copied</p> : <p>Share</p>}</Button>
            
           <a href={downloadUrl}><Button><Download/>Download</Button></a>
            {
              addedToStarred ? <Button onClick={handleStarClk}><Star fill='yellow'/></Button> 
              : <Button onClick={handleStarClk}><Star/></Button>
            }
          </div>
        </div>
  )
}

export default FileModalNav
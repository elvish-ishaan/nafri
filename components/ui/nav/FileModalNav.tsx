"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { DialogDescription, DialogTitle } from '../dialog'
import { Button } from '../button'
import { Download, Menu, Plus, Redo2, Share2, Star, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { addFileToSpace, addToStarred, fetchSignedUrl, restoreFile } from '@/app/actions/uploads'
import { useSession } from 'next-auth/react'

//refactor the whole props send filedetails as whole object and then
//extract other info from it

const FileModalNav = ({fileKey, uploadDate, fileId, starred, fileOwner}:
  {fileKey: string, uploadDate: string, fileId: string, starred: boolean, fileOwner: string, fileUrl?: string}) => {
    const [addedToStarred, setAddedToStarred] = useState<boolean>(starred)
    const { toast } = useToast()
    const [copyStatus, setCopySatus] = useState<boolean>(false)
    const { data } = useSession()
    const [addedFileStatus, setFileAddedStatus] = useState<boolean>(false)
    const [currentPath, setCurrentPath] = useState('');
    const [isRestored, setIsRestored] = useState<boolean>(false)
    const [downloadUrl, setDownloadUrl] = useState<string>('')
    const [showMobileActions, setShowMobileActions] = useState(false)

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
       setTimeout(() => {
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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
      {/* File info section */}
      <div className='flex flex-col mb-2 sm:mb-4'>
        <DialogTitle className="text-base sm:text-lg md:text-xl truncate max-w-[250px] sm:max-w-[300px] md:max-w-full">
          {fileKey}
        </DialogTitle>
        <DialogDescription className="mt-1 text-xs sm:text-sm">
          {new Date(uploadDate).toLocaleString()}
        </DialogDescription>
      </div>
      
      {/* Add to space button (desktop) */}
      <div className="hidden sm:block">
        {data?.user?.email !== fileOwner && (
          <Button onClick={() => addToSpace(fileId)}>
            {!addedFileStatus ? (
              <span className="flex gap-2"><Plus/>Add To Space</span>
            ) : (
              <span className={addedFileStatus ? 'text-green-600' : ''}>Added</span>
            )}
          </Button>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="sm:hidden flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowMobileActions(!showMobileActions)}
          aria-label="Toggle actions menu"
        >
          {showMobileActions ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile actions menu */}
      {showMobileActions && (
        <div className="sm:hidden flex flex-col space-y-2 mb-4">
          {data?.user?.email !== fileOwner && (
            <Button 
              className="w-full justify-start" 
              onClick={() => {
                addToSpace(fileId);
                setShowMobileActions(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {!addedFileStatus ? 'Add To Space' : 'Added'}
            </Button>
          )}
          
          {currentPath === '/bin' && data?.user?.email === fileOwner && (
            <Button 
              className="w-full justify-start" 
              onClick={() => {
                handleFileRes(fileId);
                setShowMobileActions(false);
              }}
            >
              <Redo2 className="mr-2 h-4 w-4" />
              {isRestored ? 'Restored' : 'Restore'}
            </Button>
          )}
          
          <Button 
            className="w-full justify-start" 
            onClick={() => {
              handleShare(fileId);
              setShowMobileActions(false);
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {copyStatus ? 'Copied' : 'Share'}
          </Button>
          
          <a href={downloadUrl} className="block w-full">
            <Button className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
          
          <Button 
            className="w-full justify-start" 
            onClick={() => {
              handleStarClk();
              setShowMobileActions(false);
            }}
          >
            <Star className="mr-2 h-4 w-4" fill={addedToStarred ? 'yellow' : 'none'} />
            {addedToStarred ? 'Unstar' : 'Star'}
          </Button>
        </div>
      )}

      {/* Desktop actions */}
      <div className="hidden sm:flex items-center gap-2">
        {currentPath === '/bin' && data?.user?.email === fileOwner && (
          <Button onClick={() => handleFileRes(fileId)}>
            <Redo2 className="mr-1" />
            {isRestored ? 'Restored' : 'Restore'}
          </Button>
        )}

        <Button onClick={() => handleShare(fileId)}>
          <Share2 className="mr-1" />
          {copyStatus ? 'Copied' : 'Share'}
        </Button>
        
        <a href={downloadUrl}>
          <Button>
            <Download className="mr-1" />
            Download
          </Button>
        </a>
        
        <Button onClick={handleStarClk}>
          <Star fill={addedToStarred ? 'yellow' : 'none'} />
        </Button>
      </div>
    </div>
  )
}

export default FileModalNav
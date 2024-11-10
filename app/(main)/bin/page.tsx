'use client'
import { getBinFiles } from '@/app/actions/uploads'
import { UploadsTable } from '@/components/ui/space/UploadsTable'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'

interface BinFile {
    id: string;
    fileKey: string;
    fileType: string;
    uploadDate: string;
    userEmail: string;
    starred: boolean | null;
}

const Page =  () => {
    const [binFiles, setBinFiles] = useState<BinFile[] | []>([])
    const {toast} = useToast()

    useEffect(() => {
        const fetchBinFiles = async () => {
            try {
                const res = await getBinFiles()
                if (res?.success) {
                    const validBinFiles = res?.binFiles?.filter((file) => file !== null) as BinFile[]
                    setBinFiles(validBinFiles || [])
                }
            } catch (error) {
                console.log(error, 'Error in getting bin files')
                toast({
                    title: 'An error occurred while fetching bin files',
                    variant: 'destructive'
                })
            }
        }

        fetchBinFiles()
    }, []) 

  return (
    <section>
        <div className='flex flex-col'>
           <h1 className='text-3xl'>Bin</h1>
           <p className='text-muted-foreground'>Your deleted files are stored here for temporary period</p>
        </div>
        <div>
            <UploadsTable filesData={binFiles}/>
        </div>
    </section>
  )
}

export default Page

import { fetchSignedUrl } from '@/app/actions/uploads'
import { FileModal } from '@/components/ui/space/FileModal'
import prisma from '@/prisma/prismaClient'
import { getServerSession } from 'next-auth'
import React from 'react'

const page = async ({ params }: { params: { fileId: string } }) => {
    const session = await getServerSession()
    if(!session){
        return {
            success: false,
            message: "user unauthenticated"
        }
    }
    let file;
    let signedUrl;
    try {
        file = await prisma.uploads.findUnique({
            where: {
                id: params?.fileId
            }
        })
        if(!file){
            console.log('file not found')
            return
        }
        signedUrl = await fetchSignedUrl(file?.fileKey || '')
    } catch (error) {
        console.log(error,'error in fetching file shared')
    }

    //set interval to auto close the modal 
    let modalOpen = true
    setInterval(() => {
        modalOpen= false
    }, 30*1000);
  return (
    <div>
        <FileModal open={modalOpen} fileUrl={signedUrl?.signedUrl || ''} fileDetails={file || null}/>
    </div>
  )
}

export default page
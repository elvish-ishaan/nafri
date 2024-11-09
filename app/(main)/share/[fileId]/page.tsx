import { fetchSignedUrl } from '@/app/actions/uploads'
import { FileModal } from '@/components/ui/space/FileModal'
import prisma from '@/prisma/prismaClient'
import { getServerSession } from 'next-auth'
import React from 'react'

const page = async ({ params }: { params: { fileId: string } }) => {
    const session = await getServerSession()
    if(!session){
        throw new Error('User unauthenticated')
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
  return (
    <div>
        <FileModal open={true} fileUrl={signedUrl || ''} fileDetails={file || null}/>
    </div>
  )
}

export default page
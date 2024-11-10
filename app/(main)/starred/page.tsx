import { UploadsTable } from '@/components/ui/space/UploadsTable'
import prisma from '@/prisma/prismaClient'
import { getServerSession } from 'next-auth'
import React from 'react'

const Page = async () => {
    const session = await getServerSession()
    if(!session){
        throw new Error('user unauthenticated')
    }
    let starredFiles
    try {
          starredFiles = await prisma.uploads.findMany({
            where: {
                userEmail: session.user?.email || '',
                starred: true,
            }
        })
        console.log(starredFiles,'these are starred files')
    } catch (error) {
        console.log(error,'error in fetching starred files')
    }
  return (
    <section>
        <div className=' flex flex-col'>
           <h1 className=' text-3xl'>Starred</h1>
           <p className=' text-muted-foreground'>All your favourite files are here</p>
        </div>
        <div>
            <UploadsTable filesData={starredFiles}/>
        </div>
    </section>
  )
}

export default Page
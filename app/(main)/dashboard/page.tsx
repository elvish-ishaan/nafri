import { fetchAllUploads } from '@/app/actions/uploads'
import { UploadsTable } from '@/components/ui/space/UploadsTable'
import React from 'react'

const Page = async () => {
  let uploadFiles;
  try {
     uploadFiles = await fetchAllUploads()
  } catch (error) {
    console.log(error,'cant fetch uploads')
  }
  return (
    <section>
      <div className=' flex flex-col items-center gap-4  w-full'>
         <h1 className=' text-muted-foreground text-3xl'>Welcome To Next Cloud</h1>
      </div>
      {/* fix it from here */}
      <div className=' mt-10'> 
        <UploadsTable filesData={uploadFiles?.uploads?.uploadsMetaData}/>
      </div>
    </section>
  )
}

export default Page
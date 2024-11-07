import { fetchAllUploads } from '@/app/actions/uploads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadsTable } from '@/components/ui/space/UploadsTable'
import { Search } from 'lucide-react'
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
         <div className=' flex justify-center gap-2 w-full'>
           <Input className=' w-1/2' placeholder='search in cloud'/>
           <Button><Search/></Button>
         </div>
      </div>
      {/* fix it from here */}
      <div className=' mt-10'> 
        <UploadsTable filesData={uploadFiles?.uploads?.uploadsMetaData}/>
      </div>
    </section>
  )
}

export default Page
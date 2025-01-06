import { fetchAllUploads } from '@/app/actions/uploads'
import { UploadsTable } from '@/components/ui/space/UploadsTable'
import React from 'react'

const Page = async () => {
  let uploadFiles;
  try {
    uploadFiles = await fetchAllUploads();
  } catch (error) {
    console.log(error, 'cant fetch uploads');
  }

  // Ensure uploadFiles?.uploads?.uploadsMetaData is always an array
  const filesData = uploadFiles?.uploads?.uploadsMetaData ?? [];

  return (
    <section>
      <div className='flex flex-col items-center gap-4 w-full'>
        <h1 className='text-muted-foreground text-3xl'>Welcome To Next Cloud</h1>
      </div>
      {/* Pass filesData as an array */}
      <div className='mt-10'>
        <UploadsTable filesData={filesData} />
      </div>
    </section>
  );
}

export default Page;

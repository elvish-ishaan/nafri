export const dynamic = 'force-dynamic';

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
    <section className="mx-auto w-full max-w-full pb-12">
      <div className='flex flex-col items-center gap-4 w-full'>
        <h1 className='text-muted-foreground text-xl sm:text-2xl md:text-3xl font-medium text-center px-4'>
          Welcome To Next Cloud
        </h1>
      </div>
      {/* Pass filesData as an array */}
      <div className='mt-4 sm:mt-6 md:mt-10 px-2 sm:px-0'>
        <UploadsTable filesData={filesData} />
      </div>
    </section>
  );
}

export default Page;
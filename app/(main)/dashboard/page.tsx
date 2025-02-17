"use client"
export const dynamic = 'force-dynamic';

import { fetchAllUploads } from '@/app/actions/uploads'
import { FileMetaData, UploadsTable } from '@/components/ui/space/UploadsTable'
import React, { useEffect, useState } from 'react'

const fetchData = async () => {
  try {
    const uploadFiles = await fetchAllUploads();
    return uploadFiles;
  } catch (error) {
    console.log(error, 'cant fetch uploads');
  }
}

const Page = () => {
  const [filesData, setFilesData] = useState<FileMetaData[] | []>([])

  useEffect(() => {
    const getData = async () => {
      const res = await fetchData()
      setFilesData(res?.uploads?.uploadsMetaData ?? [])
        }
    getData()
    
  },[])

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

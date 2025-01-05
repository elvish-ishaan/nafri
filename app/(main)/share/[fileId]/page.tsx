"use client"

import { getShareFile } from '@/app/actions/uploads'
import { FileModal } from '@/components/ui/space/FileModal'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface FileDetails {
  id: string
  fileKey: string
  uploadDate: string
  starred: boolean | null
  fileType: string
  userEmail: string
  deleted: boolean
  deleteDate: Date | null
}

const Page = ({ params }: { params: { fileId: string } }) => {
  const [showModal, setShowModal] = useState<boolean>(true)
  const [fileUrl, setFileUrl] = useState<string | undefined>()
  const [fileDetails, setFileDetails] = useState<FileDetails | undefined>() // Change this to `undefined`
  const router = useRouter()

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const res = await getShareFile(params?.fileId)
      if (res?.success) {
        setFileUrl(res.signedUrl?.signedUrl || '')
        setFileDetails(res.fileDetails) // fileDetails can now be undefined if no data
      }
    }

    fetchSignedUrl()
  }, [params.fileId])

  return (
    <div>
      <FileModal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          router.push('/dashboard')
        }}
        fileUrl={fileUrl || ''}
        fileDetails={fileDetails} // fileDetails can be undefined
      />
    </div>
  )
}

export default Page

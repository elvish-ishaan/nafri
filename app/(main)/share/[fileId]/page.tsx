'use client'

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
  const [fileDetails, setFileDetails] = useState<FileDetails | undefined>()
  const router = useRouter()

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const res = await getShareFile(params?.fileId)
      if (res?.success) {
        setFileUrl(res.signedUrl?.signedUrl || '')
        setFileDetails(res.fileDetails) // Type is now correctly inferred
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
        fileDetails={fileDetails || null}
      />
    </div>
  )
}

export default Page

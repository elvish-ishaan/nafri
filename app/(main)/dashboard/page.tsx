import { GetServerSidePropsContext } from 'next';
import { fetchAllUploads } from '@/app/actions/uploads';
import { UploadsTable } from '@/components/ui/space/UploadsTable';
import React from 'react';
import { getSession } from 'next-auth/react';

// Define the FileData type
interface FileData {
  id: string;
  fileKey: string;
  fileType: string;
  uploadDate: string;
  userEmail: string;
  starred: boolean | null;
  deleted: boolean;
  deleteDate: Date | null;
}

// Define the `getServerSideProps` function
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Ensure user is authenticated
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  let uploadFiles;
  try {
    uploadFiles = await fetchAllUploads(); // Fetch user uploads
  } catch (error) {
    console.error('Failed to fetch uploads:', error);
  }

  const filesData: FileData[] = uploadFiles?.uploads?.uploadsMetaData ?? [];

  return {
    props: {
      filesData,
    },
  };
}

// Define the `Page` component with the appropriate prop type
const Page = ({ filesData }: { filesData: FileData[] }) => {
  return (
    <section>
      <div className="flex flex-col items-center gap-4 w-full">
        <h1 className="text-muted-foreground text-3xl">Welcome To Next Cloud</h1>
      </div>
      <div className="mt-10">
        <UploadsTable filesData={filesData} />
      </div>
    </section>
  );
};

export default Page;

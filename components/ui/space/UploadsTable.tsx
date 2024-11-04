import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  interface FileMetaData {
    id: string;
    name: string; // Name of the file (can be derived from fileKey)
    uploadedOn: string; // Date of upload (mapped from uploadDate)
    owner: string; // Owner's email (mapped from userEmail)
    location: string; // Location (could be a link to the file)
  }
  
  interface UploadsTableProps {
    filesData: FileMetaData[] | undefined; // filesData is required
  }
  
  export function UploadsTable({ filesData }: UploadsTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Uploaded On</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="text-right">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filesData?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Sorry, no files found.
              </TableCell>
            </TableRow>
          ) : (
            filesData?.map((fileData) => (
              <TableRow key={fileData.id}>
                <TableCell className="font-medium">{fileData.name}</TableCell>
                <TableCell>{new Date(fileData.uploadedOn).toLocaleString()}</TableCell>
                <TableCell>{fileData.owner}</TableCell>
                <TableCell className="text-right">
                  <a href={fileData.location} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  }
  
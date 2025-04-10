import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const NafriDocs = () => {
  return (
    <div className="flex h-screen text-foreground">
      {/* Sidebar */}
      <div className="w-auto p-4 border-r border-border">
        <h2 className="text-lg font-semibold mb-4">Topics</h2>
        <ul className="space-y-2 p-5">
          <li><a href="#initialization" className="hover:underline">Initialization</a></li>
          <li><a href="#methods" className="hover:underline">Methods</a></li>
          <li><a href="#uploadFile" className="hover:underline">uploadFile</a></li>
          <li><a href="#deleteFile" className="hover:underline">deleteFile</a></li>
          <li><a href="#listFiles" className="hover:underline">listFiles</a></li>
          <li><a href="#exampleUsage" className="hover:underline">Example Usage</a></li>
          <li><a href="#errors" className="hover:underline">Errors</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Documentation</h1>
        <p className="text-muted-foreground">
          The <code>Nafri</code> class is a utility for handling file uploads, deletions,
          and listing files through an API. It requires a configuration object during
          initialization containing a <code>baseUrl</code> and an <code>apiKey</code>.
        </p>

        <h2 id="initialization" className="text-xl font-semibold mt-8 mb-4">Initialization</h2>
        <p className="text-muted-foreground">
          To initialize the <code>Nafri</code> class, provide a configuration object
          with <code>baseUrl</code> and <code>apiKey</code>. If these are missing, the
          class will throw an error.
        </p>
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {`const nafri = new Nafri({
  baseUrl: "https://example.com/api",
  apiKey: "your-api-key",
});`}
        </SyntaxHighlighter>

        <h2 id="methods" className="text-xl font-semibold mt-8 mb-4">Methods</h2>

        <h3 id="uploadFile" className="text-lg font-semibold mt-6">uploadFile(file)</h3>
        <p className="text-muted-foreground">
          Uploads a file to the server. Throws an error if the file is not provided or
          if the upload fails.
        </p>
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {`const response = await nafri.uploadFile(file);
console.log(response);`}
        </SyntaxHighlighter>
        <ul>
          <li><strong>file</strong>: The file object to upload.</li>
        </ul>
        <p className="text-muted-foreground"><strong>Returns:</strong> An object containing the response from the server.</p>

        <h3 id="deleteFile" className="text-lg font-semibold mt-6">deleteFile(fileId)</h3>
        <p className="text-muted-foreground">
          Deletes a file from the server using its file ID. Throws an error if the
          operation fails.
        </p>
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {`const response = await nafri.deleteFile("file-id");
console.log(response);`}
        </SyntaxHighlighter>
        <ul>
          <li><strong>fileId</strong>: The ID of the file to delete.</li>
        </ul>
        <p className="text-muted-foreground"><strong>Returns:</strong> An object containing the response from the server.</p>

        <h3 id="listFiles" className="text-lg font-semibold mt-6">listFiles()</h3>
        <p className="text-muted-foreground">
          Retrieves a list of uploaded files from the server. Throws an error if the
          operation fails.
        </p>
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {`const files = await nafri.listFiles();
console.log(files);`}
        </SyntaxHighlighter>
        <p className="text-muted-foreground"><strong>Returns:</strong> An array of file objects.</p>

        <h2 id="exampleUsage" className="text-xl font-semibold mt-8 mb-4">Example Usage</h2>
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {`const nafri = new Nafri({
  baseUrl: "https://example.com/api",
  apiKey: "your-api-key",
});

(async () => {
  try {
    // Upload a file
    const uploadResponse = await nafri.uploadFile(file);
    console.log("File uploaded:", uploadResponse);

    // List files
    const files = await nafri.listFiles();
    console.log("Files:", files);

    // Delete a file
    const deleteResponse = await nafri.deleteFile("file-id");
    console.log("File deleted:", deleteResponse);
  } catch (error) {
    console.error("Error:", error);
  }
})();`}
        </SyntaxHighlighter>

        <h2 id="errors" className="text-xl font-semibold mt-8 mb-4">Errors</h2>
        <ul>
          <li>
            Throws <code>Error</code> if required configuration is missing during
            initialization.
          </li>
          <li>
            Throws <code>Error</code> if an API request fails or if required
            parameters are not provided.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NafriDocs;

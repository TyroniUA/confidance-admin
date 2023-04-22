import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { app } from "../firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";

function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) =>
      prevFiles.concat(
        acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          error: false,
        }))
      )
    );
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const storageRef = ref(getStorage(app), "videos/");
      const uploadTasks = files.map((fileObj) => {

        const uploadTask = uploadBytes(storageRef, fileObj.file);
        return uploadTask;
      });
      await Promise.all(uploadTasks);
      console.log("Files uploaded successfully!");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) =>
      prevFiles.filter((fileObj) => fileObj.file !== file)
    );
  };

  const handleRetry = (file) => {
    setFiles((prevFiles) =>
      prevFiles.map((fileObj) =>
        fileObj.file === file ? { ...fileObj, uploading: false, error: false } : fileObj
      )
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "video/*", });

  return (
    <div className="box">
      <div {...getRootProps()} >
        <h3>Upload Videos</h3>

        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag and drop some files here, or click to select files
          </p>
        )}
      </div>
      <div>
        <h4>Uploaded Videos</h4>
      </div>
      <ul>
        {files.map((fileObj, index) => (
          <li key={index}>
            <div>
              <img src={fileObj.preview} alt="" />
              <div>
                <div>{fileObj.file.name}</div>
                <div>{fileObj.file.size} bytes</div>
                {fileObj.uploading && <div>Uploading...</div>}
                {fileObj.error && (
                  <div>
                    <span style={{ color: "red" }}>Error uploading file.</span>{" "}
                    <button onClick={() => handleRetry(fileObj.file)}>Retry</button>
                  </div>
                )}
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={fileObj.uploading || loading}
                >
                  Upload
                </button>
              )}
              <button onClick={() => handleRemove(fileObj.file)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Upload;
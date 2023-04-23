import React, { useCallback, useState, useContext } from "react";
import { store } from "../store/index";
import { useDropzone } from "react-dropzone";
import Input from "./input";
import { app, db, auth } from "../firebase";
import { addDoc, collection, updateDoc, doc as fbDoc, getDoc, setDoc, } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";

function Upload() {
  const { state } = useContext(store);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [partsNumber, setPartsNumber] = useState(0);
  const [errorState, setErrorState] = useState({
    title: "",
    description: "",
    genre: "",
    partsNumber: "",
  });

  const { user } = state;

  useEffect(() => {
    console.log(user)
  }, [user])

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) =>
      prevFiles.concat(
        acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          error: false,
          duration: 0,
        }))
      )
    );
  }, []);

  const validateForm = () => {
    let valid = true;

    if (!title) {
      setErrorState((prevState) => ({ ...prevState, title: "Title is required." }));
      valid = false;
    } else {
      setErrorState((prevState) => ({ ...prevState, title: "" }));
    }

    if (!description || description.length < 20) {
      setErrorState((prevState) => ({
        ...prevState,
        description: "Description must be between 20 and 200 characters.",
      }));
      valid = false;
    } else {
      setErrorState((prevState) => ({ ...prevState, title: "" }));
    }

    if (!description || description.length < 20) {
      setErrorState((prevState) => ({
        ...prevState,
        description: "Description must be between 20 and 200 characters.",
      }));
      valid = false;
    } else {
      setErrorState((prevState) => ({ ...prevState, description: "" }));
    }

    if (!genre) {
      setErrorState((prevState) => ({ ...prevState, genre: "Genre is required." }));
      valid = false;
    } else {
      setErrorState((prevState) => ({ ...prevState, genre: "" }));
    }

    if (!partsNumber || isNaN(partsNumber) || partsNumber < 1) {
      setErrorState((prevState) => ({
        ...prevState,
        partsNumber: "Parts number must be a positive integer.",
      }));
      valid = false;
    } else {
      setErrorState((prevState) => ({ ...prevState, partsNumber: "" }));
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) {
      return;
    }
    setLoading(true);
    try {
      const storageRef = ref(getStorage(app), `/videos/${user.uid}`);
      const uploadTasks = files.map(async (fileObj) => {
        const videoRef = ref(storageRef, `${title}_${genre}_${fileObj.file.name}`);
        await uploadBytes(videoRef, fileObj.file);
        const url = await getDownloadURL(videoRef);
        const userRecord = await addDoc(collection(db, "dances"), {
          title,
          userId: user.uid,
          description,
          duration: fileObj.duration,
          genre,
          parts: partsNumber,
          url: url
        })
        return { url, duration: fileObj.duration };
      });

      const uploadedFiles = await Promise.all(uploadTasks);
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/*",
    maxSize: 300 * 1024 * 1024, // 300 MB
  });


  return (
    <div className="box">
      <div>
        <label htmlFor="title">Title:</label>
        <Input
          id="title"
          type="text"
          value={title}
          error={errorState.title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Short description:</label>
        <Input
          type="textArea"
          id="description"
          error={errorState.description}

          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minLength={20}
          maxLength={200}
        />
      </div>
      <div>
        <label htmlFor="genre">Genre:</label>
        <Input
          id="genre"
          type="text"
          error={errorState.genre}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="partsNumber">Parts number:</label>
        <Input
          id="partsNumber"
          type="number"
          error={errorState.number}
          value={partsNumber}
          onChange={(e) => setPartsNumber(parseInt(e.target.value, 10))}
        />
      </div>
      <h3>Upload a video</h3>
      <div {...getRootProps()} >
        <div
          className="dropzone"
        >
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              Drag and drop some file here, or click to select files
            </p>
          )}
          <input {...getInputProps()} />
        </div>
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
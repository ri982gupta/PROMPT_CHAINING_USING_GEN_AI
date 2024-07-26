import React, { useState, useEffect } from 'react';
import styles from "./upload_document.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

interface FileInfo {
  file: File;
  progress: number;
}

const Upload_Document: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filesInfo, setFilesInfo] = useState<FileInfo[]>([]);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [Name, setName] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024;

  useEffect(() => {
    const user: any = JSON.parse(sessionStorage.getItem('userData') || '');
    console.log('upload=>user:', user);
    const name = user[1];
    console.log(name);
    setName(name);
  }, []);

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFolder = e.target.files;
      if (!selectedFolder) return;
      const filesArray = Array.from(selectedFolder);
      const newSelectedFiles = selectedFiles.concat(filesArray);
      setSelectedFiles(newSelectedFiles);

      if (filesArray) {
        setFilesInfo((prevFilesInfo) => {
          const newFilesInfo = filesArray.map((file) => ({
            file,
            progress: 0,
          }));

          return [...prevFilesInfo, ...newFilesInfo];
        });

        setFileSize(newSelectedFiles.reduce((totalSize, file) => totalSize + (file.size || 0), 0));

        for (var i = 0; i < filesArray.length; i++) {
          if (filesArray[i].size > MAX_FILE_SIZE_BYTES) {
            setSelectedFiles([]);
            setFilesInfo([]);
            setFileSize(0);
            Swal.fire({
              icon: "error",
              title: "File Size Exceeds Limit",
              text: "Please select a file smaller than 2GB.",
            });
            return;
          }
        }

        filesArray.forEach((file, index) => {
          const fileIndex = selectedFiles.length + index;

          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setFilesInfo((prevFilesInfo) => {
              const updatedFilesInfo = [...prevFilesInfo];
              updatedFilesInfo[fileIndex].progress = progress;
              return updatedFilesInfo;
            });

            if (progress === 100) {
              clearInterval(interval);
              Swal.fire("Files uploaded successfully");
            }
          }, 500);
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "File not uploaded",
      });
    }
  };

  const handleSubmitForText = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      try {
        const formData = new FormData();

        formData.append('folderName', Name);

        selectedFiles.forEach((file) => {
          formData.append('files[]', file);
        });

        console.log(Array.from(formData.entries()));

        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data);

        Swal.fire(data.message);
        navigate("/dashboard", { state: { name: Name } });

      } catch (error) {
        console.error("Error uploading files:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload files",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No files selected",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const newSelectedFiles = selectedFiles.concat(droppedFiles);
    setSelectedFiles(newSelectedFiles);
    setFilesInfo((prevFilesInfo) => {
      const newFilesInfo = droppedFiles.map((file) => ({
        file,
        progress: 0,
      }));
      return [...prevFilesInfo, ...newFilesInfo];
    });
    setFileSize(
      newSelectedFiles.reduce((totalSize, file) => totalSize + (file.size || 0), 0)
    );

    droppedFiles.forEach((file, index) => {
      const fileIndex = selectedFiles.length + index;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFilesInfo((prevFilesInfo) => {
          const updatedFilesInfo = [...prevFilesInfo];
          updatedFilesInfo[fileIndex].progress = progress;
          return updatedFilesInfo;
        });

        if (progress === 100) {
          clearInterval(interval);
          Swal.fire("File uploaded successfully");
        }
      }, 500);
    });
  };

  const formatFileSize = (sizeInBytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (sizeInBytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)).toString());
    return Math.round(sizeInBytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  return (
    <>
      <div className={styles.uplaodcon}>
        <div className={styles.header}>
          <h1 style={{ textAlign: "center" }}>PDF Redaction</h1>
          <button className='btn btn-success' onClick={() => navigate("/dashboard", { state: { name: Name } })}>dashboard</button>
        </div>
        <div
          className={styles.uplaodfiles}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className={styles.dragDropBox}>
            <p>Drag and drop files here </p>
            <p>or</p>
            <label htmlFor="fileInput" className={styles.chooseFileButton}>
              <i className="fa-solid fa-cloud-arrow-up"></i> Upload Files
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              multiple={true}
              className={styles.fileInput}
              onChange={handleFolderChange}
            />
          </div>
          {fileSize && (
            <p style={{ marginTop: "20px" }}>
              Total Size: {formatFileSize(fileSize)}
            </p>
          )}
          {selectedFiles.length > 0 && (
            <div className={styles["table-container"]}>
              <table>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>File Size</th>
                    <th>Loading Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {filesInfo.map((fileInfo, index) => (
                    <tr key={index}>
                      <td>{fileInfo.file.name}</td>
                      <td>{formatFileSize(fileInfo.file.size || 0)}</td>
                      <td>
                        <progress value={fileInfo.progress} max="100" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles.button} onClick={handleSubmitForText}>
                Redact
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload_Document;

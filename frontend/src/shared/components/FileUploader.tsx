import React, { useState, useRef } from 'react';
import styles from './FileUploader.module.css';
import { Button } from './Button/Button';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  clearUploadState: () => void;
}

export const FileUploader = ({ file, setFile, clearUploadState }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onUploaderClick = () => {
    if (!file) {
      inputRef.current?.click();
    }
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearUploadState();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const uploaderClasses = [
    styles.uploader,
    isDragging ? styles.uploaderDragging : styles.uploaderInitial,
    file ? styles.uploaderFileSelected : '',
  ].join(' ').trim();

  return (
    <div
      className={uploaderClasses}
      onClick={onUploaderClick}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className={styles.hiddenInput}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      {file ? (
        <div className={styles.fileInfo}>
          <span className={styles.fileIcon}>📄</span>
          <p className={styles.fileName}>
            Selected file: <strong>{file.name}</strong>
            <span className={styles.fileSize}> ({(file.size / 1024).toFixed(2)} KB)</span>
            <Button
              onClick={handleClearClick}
              variant='clear'
            >
              &times;
            </Button>
          </p>
        </div>
      ) : (
        <div className={styles.initialContent}>
          <span className={styles.fileIcon}></span>
          <p className={styles.uploadText}>Загрузить файл</p>
          <p className={styles.dragText}>или перетащите сюда</p>
        </div>
      )}
    </div>
  );
};
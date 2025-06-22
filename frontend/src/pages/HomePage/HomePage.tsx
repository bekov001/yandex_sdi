import { useAppStore } from '../../app/store/useAppStore';
import { FileUploader } from '../../shared/components/FileUploader';
import { AnalyticsResult as AnalyticsResultComponent } from '../../shared/components/AnalyticsResult/AnalyticsResult';
import { Button } from '../../shared/components/Button/Button';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const {
    file,
    setFile,
    isParsing,
    error,
    progressResult,
    uploadAndAnalyze,
    finalResult,
    clearUploadState,
  } = useAppStore();

  const handleUpload = () => {
    if (file) {
      uploadAndAnalyze();
    }
  };

  const isFileSelected = Boolean(file);

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Загрузите csv‑файл и получите полную информацию о нём за сверхнизкое время
      </p>

      <FileUploader file={file} setFile={setFile} clearUploadState={clearUploadState} />

      <div className={styles.buttonContainer}>
        <Button
          variant={isFileSelected ? 'ready' : 'disabled'}
          onClick={handleUpload}
          disabled={!isFileSelected || isParsing}
        >
          {isParsing ? 'Парсим...' : 'Отправить'}
        </Button>

        {/*
        <Button
          variant="secondary"
          onClick={clearUploadState}
          disabled={isLoading}
        >
          Очистить
        </Button>
        */}
      </div>

      {error && <p style={{ color: 'var(--error-color)' }}>Error: {error}</p>}

      {(isParsing || progressResult) && (
        <AnalyticsResultComponent result={progressResult} />
      )}

      {/* {!isLoading && finalResult && (
        <AnalyticsResultComponent result={finalResult}  />
      )} */}
    </div>
  );
};

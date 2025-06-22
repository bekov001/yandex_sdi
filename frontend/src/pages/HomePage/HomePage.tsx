import { useEffect } from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { FileUploader } from '../../shared/components/FileUploader';
import { AnalyticsResult as AnalyticsResultComponent } from '../../shared/components/AnalyticsResult/AnalyticsResult';
import { Button } from '../../shared/components/Button/Button';
import { ErrorBanner } from '../../shared/components/ErrorBanner/ErrorBanner';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const {
    file,
    setFile,
    isParsing,
    error,
    clearError,
    progressResult,
    finalResult,
    uploadAndAnalyze,
    clearUploadState,
  } = useAppStore();

  const isFileSelected = !!file;

  const handleUpload = () => {
    if (!file) return;
    clearError();
    uploadAndAnalyze();
  };

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 5000);
    return () => clearTimeout(t);
  }, [error, clearError]);

  return (
    <div className={styles.container}>
      <ErrorBanner msg={error ?? ''} onClose={clearError} />

      <p className={styles.title}>Загрузите CSV-файл и получите аналитику за считанные секунды</p>

      <FileUploader file={file} setFile={setFile} clearUploadState={clearUploadState} />

      <div className={styles.buttonContainer}>
        <Button
          variant={isFileSelected ? 'ready' : 'disabled'}
          onClick={handleUpload}
          disabled={!isFileSelected || isParsing}
        >
          {isParsing ? 'Парсим…' : 'Отправить'}
        </Button>
      </div>

      {(isParsing || progressResult) && <AnalyticsResultComponent result={progressResult} />}

      {finalResult && !isParsing && <AnalyticsResultComponent result={finalResult} />}
    </div>
  );
};

// src/pages/GeneratePage/GeneratePage.tsx
import React from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Button } from '../../shared/components/Button/Button';
import styles from './GeneratePage.module.css';

export const GeneratePage: React.FC = () => {
  const { isGenerating, error, reportBlob, generateReport, downloadReport } = useAppStore();

  return (
    <div className={styles.pageContainer}>
      <p className={styles.text}>Сгенерируйте CSV, затем скачайте его одним кликом</p>

      {!isGenerating && !reportBlob && (
        <Button onClick={generateReport} variant="ready">
          Начать генерацию
        </Button>
      )}

      {isGenerating && (
        <Button disabled variant="disabled">
          Генерируем…
        </Button>
      )}

      {!isGenerating && reportBlob && (
        <Button onClick={downloadReport} variant="download">
          Скачать
        </Button>
      )}

      {error && <p className={styles.error}>Ошибка: {error}</p>}
      {reportBlob && !isGenerating && !error && (
        <p className={styles.hint}>Файл готов! Нажмите «Скачать».</p>
      )}
    </div>
  );
};

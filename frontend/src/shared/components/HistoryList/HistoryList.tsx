import React from 'react';
import { HistoryEntry } from '../../types';
import { Button } from '../Button/Button';
import styles from './HistoryList.module.css';

interface HistoryListProps {
  history: HistoryEntry[];
  onItemClick: (entry: HistoryEntry) => void;
  onItemDelete: (id: string) => void;
}

export const HistoryList = ({ history, onItemClick, onItemDelete }: HistoryListProps) => {
  if (history.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>📜</p>
        <p>Ваша история пуста.</p>
        <span>Загрузите файл, чтобы начать!</span>
      </div>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onItemDelete(id);
  };

  return (
    <ul className={styles.list}>
      {history.map((entry) => (
        <li
          key={entry.id}
          className={styles.historyItem}
          onClick={() => onItemClick(entry)}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onItemClick(entry)}
        >
          <span className={styles.fileIcon}>📄</span>
          <span className={styles.fileName}>{entry.fileName}</span>
          <span className={styles.date}>
            {new Date(entry.uploadDate).toLocaleDateString('ru-RU')}
          </span>
          {entry.status === 'success' ? (
            <span className={styles.statusSuccess}>
              Обработан успешно
              <span className={styles.statusEmoji}>😊</span>
            </span>
          ) : (
            <span className={styles.statusFail}>
              Не удалось обработать
              <span className={styles.statusEmoji}>😞</span>
            </span>
          )}
          <Button
            className={styles.deleteButton}
            onClick={(e) => handleDeleteClick(e, entry.id)}
            variant="ghost"
          >
            🗑️
          </Button>
        </li>
      ))}
    </ul>
  );
};

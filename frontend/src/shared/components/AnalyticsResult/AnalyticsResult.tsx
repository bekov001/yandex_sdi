import type { AnalyticsSnapshot } from '../../types';
import styles from './AnalyticsResult.module.css';

interface Props {
  result: AnalyticsSnapshot | null;
}

export function AnalyticsResult({ result }: Props) {
  if (!result) return null;

  const {
    total_spend_galactic,
    rows_affected,
    average_spend_galactic,
    big_spent_value,
    big_spent_at,
    big_spent_civ,
    less_spent_at,
    less_spent_civ,
  } = result;

  const fmt = (v?: number, digits = 0) =>
    typeof v === 'number'
      ? v.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits })
      : '—';

  const formatDate = (dateValue: string | number | undefined): string => {
    if (typeof dateValue === 'string') {
      return dateValue;
    }
    return dateValue !== undefined ? String(dateValue) : '—';
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <strong>{fmt(total_spend_galactic)}</strong>
          <span>общие расходы в галактических кредитах</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{less_spent_civ ?? '—'}</strong>
          <span>цивилизация с минимальными расходами</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{fmt(rows_affected)}</strong>
          <span>количество обработанных записей</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{formatDate(big_spent_at)}</strong>
          <span>день года с максимальными расходами</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{formatDate(less_spent_at)}</strong>
          <span>день года с минимальными расходами</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{fmt(big_spent_value)}</strong>
          <span>максимальная сумма расходов за день</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{big_spent_civ ?? '—'}</strong>
          <span>цивилизация с максимальными расходами</span>
        </div>
        <div className={styles.gridItem}>
          <strong>{fmt(average_spend_galactic)}</strong>
          <span>средние расходы в галактических кредитах</span>
        </div>
      </div>
    </div>
  );
}

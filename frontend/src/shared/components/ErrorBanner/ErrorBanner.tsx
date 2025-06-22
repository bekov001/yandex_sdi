import styles from './ErrorBanner.module.css';

interface Props {
  msg: string;
  onClose: () => void;
}

export const ErrorBanner = ({ msg, onClose }: Props) => {
  if (!msg) return null;

  return (
    <div className={styles.banner} role="alert">
      <span>{msg}</span>
      <button onClick={onClose} className={styles.close}>
        ×
      </button>
    </div>
  );
};

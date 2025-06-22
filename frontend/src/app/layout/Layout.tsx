import { Outlet } from 'react-router-dom';
import { Header } from '../../shared/components/Header/Header';
import styles from './Layout.module.css'; // создай при желании

export function Layout() {
  return (
    <div className={styles.main}>
      <Header />

      <div className={styles.container}>
        <Outlet />
      </div>

      <div id="modal-root" />
    </div>
  );
}

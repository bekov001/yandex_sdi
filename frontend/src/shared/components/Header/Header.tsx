import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo_container}><img src="img/logo.svg"></img><div className={styles.logo}>Межгалактическая аналитика</div></div>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
          CSV Аналитик
        </NavLink>
        <NavLink to="/generate" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
          CSV Генератор
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
          История
        </NavLink>
      </nav>
    </header>
  );
};
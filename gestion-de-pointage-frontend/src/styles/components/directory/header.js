import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Menu from './Menu';
import styles from '../../styles/components/Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          Système de Pointage
        </Link>
      </div>
      {user && <Menu />}
      <div className={styles.auth}>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}

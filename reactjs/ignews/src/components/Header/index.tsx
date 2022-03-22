import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss';

export function Header() {
  const items = [
    { title: 'Home', href: '/' },
    { title: 'Posts', href: '/posts' },
  ];

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          {items.map((item) => (
            <ActiveLink key={item.title} activeClassName={styles.active} href={item.href}>
              <a>{item.title}</a>
            </ActiveLink>
          ))}
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

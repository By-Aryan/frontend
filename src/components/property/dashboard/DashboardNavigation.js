"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DashboardNavigation.module.css';

const DashboardNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard/seller/dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      href: '/dashboard/seller/my-properties',
      label: 'My Properties',
      icon: 'fas fa-home'
    },
    {
      href: '/dashboard/seller/request-to-add-new-property',
      label: 'Add Property',
      icon: 'fas fa-plus'
    },
    {
      href: '/dashboard/seller/my-requests',
      label: 'My Requests',
      icon: 'fas fa-clipboard-list'
    },
    {
      href: '/dashboard/seller/property-analytics',
      label: 'Analytics',
      icon: 'fas fa-chart-bar'
    },
    {
      href: '/dashboard/buyer/my-plan',
      label: 'My Plan',
      icon: 'fas fa-crown'
    }
  ];

  return (
    <div className={styles.dashboardNavigation}>
      <nav className={`nav ${styles.navTabs}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
          >
            <i className={`${item.icon}`}></i>
            <span className="ms-2">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardNavigation;
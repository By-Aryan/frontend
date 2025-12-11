"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin/properties',
      label: 'Properties',
      icon: 'fas fa-home'
    },
    {
      href: '/admin/banners',
      label: 'Banner Management',
      icon: 'fas fa-image'
    }
  ];

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link href="/admin" className="navbar-brand">
            <i className="fas fa-cog me-2"></i>
            Admin Dashboard
          </Link>
          
          <div className="navbar-nav ms-auto">
            <Link href="/dashboard/home" className="nav-link">
              <i className="fas fa-arrow-left me-1"></i>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 bg-light min-vh-100 p-0">
            <div className="list-group list-group-flush">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`list-group-item list-group-item-action ${
                    pathname === item.href ? 'active' : ''
                  }`}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
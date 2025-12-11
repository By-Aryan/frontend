"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    banners: 0,
    activeUsers: 0
  });

  // Auth guard
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/dashboard/home';
        return;
      }
      
      try {
        const res = await fetch(`${API}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.data.role === 'admin' || data.data.role === 'sub-admin') {
            setUser(data.data);
            setLoading(false);
          } else {
            window.location.href = '/dashboard/home';
          }
        } else {
          localStorage.removeItem('accessToken');
          window.location.href = '/dashboard/home';
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        window.location.href = '/dashboard/home';
      }
    };
    
    verifyAuth();
  }, []);

  // Fetch dashboard stats
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Fetch properties count
      const propertiesRes = await fetch(`${API}/api/v1/admin/properties?limit=1`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const propertiesData = await propertiesRes.json();
      
      // Fetch banners count
      const bannersRes = await fetch(`${API}/api/banners?limit=1`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const bannersData = await bannersRes.json();
      
      setStats({
        properties: propertiesData.meta?.total || 0,
        banners: bannersData.total || 0,
        activeUsers: 0 // You can add user count API later
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Welcome to Admin Dashboard</h1>
          <p className="text-muted">Manage your properties and advertisements</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.properties}</h4>
                  <p className="mb-0">Total Properties</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-home fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.banners}</h4>
                  <p className="mb-0">Active Banners</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-image fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.activeUsers}</h4>
                  <p className="mb-0">Active Users</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <Link href="/admin/properties" className="btn btn-outline-primary btn-lg">
                      <i className="fas fa-home me-2"></i>
                      Manage Properties
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <Link href="/admin/banners" className="btn btn-outline-success btn-lg">
                      <i className="fas fa-image me-2"></i>
                      Manage Banners
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activity</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">Activity tracking will be implemented here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardNavigation from '@/components/property/dashboard/DashboardNavigation';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import PropertyEditForm from '@/components/property/dashboard/PropertyEditForm';

const EditPropertyPage = () => {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/property/seller/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setProperty(response.data.data);
      } else {
        toast.error('Property not found');
        router.push('/dashboard/seller/my-properties');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
      router.push('/dashboard/seller/my-properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/property/seller/update/${params.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Property updated successfully!');
        router.push('/dashboard/seller/my-properties');
      } else {
        toast.error(response.data.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="dashboard__main pl0-md">
          <div className="dashboard__content bgc-f7">
            <div className="row">
              <div className="col-lg-12">
                <div className="dashboard_title_area">
                  <h2>Edit Property</h2>
                  <p className="text">Loading property details...</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="dashboard__main pl0-md">
          <div className="dashboard__content bgc-f7">
            <div className="row">
              <div className="col-lg-12">
                <div className="dashboard_title_area">
                  <h2>Property Not Found</h2>
                  <p className="text">The property you're trying to edit doesn't exist or you don't have permission to edit it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content bgc-f7">
          <div className="row">
            <div className="col-lg-12">
              <DboardMobileNavigation />
            </div>
          </div>
          
          <div className="row align-items-center pb40">
            <div className="col-xxl-6">
              <div className="dashboard_title_area">
                <h2>Edit Property</h2>
                <p className="text">Update your property information and details.</p>
              </div>
            </div>
            <div className="col-xxl-6"></div>
          </div>
          
          <div className="row">
            <div className="col-lg-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <PropertyEditForm 
                  property={property}
                  onSave={handleSave}
                  saving={saving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPropertyPage;
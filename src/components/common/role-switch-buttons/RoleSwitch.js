'use client';
import { ApiPutRequest } from '@/axios/apiRequest';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RoleSwitch({ role }) {
  const [selectedRole, setSelectedRole] = useState(role);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleRoleChange = async (newRole) => {
    // Don't do anything if clicking the already active role
    if (newRole === selectedRole || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await ApiPutRequest('/auth/change-role');

      if (response.status === 200) {
        console.log('Role changed successfully:', response.data);

        setSelectedRole(newRole);
        localStorage.setItem("roles", JSON.stringify([newRole]));
        localStorage.setItem("isPlanActive", String(response.data.isPlanActive));
        localStorage.setItem("remainingContacts", String(response.data.contactsAllowed));

        // Update access token if returned
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        }
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        setAuth(prev => ({
          ...prev,
          roles: [newRole],
          accessToken: response.data.accessToken || prev.accessToken,
          refreshToken: response.data.refreshToken || prev.refreshToken
        }));

        router.push('/dashboard/my-profile');
      } else {
        alert(response.data?.message || 'Failed to change role. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert(error.response?.data?.message || 'Failed to change role. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="relative flex w-64 bg-white rounded-full p-1"
        style={{
          boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Sliding Highlight */}
        <div
          className={`absolute top-1 bottom-1 w-1/2 rounded-full transition-all duration-300 ${selectedRole === 'seller' ? 'left-1' : 'left-1/2'
            }`}
          style={{ backgroundColor: '#0e8261' }}
        ></div>

        {/* Seller Button */}
        <button
          onClick={() => handleRoleChange('seller')}
          disabled={loading}
          className={`w-1/2 z-10 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${selectedRole === 'seller' ? 'text-white' : ''
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ color: selectedRole === 'seller' ? 'white' : '#0e8261' }}
        >
          {loading && selectedRole !== 'seller' ? 'Switching...' : 'Seller'}
        </button>

        {/* Buyer Button */}
        <button
          onClick={() => handleRoleChange('buyer')}
          disabled={loading}
          className={`w-1/2 z-10 text-sm font-semibold rounded-full transition-colors duration-300 ${selectedRole === 'buyer' ? 'text-white' : ''
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ color: selectedRole === 'buyer' ? 'white' : '#0e8261' }}
        >
          {loading && selectedRole !== 'buyer' ? 'Switching...' : 'Buyer'}
        </button>
      </div>
    </div>
  );
}

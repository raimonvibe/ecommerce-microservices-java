'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User as UserType, UserDetails } from '@/types';
import { dummyUsers } from '@/data/dummyData';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserDetails>>({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(dummyUsers[0]);
        setFormData(dummyUsers[0].userDetails || {});
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = () => {
    if (user && user.userDetails) {
      setUser({
        ...user,
        userDetails: { ...user.userDetails, ...formData }
      });
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData(user?.userDetails || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">User not found</h1>
          <p className="text-silver-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Profile</h1>
          <p className="text-xl text-silver-400">Manage your account information</p>
        </div>

        <div className="glass-effect rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gold-600/20 rounded-full flex items-center justify-center">
                <User className="text-gold-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {user.userDetails?.firstName} {user.userDetails?.lastName}
                </h2>
                <p className="text-silver-400">@{user.userName}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  user.role?.roleName === 'ADMIN' 
                    ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                    : user.role?.roleName === 'PREMIUM_USER'
                    ? 'bg-gold-600/20 text-gold-400 border border-gold-600/30'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                }`}>
                  {user.role?.roleName}
                </span>
              </div>
            </div>
            
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg transition-colors"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-silver-400 mb-2">
                  First Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-gold-600/20 rounded-lg text-white focus:outline-none focus:border-gold-400 transition-colors"
                  />
                ) : (
                  <p className="text-white text-lg">{user.userDetails?.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-silver-400 mb-2">
                  Last Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-gold-600/20 rounded-lg text-white focus:outline-none focus:border-gold-400 transition-colors"
                  />
                ) : (
                  <p className="text-white text-lg">{user.userDetails?.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-silver-400 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email Address
              </label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gold-600/20 rounded-lg text-white focus:outline-none focus:border-gold-400 transition-colors"
                />
              ) : (
                <p className="text-white text-lg">{user.userDetails?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-silver-400 mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gold-600/20 rounded-lg text-white focus:outline-none focus:border-gold-400 transition-colors"
                />
              ) : (
                <p className="text-white text-lg">{user.userDetails?.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-silver-400 mb-2">
                <MapPin className="inline mr-2" size={16} />
                Address
              </label>
              {editing ? (
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-gold-600/20 rounded-lg text-white focus:outline-none focus:border-gold-400 transition-colors resize-none"
                />
              ) : (
                <p className="text-white text-lg">{user.userDetails?.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

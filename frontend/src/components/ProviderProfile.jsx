import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle, 
  Star,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Save
} from 'lucide-react';

export default function ProviderProfile({ user }) {
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    hourlyRate: 40,
    experience: '',
    city: '',
    bio: '',
    available: true
  });

  useEffect(() => {
    loadProviderData();
  }, [user]);

  const loadProviderData = async () => {
    setLoading(true);
    try {
      const data = await api.getProviderById(user.id);
      setProvider(data);
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        hourlyRate: data.hourlyRate || 40,
        experience: data.experience || '',
        city: data.city || '',
        bio: data.bio || '',
        available: data.available !== false
      });

      const revData = await api.getProviderReviews(user.id);
      setReviews(revData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    const nextVal = !formData.available;
    setFormData(prev => ({ ...prev, available: nextVal }));
    try {
      await api.updateAvailability(user.id, nextVal);
      setStatusMessage(`Availability updated to: ${nextVal ? 'Available for bookings' : 'Unavailable (Busy)'}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e) {
      alert(e.message || 'Failed to update availability');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.updateProviderProfile(user.id, {
        fullName: formData.fullName,
        phone: formData.phone,
        hourlyRate: parseFloat(formData.hourlyRate),
        experience: formData.experience,
        city: formData.city,
        bio: formData.bio
      });
      setStatusMessage('Profile information saved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e) {
      alert(e.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-xs text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Provider Settings & Availability</h1>
        <p className="text-xs text-slate-500">Manage your working hours, hourly rates, and check client ratings</p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Availability Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability Status</span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {formData.available ? '🟢 Accepting New Bookings' : '🔴 Currently Unavailable'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Toggle this off if you are fully booked or on leave so customers cannot create overlapping requests.
          </p>
        </div>

        <button
          onClick={handleToggleAvailability}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            formData.available
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          {formData.available ? 'Set as Busy / Off' : 'Set as Available'}
        </button>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Profile & Skill Specifications</h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Rate ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience</label>
              <input
                type="text"
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bio & Experience Summary</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Customer Reviews & Ratings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Customer Reviews & Ratings</h2>
            <p className="text-xs text-slate-500">
              Average Rating: {provider?.rating || '5.0'}★ ({provider?.totalReviews || 0} reviews)
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No reviews submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1">{rev.rating}.0</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">{rev.comment}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">By {rev.customer?.fullName || 'Verified Customer'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api, setAuthToken, setStoredUser } from '../services/api';
import { Mail, Lock, User, Phone, MapPin, Briefcase, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal({ initialMode = 'login', onSuccess, onSwitchMode }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' or 'PROVIDER'
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    city: 'Springfield',
    address: '',
    categoryId: '',
    experience: '3 years',
    hourlyRate: '40',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode]);

  useEffect(() => {
    api.getCategories()
      .then(res => {
        setCategories(res);
        if (res.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: res[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'login') {
        res = await api.login({ email: formData.email, password: formData.password });
      } else {
        const payload = {
          ...formData,
          role,
          hourlyRate: parseFloat(formData.hourlyRate) || 35.0,
          categoryId: role === 'PROVIDER' ? (formData.categoryId || categories[0]?.id) : null
        };
        res = await api.register(payload);
      }
      setAuthToken(res.token);
      setStoredUser(res);
      onSuccess(res);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins
  const handleQuickLogin = (email, pwd) => {
    setFormData(prev => ({ ...prev, email, password: pwd }));
    api.login({ email, password: pwd })
      .then(res => {
        setAuthToken(res.token);
        setStoredUser(res);
        onSuccess(res);
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="max-w-md w-full mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {mode === 'login' 
            ? 'Sign in to access your bookings and requests' 
            : 'Join our trusted service network today'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {mode === 'register' && (
        <div className="mb-5 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              role === 'CUSTOMER' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I need Services (Customer)
          </button>
          <button
            type="button"
            onClick={() => setRole('PROVIDER')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              role === 'PROVIDER' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I provide Services (Provider)
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">City</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Springfield"
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {role === 'CUSTOMER' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Service Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 742 Evergreen Terrace"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Skill Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (${c.basePrice} base rate)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Hourly Rate ($)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5 years"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bio / Profile Summary</label>
                  <textarea
                    name="bio"
                    rows="2"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Describe your skills and specializations..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
              </>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch between Login and Register */}
      <div className="mt-6 text-center text-sm text-slate-600">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => { setMode('register'); onSwitchMode && onSwitchMode('register'); }}
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => { setMode('login'); onSwitchMode && onSwitchMode('login'); }}
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </div>

      {/* 1-Click Demo Profiles for Presentation & Testing */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
          1-Click Demo Credentials
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('alice@gmail.com', 'password123')}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition text-center"
          >
            🧑 Customer<br/><span className="text-[10px] text-slate-400">Alice</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('raj.electric@gmail.com', 'password123')}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition text-center"
          >
            ⚡ Provider<br/><span className="text-[10px] text-slate-400">Raj (Electrician)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@platform.com', 'admin123')}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition text-center"
          >
            🛡️ Admin<br/><span className="text-[10px] text-slate-400">admin123</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function BookingModal({ provider, user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    timeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: user?.city ? `${user.city}, Local Address` : '742 Evergreen Terrace',
    issueDescription: '',
    estimatedHours: 2
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  // Pricing formula matching Strategy Pattern in backend:
  const basePrice = provider?.category?.basePrice || 40.0;
  const hourly = provider?.hourlyRate || 35.0;
  const totalAmount = basePrice + (hourly * formData.estimatedHours);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        providerId: provider.id,
        categoryId: provider.category?.id,
        serviceAddress: formData.serviceAddress,
        serviceDate: formData.serviceDate,
        timeSlot: formData.timeSlot,
        issueDescription: formData.issueDescription,
        estimatedHours: parseInt(formData.estimatedHours, 10)
      };

      const booking = await api.createBooking(user.id, payload);
      onSuccess(booking);
    } catch (err) {
      setError(err.message || 'Failed to submit service booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Service Request
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Book {provider.fullName}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {provider.category?.name} • ${provider.hourlyRate}/hr • Rating: {provider.rating}★
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Service Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.serviceAddress}
                onChange={(e) => setFormData({ ...formData, serviceAddress: e.target.value })}
                placeholder="House no, Street, Landmark, City"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Hours</label>
            <select
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="1">1 hour (Quick fix)</option>
              <option value="2">2 hours (Standard repair)</option>
              <option value="3">3 hours (In-depth job)</option>
              <option value="4">4 hours (Half day)</option>
              <option value="8">8 hours (Full day)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Describe the Issue / Requirements</label>
            <textarea
              rows="3"
              required
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              placeholder="E.g., Short circuit in living room switchboard, sparking observed..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Pricing Summary (Transparent breakdown) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Category Base Rate ({provider.category?.name})</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Provider Labor ({formData.estimatedHours} hrs @ ${hourly}/hr)</span>
              <span>${(hourly * formData.estimatedHours).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
              <span>Estimated Total Amount</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 text-sm transition"
            >
              {loading ? 'Confirming with Provider...' : 'Send Booking Request'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Payment is settled upon completion of service. You can cancel any time before job start.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

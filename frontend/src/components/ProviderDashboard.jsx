import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  CheckCheck,
  User,
  Phone,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

const statusBadges = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200'
};

export default function ProviderDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalBooking, setRejectModalBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getProviderBookings(user.id);
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus, reason = null) => {
    setActionLoading(true);
    try {
      await api.updateBookingStatus(bookingId, newStatus, reason, user.id);
      setMessage(`Booking status updated to ${newStatus}`);
      setTimeout(() => setMessage(''), 4000);
      setRejectModalBooking(null);
      setRejectReason('');
      loadRequests();
    } catch (e) {
      alert(e.message || 'Status update failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incoming Job Requests</h1>
          <p className="text-xs text-slate-500">Manage client requests, accept bookings, and update job progress</p>
        </div>
        <button
          onClick={loadRequests}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 self-start shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-xs text-slate-500">Loading incoming requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No service requests yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When customers in your service area book your category, their requests will appear here instantly!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">#{booking.id}</span>
                    <h3 className="font-bold text-slate-900 text-base">
                      {booking.category?.name || 'Service'} Job for {booking.customer?.fullName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Requested on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      statusBadges[booking.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    ${booking.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Schedule</span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.serviceDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.timeSlot} ({booking.estimatedHours} hrs)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Client Location</span>
                  <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{booking.serviceAddress}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Customer Contact</span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.customer?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.customer?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Issue Note */}
              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Problem Description: </span>
                {booking.issueDescription}
              </div>

              {booking.rejectionReason && (
                <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700">
                  <span className="font-semibold">Note / Reason: </span>
                  {booking.rejectionReason}
                </div>
              )}

              {/* Action buttons (State pattern transitions) */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                {booking.status === 'PENDING' && (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={() => setRejectModalBooking(booking)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      Reject Request
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(booking.id, 'ACCEPTED')}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept Job
                    </button>
                  </>
                )}

                {booking.status === 'ACCEPTED' && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(booking.id, 'IN_PROGRESS')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center gap-1"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Start Service (In-Progress)
                  </button>
                )}

                {booking.status === 'IN_PROGRESS' && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Decline Service Request?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide an optional explanation to the client:
            </p>
            <div className="mt-3">
              <textarea
                rows="2"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="E.g., Schedule conflict, out of coverage area..."
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              ></textarea>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRejectModalBooking(null)}
                className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => handleUpdateStatus(rejectModalBooking.id, 'REJECTED', rejectReason)}
                disabled={actionLoading}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                {actionLoading ? 'Declining...' : 'Decline Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Star, 
  Wrench,
  RotateCcw
} from 'lucide-react';

const statusBadges = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200'
};

export default function CustomerBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomerBookings(user.id);
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setActionLoading(true);
    try {
      await api.cancelBooking(cancelModalBooking.id, user.id, cancelReason);
      setCancelModalBooking(null);
      setCancelReason('');
      loadBookings();
    } catch (e) {
      alert(e.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    setActionLoading(true);
    try {
      await api.addReview(user.id, {
        bookingId: reviewModalBooking.id,
        rating,
        comment
      });
      setReviewModalBooking(null);
      setComment('');
      setActionMessage('Thank you! Your review has been published.');
      setTimeout(() => setActionMessage(''), 4000);
      loadBookings();
    } catch (e) {
      alert(e.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Service Bookings</h1>
          <p className="text-xs text-slate-500">Track all your requested, in-progress, and past jobs</p>
        </div>
        <button
          onClick={loadBookings}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 self-start shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-xs text-slate-500">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No bookings created yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse our categories on the home screen to book your first skilled professional!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">#{booking.id}</span>
                    <h3 className="font-bold text-slate-900 text-base">
                      {booking.category?.name || 'Service'} with {booking.provider?.fullName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
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

              {/* Booking Details */}
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
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Service Location</span>
                  <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{booking.serviceAddress}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Provider Contact</span>
                  <p className="text-slate-700 font-medium">{booking.provider?.fullName}</p>
                  <p className="text-slate-500">{booking.provider?.phone} • {booking.provider?.email}</p>
                </div>
              </div>

              {/* Issue Description */}
              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Issue Note: </span>
                {booking.issueDescription}
              </div>

              {booking.rejectionReason && (
                <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700">
                  <span className="font-semibold">Cancellation / Note: </span>
                  {booking.rejectionReason}
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {['PENDING', 'ACCEPTED'].includes(booking.status) && (
                  <button
                    onClick={() => setCancelModalBooking(booking)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    Cancel Booking
                  </button>
                )}

                {booking.status === 'COMPLETED' && (
                  <button
                    onClick={() => setReviewModalBooking(booking)}
                    className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    Rate & Review Worker
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Cancel Service Booking?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to cancel booking #{cancelModalBooking.id}?
            </p>
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Cancellation</label>
              <textarea
                rows="2"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g., Problem resolved / reschedule needed..."
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              ></textarea>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={actionLoading}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review & Rating Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg">Leave a Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How was your service with {reviewModalBooking.provider?.fullName}?
            </p>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback & Comments</label>
                <textarea
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe punctuality, quality of work, professionalism..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

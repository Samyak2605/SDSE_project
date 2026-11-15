import React from 'react';
import { X, Check, Bell, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function NotificationDrawer({ isOpen, onClose, notifications, onRefresh, userId }) {
  if (!isOpen) return null;

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead(userId);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-lg">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-2 stroke-[1.5] text-slate-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition ${
                  n.read ? 'bg-white border-slate-100 text-slate-600' : 'bg-blue-50/50 border-blue-100 text-slate-800 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">{n.title}</h4>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] text-blue-600 hover:underline flex-shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  getStoredUser, 
  removeAuthToken, 
  api 
} from './services/api';

import Navbar from './components/Navbar';
import CustomerHome from './components/CustomerHome';
import CustomerBookings from './components/CustomerBookings';
import ProviderDashboard from './components/ProviderDashboard';
import ProviderProfile from './components/ProviderProfile';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import NotificationDrawer from './components/NotificationDrawer';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [currentTab, setCurrentTab] = useState('home');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [bookingProvider, setBookingProvider] = useState(null);

  // Sync initial tab based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'ROLE_PROVIDER') {
        setCurrentTab('provider-dashboard');
      } else if (user.role === 'ROLE_ADMIN') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('home');
      }
      loadNotifications();
    } else {
      setCurrentTab('home');
      setNotifications([]);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setCurrentTab('home');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
    if (userData.role === 'ROLE_PROVIDER') {
      setCurrentTab('provider-dashboard');
    } else if (userData.role === 'ROLE_ADMIN') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('home');
    }
  };

  const handleNavigate = (tab) => {
    if (tab === 'login') {
      setAuthInitialMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (tab === 'register') {
      setAuthInitialMode('register');
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        currentTab={currentTab}
        unreadCount={unreadCount}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onOpenNotifications={() => {
          loadNotifications();
          setIsNotificationOpen(true);
        }}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <CustomerHome
            user={user}
            onBookProvider={(provider) => setBookingProvider(provider)}
            onRequireLogin={() => {
              setAuthInitialMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {currentTab === 'my-bookings' && user && user.role === 'ROLE_CUSTOMER' && (
          <CustomerBookings user={user} />
        )}

        {currentTab === 'provider-dashboard' && user && user.role === 'ROLE_PROVIDER' && (
          <ProviderDashboard user={user} />
        )}

        {currentTab === 'provider-profile' && user && user.role === 'ROLE_PROVIDER' && (
          <ProviderProfile user={user} />
        )}

        {currentTab === 'admin' && user && user.role === 'ROLE_ADMIN' && (
          <AdminPanel user={user} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">Skilled Service Provider Booking Platform</p>
        <p className="mt-1">Built with Spring Boot 3, React 18, PostgreSQL/H2, Tailwind CSS & SOLID Design Patterns</p>
      </footer>

      {/* Booking Dialog */}
      {bookingProvider && user && (
        <BookingModal
          provider={bookingProvider}
          user={user}
          onClose={() => setBookingProvider(null)}
          onSuccess={(booking) => {
            setBookingProvider(null);
            setCurrentTab('my-bookings');
            loadNotifications();
          }}
        />
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
            <AuthModal
              initialMode={authInitialMode}
              onSuccess={handleAuthSuccess}
              onSwitchMode={(mode) => setAuthInitialMode(mode)}
            />
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onRefresh={loadNotifications}
        userId={user?.id}
      />
    </div>
  );
}

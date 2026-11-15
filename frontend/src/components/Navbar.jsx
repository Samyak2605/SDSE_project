import React, { useState } from 'react';
import { 
  Wrench, 
  Bell, 
  LogOut, 
  User, 
  Briefcase, 
  Shield, 
  CheckCircle,
  Menu,
  X 
} from 'lucide-react';

export default function Navbar({ user, notifications, onLogout, onNavigate, currentTab, unreadCount, onOpenNotifications }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                ProFix
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Skilled Service Platform
              </span>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {user ? (
              <>
                {user.role === 'ROLE_CUSTOMER' && (
                  <>
                    <button
                      onClick={() => onNavigate('home')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Find Services
                    </button>
                    <button
                      onClick={() => onNavigate('my-bookings')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentTab === 'my-bookings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      My Bookings
                    </button>
                  </>
                )}

                {user.role === 'ROLE_PROVIDER' && (
                  <>
                    <button
                      onClick={() => onNavigate('provider-dashboard')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentTab === 'provider-dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Incoming Requests
                    </button>
                    <button
                      onClick={() => onNavigate('provider-profile')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentTab === 'provider-profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Manage Profile & Availability
                    </button>
                  </>
                )}

                {user.role === 'ROLE_ADMIN' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentTab === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Admin Control Panel
                  </button>
                )}

                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition ml-2"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User badge */}
                <div className="flex items-center pl-3 border-l border-slate-200 gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-xs border border-slate-300">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {user.role === 'ROLE_ADMIN' ? 'Administrator' : user.role === 'ROLE_PROVIDER' ? 'Provider' : 'Customer'}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden gap-2">
            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <p className="font-semibold text-slate-800 text-sm">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              {user.role === 'ROLE_CUSTOMER' && (
                <>
                  <button
                    onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Find Services
                  </button>
                  <button
                    onClick={() => { onNavigate('my-bookings'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md font-medium text-slate-700 hover:bg-slate-50"
                  >
                    My Bookings
                  </button>
                </>
              )}
              {user.role === 'ROLE_PROVIDER' && (
                <>
                  <button
                    onClick={() => { onNavigate('provider-dashboard'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Incoming Requests
                  </button>
                  <button
                    onClick={() => { onNavigate('provider-profile'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Manage Profile & Availability
                  </button>
                </>
              )}
              {user.role === 'ROLE_ADMIN' && (
                <button
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md font-medium text-slate-700 hover:bg-slate-50"
                >
                  Admin Control Panel
                </button>
              )}
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm rounded-md font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

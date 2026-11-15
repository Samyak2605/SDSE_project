import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Zap, 
  Wrench, 
  Hammer, 
  Paintbrush, 
  HardHat, 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Search, 
  Filter,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const iconMap = {
  Zap: Zap,
  Wrench: Wrench,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  HardHat: HardHat
};

export default function CustomerHome({ user, onBookProvider, onRequireLogin }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);

  // Load Categories & Providers
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProviders();
  }, [selectedCategory, availableOnly]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await api.getProviders(
        selectedCategory ? selectedCategory.id : null,
        availableOnly ? true : false
      );
      setProviders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(p => {
    const q = searchQuery.toLowerCase();
    const nameMatch = p.fullName.toLowerCase().includes(q);
    const cityMatch = p.city && p.city.toLowerCase().includes(q);
    const catMatch = p.category && p.category.name.toLowerCase().includes(q);
    return nameMatch || cityMatch || catMatch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white p-8 sm:p-12 shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Certified Skilled Professionals
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Book Trusted Local Experts in Minutes.
          </h1>
          <p className="mt-4 text-blue-100 text-sm sm:text-base leading-relaxed">
            Need an electrician, plumber, carpenter, painter, or mason? Connect directly with verified providers, book instant appointments, and track your service seamlessly.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by worker name, city, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
            </div>
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium text-sm rounded-xl transition text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 sm:opacity-20 pointer-events-none transform translate-x-12 translate-y-12">
          <Wrench className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Service Categories Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore Service Categories</h2>
            <p className="text-xs text-slate-500">Pick a category to find specialized professionals</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Show All Categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Wrench;
            const isSelected = selectedCategory?.id === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-[1.02]'
                    : 'bg-white hover:border-blue-300 hover:shadow-md border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm leading-tight">{cat.name}</h3>
                <p className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'} line-clamp-1`}>
                  {cat.description}
                </p>
                <div className={`mt-3 text-xs font-semibold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                  From ${cat.basePrice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Service Providers */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory ? `${selectedCategory.name} Specialists` : 'Available Skilled Workers'}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredProviders.length} verified service providers ready to help
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Available Now Only
            </label>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Loading skilled providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No service providers found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter, city query, or toggle off the "Available Now Only" filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => {
              const CategoryIcon = (provider.category && iconMap[provider.category.icon]) || Wrench;
              return (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                          {provider.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-base">{provider.fullName}</h3>
                            <ShieldCheck className="w-4 h-4 text-blue-600" title="Verified Worker" />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <CategoryIcon className="w-3.5 h-3.5 text-blue-600" />
                            <span>{provider.category?.name || 'General Skilled Worker'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Availability status badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                          provider.available
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${provider.available ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {provider.available ? 'Available' : 'Busy'}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {provider.bio || 'Experienced and reliable skilled craftsman.'}
                    </p>

                    {/* Quick Specs */}
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Rating</span>
                        <div className="flex items-center justify-center gap-0.5 mt-0.5 font-bold text-slate-800">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{provider.rating || '5.0'}</span>
                          <span className="text-[10px] text-slate-400">({provider.totalReviews})</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{provider.experience || '3+ yrs'}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Rate</span>
                        <span className="font-bold text-blue-600 mt-0.5 block">${provider.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.city || 'Springfield'} & Nearby Area</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Base Call-Out Fee</span>
                      <p className="text-xs font-bold text-slate-800">${provider.category?.basePrice || 40}</p>
                    </div>
                    <button
                      disabled={!provider.available}
                      onClick={() => {
                        if (!user) {
                          onRequireLogin();
                        } else {
                          onBookProvider(provider);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1"
                    >
                      <span>Book Service</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  Briefcase, 
  Layers, 
  DollarSign, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Edit, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';

export default function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, categories, users, bookings
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New category modal/form
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '', icon: 'Wrench', basePrice: 40 });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, catRes, userRes, bookRes] = await Promise.all([
        api.getAdminStats(),
        api.getCategories(),
        api.getAllUsers(),
        api.getAllBookingsAdmin()
      ]);
      setStats(statsRes);
      setCategories(catRes);
      setUsers(userRes);
      setBookings(bookRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await api.updateCategory(editingCatId, {
          ...catForm,
          basePrice: parseFloat(catForm.basePrice)
        });
      } else {
        await api.createCategory({
          ...catForm,
          basePrice: parseFloat(catForm.basePrice)
        });
      }
      setShowCatModal(false);
      setEditingCatId(null);
      setCatForm({ name: '', description: '', icon: 'Wrench', basePrice: 40 });
      loadAllData();
    } catch (e) {
      alert(e.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      loadAllData();
    } catch (e) {
      alert(e.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Admin Center</h1>
          <p className="text-xs text-slate-500">Monitor system analytics, manage service categories, users, and all bookings</p>
        </div>
        <button
          onClick={loadAllData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 self-start shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reload Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-1 border-b-2 transition ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Analytics & Metrics
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-1 border-b-2 transition ${
            activeTab === 'categories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-1 border-b-2 transition ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-2 px-1 border-b-2 transition ${
            activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Bookings ({bookings.length})
        </button>
      </div>

      {/* Overview stats cards */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-xs font-semibold uppercase">Total Users</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-xs font-semibold uppercase">Total Bookings</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalBookings}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-xs font-semibold uppercase">Completed Jobs</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats.completedBookings}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-xs font-semibold uppercase">Gross Revenue</span>
            <div className="text-2xl font-black text-blue-600 mt-1">${stats.totalRevenue?.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-base">Service Categories</h3>
            <button
              onClick={() => {
                setEditingCatId(null);
                setCatForm({ name: '', description: '', icon: 'Wrench', basePrice: 40 });
                setShowCatModal(true);
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                  <p className="text-slate-500">{c.description}</p>
                  <span className="text-blue-600 font-semibold mt-0.5 block">Base Price: ${c.basePrice}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCatId(c.id);
                      setCatForm({ name: c.name, description: c.description, icon: c.icon, basePrice: c.basePrice });
                      setShowCatModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-400">#{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'ROLE_ADMIN' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'ROLE_PROVIDER' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{u.phone}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-400">#{b.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{b.customer?.fullName}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{b.provider?.fullName}</td>
                    <td className="py-3 px-4">{b.category?.name}</td>
                    <td className="py-3 px-4">{b.serviceDate}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">${b.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              {editingCatId ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Electrician"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={catForm.basePrice}
                  onChange={(e) => setCatForm({ ...catForm, basePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Icon Identifier</label>
                <select
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Zap">Zap (Electrical)</option>
                  <option value="Wrench">Wrench (Plumbing)</option>
                  <option value="Hammer">Hammer (Carpentry)</option>
                  <option value="Paintbrush">Paintbrush (Painting)</option>
                  <option value="HardHat">HardHat (Masonry)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

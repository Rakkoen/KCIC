import React, { useState } from 'react';
import { LogIn, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USERS, STATIONS } from '../data/mockData';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    stationId: ''
  });
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    // Auto-detect role based on username
    if (name === 'username') {
      const user = USERS.find(u => u.username === value);
      if (user) {
        setSelectedRole(user.role);
        if (user.stationId) {
          setFormData(prev => ({ ...prev, stationId: user.stationId.toString() }));
        }
      } else {
        setSelectedRole('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = USERS.find(u => u.username === formData.username);

    if (!user) {
      setError('Username tidak ditemukan');
      return;
    }

    // For demo, password is same as username
    if (formData.password !== formData.username) {
      setError('Password salah');
      return;
    }

    // Check if inspector/supervisor stasiun needs to select station
    if ((user.role === 'inspector' || user.role === 'supervisor_stasiun') && !formData.stationId) {
      setError('Pilih stasiun Anda');
      return;
    }

    // Store user in session (untuk demo)
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('selectedStation', formData.stationId);

    // Redirect based on role
    if (user.role === 'admin' || user.role === 'supervisor_pusat') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard-station');
    }
  };

  const needsStationSelection = selectedRole === 'inspector' || selectedRole === 'supervisor_stasiun';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      < div className="max-w-md w-full" >
        {/* Logo & Title */}
        < div className="text-center mb-8" >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">KCIC Inspection System</h1>
          <p className="text-primary-100">Daily Inspection Record - OCC</p>
        </div >

        {/* Login Card */}
        < div className="bg-white rounded-lg shadow-xl p-8" >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>

          {
            error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )
          }

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {needsStationSelection && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stasiun <span className="text-red-500">*</span>
                </label>
                <select
                  name="stationId"
                  value={formData.stationId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">-- Pilih Stasiun --</option>
                  {STATIONS.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Admin: <code className="bg-white px-1.5 py-0.5 rounded">admin</code> / <code className="bg-white px-1.5 py-0.5 rounded">admin</code></p>
              <p>• Supervisor Pusat: <code className="bg-white px-1.5 py-0.5 rounded">supervisor.pusat</code></p>
              <p>• Inspector Halim: <code className="bg-white px-1.5 py-0.5 rounded">inspector.halim</code></p>
              <p className="text-gray-500 italic">Password sama dengan username</p>
            </div>
          </div>
        </div >

        <p className="text-center text-primary-100 text-sm mt-6">
          © 2024 KCIC - All Rights Reserved
        </p>
      </div >
    </div >
  );
};

export default Login;

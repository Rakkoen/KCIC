import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Users,
    AlertTriangle,
    CheckCircle,
    Calendar,
    Filter
} from 'lucide-react';
import { STATIONS, ROOMS, INSPECTIONS, getCurrentUser } from '../data/mockData';
import StatsCard from '../components/Dashboard/StatsCard';
import RoomCard from '../components/Dashboard/RoomCard';
import TemperatureChart from '../components/Dashboard/TemperatureChart';
import HumidityChart from '../components/Dashboard/HumidityChart';
import StationComparisonChart from '../components/Dashboard/StationComparisonChart';
import StationBadge from '../components/Common/StationBadge';
import StatusBadge from '../components/Common/StatusBadge';

const Dashboard = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const [selectedStation, setSelectedStation] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('7'); // 7, 30, 90 days
    const [loading, setLoading] = useState(false);

    // Generate mock chart data for temperature
    const generateTempData = () => {
        const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        return hours.map(time => ({
            time,
            station1: 22 + Math.random() * 2,
            station2: 22.5 + Math.random() * 1.5,
            station3: 23 + Math.random() * 1,
            station4: 22.3 + Math.random() * 1.7,
        }));
    };

    // Generate mock chart data for humidity
    const generateHumidityData = () => {
        const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        return hours.map(time => ({
            time,
            station1: 55 + Math.random() * 10,
            station2: 58 + Math.random() * 8,
            station3: 52 + Math.random() * 12,
            station4: 60 + Math.random() * 7,
        }));
    };

    // Calculate stats per station
    const getStationStats = (stationId) => {
        const stationRooms = ROOMS.filter(r => r.stationId === stationId);
        const today = new Date().toISOString().split('T')[0];

        const todayInspections = INSPECTIONS.filter(insp => {
            const room = ROOMS.find(r => r.id === insp.roomId);
            return room?.stationId === stationId && insp.inspectionDate === today;
        });

        const abnormalCount = todayInspections.filter(insp => {
            const room = ROOMS.find(r => r.id === insp.roomId);
            return insp.temperature < room.tempMin ||
                insp.temperature > room.tempMax ||
                insp.hasWaterLeak ||
                insp.hasOdor ||
                insp.hasNoise;
        }).length;

        const lastUpdate = todayInspections.length > 0
            ? todayInspections[todayInspections.length - 1].submittedAt
            : null;

        return {
            totalInspections: todayInspections.length,
            normalCount: todayInspections.length - abnormalCount,
            abnormalCount,
            lastUpdate,
            status: abnormalCount > 0 ? 'warning' : 'normal'
        };
    };

    // Get all stats
    const allStats = STATIONS.map(station => ({
        ...station,
        ...getStationStats(station.id)
    }));

    const totalInspections = allStats.reduce((sum, s) => sum + s.totalInspections, 0);
    const totalAbnormal = allStats.reduce((sum, s) => sum + s.abnormalCount, 0);

    // Get rooms to display based on selected station
    const getRoomsToDisplay = () => {
        if (selectedStation === 'all') {
            return ROOMS;
        }
        return ROOMS.filter(r => r.stationId === parseInt(selectedStation));
    };

    // Get inspection for room
    const getInspectionForRoom = (roomId) => {
        return INSPECTIONS.find(insp => insp.roomId === roomId);
    };

    // Station comparison data
    const comparisonData = STATIONS.map(station => {
        const stats = getStationStats(station.id);
        return {
            station: station.code,
            'Total Inspeksi': stats.totalInspections,
            'Abnormal': stats.abnormalCount,
        };
    });

    // Recent activities (mock for all inspections)
    const recentActivities = INSPECTIONS.slice(-10).reverse().map(insp => {
        const room = ROOMS.find(r => r.id === insp.roomId);
        const station = STATIONS.find(s => s.id === room?.stationId);
        return {
            ...insp,
            room,
            station
        };
    });

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard KCIC Inspection</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>{currentUser.fullName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Station Filter */}
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <select
                                value={selectedStation}
                                onChange={(e) => setSelectedStation(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">Semua Stasiun</option>
                                {STATIONS.map(station => (
                                    <option key={station.id} value={station.id}>{station.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Quick Stats - Station Cards */}
                {selectedStation === 'all' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ringkasan Stasiun Hari Ini</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {STATIONS.map(station => {
                                const stats = allStats.find(s => s.id === station.id);
                                return (
                                    <StatsCard
                                        key={station.id}
                                        title={station.name}
                                        value={stats.totalInspections}
                                        subtitle={`Normal: ${stats.normalCount} | Abnormal: ${stats.abnormalCount}`}
                                        status={stats.status}
                                        icon={Building2}
                                    />
                                );
                            })}

                            {/* Total Summary */}
                            <StatsCard
                                title="Total Keseluruhan"
                                value={totalInspections}
                                subtitle={`Abnormal: ${totalAbnormal}`}
                                status={totalAbnormal > 0 ? 'warning' : 'normal'}
                                icon={CheckCircle}
                            />
                        </div>
                    </div>
                )}

                {/* Room Status Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Status Ruangan {selectedStation !== 'all' && `- ${STATIONS.find(s => s.id === parseInt(selectedStation))?.name}`}
                    </h2>
                    <div className={`grid gap-4 ${selectedStation === 'all'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
                        {getRoomsToDisplay().map(room => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                inspection={getInspectionForRoom(room.id)}
                                stationId={room.stationId}
                                detailed={selectedStation !== 'all'}
                                onClick={() => {/* Navigate to detail */ }}
                            />
                        ))}
                    </div>
                </div>

                {/* Charts Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Grafik Trend</h2>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="7">7 Hari Terakhir</option>
                            <option value="30">30 Hari Terakhir</option>
                            <option value="90">90 Hari Terakhir</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TemperatureChart
                            data={generateTempData()}
                            stations={STATIONS}
                            selectedStation={selectedStation}
                        />
                        <HumidityChart
                            data={generateHumidityData()}
                            stations={STATIONS}
                            selectedStation={selectedStation}
                        />
                    </div>
                </div>

                {/* Station Comparison (only show when viewing all stations) */}
                {selectedStation === 'all' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Perbandingan Stasiun</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <StationComparisonChart
                                data={comparisonData}
                                dataKey="Total Inspeksi"
                                title="Total Inspeksi per Stasiun (Bulan Ini)"
                                color="#3b82f6"
                            />
                            <StationComparisonChart
                                data={comparisonData}
                                dataKey="Abnormal"
                                title="Kondisi Abnormal per Stasiun"
                                color="#ef4444"
                            />
                        </div>

                        {/* Station Ranking */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking Stasiun (Berdasarkan Kondisi Normal)</h3>
                            <div className="space-y-3">
                                {allStats
                                    .sort((a, b) => (a.abnormalCount / (a.totalInspections || 1)) - (b.abnormalCount / (b.totalInspections || 1)))
                                    .map((station, index) => (
                                        <div key={station.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                                <StationBadge stationId={station.id} />
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Total Inspeksi</p>
                                                    <p className="text-lg font-semibold text-gray-900">{station.totalInspections}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Abnormal</p>
                                                    <p className="text-lg font-semibold text-red-600">{station.abnormalCount}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Success Rate</p>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        {station.totalInspections > 0
                                                            ? Math.round((station.normalCount / station.totalInspections) * 100)
                                                            : 0}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Activities Table */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stasiun</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suhu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelembaban</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentActivities.map((activity) => {
                                    const isAbnormal = activity.temperature < activity.room?.tempMin ||
                                        activity.temperature > activity.room?.tempMax ||
                                        activity.hasWaterLeak || activity.hasOdor || activity.hasNoise;

                                    return (
                                        <tr key={activity.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(activity.inspectionDate)} {formatTime(activity.submittedAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StationBadge stationId={activity.station?.id} size="sm" />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{activity.room?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.temperature}°C</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.humidity}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={isAbnormal ? 'abnormal' : 'normal'} size="sm" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-primary-600 hover:text-primary-900 font-medium">
                                                    Lihat Detail
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

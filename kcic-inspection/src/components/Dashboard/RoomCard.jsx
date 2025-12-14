import React from 'react';
import { Thermometer, Droplets, Clock } from 'lucide-react';
import StatusBadge from '../Common/StatusBadge';
import StationBadge from '../Common/StationBadge';

const RoomCard = ({ room, inspection, stationId, onClick, detailed = false }) => {
    // Determine status based on temperature and humidity
    const getStatus = () => {
        if (!inspection) return 'unknown';

        const { temperature, humidity, hasWaterLeak, hasOdor, hasNoise } = inspection;

        // Check if any abnormal equipment
        const hasAbnormalEquipment = inspection.equipmentStatus &&
            Object.values(inspection.equipmentStatus).some(eq => eq.status === 'abnormal');

        // Check environmental issues
        if (hasWaterLeak || hasOdor || hasNoise || hasAbnormalEquipment) {
            return 'abnormal';
        }

        // Check temperature range
        if (temperature < room.tempMin || temperature > room.tempMax) {
            return 'warning';
        }

        // Check humidity range
        if (humidity < room.humidityMin || humidity > room.humidityMax) {
            return 'warning';
        }

        return 'normal';
    };

    const status = getStatus();

    const statusColors = {
        normal: 'border-green-200 bg-green-50 hover:bg-green-100',
        warning: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
        abnormal: 'border-red-200 bg-red-50 hover:bg-red-100',
        unknown: 'border-gray-200 bg-gray-50 hover:bg-gray-100'
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-all ${statusColors[status]}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{room.name}</h3>
                    {!detailed && <StationBadge stationId={stationId} size="sm" />}
                </div>
                <StatusBadge status={status} size="sm" />
            </div>

            {/* Environmental Data */}
            {inspection ? (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Suhu</span>
                        </div>
                        <span className={`text-sm font-semibold ${inspection.temperature < room.tempMin || inspection.temperature > room.tempMax
                                ? 'text-amber-600'
                                : 'text-gray-900'
                            }`}>
                            {inspection.temperature}°C
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Kelembaban</span>
                        </div>
                        <span className={`text-sm font-semibold ${inspection.humidity < room.humidityMin || inspection.humidity > room.humidityMax
                                ? 'text-amber-600'
                                : 'text-gray-900'
                            }`}>
                            {inspection.humidity}%
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Update</span>
                        </div>
                        <span>{formatTime(inspection.submittedAt)}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Belum ada inspeksi</p>
                </div>
            )}
        </div>
    );
};

export default RoomCard;

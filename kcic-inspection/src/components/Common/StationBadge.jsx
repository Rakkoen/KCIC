import React from 'react';
import { getStationById } from '../../data/mockData';

const StationBadge = ({ stationId, size = 'md', showCode = false }) => {
    const station = getStationById(stationId);

    if (!station) return null;

    const colorClasses = {
        halim: 'bg-blue-100 text-blue-800 border-blue-200',
        karawang: 'bg-green-100 text-green-800 border-green-200',
        padalarang: 'bg-amber-100 text-amber-800 border-amber-200',
        tegalluar: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1'
    };

    return (
        <span className={`inline-flex items-center rounded-md font-semibold border ${colorClasses[station.color]} ${sizeClasses[size]}`}>
            {showCode ? `${station.code} - ${station.name}` : station.name}
        </span>
    );
};

export default StationBadge;

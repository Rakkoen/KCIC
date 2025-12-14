import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TemperatureChart = ({ data, stations, selectedStation }) => {
    // Station colors matching our theme
    const stationColors = {
        1: '#3b82f6', // Halim - Blue
        2: '#10b981', // Karawang - Green
        3: '#f59e0b', // Padalarang - Amber
        4: '#8b5cf6', // Tegalluar - Purple
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grafik Suhu Ruangan</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="time"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />

                    {selectedStation === 'all' ? (
                        // Show all stations
                        stations.map(station => (
                            <Line
                                key={station.id}
                                type="monotone"
                                dataKey={`station${station.id}`}
                                name={station.name}
                                stroke={stationColors[station.id]}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        ))
                    ) : (
                        // Show single station
                        <Line
                            type="monotone"
                            dataKey={`station${selectedStation}`}
                            name={stations.find(s => s.id === parseInt(selectedStation))?.name}
                            stroke={stationColors[selectedStation]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureChart;

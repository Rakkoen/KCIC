import React, { useState, useEffect } from 'react';
import { Camera, ChevronRight, Save, Send, AlertTriangle } from 'lucide-react';
import { getCurrentUser, getRoomsByStation, getEquipmentByRoom, SHIFTS, getStationById, getRoomById } from '../data/mockData';
import StationBadge from '../components/Common/StationBadge';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const InspectionForm = () => {
    const currentUser = getCurrentUser();
    const currentStation = getStationById(currentUser.stationId);

    // Form State
    const [formData, setFormData] = useState({
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectionTime: new Date().toTimeString().slice(0, 5),
        inspectorName: currentUser.fullName,
        stationId: currentUser.stationId,
        roomId: '',
        shiftId: '',
        temperature: '',
        humidity: '',
        hasWaterLeak: false,
        hasOdor: false,
        hasNoise: false,
        generalNotes: '',
        equipmentStatus: {} // { equipmentId: { status: 'normal|abnormal', notes: '', photo: null } }
    });

    const [rooms, setRooms] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch rooms untuk stasiun ini
    useEffect(() => {
        if (currentUser.stationId) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                const stationRooms = getRoomsByStation(currentUser.stationId);
                setRooms(stationRooms);
                setLoading(false);
            }, 300);
        }
    }, [currentUser.stationId]);

    // Fetch equipment ketika room dipilih
    useEffect(() => {
        if (formData.roomId) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                const roomEquipment = getEquipmentByRoom(parseInt(formData.roomId));
                setEquipment(roomEquipment);

                // Initialize equipment status
                const initialStatus = {};
                roomEquipment.forEach(eq => {
                    initialStatus[eq.id] = { status: 'normal', notes: '', photo: null };
                });
                setFormData(prev => ({ ...prev, equipmentStatus: initialStatus }));

                const room = getRoomById(parseInt(formData.roomId));
                setSelectedRoom(room);
                setLoading(false);
            }, 300);
        } else {
            setEquipment([]);
            setSelectedRoom(null);
        }
    }, [formData.roomId]);

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.roomId) {
            newErrors.roomId = 'Ruangan harus dipilih';
        }

        if (!formData.shiftId) {
            newErrors.shiftId = 'Shift harus dipilih';
        }

        if (!formData.temperature) {
            newErrors.temperature = 'Suhu harus diisi';
        } else if (selectedRoom) {
            const temp = parseFloat(formData.temperature);
            if (temp < selectedRoom.tempMin || temp > selectedRoom.tempMax) {
                newErrors.temperature = `Suhu di luar range normal (${selectedRoom.tempMin}°C - ${selectedRoom.tempMax}°C)`;
            }
        }

        if (!formData.humidity) {
            newErrors.humidity = 'Kelembaban harus diisi';
        } else if (selectedRoom) {
            const humidity = parseFloat(formData.humidity);
            if (humidity < selectedRoom.humidityMin || humidity > selectedRoom.humidityMax) {
                newErrors.humidity = `Kelembaban di luar range normal (${selectedRoom.humidityMin}% - ${selectedRoom.humidityMax}%)`;
            }
        }

        // Validate abnormal equipment must have notes
        Object.entries(formData.equipmentStatus).forEach(([eqId, status]) => {
            if (status.status === 'abnormal' && !status.notes.trim()) {
                newErrors[`equipment_${eqId}`] = 'Catatan wajib diisi untuk kondisi abnormal';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleEquipmentStatusChange = (equipmentId, field, value) => {
        setFormData(prev => ({
            ...prev,
            equipmentStatus: {
                ...prev.equipmentStatus,
                [equipmentId]: {
                    ...prev.equipmentStatus[equipmentId],
                    [field]: value
                }
            }
        }));
        // Clear error
        if (errors[`equipment_${equipmentId}`]) {
            setErrors(prev => ({ ...prev, [`equipment_${equipmentId}`]: '' }));
        }
    };

    const handlePhotoUpload = (equipmentId, e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, [`photo_${equipmentId}`]: 'Ukuran file maksimal 5MB' }));
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, [`photo_${equipmentId}`]: 'Format file harus JPG atau PNG' }));
                return;
            }

            handleEquipmentStatusChange(equipmentId, 'photo', file);
            setErrors(prev => ({ ...prev, [`photo_${equipmentId}`]: '' }));
        }
    };

    const handleSaveDraft = () => {
        console.log('Saving draft...', formData);
        alert('Draft tersimpan!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Mohon lengkapi form dengan benar');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Submitting inspection...', formData);
            alert('Inspeksi berhasil disubmit!');
            setIsSubmitting(false);

            // Reset form
            setFormData({
                inspectionDate: new Date().toISOString().split('T')[0],
                inspectionTime: new Date().toTimeString().slice(0, 5),
                inspectorName: currentUser.fullName,
                stationId: currentUser.stationId,
                roomId: '',
                shiftId: '',
                temperature: '',
                humidity: '',
                hasWaterLeak: false,
                hasOdor: false,
                hasNoise: false,
                generalNotes: '',
                equipmentStatus: {}
            });
            setSelectedRoom(null);
            setEquipment([]);
        }, 1000);
    };

    // Check if temperature or humidity is abnormal
    const isTemperatureAbnormal = selectedRoom && formData.temperature &&
        (parseFloat(formData.temperature) < selectedRoom.tempMin || parseFloat(formData.temperature) > selectedRoom.tempMax);

    const isHumidityAbnormal = selectedRoom && formData.humidity &&
        (parseFloat(formData.humidity) < selectedRoom.humidityMin || parseFloat(formData.humidity) > selectedRoom.humidityMax);

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header & Breadcrumb */}
            <div className="mb-6">
                <nav className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="font-medium text-gray-900">Inspeksi Harian</span>
                    {currentStation && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <StationBadge stationId={currentStation.id} size="sm" />
                        </>
                    )}
                    {selectedRoom && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span>{selectedRoom.name}</span>
                        </>
                    )}
                </nav>
                <h1 className="text-3xl font-bold text-gray-900">Form Inspeksi Harian</h1>
                <p className="text-gray-600 mt-2">Isi data inspeksi dengan lengkap dan akurat</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Auto-filled Information Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Inspeksi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                name="inspectionDate"
                                value={formData.inspectionDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                            <input
                                type="time"
                                name="inspectionTime"
                                value={formData.inspectionTime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inspector</label>
                            <input
                                type="text"
                                value={formData.inspectorName}
                                disabled
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Room & Shift Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Lokasi & Shift</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ruangan <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="roomId"
                                value={formData.roomId}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.roomId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="">-- Pilih Ruangan --</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roomId && <p className="text-red-500 text-sm mt-1">{errors.roomId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shift <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="shiftId"
                                value={formData.shiftId}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.shiftId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="">-- Pilih Shift --</option>
                                {SHIFTS.map(shift => (
                                    <option key={shift.id} value={shift.id}>
                                        {shift.name} ({shift.startTime} - {shift.endTime})
                                    </option>
                                ))}
                            </select>
                            {errors.shiftId && <p className="text-red-500 text-sm mt-1">{errors.shiftId}</p>}
                        </div>
                    </div>
                </div>

                {/* Environmental Conditions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Kondisi Lingkungan</h2>

                    {selectedRoom && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>Standard Normal:</strong> Suhu: {selectedRoom.tempMin}°C - {selectedRoom.tempMax}°C |
                                Kelembaban: {selectedRoom.humidityMin}% - {selectedRoom.humidityMax}%
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Suhu Ruangan (°C) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleInputChange}
                                placeholder="Contoh: 22.5"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.temperature ? 'border-red-500' : isTemperatureAbnormal ? 'border-amber-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
                            {isTemperatureAbnormal && !errors.temperature && (
                                <div className="flex items-center text-amber-600 text-sm mt-1">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Suhu di luar range normal!
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kelembaban (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="humidity"
                                value={formData.humidity}
                                onChange={handleInputChange}
                                placeholder="Contoh: 55"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.humidity ? 'border-red-500' : isHumidityAbnormal ? 'border-amber-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {errors.humidity && <p className="text-red-500 text-sm mt-1">{errors.humidity}</p>}
                            {isHumidityAbnormal && !errors.humidity && (
                                <div className="flex items-center text-amber-600 text-sm mt-1">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Kelembaban di luar range normal!
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi Fisik</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="hasWaterLeak"
                                    checked={formData.hasWaterLeak}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Kebocoran Air</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="hasOdor"
                                    checked={formData.hasOdor}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Bau Tidak Normal</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="hasNoise"
                                    checked={formData.hasNoise}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Suara Tidak Normal</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Equipment Checklist */}
                {equipment.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Checklist Perangkat ({equipment.length} items)
                        </h2>

                        {loading ? (
                            <LoadingSpinner text="Loading equipment..." />
                        ) : (
                            <div className="space-y-4">
                                {equipment.map((eq) => (
                                    <div key={eq.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{eq.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {eq.brand} {eq.model} • {eq.code}
                                                </p>
                                            </div>
                                            <StatusBadge
                                                status={formData.equipmentStatus[eq.id]?.status}
                                                size="sm"
                                            />
                                        </div>

                                        <div className="flex gap-4 mb-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`equipment_${eq.id}`}
                                                    value="normal"
                                                    checked={formData.equipmentStatus[eq.id]?.status === 'normal'}
                                                    onChange={() => handleEquipmentStatusChange(eq.id, 'status', 'normal')}
                                                    className="text-green-600 focus:ring-green-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Normal</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`equipment_${eq.id}`}
                                                    value="abnormal"
                                                    checked={formData.equipmentStatus[eq.id]?.status === 'abnormal'}
                                                    onChange={() => handleEquipmentStatusChange(eq.id, 'status', 'abnormal')}
                                                    className="text-red-600 focus:ring-red-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Abnormal</span>
                                            </label>
                                        </div>

                                        {formData.equipmentStatus[eq.id]?.status === 'abnormal' && (
                                            <div className="space-y-3 bg-red-50 p-3 rounded-md">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Catatan <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        value={formData.equipmentStatus[eq.id]?.notes || ''}
                                                        onChange={(e) => handleEquipmentStatusChange(eq.id, 'notes', e.target.value)}
                                                        placeholder="Deskripsikan kondisi abnormal yang ditemukan..."
                                                        rows={3}
                                                        className={`w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${errors[`equipment_${eq.id}`] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    />
                                                    {errors[`equipment_${eq.id}`] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors[`equipment_${eq.id}`]}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Upload Foto (Max 5MB, JPG/PNG)
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                                            <Camera className="w-4 h-4 mr-2" />
                                                            Pilih Foto
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/jpg"
                                                                onChange={(e) => handlePhotoUpload(eq.id, e)}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        {formData.equipmentStatus[eq.id]?.photo && (
                                                            <span className="text-sm text-gray-600">
                                                                {formData.equipmentStatus[eq.id].photo.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {errors[`photo_${eq.id}`] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors[`photo_${eq.id}`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* General Notes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan Umum</h2>
                    <textarea
                        name="generalNotes"
                        value={formData.generalNotes}
                        onChange={handleInputChange}
                        placeholder="Tambahkan catatan atau observasi tambahan..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Simpan Draft
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner size="sm" text="" />
                                <span className="ml-2">Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2" />
                                Submit Inspeksi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InspectionForm;

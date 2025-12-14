// Mock data untuk development frontend sebelum backend siap

export const STATIONS = [
    {
        id: 1,
        code: 'HLM',
        name: 'Stasiun Halim',
        address: 'Jakarta Timur',
        phone: '021-12345678',
        color: 'halim', // blue
        isActive: true
    },
    {
        id: 2,
        code: 'KRW',
        name: 'Stasiun Karawang',
        address: 'Karawang',
        phone: '021-87654321',
        color: 'karawang', // green
        isActive: true
    },
    {
        id: 3,
        code: 'PDL',
        name: 'Stasiun Padalarang',
        address: 'Bandung Barat',
        phone: '022-12345678',
        color: 'padalarang', // amber
        isActive: true
    },
    {
        id: 4,
        code: 'TGL',
        name: 'Stasiun Tegalluar',
        address: 'Bandung',
        phone: '022-87654321',
        color: 'tegalluar', // purple
        isActive: true
    }
];

export const ROOM_TYPES = {
    '501_information': '501 Information Machinery Room',
    '503_information': '503 Information Machinery Room',
    '501_power': '501 Power Supply Room',
    '501_wiring': '501 Wiring Room',
    '501_disaster': '501 Disaster Prevention Machinery Room'
};

// Generate 20 rooms (4 stations × 5 rooms)
export const ROOMS = STATIONS.flatMap(station =>
    Object.entries(ROOM_TYPES).map(([type, name], index) => ({
        id: station.id * 10 + index + 1,
        stationId: station.id,
        code: `${station.code}-${type.toUpperCase().replace(/_/g, '-')}`,
        name: name,
        roomType: type,
        tempMin: 21,
        tempMax: 24,
        humidityMin: 40,
        humidityMax: 70,
        isActive: true
    }))
);

export const EQUIPMENT_CATEGORIES = [
    { id: 1, name: 'Router, Firewall, Switching', description: 'Network equipment', sortOrder: 1 },
    { id: 2, name: 'Server & Storage', description: 'Server and storage systems', sortOrder: 2 },
    { id: 3, name: 'Load Balancing', description: 'Load balancing systems', sortOrder: 3 },
    { id: 4, name: 'Information Equipment', description: 'Other IT equipment', sortOrder: 4 },
    { id: 5, name: 'UPS & Power Distribution Cabinet', description: 'Power systems', sortOrder: 5 },
    { id: 6, name: 'Air Conditioner', description: 'HVAC systems', sortOrder: 6 },
    { id: 7, name: 'Fire Fighting Equipment', description: 'Fire safety equipment', sortOrder: 7 }
];

// Sample equipment untuk room pertama (akan di-generate untuk semua room)
export const EQUIPMENT = [
    // Room 1 - 501 Information Machinery Room (Halim)
    { id: 1, roomId: 11, categoryId: 1, code: 'RT-HLM-001', name: 'Core Router', brand: 'Cisco', model: 'ASR 9000', serialNumber: 'CSC123456', isActive: true },
    { id: 2, roomId: 11, categoryId: 1, name: 'Firewall Primary', brand: 'Fortinet', model: 'FortiGate 600E', serialNumber: 'FGT600E123', isActive: true },
    { id: 3, roomId: 11, categoryId: 1, code: 'SW-HLM-001', name: 'Core Switch', brand: 'Cisco', model: 'Catalyst 9500', serialNumber: 'CAT123456', isActive: true },
    { id: 4, roomId: 11, categoryId: 2, code: 'SRV-HLM-001', name: 'Application Server 1', brand: 'HP', model: 'ProLiant DL380', serialNumber: 'HP123456', isActive: true },
    { id: 5, roomId: 11, categoryId: 2, code: 'SRV-HLM-002', name: 'Database Server', brand: 'Dell', model: 'PowerEdge R740', serialNumber: 'DELL123456', isActive: true },
    { id: 6, roomId: 11, categoryId: 3, code: 'LB-HLM-001', name: 'Load Balancer', brand: 'F5', model: 'BIG-IP 4000', serialNumber: 'F5123456', isActive: true },
    { id: 7, roomId: 11, categoryId: 5, code: 'UPS-HLM-001', name: 'UPS Array A', brand: 'APC', model: 'Smart-UPS 10kVA', serialNumber: 'APC123456', isActive: true },
    { id: 8, roomId: 11, categoryId: 5, code: 'PDU-HLM-001', name: 'Power Distribution Unit', brand: 'APC', model: 'AP8959EU3', serialNumber: 'PDU123456', isActive: true },
    { id: 9, roomId: 11, categoryId: 6, code: 'AC-HLM-001', name: 'Precision AC Unit 1', brand: 'Vertiv', model: 'Liebert PDX', serialNumber: 'VRT123456', isActive: true },
    { id: 10, roomId: 11, categoryId: 6, code: 'AC-HLM-002', name: 'Precision AC Unit 2', brand: 'Vertiv', model: 'Liebert PDX', serialNumber: 'VRT123457', isActive: true },
    { id: 11, roomId: 11, categoryId: 7, code: 'FF-HLM-001', name: 'FM200 System', brand: 'Ansul', model: 'INERGEN', serialNumber: 'ANS123456', isActive: true },
    // Tambahkan equipment untuk room lain sesuai kebutuhan
];

export const SHIFTS = [
    { id: 1, name: 'Shift 1 (Pagi)', startTime: '08:00', endTime: '16:00' },
    { id: 2, name: 'Shift 2 (Sore)', startTime: '16:00', endTime: '00:00' },
    { id: 3, name: 'Shift 3 (Malam)', startTime: '00:00', endTime: '08:00' }
];

export const USERS = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@kcic.co.id',
        fullName: 'Administrator',
        role: 'admin',
        stationId: null,
        phone: '08123456789',
        isActive: true
    },
    {
        id: 2,
        username: 'supervisor.pusat',
        email: 'supervisor.pusat@kcic.co.id',
        fullName: 'Supervisor Pusat',
        role: 'supervisor_pusat',
        stationId: null,
        phone: '08123456790',
        isActive: true
    },
    {
        id: 3,
        username: 'supervisor.halim',
        email: 'supervisor.halim@kcic.co.id',
        fullName: 'Supervisor Halim',
        role: 'supervisor_stasiun',
        stationId: 1,
        phone: '08123456791',
        isActive: true
    },
    {
        id: 4,
        username: 'inspector.halim',
        email: 'inspector.halim@kcic.co.id',
        fullName: 'Inspector Halim',
        role: 'inspector',
        stationId: 1,
        phone: '08123456792',
        isActive: true
    },
    {
        id: 5,
        username: 'inspector.karawang',
        email: 'inspector.karawang@kcic.co.id',
        fullName: 'Inspector Karawang',
        role: 'inspector',
        stationId: 2,
        phone: '08123456793',
        isActive: true
    }
];

// Sample inspection data
export const INSPECTIONS = [
    {
        id: 1,
        roomId: 11,
        inspectorId: 4,
        shiftId: 1,
        inspectionDate: '2024-12-14',
        inspectionTime: '09:30',
        temperature: 22.5,
        humidity: 55,
        hasWaterLeak: false,
        hasOdor: false,
        hasNoise: false,
        generalNotes: 'Semua kondisi normal',
        status: 'submitted',
        submittedAt: '2024-12-14T09:45:00',
        createdAt: '2024-12-14T09:30:00'
    },
    {
        id: 2,
        roomId: 11,
        inspectorId: 4,
        shiftId: 1,
        inspectionDate: '2024-12-13',
        inspectionTime: '10:00',
        temperature: 25.5, // Above normal!
        humidity: 58,
        hasWaterLeak: false,
        hasOdor: false,
        hasNoise: true,
        generalNotes: 'Suhu sedikit tinggi, AC perlu dicek',
        status: 'submitted',
        submittedAt: '2024-12-13T10:15:00'
    }
];

export const ABNORMAL_REPORTS = [
    {
        id: 1,
        inspectionId: 2,
        equipmentId: 9, // AC Unit 1
        reportedBy: 4,
        reportedAt: '2024-12-13T10:15:00',
        description: 'AC Unit 1 mengeluarkan suara tidak normal, perlu inspeksi oleh teknisi',
        severity: 'medium',
        status: 'in_progress',
        assignedTo: 3,
        resolvedBy: null,
        resolvedAt: null,
        resolutionNotes: null
    }
];

export const getCurrentUser = () => {
    // Untuk demo, return inspector halim
    return USERS[3]; // Inspector Halim
};

export const getStationById = (id) => STATIONS.find(s => s.id === id);
export const getRoomsByStation = (stationId) => ROOMS.filter(r => r.stationId === stationId);
export const getEquipmentByRoom = (roomId) => EQUIPMENT.filter(e => e.roomId === roomId);
export const getRoomById = (id) => ROOMS.find(r => r.id === id);

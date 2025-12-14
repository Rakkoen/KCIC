import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
    const getStatusConfig = () => {
        switch (status?.toLowerCase()) {
            case 'normal':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Normal' };
            case 'abnormal':
                return { bg: 'bg-red-100', text: 'text-red-800', label: 'Abnormal' };
            case 'warning':
                return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Warning' };
            case 'critical':
                return { bg: 'bg-red-100', text: 'text-red-900', label: 'Critical' };
            case 'open':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Open' };
            case 'in_progress':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' };
            case 'resolved':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' };
            case 'closed':
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' };
            case 'draft':
                return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' };
            case 'submitted':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Submitted' };
            case 'reviewed':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Reviewed' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
        }
    };

    const config = getStatusConfig();
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1'
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;

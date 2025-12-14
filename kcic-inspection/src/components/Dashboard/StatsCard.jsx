import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const StatsCard = ({
    title,
    value,
    subtitle,
    trend,
    trendValue,
    status = 'normal',
    icon: Icon
}) => {
    const statusColors = {
        normal: 'bg-green-50 border-green-200',
        warning: 'bg-amber-50 border-amber-200',
        abnormal: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const statusIconColors = {
        normal: 'text-green-600',
        warning: 'text-amber-600',
        abnormal: 'text-red-600',
        info: 'text-blue-600'
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        return trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
        );
    };

    const getStatusIcon = () => {
        if (Icon) return <Icon className={`w-6 h-6 ${statusIconColors[status]}`} />;
        return status === 'normal' ? (
            <CheckCircle className={`w-6 h-6 ${statusIconColors[status]}`} />
        ) : (
            <AlertTriangle className={`w-6 h-6 ${statusIconColors[status]}`} />
        );
    };

    return (
        <div className={`rounded-lg border-2 p-6 ${statusColors[status]} transition-all hover:shadow-md`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                    {trendValue && (
                        <div className="flex items-center gap-1 mt-2">
                            {getTrendIcon()}
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0">
                    {getStatusIcon()}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;

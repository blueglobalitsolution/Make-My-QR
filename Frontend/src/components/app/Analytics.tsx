import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Search,
    Calendar,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    ArrowUpRight,
    Download,
    Info,
    ChevronDown,
    Activity,
    ExternalLink,
    QrCode,
    Globe2,
    TrendingUp,
    Clock,
    MapPin,
    Cpu,
    Chrome,
    Laptop,
    Check
} from 'lucide-react';
import { getSummaryAnalytics, exportScansCsv, getCodeAnalytics } from '../../api/qrcodes';

export const Analytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [selectedCodeId, setSelectedCodeId] = useState<string | number | null>(null);
    const [detailData, setDetailData] = useState<any>(null);

    // Filter States
    const [period, setPeriod] = useState('30'); // Default 30 days
    const [deviceType, setDeviceType] = useState('All');
    const [search, setSearch] = useState('');

    // Dropdown states
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

    useEffect(() => {
        if (selectedCodeId) {
            fetchCodeDetail(selectedCodeId);
        } else {
            fetchAnalytics();
        }
    }, [period, deviceType, selectedCodeId]); // Auto-refresh on dropdown change or selection

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const params = {
                period: period,
                device_type: deviceType,
                search: search
            };
            const result = await getSummaryAnalytics(params);
            setData(result);
            setDetailData(null);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCodeDetail = async (id: string | number) => {
        try {
            setLoading(true);
            const params = {
                period: period,
                device_type: deviceType
            };
            const result = await getCodeAnalytics(id, params);
            setDetailData(result);
        } catch (error) {
            console.error('Error fetching code analytics:', error);
            setSelectedCodeId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        await exportScansCsv();
    };

    if (loading && !data) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50/30">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-black text-slate-400 capitalize  text-[10px]">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    const displayData = detailData || data;
    const summary = displayData?.summary || { total_scans: 0, unique_scans: 0, total_qrcodes: 0 };
    const devices = displayData?.devices || [];
    const os_stats = displayData?.os || [];
    const browsers = displayData?.browsers || [];
    const top_qrs = data?.top_qrcodes || []; // Top list always comes from general summary

    // Fill in missing dates for the chart to make it look full and professional
    const getChartData = () => {
        const rawData = displayData?.daily_scans || [];
        if (rawData.length === 0) return [];

        const dayList = [];
        const daysToMap = parseInt(period) || 7;
        const now = new Date();

        for (let i = daysToMap - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const existingDay = rawData.find((d: any) => d.date === dateStr);
            dayList.push({
                date: dateStr,
                count: existingDay ? existingDay.count : 0,
                label: date.toLocaleDateString('en-US', { day: '2-digit' })
            });
        }
        return dayList;
    };

    const daily_scans = getChartData();
    const maxVal = Math.max(...daily_scans.map((d: any) => d.count), 1);

    const periods = [
        { label: 'Last 7 days', value: '7' },
        { label: 'Last 30 days', value: '30' },
        { label: 'Last 90 days', value: '90' },
        { label: 'All time', value: '0' },
    ];

    const devicesList = ['All', 'Mobile', 'PC', 'Tablet'];

    return (
        <div className="flex-1 py-10 pb-16 space-y-8 font-lato">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-red-50 rounded-xl">
                            <BarChart3 className="w-5 h-5 text-red-500" />
                        </div>
                        <h1 className="skeu-page-title truncate max-w-lg">
                            {selectedCodeId ? (detailData?.name || 'Loading...') : 'Analytics Dashboard'}
                        </h1>
                        {selectedCodeId && (
                            <button
                                onClick={() => setSelectedCodeId(null)}
                                className="ml-4 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black capitalize  transition-colors"
                            >
                                ← Back to Overview
                            </button>
                        )}
                    </div>
                    <p className="skeu-page-subtitle">
                        {selectedCodeId ? 'Detailed performance for this specific QR code.' : 'Track and analyze your QR code performance.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="px-6 py-3 skeu-btn text-[11px] font-black capitalize  shadow-lg flex items-center gap-2 group transition-all"
                    >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Export Data
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 skeu-card bg-white/60 backdrop-blur-md relative z-30">
                {/* Period Filter */}
                <div className="space-y-2 relative">
                    <label className="text-[9px] font-black capitalize  text-slate-400 pl-1">Period</label>
                    <div
                        onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                        className="px-4 py-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer hover:border-red-100 transition-colors"
                    >
                        <span className="text-xs font-bold text-slate-700">
                            {periods.find(p => p.value === period)?.label}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showPeriodDropdown && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            {periods.map((p) => (
                                <div
                                    key={p.value}
                                    onClick={() => {
                                        setPeriod(p.value);
                                        setShowPeriodDropdown(false);
                                    }}
                                    className="px-4 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                                >
                                    <span className={`text-xs ${period === p.value ? 'text-red-500 font-black' : 'text-slate-600 font-bold'}`}>
                                        {p.label}
                                    </span>
                                    {period === p.value && <Check className="w-3 h-3 text-red-500" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Device Filter */}
                <div className="space-y-2 relative">
                    <label className="text-[9px] font-black capitalize  text-slate-400 pl-1">Device Type</label>
                    <div
                        onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                        className="px-4 py-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer hover:border-red-100 transition-colors"
                    >
                        <span className="text-xs font-bold text-slate-700">{deviceType} Devices</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDeviceDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showDeviceDropdown && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            {devicesList.map((d) => (
                                <div
                                    key={d}
                                    onClick={() => {
                                        setDeviceType(d);
                                        setShowDeviceDropdown(false);
                                    }}
                                    className="px-4 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                                >
                                    <span className={`text-xs ${deviceType === d ? 'text-red-500 font-black' : 'text-slate-600 font-bold'}`}>
                                        {d}
                                    </span>
                                    {deviceType === d && <Check className="w-3 h-3 text-red-500" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black capitalize  text-slate-400 pl-1">Search QR Code</label>
                    <div className="px-4 py-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name..."
                            className="flex-1 bg-transparent text-xs font-bold outline-none text-slate-700"
                        />
                    </div>
                </div>

                <div className="flex items-end pb-0.5">
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="w-full h-11 bg-slate-900 rounded-xl text-white text-[10px] font-black capitalize  shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Apply Filters'}
                    </button>
                </div>
            </div>

            {loading && data && <div className="text-center py-2 animate-pulse"><p className="text-[10px] font-black text-red-500 capitalize ">Updating data...</p></div>}

            {/* Summary Stats & Distributions Row */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Selected Codes */}
                <div className="skeu-card p-6 bg-white relative overflow-hidden group border-b-4 border-red-500/10">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-xl shadow-sm border border-red-100/50">
                                    <QrCode className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 capitalize ">Selected Codes</p>
                            </div>
                        </div>
                        <h3 className="text-6xl font-black text-slate-800  mb-2">{summary.total_qrcodes}</h3>
                    </div>
                </div>

                {/* Period Scans */}
                <div className="skeu-card p-6 bg-white relative overflow-hidden group border-b-4 border-emerald-500/10">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-xl shadow-sm border border-emerald-100/50">
                                    <Activity className="w-5 h-5 text-emerald-500" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 capitalize ">Period Scans</p>
                            </div>
                        </div>
                        <h3 className="text-6xl font-black text-slate-800  mb-2">{summary.total_scans}</h3>
                    </div>
                </div>

                {/* Unique Period Scans */}
                <div className="skeu-card p-6 bg-white relative overflow-hidden group border-b-4 border-indigo-500/10">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100/50">
                                    <Globe2 className="w-5 h-5 text-indigo-500" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 capitalize ">Unique Period Scans</p>
                            </div>
                        </div>
                        <h3 className="text-6xl font-black text-slate-800  mb-2">{summary.unique_scans}</h3>
                    </div>
                </div>

                {/* OS Distribution */}
                <div className="skeu-card p-6 bg-white space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Cpu className="w-4 h-4 text-purple-500" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-800 capitalize ">OS Distribution</h3>
                    </div>
                    <div className="space-y-3">
                        {os_stats.length > 0 ? os_stats.slice(0, 3).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors capitalize ">{item.os_family || 'Other'}</span>
                                <span className="text-[11px] font-black text-slate-800">{item.count}</span>
                            </div>
                        )) : (
                            <p className="text-[10px] font-bold text-slate-300 text-center py-2 capitalize ">No data</p>
                        )}
                        {os_stats.length > 3 && (
                            <div className="pt-1 flex items-center justify-between opacity-40">
                                <span className="text-[10px] font-bold text-slate-400">Others</span>
                                <span className="text-[10px] font-black text-slate-400">
                                    {os_stats.slice(3).reduce((acc: number, curr: any) => acc + curr.count, 0)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Browser Distribution */}
                <div className="skeu-card p-6 bg-white space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Chrome className="w-4 h-4 text-orange-500" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-800 capitalize ">Browsers</h3>
                    </div>
                    <div className="space-y-3">
                        {browsers.length > 0 ? browsers.slice(0, 3).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors capitalize  truncate max-w-[80px]">{item.browser || 'Other'}</span>
                                <span className="text-[11px] font-black text-slate-800">{item.count}</span>
                            </div>
                        )) : (
                            <p className="text-[10px] font-bold text-slate-300 text-center py-2 capitalize ">No data</p>
                        )}
                        {browsers.length > 3 && (
                            <div className="pt-1 flex items-center justify-between opacity-40">
                                <span className="text-[10px] font-bold text-slate-400">Others</span>
                                <span className="text-[10px] font-black text-slate-400">
                                    {browsers.slice(3).reduce((acc: number, curr: any) => acc + curr.count, 0)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="lg:col-span-2 skeu-card min-h-[400px] flex flex-col p-8 bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-48 h-48 rotate-12" />
                    </div>
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h2 className="text-lg font-black text-slate-800 ">QR Code Scan Activities</h2>
                            <p className="text-[10px] font-bold text-slate-400 capitalize ">Daily scan trends for {periods.find(p => p.value === period)?.label || 'selected period'}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-black text-slate-500 capitalize ">
                                {daily_scans.length > 0 ? `${new Date(daily_scans[0].date).toLocaleDateString()} - ${new Date(daily_scans[daily_scans.length - 1].date).toLocaleDateString()}` : 'Live Trends'}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end gap-3 pb-8 relative z-10 h-64">
                        {daily_scans.length > 0 ? daily_scans.map((day: any, i: number) => {
                            const height = (day.count / maxVal) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                                    <div className="w-full relative group h-full flex items-end">
                                        <div
                                            className="w-full bg-red-400 group-hover:bg-red-500 rounded-t-lg transition-all duration-700 ease-out shadow-sm"
                                            style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                                        />
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black py-1 px-2 rounded  pointer-events-none transition-all z-20">
                                            {day.count}
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-300 capitalize shrink-0">
                                        {day.label}
                                    </span>
                                </div>
                            );
                        }) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
                                <Activity className="w-12 h-12 opacity-20" />
                                <p className="text-[10px] font-black capitalize ">Not enough data to show statistics</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Top QR Codes */}
                    <div className="skeu-card p-6 bg-white space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 capitalize ">Top Performing</h3>
                        </div>

                        <div className="space-y-4">
                            {top_qrs.length > 0 ? top_qrs.map((qr: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedCodeId(qr.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${selectedCodeId === qr.id ? 'bg-red-50 border-red-200' : 'bg-slate-50/50 border-slate-100 hover:border-blue-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-red-500 border border-slate-100 shadow-sm">
                                            <QrCode className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-700 truncate max-w-[100px]">{qr.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 capitalize ">ID: {qr.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-800">{qr.scans}</p>
                                        <p className="text-[9px] font-bold text-green-500 capitalize">Scans</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 opacity-20">
                                    <p className="text-[10px] font-black capitalize ">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Device Distribution */}
                    <div className="skeu-card p-6 bg-white space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 capitalize ">Scans by Device</h3>
                        </div>

                        <div className="space-y-6">
                            {devices.length > 0 ? devices.map((item: any, i: number) => {
                                const total = summary.total_scans || 1;
                                const percentage = (item.count / total) * 100;

                                // Sleek color palette based on device rank
                                const barColors = ['bg-red-500', 'bg-indigo-500', 'bg-purple-500', 'bg-slate-400'];
                                const barColor = barColors[i] || 'bg-slate-300';

                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-black capitalize ">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-700 ">{item.device_type}</span>
                                            </div>
                                            <span className="text-slate-400 text-[10px]">{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${barColor} shadow-sm group-hover:brightness-110`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-6 opacity-20">
                                    <p className="text-[10px] font-black capitalize ">No device data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div className="pt-8 border-t border-slate-100 flex items-center justify-center">
                <p className="text-[9px] font-black text-slate-400 capitalize ">
                    Data is strictly aggregated for your account privacy
                </p>
            </div>
        </div>
    );
};

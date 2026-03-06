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
    Barcode as QrCode,
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
    const [location, setLocation] = useState('All');

    // Dropdown states
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    useEffect(() => {
        if (selectedCodeId) {
            fetchCodeDetail(selectedCodeId);
        } else {
            fetchAnalytics();
        }
    }, [period, deviceType, location, selectedCodeId]); // Auto-refresh on dropdown change or selection

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const params = {
                period: period,
                device_type: deviceType,
                search: search,
                location: location !== 'All' ? location : undefined
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
                device_type: deviceType,
                location: location !== 'All' ? location : undefined
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
                    <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Loading Analytics...</p>
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
        <div className="flex-1 overflow-y-auto skeu-app-bg px-8 pt-8 pb-16 space-y-8 font-inter">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-red-50 rounded-xl">
                            <BarChart3 className="w-5 h-5 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            {selectedCodeId ? (detailData?.name || 'Loading...') : 'Analytics Dashboard'}
                        </h1>
                        {selectedCodeId && (
                            <button
                                onClick={() => setSelectedCodeId(null)}
                                className="ml-4 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                ← Back to Overview
                            </button>
                        )}
                    </div>
                    <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                        {selectedCodeId ? 'Detailed performance for this specific QR code.' : 'Track and analyze your QR code performance.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="px-6 py-3 skeu-btn text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 group transition-all"
                    >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Export Data
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 skeu-card bg-white/60 backdrop-blur-md relative z-30">
                {/* Period Filter */}
                <div className="space-y-2 relative">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Period</label>
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
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Device Type</label>
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
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Search QR Code</label>
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

                {/* Location Filter */}
                <div className="space-y-2 relative">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Location</label>
                    <div
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className="px-4 py-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer hover:border-red-100 transition-colors"
                    >
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[80px]">
                            {location}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showLocationDropdown && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            {['All', ...(data?.locations?.map((l: any) => l.country) || [])].map((loc) => (
                                <div
                                    key={loc}
                                    onClick={() => {
                                        setLocation(loc);
                                        setShowLocationDropdown(false);
                                    }}
                                    className="px-4 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                                >
                                    <span className={`text-xs ${location === loc ? 'text-red-500 font-black' : 'text-slate-600 font-bold'}`}>
                                        {loc}
                                    </span>
                                    {location === loc && <Check className="w-3 h-3 text-red-500" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-end pb-0.5">
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="w-full h-11 bg-slate-900 rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Apply Filters'}
                    </button>
                </div>
            </div>

            {loading && data && <div className="text-center py-2 animate-pulse"><p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Updating data...</p></div>}

            {/* Summary Stats */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="skeu-card p-6 bg-white flex items-center justify-between border-b-4 border-blue-400/20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                <QrCode className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Codes</p>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800">{summary.total_qrcodes}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-blue-50 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-blue-300" />
                    </div>
                </div>

                <div className="skeu-card p-6 bg-white flex items-center justify-between border-b-4 border-green-400/20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-50 rounded-lg">
                                <Activity className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period Scans</p>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800">{summary.total_scans}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-green-50 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-green-300" />
                    </div>
                </div>

                <div className="skeu-card p-6 bg-white flex items-center justify-between border-b-4 border-indigo-400/20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 rounded-lg">
                                <Globe2 className="w-4 h-4 text-indigo-500" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Period Scans</p>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800">{summary.unique_scans}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-indigo-50 flex items-center justify-center">
                        <Info className="w-5 h-5 text-indigo-300" />
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
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">QR Code Scan Activities</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily scan trends for {periods.find(p => p.value === period)?.label || 'selected period'}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
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
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black py-1 px-2 rounded tracking-widest pointer-events-none transition-all z-20">
                                            {day.count}
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-300 uppercase shrink-0">
                                        {day.label}
                                    </span>
                                </div>
                            );
                        }) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
                                <Activity className="w-12 h-12 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Not enough data to show statistics</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Top QR Codes */}
                    <div className="skeu-card p-6 bg-white space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Top Performing</h3>
                            <ExternalLink className="w-4 h-4 text-slate-300" />
                        </div>

                        <div className="space-y-4">
                            {top_qrs.length > 0 ? top_qrs.map((qr: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedCodeId(qr.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${selectedCodeId === qr.id ? 'bg-red-50 border-red-200' : 'bg-slate-50/50 border-slate-100 hover:border-blue-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 border border-slate-100 shadow-sm">
                                            <QrCode className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-700 truncate max-w-[100px]">{qr.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {qr.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-800">{qr.scans}</p>
                                        <p className="text-[9px] font-bold text-green-500 uppercase">Scans</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 opacity-20">
                                    <p className="text-[10px] font-black uppercase tracking-widest">No data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Device Distribution */}
                    <div className="skeu-card p-6 bg-white space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Scans by Device</h3>
                            <Smartphone className="w-4 h-4 text-slate-300" />
                        </div>

                        <div className="space-y-6">
                            {devices.length > 0 ? devices.map((item: any, i: number) => {
                                const total = summary.total_scans || 1;
                                const percentage = (item.count / total) * 100;
                                const Icon = item.device_type === 'Mobile' ? Smartphone : item.device_type === 'Tablet' ? Tablet : Monitor;

                                // Sleek color palette based on device rank
                                const barColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-slate-400'];
                                const barColor = barColors[i] || 'bg-slate-300';

                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-slate-700 tracking-tighter">{item.device_type}</span>
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
                                    <p className="text-[10px] font-black uppercase tracking-widest">No device data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Distributions Footer */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {/* OS Distribution */}
                <div className="skeu-card p-6 bg-white space-y-7">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Cpu className="w-4 h-4 text-purple-500" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">OS Distribution</h3>
                    </div>
                    <div className="space-y-5">
                        {os_stats.length > 0 ? os_stats.slice(0, 4).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-[12px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.os_family || 'Other'}</span>
                                <span className="text-[12px] font-black text-slate-800">{item.count}</span>
                            </div>
                        )) : (
                            <p className="text-[10px] font-bold text-slate-300 text-center py-6 uppercase tracking-widest">No data collected</p>
                        )}
                    </div>
                </div>

                {/* Browser Distribution */}
                <div className="skeu-card p-6 bg-white space-y-7">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Chrome className="w-4 h-4 text-orange-500" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Browser Distribution</h3>
                    </div>
                    <div className="space-y-5">
                        {browsers.length > 0 ? browsers.slice(0, 4).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-[12px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.browser || 'Other'}</span>
                                <span className="text-[12px] font-black text-slate-800">{item.count}</span>
                            </div>
                        )) : (
                            <p className="text-[10px] font-bold text-slate-300 text-center py-6 uppercase tracking-widest">No data collected</p>
                        )}
                    </div>
                </div>

                {/* Geographical Data */}
                <div className="skeu-card p-6 bg-white space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-green-500" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Top Locations</h3>
                    </div>
                    <div className="space-y-4">
                        {data?.locations?.length > 0 ? data.locations.slice(0, 5).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">{item.country || 'Unknown'}</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-12 bg-green-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-400" style={{ width: `${(item.count / summary.total_scans) * 100}%` }} />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-800">{item.count}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-6 opacity-30 space-y-2">
                                <Globe className="w-12 h-12 mx-auto animate-pulse" />
                                <p className="text-[9px] font-black uppercase tracking-widest">Waiting for geo data...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Data is strictly aggregated for your account privacy
                </p>
            </div>
        </div>
    );
};

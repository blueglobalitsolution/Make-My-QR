import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Database, LogOut, Settings, CreditCard, Plus, Trash2, Edit, Check, X, Calendar, ArrowRight, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { getAdminStats, getAdminPlans, createAdminPlan, updateAdminPlan, deleteAdminPlan, getAdminUserSubscriptions, getAdminUsers, manageAdminUser } from '../../api/admin';

interface AdminDashboardProps {
    setView: React.Dispatch<React.SetStateAction<any>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'subscriptions' | 'users'>('overview');
    const [stats, setStats] = useState<any>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [userSubs, setUserSubs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Plan Editing State
    const [isEditingPlan, setIsEditingPlan] = useState<any>(null); // null means not editing/creating
    const [planForm, setPlanForm] = useState({ 
        name: '', 
        price: '', 
        duration_months: 1, 
        features: [] as string[],
        qr_limit: 5,
        can_create_dynamic: false,
        can_create_pdf: false,
        can_create_business: false,
        can_password_protect: false,
        can_lead_capture: false,
        can_access_analytics: false,
        upload_limit_mb: 5,
        is_lifetime: false,
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'overview') {
                const data = await getAdminStats();
                setStats(data);
            } else if (activeTab === 'plans') {
                const data = await getAdminPlans();
                setPlans(data);
            } else if (activeTab === 'subscriptions') {
                const data = await getAdminUserSubscriptions();
                setUserSubs(data);
            } else if (activeTab === 'users') {
                const data = await getAdminUsers();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePlan = async () => {
        try {
            const dataToSave = {
                ...planForm,
                price: parseFloat(planForm.price)
            };
            if (isEditingPlan?.id) {
                await updateAdminPlan(isEditingPlan.id, dataToSave);
            } else {
                await createAdminPlan(dataToSave);
            }
            setIsEditingPlan(null);
            fetchData();
        } catch (err) {
            alert("Error saving plan");
        }
    };

    const handleDeletePlan = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this plan?")) return;
        try {
            await deleteAdminPlan(id);
            fetchData();
        } catch (err) {
            alert("Error deleting plan");
        }
    };

    const handleManageUser = async (userId: number, action: 'toggle_active' | 'delete') => {
        if (action === 'delete' && !window.confirm("Are you sure you want to delete this user? This is permanent!")) return;
        try {
            await manageAdminUser(userId, action);
            fetchData();
        } catch (err) {
            alert("Error managing user");
        }
    };

    const openPlanForm = (plan?: any) => {
        if (plan) {
            setIsEditingPlan(plan);
            setPlanForm({ 
                name: plan.name, 
                price: plan.price.toString(), 
                duration_months: plan.duration_months,
                features: Array.isArray(plan.features) ? plan.features : [],
                qr_limit: plan.qr_limit || 5,
                can_create_dynamic: plan.can_create_dynamic || false,
                can_create_pdf: plan.can_create_pdf || false,
                can_create_business: plan.can_create_business || false,
                can_password_protect: plan.can_password_protect || false,
                can_lead_capture: plan.can_lead_capture || false,
                can_access_analytics: plan.can_access_analytics || false,
                upload_limit_mb: plan.upload_limit_mb || 5,
                is_lifetime: plan.is_lifetime || false
            });
        } else {
            setIsEditingPlan({ isNew: true });
            setPlanForm({ 
                name: '', 
                price: '', 
                duration_months: 1, 
                features: [],
                qr_limit: 5,
                can_create_dynamic: false,
                can_create_pdf: false,
                can_create_business: false,
                can_password_protect: false,
                can_lead_capture: false,
                can_access_analytics: false,
                upload_limit_mb: 5,
                is_lifetime: false
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-600/20">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="skeu-page-title !text-lg leading-none">MakeMyQR <span className="text-red-600">Admin</span></h1>
                        <p className="skeu-page-subtitle !text-[9px] capitalize ">Subscription Control Panel</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('plans')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'plans' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Manage Plans
                        </button>
                        <button 
                            onClick={() => setActiveTab('subscriptions')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'subscriptions' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Subscriptions
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'users' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Users
                        </button>
                    </nav>

                    <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                        <button 
                            onClick={() => setView('admin_login')}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 py-10 px-6 lg:px-10">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">

                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 ">
                                {activeTab === 'overview' && 'System Overview'}
                                {activeTab === 'plans' && 'Subscription Plans'}
                                {activeTab === 'subscriptions' && 'User Subscriptions Tracker'}
                                {activeTab === 'users' && 'User Management'}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">
                                {activeTab === 'overview' && 'Monitor all platform metrics and users globally.'}
                                {activeTab === 'plans' && 'Create and edit pricing plans for your users.'}
                                {activeTab === 'subscriptions' && 'Track user purchases, renewals, and expiry dates.'}
                                {activeTab === 'users' && 'Manage registered users, their accounts and data.'}
                            </p>
                        </div>
                        
                        {activeTab === 'plans' && !isEditingPlan && (
                            <button 
                                onClick={() => openPlanForm()}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all font-black text-[11px] uppercase tracking-wider flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Create New Plan
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
                                                <Users className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-2">Total Users</p>
                                                <p className="text-3xl font-black text-slate-800 tabular-nums">{stats?.total_users || 0}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                                                <Database className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-2">Generated QRs</p>
                                                <p className="text-3xl font-black text-slate-800 tabular-nums">{stats?.total_qrcodes || 0}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
                                                <CreditCard className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-2">Active Plans</p>
                                                <p className="text-3xl font-black text-slate-800 tabular-nums">{stats?.active_subscriptions || 0}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                            <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center shadow-inner">
                                                <TrendingUp className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-2">Total Subscriptions</p>
                                                <p className="text-3xl font-black text-slate-800 tabular-nums">{stats?.total_subscriptions || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Table / Charts could go here */}
                                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                         <div className="flex items-center gap-3 mb-8">
                                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-red-600" />
                                            </div>
                                            <h3 className="text-lg font-black text-slate-800">Platform activity</h3>
                                         </div>
                                         <div className="h-64 flex items-center justify-center border-2 border-slate-50 border-dashed rounded-[2rem] text-slate-400 font-medium">
                                             Activity chart will be visible after more data collection
                                         </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'plans' && (
                                <div className="space-y-6">
                                    {isEditingPlan ? (
                                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xl font-black text-slate-800">
                                                    {isEditingPlan.isNew ? 'New Plan Details' : `Edit Plan: ${isEditingPlan.name}`}
                                                </h3>
                                                <button onClick={() => setIsEditingPlan(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Plan Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={planForm.name}
                                                            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold text-slate-700 transition-all"
                                                            placeholder="e.g. Pro Monthly"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Total Price for Duration (INR)</label>
                                                        <input 
                                                            type="number" 
                                                            value={planForm.price}
                                                            onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold text-slate-700 transition-all"
                                                            placeholder="999"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Duration (Months)</label>
                                                    <select 
                                                        value={planForm.duration_months}
                                                        onChange={(e) => setPlanForm({ ...planForm, duration_months: parseInt(e.target.value) })}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold text-slate-700 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value={1}>1 Month</option>
                                                        <option value={3}>3 Months</option>
                                                        <option value={6}>6 Months</option>
                                                        <option value={12}>12 Months (Annual)</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Plan Capabilities</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="can_create_dynamic"
                                                                    checked={planForm.can_create_dynamic}
                                                                    onChange={(e) => setPlanForm({ ...planForm, can_create_dynamic: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="can_create_dynamic" className="text-xs font-bold text-slate-700">Dynamic QR Codes</label>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="can_create_pdf"
                                                                    checked={planForm.can_create_pdf}
                                                                    onChange={(e) => setPlanForm({ ...planForm, can_create_pdf: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="can_create_pdf" className="text-xs font-bold text-slate-700">PDF QR Codes</label>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="can_create_business"
                                                                    checked={planForm.can_create_business}
                                                                    onChange={(e) => setPlanForm({ ...planForm, can_create_business: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="can_create_business" className="text-xs font-bold text-slate-700">Business Profile</label>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="can_password_protect"
                                                                    checked={planForm.can_password_protect}
                                                                    onChange={(e) => setPlanForm({ ...planForm, can_password_protect: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="can_password_protect" className="text-xs font-bold text-slate-700">Password Protect</label>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="can_lead_capture"
                                                                    checked={planForm.can_lead_capture}
                                                                    onChange={(e) => setPlanForm({ ...planForm, can_lead_capture: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="can_lead_capture" className="text-xs font-bold text-slate-700">Lead Capture</label>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="can_access_analytics"
                                                                    checked={planForm.can_access_analytics}
                                                                    onChange={(e) => setPlanForm({ ...planForm, can_access_analytics: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="can_access_analytics" className="text-xs font-bold text-slate-700">Full Analytics</label>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id="is_lifetime"
                                                                    checked={planForm.is_lifetime}
                                                                    onChange={(e) => setPlanForm({ ...planForm, is_lifetime: e.target.checked })}
                                                                    className="w-5 h-5 rounded border-slate-200 text-red-600 focus:ring-red-500"
                                                                />
                                                                <label htmlFor="is_lifetime" className="text-xs font-bold text-red-600">Lifetime Access</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">QR Code Limit</label>
                                                    <input 
                                                        type="number" 
                                                        value={planForm.qr_limit}
                                                        onChange={(e) => setPlanForm({ ...planForm, qr_limit: parseInt(e.target.value) })}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold text-slate-700 transition-all"
                                                        placeholder="e.g. 100"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Upload Limit (MB)</label>
                                                    <input 
                                                        type="number" 
                                                        value={planForm.upload_limit_mb}
                                                        onChange={(e) => setPlanForm({ ...planForm, upload_limit_mb: parseInt(e.target.value) })}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold text-slate-700 transition-all"
                                                        placeholder="e.g. 10"
                                                    />
                                                </div>
                                                <div className="pt-6">
                                                    <button 
                                                        onClick={handleSavePlan}
                                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[1.25rem] font-black text-[12px] uppercase tracking-[0.1em] shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-3"
                                                    >
                                                        <Check className="w-5 h-5" /> Save Plan Configuration
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {plans.map((plan) => (
                                                <div key={plan.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button 
                                                            onClick={() => openPlanForm(plan)}
                                                            className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeletePlan(plan.id)}
                                                            className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                    
                                                    <h4 className="text-xl font-black text-slate-800 mb-1">{plan.name}</h4>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                                        {plan.is_lifetime ? 'LIFETIME ACCESS' : `Duration: ${plan.duration_months} Month(s)`}
                                                    </p>
                                                    
                                                    <div className="flex items-baseline gap-1 mb-6">
                                                        <span className="text-3xl font-black text-slate-800">₹{plan.price}</span>
                                                        <span className="text-slate-400 text-xs font-bold">{plan.is_lifetime ? '/ lifetime' : '/ period'}</span>
                                                    </div>

                                                    <div className="space-y-3 pt-6 border-t border-slate-50">
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                            <Check className={`w-4 h-4 ${plan.can_create_dynamic ? 'text-emerald-500' : 'text-slate-300'}`} /> Dynamic QRs: {plan.can_create_dynamic ? 'Yes' : 'No'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                            <Check className={`w-4 h-4 ${plan.can_create_pdf ? 'text-emerald-500' : 'text-slate-300'}`} /> PDF Uploads: {plan.can_create_pdf ? 'Yes' : 'No'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                            <Check className={`w-4 h-4 ${plan.can_create_business ? 'text-emerald-500' : 'text-slate-300'}`} /> Business Profiles: {plan.can_create_business ? 'Yes' : 'No'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-red-600">
                                                            <Database className="w-4 h-4" /> Max QR Codes: {plan.qr_limit}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600">
                                                            <Plus className="w-4 h-4" /> Upload Limit: {plan.upload_limit_mb}MB
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {plans.length === 0 && (
                                                <div className="col-span-full py-20 bg-white rounded-[2.5rem] border-2 border-slate-100 border-dashed flex flex-col items-center justify-center text-center">
                                                    <CreditCard className="w-12 h-12 text-slate-200 mb-4" />
                                                    <h4 className="text-lg font-black text-slate-400">No active plans found</h4>
                                                    <button onClick={() => openPlanForm()} className="mt-4 text-red-600 font-black text-[11px] uppercase tracking-wider flex items-center gap-2">
                                                        <Plus className="w-4 h-4" /> Create your first plan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'subscriptions' && (
                                <div className="bg-white rounded-[2.5rem] p-1 shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-50">
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">User</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Current Plan</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Purchases</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Expiry Date</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {userSubs.map((sub) => (
                                                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 text-xs">
                                                                    {sub.username?.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-sm leading-tight">{sub.username}</p>
                                                                    <p className="text-[10px] font-medium text-slate-400">{sub.user_email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${sub.plan ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                                                                <span className="text-xs font-black text-slate-700">{sub.plan_name || 'Free User'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-center">
                                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black leading-none">
                                                                {sub.purchase_count} Time(s)
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${sub.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                                {sub.is_active ? 'Active' : 'Expired'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className={`flex items-center gap-2 text-xs font-bold ${
                                                                sub.expiry_date && (new Date(sub.expiry_date).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000 
                                                                ? 'text-red-500' : 'text-slate-500'
                                                            }`}>
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {sub.expiry_date ? new Date(sub.expiry_date).toLocaleDateString() : (sub.plan_name?.toLowerCase().includes('lifetime') ? 'LIFETIME' : 'N/A')}
                                                                {sub.expiry_date && (new Date(sub.expiry_date).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000 && (
                                                                    <span className="bg-red-50 text-[8px] px-1.5 py-0.5 rounded ml-1 animate-pulse">EXPIRING SOON</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {userSubs.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="px-8 py-20 text-center">
                                                            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                            <p className="text-slate-400 font-black text-[11px] uppercase tracking-wider">No user subscriptions records found</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="bg-white rounded-[2.5rem] p-1 shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-50">
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">User Details</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Join Date</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Plan</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">QRs</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {users.map((user) => (
                                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                                    {user.username.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-sm leading-tight">{user.username}</p>
                                                                    <p className="text-[10px] font-medium text-slate-400">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-xs font-bold text-slate-500">
                                                            {new Date(user.date_joining || user.date_joined).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                                {user.plan_name}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 font-black text-slate-700 text-sm">
                                                            {user.qr_count}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                                {user.is_active ? 'Active' : 'Banned'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button 
                                                                    onClick={() => handleManageUser(user.id, 'toggle_active')}
                                                                    title={user.is_active ? "Deactivate User" : "Activate User"}
                                                                    className={`p-2 rounded-lg transition-all ${user.is_active ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                                >
                                                                    {user.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleManageUser(user.id, 'delete')}
                                                                    title="Delete User Forever"
                                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {users.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="px-8 py-20 text-center">
                                                            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                            <p className="text-slate-400 font-black text-[11px] uppercase tracking-wider">No users found</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

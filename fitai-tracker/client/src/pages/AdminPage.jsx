import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, FileText, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, workouts: 0, diets: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchAdminData();
        }
    }, [user]);

    const fetchAdminData = async () => {
        try {
            const res = await axios.get('/api/admin/dashboard');
            setStats(res.data.stats);
            setRecentUsers(res.data.recentUsers);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (window.confirm(`Are you absolutely sure you want to delete ${name}? All their workouts and diet logs will be lost.`)) {
            try {
                await axios.delete(`/api/admin/user/${id}`);
                toast.success(`${name}'s account deleted successfully`);
                fetchAdminData(); // Refresh the list
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto animate-fade-in relative z-10">
            {/* Background elements */}
            <div className="hidden lg:block absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[120px] -z-10"></div>
            <div className="hidden lg:block absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] -z-10"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 cursor-default">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-500 mb-2">
                        Admin Command Center
                    </h1>
                    <p className="text-text-muted text-lg">Manage all fitAI users, monitor usage, and command the platform.</p>
                </div>
                <div className="glass px-6 py-3 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <p className="text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Admin Mode Active
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass p-8 hover:bg-white/[0.04] transition-all group overflow-hidden relative cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all"></div>
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner">
                        <Users size={28} />
                    </div>
                    <p className="text-text-muted font-medium mb-1">Total Active Users</p>
                    <h3 className="text-5xl font-bold text-white tracking-tight">{stats.users}</h3>
                </div>

                <div className="glass p-8 hover:bg-white/[0.04] transition-all group overflow-hidden relative cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-all"></div>
                    <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary mb-6 shadow-inner">
                        <Activity size={28} />
                    </div>
                    <p className="text-text-muted font-medium mb-1">Total Workouts Logged</p>
                    <h3 className="text-5xl font-bold text-white tracking-tight">{stats.workouts}</h3>
                </div>

                <div className="glass p-8 hover:bg-white/[0.04] transition-all group overflow-hidden relative cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all"></div>
                    <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 shadow-inner">
                        <FileText size={28} />
                    </div>
                    <p className="text-text-muted font-medium mb-1">Total Diets Logged</p>
                    <h3 className="text-5xl font-bold text-white tracking-tight">{stats.diets}</h3>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass overflow-hidden shadow-xl border-white/5">
                <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h2 className="text-2xl font-bold text-white">Recent Users</h2>
                    <span className="text-text-muted text-sm">{recentUsers.length} total displayed</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/40">
                                <th className="p-5 font-semibold text-text-muted border-b border-white/10 uppercase tracking-wider text-xs">Name</th>
                                <th className="p-5 font-semibold text-text-muted border-b border-white/10 uppercase tracking-wider text-xs">Email</th>
                                <th className="p-5 font-semibold text-text-muted border-b border-white/10 uppercase tracking-wider text-xs">Goal</th>
                                <th className="p-5 font-semibold text-text-muted border-b border-white/10 uppercase tracking-wider text-xs">Joined</th>
                                <th className="p-5 font-semibold text-text-muted border-b border-white/10 uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-text-muted">No users found.</td>
                                </tr>
                            ) : (
                                recentUsers.map(u => (
                                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-white">{u.name} {u.role === 'admin' && <span className="ml-2 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md uppercase font-bold tracking-widest border border-red-400/20">Admin</span>}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-gray-300">{u.email}</td>
                                        <td className="p-5 text-gray-400 capitalize">{u.goal.replace('_', ' ')}</td>
                                        <td className="p-5 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="p-5 text-right">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id, u.name)}
                                                    className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-500/20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

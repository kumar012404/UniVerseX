import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Settings, Scale, Ruler, Target, Flame, Save, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const { user, setUser, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        weight: user?.weight || '',
        height: user?.height || '',
        goal: user?.goal || 'maintain',
        dailyCalorieGoal: user?.dailyCalorieGoal || 2000
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put('/api/auth/profile', formData);
            setUser(res.data);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const goals = [
        { value: 'lose_weight', label: 'Lose Weight' },
        { value: 'gain_muscle', label: 'Gain Muscle' },
        { value: 'maintain', label: 'Maintain weight' },
        { value: 'improve_fitness', label: 'Improve Fitness' }
    ];

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">My <span className="text-gradient">Profile</span></h1>
                <button onClick={logout} className="flex items-center gap-2 text-red-500 font-bold hover:underline">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="glass-card text-center py-10 sticky top-24">
                        <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-inner border border-primary/20">
                            <User size={48} />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{user?.name}</h3>
                        <p className="text-text-muted text-sm mb-6">{user?.email}</p>
                        <div className="flex justify-center gap-2">
                            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-text-muted">Pro Member</span>
                            <span className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">Alpha Tester</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <div className="glass-card">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                <Settings size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Account Settings</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block flex items-center gap-2">
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block flex items-center gap-2">
                                        <User size={14} /> Age
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block flex items-center gap-2">
                                        <Scale size={14} /> Weight (kg)
                                    </label>
                                    <input
                                        type="number" step="0.1"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block flex items-center gap-2">
                                        <Ruler size={14} /> Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full my-8" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                                    <Target size={20} />
                                </div>
                                <h2 className="text-xl font-bold">Fitness Goals</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Primary Goal</label>
                                    <select
                                        className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    >
                                        {goals.map(g => (
                                            <option key={g.value} value={g.value}>{g.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block flex items-center gap-2">
                                        <Flame size={14} /> Daily Calorie Goal
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                        value={formData.dailyCalorieGoal}
                                        onChange={(e) => setFormData({ ...formData, dailyCalorieGoal: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 mt-8 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {loading ? 'Saving changes...' : 'Update Health Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

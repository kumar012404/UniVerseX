import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie,
} from 'recharts';
import { Flame, Trophy, TrendingUp, Activity, Dumbbell, Utensils, Target, Sparkles } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        todayCalories: 0,
        dailyGoal: user?.dailyCalorieGoal || 2000,
        recentWorkouts: [],
        weeklyCalories: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dietRes = await axios.get('/api/diet');
                const workoutRes = await axios.get('/api/workout');

                // Process weekly data mock/dummy for now or real if available
                setStats(prev => ({
                    ...prev,
                    todayCalories: dietRes.data.totals.calories,
                    recentWorkouts: workoutRes.data.slice(0, 3)
                }));
            } catch (err) {
                console.error('Stats fetch failed');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const caloriesProgress = Math.min((stats.todayCalories / stats.dailyGoal) * 100, 100);

    const StatCard = ({ title, value, unit, icon: Icon, color, delay }) => (
        <div className="glass-card flex flex-col animate-fade-in" style={{ animationDelay: delay }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${color}-500/10 text-${color}-400 shadow-inner`}>
                <Icon size={20} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-bold">{value}</h3>
                <span className="text-sm text-text-muted">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
            <header className="mb-10 animate-fade-in">
                <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="text-gradient capitalize">{user?.name}</span>!</h1>
                <p className="text-text-muted flex items-center gap-2">
                    <TrendingUp size={16} className="text-secondary" />
                    You're doing great! You logged {stats.todayCalories} calories today.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="glass-card relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="relative z-10">
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Daily Calorie Goal</p>
                        <h3 className="text-4xl font-bold mb-2">{stats.todayCalories} <span className="text-base font-normal text-text-muted">/ {stats.dailyGoal}</span></h3>
                        <div className="h-2 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-right bg-primary shadow-lg shadow-primary/40 transition-all duration-1000"
                                style={{ width: `${caloriesProgress}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-text-muted mt-2 text-right">{Math.round(caloriesProgress)}% of daily goal</p>
                    </div>
                    <Flame className="absolute -right-4 -bottom-4 text-primary opacity-5" size={120} />
                </div>

                <StatCard title="Water Intake" value="1.8" unit="L" icon={Activity} color="blue" delay="0.2s" />
                <StatCard title="Weight Progress" value={user?.weight || '--'} unit="kg" icon={Target} color="purple" delay="0.3s" />
                <StatCard title="Streak" value="5" unit="days" icon={Trophy} color="yellow" delay="0.4s" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-primary" /> Training Frequency
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Mon', hours: 1.2 },
                                    { name: 'Tue', hours: 0.8 },
                                    { name: 'Wed', hours: 1.5 },
                                    { name: 'Thu', hours: 2.1 },
                                    { name: 'Fri', hours: 1.0 },
                                    { name: 'Sat', hours: 1.8 },
                                    { name: 'Sun', hours: 0.5 },
                                ]}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                        {[1, 2, 3, 4, 5, 6, 7].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 3 ? '#8B5CF6' : 'rgba(139, 92, 246, 0.4)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Dumbbell size={20} className="text-secondary" /> Recent Workouts
                            </h3>
                            <button className="text-primary text-xs font-bold hover:underline">VIEW ALL</button>
                        </div>
                        <div className="space-y-4">
                            {stats.recentWorkouts.map((w, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center">
                                            <Dumbbell size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{w.name}</h4>
                                            <p className="text-xs text-text-muted">{new Date(w.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{w.exercises.length} Ex</p>
                                        <p className="text-[10px] text-text-muted uppercase tracking-wider">Completed</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card animate-fade-in" style={{ animationDelay: '0.7s' }}>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Utensils size={20} className="text-accent" /> Macro Breakdown
                        </h3>
                        <div className="h-56 w-full flex items-center justify-center">
                            {/* Pie chart would go here */}
                            <div className="relative w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                                <div className="absolute inset-[-12px] rounded-full border-[12px] border-accent border-l-transparent border-b-transparent rotate-45" />
                                <div className="absolute inset-[-12px] rounded-full border-[12px] border-secondary border-t-transparent border-r-transparent -rotate-12" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold">1420</p>
                                    <p className="text-[10px] text-text-muted uppercase">kcal left</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 mt-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-secondary"><div className="w-2 h-2 rounded-full bg-secondary" /> Protein</span>
                                <span className="font-bold">45%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-accent"><div className="w-2 h-2 rounded-full bg-accent" /> Carbs</span>
                                <span className="font-bold">35%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-red-400"><div className="w-2 h-2 rounded-full bg-red-400" /> Fats</span>
                                <span className="font-bold">20%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-indigo-700 p-8 rounded-[32px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Smart Assist</h3>
                            <p className="text-white/80 text-sm mb-6 leading-relaxed">
                                "Based on your recent push workouts, your triceps endurance is improving. High reps are working for you!"
                            </p>
                            <button className="bg-white text-primary font-bold px-6 py-2 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all">
                                Ask FitAI
                            </button>
                        </div>
                        <Sparkles className="absolute right-[-20px] top-[-20px] text-white opacity-10 group-hover:scale-110 transition-transform" size={160} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

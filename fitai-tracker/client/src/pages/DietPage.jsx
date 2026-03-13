import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Utensils, PieChart, Info } from 'lucide-react';

const DietPage = () => {
    const [logs, setLogs] = useState([]);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newLog, setNewLog] = useState({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: 'snack',
        quantity: 1
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('/api/diet');
            setLogs(res.data.dietLogs);
            setTotals(res.data.totals);
        } catch (err) {
            toast.error('Failed to fetch diet logs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/diet', newLog);
            setLogs([res.data, ...logs]);
            setShowForm(false);
            setNewLog({ foodName: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'snack', quantity: 1 });
            toast.success('Food logged!');
            fetchLogs(); // Refresh totals
        } catch (err) {
            toast.error('Failed to log food');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/diet/${id}`);
            setLogs(logs.filter(log => log._id !== id));
            toast.success('Log deleted');
            fetchLogs(); // Refresh totals
        } catch (err) {
            toast.error('Failed to delete log');
        }
    };

    return (
        <div className="pt-24 px-6 max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Diet <span className="text-gradient">Log</span></h1>
                    <p className="text-text-muted">You are what you eat. Track your nutrition.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    {showForm ? 'Close' : 'Log Food'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="glass-card flex flex-col items-center justify-center p-6 bg-primary/10 border-primary/20">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-widest mb-1">Calories</p>
                    <p className="text-2xl font-bold text-primary">{Math.round(totals.calories)}</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase">kcal today</p>
                </div>
                <div className="glass-card flex flex-col items-center justify-center p-6 bg-secondary/10 border-secondary/20">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-widest mb-1">Protein</p>
                    <p className="text-2xl font-bold text-secondary">{Math.round(totals.protein)}g</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase">Build Muscle</p>
                </div>
                <div className="glass-card flex flex-col items-center justify-center p-6 bg-accent/10 border-accent/20">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-widest mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(totals.carbs)}g</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase">Energy</p>
                </div>
                <div className="glass-card flex flex-col items-center justify-center p-6 bg-red-500/10 border-red-500/20">
                    <p className="text-text-muted text-xs uppercase font-bold tracking-widest mb-1">Fats</p>
                    <p className="text-2xl font-bold text-red-400">{Math.round(totals.fat)}g</p>
                    <p className="text-[10px] text-text-muted mt-1 uppercase">Healthy lipids</p>
                </div>
            </div>

            {showForm && (
                <div className="glass-card mb-10 animate-fade-in max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block ml-1">Food Name</label>
                                <input
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                    placeholder="e.g. Chicken Breast, Greek Yogurt"
                                    value={newLog.foodName}
                                    onChange={(e) => setNewLog({ ...newLog, foodName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block ml-1">Calories</label>
                                <input
                                    type="number" required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                    placeholder="kcal"
                                    value={newLog.calories}
                                    onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block ml-1">Meal Type</label>
                                <select
                                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                    value={newLog.mealType}
                                    onChange={(e) => setNewLog({ ...newLog, mealType: e.target.value })}
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block text-center">Protein (g)</label>
                                <input
                                    type="number" step="0.1"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center focus:border-secondary"
                                    value={newLog.protein}
                                    onChange={(e) => setNewLog({ ...newLog, protein: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block text-center">Carbs (g)</label>
                                <input
                                    type="number" step="0.1"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center focus:border-accent"
                                    value={newLog.carbs}
                                    onChange={(e) => setNewLog({ ...newLog, carbs: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block text-center">Fat (g)</label>
                                <input
                                    type="number" step="0.1"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center focus:border-red-400"
                                    value={newLog.fat}
                                    onChange={(e) => setNewLog({ ...newLog, fat: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-3 mt-4">Save To Daily Log</button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-3">
                    {logs.length === 0 && (
                        <div className="glass-card text-center py-20 border-dashed border-2 border-white/5">
                            <Utensils size={48} className="mx-auto text-white/5 mb-4" />
                            <p className="text-text-muted">No food logged today. Eat healthy!</p>
                        </div>
                    )}
                    {logs.map((log) => (
                        <div key={log._id} className="glass-card flex items-center justify-between py-3 px-5 hover:bg-white/5 transition-colors animate-fade-in group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${log.mealType === 'breakfast' ? 'bg-orange-500/20 text-orange-400' :
                                    log.mealType === 'lunch' ? 'bg-green-500/20 text-green-400' :
                                        log.mealType === 'dinner' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                    }`}>
                                    <Utensils size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold">{log.foodName}</h4>
                                    <div className="flex gap-3 text-xs text-text-muted">
                                        <span className="capitalize">{log.mealType}</span>
                                        <span>•</span>
                                        <span>{log.calories} kcal</span>
                                        <span>•</span>
                                        <span className="text-secondary">P: {log.protein}g</span>
                                        <span className="text-accent">C: {log.carbs}g</span>
                                        <span className="text-red-400">F: {log.fat}g</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(log._id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-20 p-6 glass border border-primary/10 rounded-2xl flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-xl text-primary">
                    <Info />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-1">AI Suggestion</h4>
                    <p className="text-text-muted text-sm leading-relaxed">
                        Based on your today's log, you've had a solid protein intake but protein could be slightly higher for optimal muscle recovery. Consider a post-workout shake or chicken breast for dinner!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DietPage;

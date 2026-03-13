import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Dumbbell, Calendar, ChevronRight } from 'lucide-react';

const WorkoutsPage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newWorkout, setNewWorkout] = useState({
        name: '',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }],
        notes: ''
    });

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const res = await axios.get('/api/workout');
            setWorkouts(res.data);
        } catch (err) {
            toast.error('Failed to fetch workouts');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExercise = () => {
        setNewWorkout({
            ...newWorkout,
            exercises: [...newWorkout.exercises, { name: '', sets: '', reps: '', weight: '' }]
        });
    };

    const handleRemoveExercise = (index) => {
        const updated = newWorkout.exercises.filter((_, i) => i !== index);
        setNewWorkout({ ...newWorkout, exercises: updated });
    };

    const handleExerciseChange = (index, field, value) => {
        const updated = [...newWorkout.exercises];
        updated[index][field] = value;
        setNewWorkout({ ...newWorkout, exercises: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/workout', newWorkout);
            setWorkouts([res.data, ...workouts]);
            setShowForm(false);
            setNewWorkout({ name: '', exercises: [{ name: '', sets: '', reps: '', weight: '' }], notes: '' });
            toast.success('Workout logged!');
        } catch (err) {
            toast.error('Failed to log workout');
        }
    };

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My <span className="text-gradient">Workouts</span></h1>
                    <p className="text-text-muted">Keep track of your strength and progress.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    {showForm ? 'Close' : 'Log Workout'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card mb-10 animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-text-muted uppercase mb-2">Workout Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Morning Push Day, Full Body"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary"
                                value={newWorkout.name}
                                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-text-muted uppercase">Exercises</label>
                            {newWorkout.exercises.map((ex, index) => (
                                <div key={index} className="flex flex-wrap gap-4 items-end bg-white/5 p-4 rounded-xl relative">
                                    <div className="flex-1 min-w-[200px]">
                                        <input
                                            placeholder="Exercise Name"
                                            required
                                            className="w-full bg-transparent border-b border-white/10 py-1"
                                            value={ex.name}
                                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label className="text-[10px] uppercase text-text-muted font-bold">Sets</label>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-white/10 py-1 text-center"
                                            value={ex.sets}
                                            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label className="text-[10px] uppercase text-text-muted font-bold">Reps</label>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-white/10 py-1 text-center"
                                            value={ex.reps}
                                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-[10px] uppercase text-text-muted font-bold">Weight (kg)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-white/10 py-1 text-center"
                                            value={ex.weight}
                                            onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExercise(index)}
                                        className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddExercise}
                                className="flex items-center gap-2 text-primary font-bold hover:underline"
                            >
                                <Plus size={18} /> Add Exercise
                            </button>
                        </div>

                        <button type="submit" className="btn-primary w-full">Save Workout session</button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    {workouts.length === 0 && (
                        <div className="glass-card text-center py-20">
                            <Dumbbell size={48} className="mx-auto text-white/10 mb-4" />
                            <p className="text-text-muted">No workouts logged yet. Start training!</p>
                        </div>
                    )}
                    {workouts.map((workout) => (
                        <div key={workout._id} className="glass-card animate-fade-in group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        {workout.name}
                                        <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                                    </h3>
                                    <div className="flex items-center gap-4 text-text-muted text-sm mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(workout.date).toLocaleDateString()}</span>
                                        <span>{workout.exercises.length} Exercises</span>
                                    </div>
                                </div>
                                {/* Delete button could go here */}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {workout.exercises.slice(0, 3).map((ex, i) => (
                                    <span key={i} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-text-muted">
                                        {ex.name} • {ex.sets}x{ex.reps}
                                    </span>
                                ))}
                                {workout.exercises.length > 3 && (
                                    <span className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-text-muted">
                                        +{workout.exercises.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkoutsPage;

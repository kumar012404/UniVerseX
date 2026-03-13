import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthPage = ({ mode = 'login' }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post(endpoint, formData);
            login(res.data.token, res.data.user);
            toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-bg">
            <div className="glass-card w-full max-w-md p-8 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mx-auto mb-6">
                        <span className="text-white text-3xl font-bold">F</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                    </h1>
                    <p className="text-text-muted">
                        {mode === 'login'
                            ? 'Track your fitness journey with AI assistance.'
                            : 'Join FitAI and start your transformation today.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === 'register' && (
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:bg-white/10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:bg-white/10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:bg-white/10"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center text-text-muted">
                    {mode === 'login' ? (
                        <p>Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link></p>
                    ) : (
                        <p>Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

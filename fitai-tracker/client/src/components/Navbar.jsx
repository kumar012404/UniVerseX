import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Dumbbell, Utensils, MessageSquare, Camera, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    let navLinks = [];

    if (user?.role === 'admin') {
        navLinks = [
            { name: 'Admin Dashboard', path: '/admin', icon: <ShieldAlert size={20} /> },
        ];
    } else if (user) {
        navLinks = [
            { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
            { name: 'Workouts', path: '/workouts', icon: <Dumbbell size={20} /> },
            { name: 'Diet', path: '/diet', icon: <Utensils size={20} /> },
            { name: 'FitAI Chat', path: '/chat', icon: <MessageSquare size={20} /> },
        ];
    }

    if (!user) return null;

    return (
        <nav className="fixed top-0 w-full z-50 header-gradient-glass">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 no-underline group shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <span className="font-bold text-lg md:text-xl tracking-tight text-white line-clamp-1">FitAI<span className="text-primary">Tracker</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 card-glass px-6 py-2 rounded-full border border-white/5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center gap-2 text-text-muted hover:text-white transition-all hover:scale-105 no-underline"
                        >
                            <span className="text-primary">{link.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{link.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-2 hover:scale-110 transition-transform">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-primary hover:bg-white/10 transition-colors shadow-lg">
                            <User size={20} />
                        </div>
                    </Link>
                    <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden p-2 text-white transition-colors" 
                    style={{ background: 'none', border: 'none', outline: 'none', boxShadow: 'none' }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar & Overlay */}
            <div 
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
                onClick={() => setIsOpen(false)}
            />
            
            <div className={`sidebar-mobile ${isOpen ? 'open' : ''}`}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1e293b]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="font-bold text-white">FitAI<span className="text-primary">Tracker</span></span>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors border-none bg-none shadow-none"
                        style={{ background: 'transparent', border: 'none' }}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex flex-col gap-2 p-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                        >
                            <div className="text-primary">{link.icon}</div>
                            <span className="font-medium text-sm uppercase tracking-wide">{link.name}</span>
                        </Link>
                    ))}
                    <div className="h-px w-full bg-white/5 my-2" />
                    <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                    >
                        <User size={20} className="text-primary" />
                        <span className="font-medium text-sm uppercase tracking-wide">Profile</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left !bg-none !bg-transparent border-none shadow-none"
                        style={{ background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm uppercase tracking-wide">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

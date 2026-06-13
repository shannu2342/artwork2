import { Outlet, Navigate, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BarChart3, Eye, FileText, Home, Image as ImageIcon, LayoutDashboard, LogOut, Quote, Sparkles, Users, Video } from 'lucide-react';
import { ADMIN_SESSION_EXPIRED_EVENT, fetchAdminProfile, getAdminToken, logoutAdmin } from '../services/adminAuthService';

const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition ${
        isActive
            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;


const CONTENT_LINKS = [
    { to: '/admin/content/hero', label: 'Hero', icon: Sparkles },
    { to: '/admin/content/about', label: 'About', icon: Video },
    { to: '/admin/content/programs', label: 'Programs', icon: FileText },
    { to: '/admin/content/mentors', label: 'Mentors', icon: Users },
    { to: '/admin/content/gallery', label: 'Gallery', icon: ImageIcon },
    { to: '/admin/content/workshops', label: 'Workshops', icon: Home },
    { to: '/admin/content/testimonials', label: 'Testimonials', icon: Quote }
];

const CONTENT_TITLES = {
    hero: 'Hero Editor',
    about: 'About Editor',
    programs: 'Programs Editor',
    mentors: 'Mentors Editor',
    gallery: 'Gallery Editor',
    workshops: 'Workshops Editor',
    testimonials: 'Testimonials Editor'
};

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAdminToken()));

    useEffect(() => {
        const verifySession = async () => {
            const token = getAdminToken();
            if (!token) {
                setIsAuthenticated(false);
                setCheckingAuth(false);
                return;
            }

            try {
                await fetchAdminProfile();
                setIsAuthenticated(true);
            } catch (_error) {
                setIsAuthenticated(false);
            } finally {
                setCheckingAuth(false);
            }
        };

        void verifySession();
    }, []);

    useEffect(() => {
        const handleSessionExpired = () => {
            setIsAuthenticated(false);
            setCheckingAuth(false);
        };

        window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleSessionExpired);
        return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleSessionExpired);
    }, []);

    if (checkingAuth) {
        return (
            <div className="min-h-[100dvh] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600 font-medium">Checking admin session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = async () => {
        await logoutAdmin();
        navigate('/login', { replace: true });
    };

    const contentMatch = location.pathname.match(/\/admin\/(?:content|home-content)\/([^/]+)/);
    const sectionKey = contentMatch?.[1] || '';
    const pageTitle = sectionKey && CONTENT_TITLES[sectionKey]
        ? CONTENT_TITLES[sectionKey]
        : location.pathname.includes('/admin/content') || location.pathname.includes('/admin/home-content')
            ? 'Content Sections'
            : location.pathname.includes('/admin/analytics')
                ? 'Analytics'
                : 'Overview';

    return (
        <div className="flex h-[100dvh] bg-gray-100">
            <aside className="w-72 bg-[#2C3E50] text-white flex flex-col overflow-y-auto shrink-0">
                <div className="p-6 text-center border-b border-gray-700">
                    <Link to="/" className="text-2xl font-bold text-[#D4AF37]">
                        Limitless Art
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 min-h-0">
                    <NavLink to="/admin" end className={navItemClass}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Overview
                    </NavLink>
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition"
                    >
                        <Eye className="w-5 h-5 mr-3" />
                        Open Website
                    </Link>
                    <NavLink to="/admin/analytics" className={navItemClass}>
                        <BarChart3 className="w-5 h-5 mr-3" />
                        Analytics
                    </NavLink>
                    <div className="pt-4">
                        <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Content Pages</p>
                        <div className="space-y-1">
                            {CONTENT_LINKS.map((item) => (
                                <NavLink key={item.to} to={item.to} className={navItemClass}>
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-100">
                    <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

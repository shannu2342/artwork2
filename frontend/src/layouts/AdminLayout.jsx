import { Outlet, Navigate, Link, NavLink, useLocation } from 'react-router-dom';
import { Eye, Home, LayoutDashboard, LogOut } from 'lucide-react';

const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition ${
        isActive
            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

const AdminLayout = () => {
    const location = useLocation();

    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        window.location.href = '/login';
    };

    const pageTitle = location.pathname.includes('/admin/home-content')
        ? 'Home Content Manager'
        : 'Overview';

    return (
        <div className="flex h-[100dvh] bg-gray-100">
            <aside className="w-72 bg-[#2C3E50] text-white flex flex-col">
                <div className="p-6 text-center border-b border-gray-700">
                    <Link to="/" className="text-2xl font-bold text-[#D4AF37]">
                        Limitless Art
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <NavLink to="/admin" end className={navItemClass}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Overview
                    </NavLink>
                    <NavLink to="/admin/home-content" className={navItemClass}>
                        <Home className="w-5 h-5 mr-3" />
                        Home Content
                    </NavLink>
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition"
                    >
                        <Eye className="w-5 h-5 mr-3" />
                        Open Website
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
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

import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Who We Are', href: '/#who-we-are' },
        { name: 'Mission & Vision', href: '/#mission' },
        { name: 'What We Do', href: '/#what-we-do' },
        { name: 'Team', href: '/#team' },
        { name: 'Gallery', href: '/#gallery' },
        { name: 'Workshops', href: '/#workshops' },
    ];

    return (
        <div className="flex flex-col min-h-[100dvh]">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <img className="h-16 w-auto" src="/logo.jpg" alt="Limitless Art Logo" />
                                <span className="ml-3 text-2xl font-black text-[#D4AF37] uppercase tracking-wide">Limitless Art</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="relative text-[#2C3E50] font-semibold text-sm transition-colors group px-1 py-2">
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F9D423] to-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                            <Link to="/register" className="ml-4 bg-gradient-to-r from-[#F9D423] to-[#D4AF37] text-[#1a252f] hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5 px-7 py-2.5 rounded-full font-bold transition-all duration-300 transform shadow-md relative overflow-hidden group">
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                                <span className="relative">Register</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-[#2C3E50] hover:text-[#D4AF37] focus:outline-none"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-white shadow-lg overflow-hidden"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block text-[#2C3E50] hover:text-[#D4AF37] px-3 py-3 text-base font-medium"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <div className="mt-4 pb-4">
                                    <Link
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="inline-block bg-[#F9D423] text-black px-8 py-3 rounded-full font-bold w-11/12 mx-auto"
                                    >
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="flex-grow pt-20">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-[#2C3E50] to-[#1a252f] text-white py-16 text-center md:text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
                        <div>
                            <div className="flex items-center justify-center md:justify-start mb-6">
                                <div className="p-1.5 bg-white/10 rounded-full backdrop-blur-sm mr-4">
                                    <img className="h-12 w-auto bg-white p-1 rounded-full" src="/logo.jpg" alt="Limitless Art Logo" />
                                </div>
                                <span className="text-2xl font-black text-[#D4AF37] tracking-wider">Limitless Art</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed max-w-sm mx-auto md:mx-0">Empowering specially-abled children through art, creativity, and skill development in a safe, nurturing environment.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 border-b border-[#D4AF37] pb-2 inline-block">Quick Links</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="/#who-we-are" className="hover:text-white transition-colors">Who We Are</a></li>
                                <li><a href="/#workshops" className="hover:text-white transition-colors">Workshops</a></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Registration</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 border-b border-[#D4AF37] pb-2 inline-block">Contact</h3>
                            <p className="text-gray-300">Phone: 9654168888</p>
                            <p className="text-gray-300">Email: limitlessart.org@gmail.com</p>
                            <p className="text-gray-300">Instagram: @limitlessart_org</p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Limitless Art. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

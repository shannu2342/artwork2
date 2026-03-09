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
            <nav className="fixed w-full z-50 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <img className="h-16 w-auto" src="/logo.png" alt="Limitless Art Logo" />
                                <span className="ml-3 text-2xl font-black text-[#D4AF37] uppercase tracking-wide">Limitless Art</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-[#2C3E50] hover:text-[#D4AF37] px-3 py-2 text-sm font-medium transition-colors">
                                    {link.name}
                                </a>
                            ))}
                            <Link to="/register" className="bg-[#F9D423] text-black hover:bg-[#D4AF37] px-6 py-2 rounded-full font-bold transition-colors shadow-md">
                                Register
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
            <footer className="bg-[#2C3E50] text-white py-12 text-center md:text-left">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center justify-center md:justify-start mb-4">
                                <img className="h-10 w-auto bg-white p-1 rounded-full" src="/logo.png" alt="Limitless Art Logo" />
                                <span className="ml-3 text-xl font-bold text-[#D4AF37]">Limitless Art</span>
                            </div>
                            <p className="text-gray-300">Empowering specially-abled children through art and skill development.</p>
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

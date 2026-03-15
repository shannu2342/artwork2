import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { API_BASE } from '../services/siteContentService';

const Registration = () => {
    const [formData, setFormData] = useState({
        parentName: '',
        childName: '',
        age: '',
        email: '',
        phone: '',
        interests: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const backendUrl = `${API_BASE}/content`;
            const res = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: `Registration for ${formData.childName}`,
                    type: 'Registration',
                    data: formData
                })
            });

            if (res.ok) {
                setStatus('success');
                setFormData({
                    parentName: '', childName: '', age: '', email: '', phone: '', interests: '', message: ''
                });
                // Reset success message after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                const errorText = await res.text();
                console.error('Registration request failed:', res.status, errorText);
                setStatus('error');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-gray-50 min-h-[100dvh] py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="bg-[#2C3E50] px-8 py-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                        <h2 className="text-3xl font-extrabold text-[#D4AF37] relative z-10">Join Limitless Art</h2>
                        <p className="mt-2 text-gray-300 relative z-10 text-lg">Enroll your child in our upcoming creative workshops.</p>
                    </div>

                    <div className="px-8 py-10">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Registration Successful!</h3>
                                <p className="text-gray-600">We have received your details and will get in touch with you shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full transition-colors"
                                >
                                    Register Another Child
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status === 'error' && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-200 font-medium">
                                        An error occurred while submitting. Please try again later.
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Parent/Guardian Name</label>
                                        <input type="text" name="parentName" value={formData.parentName} required className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all" onChange={handleChange} placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Child's Name</label>
                                        <input type="text" name="childName" value={formData.childName} required className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all" onChange={handleChange} placeholder="Jane Doe" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Child's Age</label>
                                        <input type="number" name="age" value={formData.age} min="3" max="25" required className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all" onChange={handleChange} placeholder="E.g. 8" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} required className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all" onChange={handleChange} placeholder="+91 9876543210" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} required className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all" onChange={handleChange} placeholder="johndoe@example.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Child's Core Interests & Needs</label>
                                    <textarea name="interests" value={formData.interests} rows="4" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none" placeholder="E.g., loves bright colors, needs a quiet environment, enjoys tactical play..." onChange={handleChange}></textarea>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-gradient-to-r from-[#F9D423] to-[#D4AF37] hover:from-[#e5c21f] hover:to-[#c4a130] text-[#1a252f] font-extrabold py-4 px-8 rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                                Submitting Details...
                                            </>
                                        ) : (
                                            'Submit Registration'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Registration;

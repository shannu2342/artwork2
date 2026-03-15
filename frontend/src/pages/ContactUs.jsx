import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Loader2,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    User,
    HelpCircle
} from 'lucide-react';
import { API_BASE } from '../services/siteContentService';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        subject: 'General Enquiry',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('loading');

        try {
            const backendUrl = `${API_BASE}/content`;
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Contact enquiry from ${formData.fullName || 'Visitor'}`,
                    type: 'Contact',
                    data: formData
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Registration request failed:', response.status, errorText);
                setStatus('error');
                return;
            }

            setStatus('success');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                location: '',
                subject: 'General Enquiry',
                message: ''
            });

            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Registration failed:', error);
            setStatus('error');
        }
    };

    return (
        <div id="contact-us" className="min-h-[100dvh] bg-gradient-to-br from-[#f8fafc] via-white to-[#fff8df] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-[#2C3E50]">Contact Us</h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Send your message and our team will contact you quickly.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#2C3E50] to-[#1a252f]">
                            <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                <Mail className="w-7 h-7 text-[#F9D423]" /> Send Us A Message
                            </h2>
                        </div>

                        <div className="px-8 py-8">
                            {status === 'success' ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-[#2C3E50]">Message Sent Successfully</h3>
                                    <p className="text-gray-600 mt-2">Our team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {status === 'error' ? (
                                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
                                            Could not submit right now. Please try again.
                                        </div>
                                    ) : null}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1 block">Name*</label>
                                        <div className="relative">
                                                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Enter full name"
                                                    required
                                                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">E-Mail*</label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="you@example.com"
                                                    required
                                                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">Phone Number*</label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    required
                                                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">Location</label>
                                            <div className="relative">
                                                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="City, State"
                                                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1 block">Subject*</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                        >
                                            <option>General Enquiry</option>
                                            <option>Workshop Information</option>
                                            <option>Course Details</option>
                                            <option>Support Request</option>
                                            <option>Partnership / Volunteering</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1 block">Message*</label>
                                        <div className="relative">
                                            <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                required
                                                placeholder="Tell us how we can help..."
                                                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] hover:from-[#bf9d31] hover:to-[#e5c421] text-[#1a252f] font-black py-3.5 rounded-xl transition-all shadow-lg"
                                    >
                                        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        {status === 'loading' ? 'Submitting...' : 'Submit Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6"
                        >
                            <h3 className="text-3xl font-black text-[#2C3E50] flex items-center gap-3 mb-6">
                                <HelpCircle className="w-7 h-7 text-[#D4AF37]" /> Frequently Asked Questions
                            </h3>

                            <div className="space-y-5 text-gray-700">
                                <div>
                                    <h4 className="font-bold text-[#2C3E50]">How can I enroll my child?</h4>
                                    <p className="text-sm mt-1">Fill the form and our coordinator will confirm the next batch.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2C3E50]">Do you provide trial sessions?</h4>
                                    <p className="text-sm mt-1">Yes, trial and orientation sessions are available based on schedule.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2C3E50]">Is psychological support available?</h4>
                                    <p className="text-sm mt-1">Yes, emotional and behavioural support is integrated with programs.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6"
                        >
                            <h3 className="text-3xl font-black text-[#2C3E50] mb-6">Contact Information</h3>

                            <div className="space-y-5 text-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mt-0.5">
                                        <Mail className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2C3E50]">Email</p>
                                        <a href="mailto:limitlessart.org@gmail.com" className="text-sm hover:text-[#D4AF37]">
                                            limitlessart.org@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mt-0.5">
                                        <Phone className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2C3E50]">Phone</p>
                                        <a href="tel:+919654168888" className="text-sm hover:text-[#D4AF37]">
                                            +91 96541 68888
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mt-0.5">
                                        <MapPin className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2C3E50]">Address</p>
                                        <p className="text-sm">Delhi NCR, India</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

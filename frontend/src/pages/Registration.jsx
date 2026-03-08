import { useState } from 'react';

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Registration Complete. We will contact you soon!');
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-[#2C3E50] px-8 py-10 text-center">
                        <h2 className="text-3xl font-extrabold text-[#D4AF37]">Join Limitless Art</h2>
                        <p className="mt-2 text-gray-300">Enroll your child in our upcoming creative workshops.</p>
                    </div>

                    <div className="px-8 py-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Parent/Guardian Name</label>
                                    <input type="text" name="parentName" required className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Child's Name</label>
                                    <input type="text" name="childName" required className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Child's Age</label>
                                    <input type="number" name="age" required className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                    <input type="tel" name="phone" required className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none" onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                                <input type="email" name="email" required className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none" onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Child's Core Interests & Needs</label>
                                <textarea name="interests" rows="3" className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none" placeholder="E.g., loves bright colors, needs a quiet environment..." onChange={handleChange}></textarea>
                            </div>

                            <div>
                                <button type="submit" className="w-full bg-[#F9D423] hover:bg-[#D4AF37] text-black font-bold py-4 px-8 rounded-lg transition-colors shadow-md">
                                    Submit Registration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;

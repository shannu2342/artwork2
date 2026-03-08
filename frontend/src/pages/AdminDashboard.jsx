import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we'd fetch from backend here.
        // For now we mock the data to show UI structure.
        setPosts([
            { _id: '1', title: 'New Workshop Scheduled', type: 'Workshop', date: '2026-04-10' },
            { _id: '2', title: 'Awesome Art by Jimmy', type: 'Gallery', date: '2026-03-25' }
        ]);
        setLoading(false);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(p => p._id !== id));
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-[#2C3E50]">
                    <h3 className="text-gray-500 text-sm font-medium">Total Registrations</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">142</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-[#D4AF37]">
                    <h3 className="text-gray-500 text-sm font-medium">Active Workshops</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-[#F9D423]">
                    <h3 className="text-gray-500 text-sm font-medium">Gallery Items</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">56</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-[#2C3E50]">Manage Posts & Content</h2>
                    <button className="bg-[#D4AF37] hover:bg-[#b0922e] text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition">
                        <Plus className="w-4 h-4 mr-2" /> Add New
                    </button>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-sm font-semibold text-gray-600 uppercase">Title</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600 uppercase">Type</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600 uppercase">Date</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 text-gray-800 font-medium">{post.title}</td>
                                        <td className="py-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm">{post.date}</td>
                                        <td className="py-4 text-right">
                                            <button className="text-gray-400 hover:text-blue-500 mr-3"><Edit className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(post._id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ExternalLink, Home, Image as ImageIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchContacts, fetchRegistrations } from '../services/siteContentService';

const AdminDashboard = () => {
    const { content } = useSiteContent();
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(true);
    const [registrationError, setRegistrationError] = useState('');
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [contactError, setContactError] = useState('');

    useEffect(() => {
        const loadRegistrations = async () => {
            setLoadingRegistrations(true);
            try {
                const rows = await fetchRegistrations();
                setRegistrations(rows);
                setRegistrationError('');
            } catch (requestError) {
                setRegistrationError(
                    requestError instanceof Error
                        ? requestError.message
                        : 'Could not load registrations from API.'
                );
            } finally {
                setLoadingRegistrations(false);
            }
        };

        const loadContacts = async () => {
            setLoadingContacts(true);
            try {
                const rows = await fetchContacts();
                setContacts(rows);
                setContactError('');
            } catch (requestError) {
                setContactError(
                    requestError instanceof Error
                        ? requestError.message
                        : 'Could not load contact enquiries from API.'
                );
            } finally {
                setLoadingContacts(false);
            }
        };

        void loadRegistrations();
        void loadContacts();
    }, []);

    const stats = useMemo(
        () => [
            {
                title: 'Total Registrations',
                value: registrations.length,
                icon: Users,
                accent: 'border-l-[#2C3E50]'
            },
            {
                title: 'Mentor Cards on Home',
                value: content.home.team.members.length,
                icon: Home,
                accent: 'border-l-[#D4AF37]'
            },
            {
                title: 'Gallery Items on Home',
                value: content.home.gallery.items.length,
                icon: ImageIcon,
                accent: 'border-l-[#F9D423]'
            },
            {
                title: 'Contact Enquiries',
                value: contacts.length,
                icon: CalendarDays,
                accent: 'border-l-emerald-500'
            }
        ],
        [contacts.length, content.home.gallery.items.length, content.home.team.members.length, registrations.length]
    );

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-[#2C3E50]">Admin Overview</h1>
                <p className="text-sm text-gray-500 mt-1">
                    This dashboard is connected to Node.js + Express + MySQL. Use Home Content to edit website text and photos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 ${stat.accent}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                            <stat.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/admin/home-content"
                            className="w-full inline-flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Open Home Content Manager
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/"
                            target="_blank"
                            className="w-full inline-flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Open Public Home Page
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Content Snapshot</h2>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
                            <span>Hero Title</span>
                            <span className="font-semibold text-[#2C3E50] truncate ml-4">{content.home.hero.title}</span>
                        </li>
                        <li className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
                            <span>Programs</span>
                            <span className="font-semibold text-[#2C3E50]">{content.home.programs.length}</span>
                        </li>
                        <li className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
                            <span>Testimonials</span>
                            <span className="font-semibold text-[#2C3E50]">{content.home.testimonials.items.length}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-bold text-[#2C3E50]">Recent Registrations</h2>
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                </div>

                <div className="p-6 overflow-x-auto">
                    {loadingRegistrations ? (
                        <p className="text-sm text-gray-500">Loading registrations...</p>
                    ) : null}

                    {registrationError ? (
                        <p className="text-sm text-red-600">{registrationError}</p>
                    ) : null}

                    {!loadingRegistrations && !registrationError ? (
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Child</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Parent</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Phone</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.slice(0, 8).map((row) => (
                                    <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 text-sm text-gray-800 font-medium">
                                            {row.data?.childName || 'Unknown'}
                                        </td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.parentName || '-'}</td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.phone || '-'}</td>
                                        <td className="py-3 text-sm text-gray-500">
                                            {new Date(row.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null}

                    {!loadingRegistrations && !registrationError && registrations.length === 0 ? (
                        <p className="text-sm text-gray-500">No registrations yet.</p>
                    ) : null}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-bold text-[#2C3E50]">Recent Contact Enquiries</h2>
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                </div>

                <div className="p-6 overflow-x-auto">
                    {loadingContacts ? (
                        <p className="text-sm text-gray-500">Loading contact enquiries...</p>
                    ) : null}

                    {contactError ? (
                        <p className="text-sm text-red-600">{contactError}</p>
                    ) : null}

                    {!loadingContacts && !contactError ? (
                        <table className="w-full text-left border-collapse min-w-[760px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Subject</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Phone</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.slice(0, 8).map((row) => (
                                    <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 text-sm text-gray-800 font-medium">
                                            {row.data?.fullName || 'Unknown'}
                                        </td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.subject || '-'}</td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.phone || '-'}</td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.email || '-'}</td>
                                        <td className="py-3 text-sm text-gray-500">
                                            {new Date(row.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null}

                    {!loadingContacts && !contactError && contacts.length === 0 ? (
                        <p className="text-sm text-gray-500">No contact enquiries yet.</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import { useEffect, useMemo, useState } from 'react';
import {
    CalendarDays,
    Home,
    Image as ImageIcon,
    Mail,
    MessageCircle,
    Phone,
    Save,
    Search,
    Settings,
    Users,
    Youtube,
    Instagram
} from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchContacts, fetchInternships, fetchRegistrations } from '../services/siteContentService';

const normalizeNumericLink = (value) => (value || '').replace(/[^\d+]/g, '');

const StatCard = ({ accent, iconNode, title, value, helper }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 ${accent}`}>
        <div className="flex items-center justify-between gap-4">
            <div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                {helper ? <p className="text-xs text-gray-500 mt-2">{helper}</p> : null}
            </div>
            {iconNode}
        </div>
    </div>
);

const SettingsInput = ({ label, type = 'text', value, onChange, placeholder }) => (
    <label className="block">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />
    </label>
);

const SettingsTextarea = ({ label, rows = 3, value, onChange, placeholder }) => (
    <label className="block">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <textarea
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-y"
        />
    </label>
);

const AdminDashboard = () => {
    const { content, updateContent, saving } = useSiteContent();
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(true);
    const [registrationError, setRegistrationError] = useState('');
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [contactError, setContactError] = useState('');
    const [internships, setInternships] = useState([]);
    const [loadingInternships, setLoadingInternships] = useState(true);
    const [internshipError, setInternshipError] = useState('');
    const [settingsDraft, setSettingsDraft] = useState(() => content.site);
    const [settingsStatus, setSettingsStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        setSettingsDraft(content.site);
    }, [content.site]);

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

        const loadInternships = async () => {
            setLoadingInternships(true);
            try {
                const rows = await fetchInternships();
                setInternships(rows);
                setInternshipError('');
            } catch (requestError) {
                setInternshipError(
                    requestError instanceof Error
                        ? requestError.message
                        : 'Could not load internship applications from API.'
                );
            } finally {
                setLoadingInternships(false);
            }
        };

        void loadRegistrations();
        void loadContacts();
        void loadInternships();
    }, []);

    const stats = useMemo(
        () => [
            {
                title: 'Total Registrations',
                value: registrations.length,
                iconNode: <Users className="w-5 h-5 text-gray-400" />,
                accent: 'border-l-[#2C3E50]',
                helper: 'Submitted from registration page'
            },
            {
                title: 'Contact Enquiries',
                value: contacts.length,
                iconNode: <Mail className="w-5 h-5 text-gray-400" />,
                accent: 'border-l-emerald-500',
                helper: 'Messages received from contact form'
            },
            {
                title: 'Internship Applications',
                value: internships.length,
                iconNode: <Users className="w-5 h-5 text-gray-400" />,
                accent: 'border-l-violet-500',
                helper: 'Applications submitted from internship form'
            },
            {
                title: 'Mentor Cards On Home',
                value: content.home.team.members.length,
                iconNode: <Home className="w-5 h-5 text-gray-400" />,
                accent: 'border-l-[#D4AF37]',
                helper: `${content.home.gallery.items.length} gallery items live`
            },
        ],
        [contacts.length, content.home.gallery.items.length, content.home.team.members.length, internships.length, registrations.length]
    );

    const handleSiteFieldChange = (path, value) => {
        setSettingsDraft((current) => {
            const next = structuredClone(current);
            let cursor = next;
            for (let index = 0; index < path.length - 1; index += 1) {
                cursor = cursor[path[index]];
            }
            cursor[path[path.length - 1]] = value;
            return next;
        });
    };

    const handleSaveSettings = async (event) => {
        event.preventDefault();
        setSettingsStatus({ type: '', message: '' });

        try {
            await updateContent((draft) => {
                draft.site = structuredClone(settingsDraft);
                return draft;
            });
            setSettingsStatus({ type: 'success', message: 'Contact, social, and SEO settings saved.' });
        } catch (error) {
            setSettingsStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Could not save settings.'
            });
        }
    };

    const whatsappHref = normalizeNumericLink(settingsDraft.contact.whatsappNumber);
    const phoneHref = normalizeNumericLink(settingsDraft.contact.phone);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-[#2C3E50]">Admin Overview</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage brand settings, contact channels, and core content tools for Limitless Art from one place.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        accent={stat.accent}
                        iconNode={stat.iconNode}
                        title={stat.title}
                        value={stat.value}
                        helper={stat.helper}
                    />
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Brand Snapshot</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 gap-4">
                        <span>Organization</span>
                        <span className="font-semibold text-[#2C3E50] text-right">{settingsDraft.organizationName}</span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 gap-4">
                        <span>Main Email</span>
                        <span className="font-semibold text-[#2C3E50] text-right break-all">{settingsDraft.contact.email}</span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 gap-4">
                        <span>WhatsApp</span>
                        <span className="font-semibold text-[#2C3E50] text-right">{settingsDraft.contact.whatsappNumber}</span>
                    </li>
                </ul>
            </div>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                        <h2 className="text-xl font-bold text-[#2C3E50]">Brand, Contact, And Social Settings</h2>
                        <p className="text-sm text-gray-500 mt-1">Update footer details, WhatsApp, and social links from here.</p>
                    </div>
                </div>

                <form onSubmit={handleSaveSettings} className="p-6 space-y-8">
                    {settingsStatus.message ? (
                        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${settingsStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                            {settingsStatus.message}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <h3 className="text-lg font-bold text-[#2C3E50]">Organization Details</h3>
                            <SettingsInput label="Organization Name" value={settingsDraft.organizationName} onChange={(event) => handleSiteFieldChange(['organizationName'], event.target.value)} placeholder="Limitless Art" />
                            <SettingsInput label="Primary Email" type="email" value={settingsDraft.contact.email} onChange={(event) => handleSiteFieldChange(['contact', 'email'], event.target.value)} placeholder="hello@example.com" />
                            <SettingsInput label="Phone Number" value={settingsDraft.contact.phone} onChange={(event) => handleSiteFieldChange(['contact', 'phone'], event.target.value)} placeholder="+91 98765 43210" />
                            <SettingsInput label="WhatsApp Number" value={settingsDraft.contact.whatsappNumber} onChange={(event) => handleSiteFieldChange(['contact', 'whatsappNumber'], event.target.value)} placeholder="919876543210" />
                            <SettingsTextarea label="Address" rows={3} value={settingsDraft.contact.address} onChange={(event) => handleSiteFieldChange(['contact', 'address'], event.target.value)} placeholder="City, State, Country" />
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-lg font-bold text-[#2C3E50]">Social Links</h3>
                            <SettingsInput label="Instagram URL" value={settingsDraft.social.instagramUrl} onChange={(event) => handleSiteFieldChange(['social', 'instagramUrl'], event.target.value)} placeholder="https://instagram.com/yourpage" />
                            <SettingsInput label="YouTube URL" value={settingsDraft.social.youtubeUrl} onChange={(event) => handleSiteFieldChange(['social', 'youtubeUrl'], event.target.value)} placeholder="https://youtube.com/@yourchannel" />
                            <div className="grid grid-cols-2 gap-3">
                                <a href={settingsDraft.social.instagramUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                    <Instagram className="w-4 h-4" />
                                    Instagram
                                </a>
                                <a href={settingsDraft.social.youtubeUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                    <Youtube className="w-4 h-4" />
                                    YouTube
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <h3 className="text-lg font-bold text-[#2C3E50] mb-4">Live Contact Points</h3>
                            <div className="space-y-4 text-sm text-gray-700">
                                <a href={`mailto:${settingsDraft.contact.email}`} className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 hover:border-[#D4AF37]">
                                    <Mail className="w-4 h-4 mt-0.5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-semibold text-[#2C3E50]">Email</p>
                                        <p>{settingsDraft.contact.email}</p>
                                    </div>
                                </a>
                                <a href={`tel:${phoneHref}`} className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 hover:border-[#D4AF37]">
                                    <Phone className="w-4 h-4 mt-0.5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-semibold text-[#2C3E50]">Phone</p>
                                        <p>{settingsDraft.contact.phone}</p>
                                    </div>
                                </a>
                                <a href={`https://wa.me/${whatsappHref}`} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 hover:border-[#D4AF37]">
                                    <MessageCircle className="w-4 h-4 mt-0.5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-semibold text-[#2C3E50]">WhatsApp</p>
                                        <p>{settingsDraft.contact.whatsappNumber}</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
                            <div>
                                <p className="text-sm font-semibold text-[#2C3E50]">Save these settings to update footer, WhatsApp, and public contact details site-wide.</p>
                                <p className="text-xs text-gray-500 mt-1">Analytics has been moved into its own admin section for cleaner access.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white hover:bg-[#213244] disabled:opacity-60 self-start"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </form>
            </section>

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
                    <h2 className="text-lg font-bold text-[#2C3E50]">Recent Internship Applications</h2>
                    <Users className="w-4 h-4 text-gray-500" />
                </div>

                <div className="p-6 overflow-x-auto">
                    {loadingInternships ? (
                        <p className="text-sm text-gray-500">Loading internship applications...</p>
                    ) : null}

                    {internshipError ? (
                        <p className="text-sm text-red-600">{internshipError}</p>
                    ) : null}

                    {!loadingInternships && !internshipError ? (
                        <table className="w-full text-left border-collapse min-w-[760px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Interest</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Phone</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internships.slice(0, 8).map((row) => (
                                    <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 text-sm text-gray-800 font-medium">{row.data?.fullName || 'Unknown'}</td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.areaOfInterest || '-'}</td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.phone || '-'}</td>
                                        <td className="py-3 text-sm text-gray-600">{row.data?.email || '-'}</td>
                                        <td className="py-3 text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null}

                    {!loadingInternships && !internshipError && internships.length === 0 ? (
                        <p className="text-sm text-gray-500">No internship applications yet.</p>
                    ) : null}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-bold text-[#2C3E50]">Recent Contact Enquiries</h2>
                    <Search className="w-4 h-4 text-gray-500" />
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

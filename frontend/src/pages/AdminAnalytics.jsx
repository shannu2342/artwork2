import { useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { BarChart3, CalendarDays, Globe, Image as ImageIcon, Mail, Users } from 'lucide-react';
import { fetchAdminAnalytics } from '../services/siteContentService';

const ANALYTICS_RANGES = [7, 30, 90];
const SCREEN_SCOPES = {
    overview: { title: 'All Analytics', screen: '' },
    home: { title: 'Home Analytics', screen: 'Home' },
    about: { title: 'About Analytics', screen: 'About' },
    programs: { title: 'Programs Analytics', screen: 'Programs' },
    mentors: { title: 'Mentors Analytics', screen: 'Mentors' }
};

const formatDateTime = (value) => {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleString();
    } catch (_error) {
        return value;
    }
};

const formatDateLabel = (value) => {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (_error) {
        return value;
    }
};

const StatCard = ({ accent, iconNode, title, value }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 ${accent}`}>
        <div className="flex items-center justify-between gap-4">
            <div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            {iconNode}
        </div>
    </div>
);

const MiniBarList = ({ emptyLabel, items, labelKey, valueKey = 'visits' }) => {
    const maxValue = Math.max(0, ...items.map((item) => Number(item[valueKey] || 0)));
    if (!items.length) return <p className="text-sm text-gray-500">{emptyLabel}</p>;

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const value = Number(item[valueKey] || 0);
                const width = maxValue > 0 ? `${Math.max((value / maxValue) * 100, 10)}%` : '10%';
                return (
                    <div key={`${item[labelKey]}-${value}`}>
                        <div className="flex items-center justify-between gap-3 text-sm mb-1.5">
                            <span className="font-medium text-gray-700 truncate">{item[labelKey] || 'Unknown'}</span>
                            <span className="text-gray-500 shrink-0">{value}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F9D423]" style={{ width }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const scopeClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
        isActive ? 'bg-[#2C3E50] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
    }`;

const AdminAnalytics = () => {
    const { scope = 'overview' } = useParams();
    const currentScope = SCREEN_SCOPES[scope] || SCREEN_SCOPES.overview;
    const [analytics, setAnalytics] = useState(null);
    const [analyticsDays, setAnalyticsDays] = useState(30);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            setAnalyticsLoading(true);
            try {
                const payload = await fetchAdminAnalytics(analyticsDays, currentScope.screen);
                setAnalytics(payload);
                setAnalyticsError('');
            } catch (requestError) {
                setAnalyticsError(requestError instanceof Error ? requestError.message : 'Could not load visitor analytics.');
            } finally {
                setAnalyticsLoading(false);
            }
        };

        void loadAnalytics();
    }, [analyticsDays, currentScope.screen]);

    const dailyPeak = Math.max(0, ...(analytics?.dailyTraffic || []).map((item) => item.visits));
    const statTitle = useMemo(() => currentScope.screen || 'All Public Screens', [currentScope.screen]);

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[#2C3E50]">{currentScope.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">Analytics view for {statTitle.toLowerCase()}.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {ANALYTICS_RANGES.map((days) => (
                                <button
                                    key={days}
                                    type="button"
                                    onClick={() => setAnalyticsDays(days)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        analyticsDays === days
                                            ? 'bg-[#2C3E50] text-white'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Last {days} Days
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(SCREEN_SCOPES).map(([key, value]) => (
                            <NavLink key={key} to={key === 'overview' ? '/admin/analytics' : `/admin/analytics/${key}`} end className={scopeClass}>
                                {key === 'overview' ? 'All' : value.title.replace(' Analytics', '')}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {analyticsLoading ? <p className="text-sm text-gray-500">Loading analytics...</p> : null}
                    {analyticsError ? <p className="text-sm text-red-600">{analyticsError}</p> : null}
                    {!analyticsLoading && !analyticsError && analytics ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                <StatCard accent="border-l-[#D4AF37]" iconNode={<Globe className="w-5 h-5 text-gray-400" />} title="Total Visits" value={analytics.overview.totalVisits} />
                                <StatCard accent="border-l-[#2C3E50]" iconNode={<Users className="w-5 h-5 text-gray-400" />} title="Unique Visitors" value={analytics.overview.uniqueVisitors} />
                                <StatCard accent="border-l-emerald-500" iconNode={<CalendarDays className="w-5 h-5 text-gray-400" />} title="Today Visits" value={analytics.overview.todayVisits} />
                                <StatCard accent="border-l-[#F9D423]" iconNode={<Mail className="w-5 h-5 text-gray-400" />} title="Contacts" value={analytics.overview.contacts} />
                                <StatCard accent="border-l-pink-500" iconNode={<ImageIcon className="w-5 h-5 text-gray-400" />} title="Registrations" value={analytics.overview.registrations} />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                    <div className="flex items-center justify-between gap-3 mb-5">
                                        <h3 className="text-lg font-bold text-[#2C3E50]">Daily Traffic</h3>
                                        <span className="text-xs font-semibold text-gray-500">{formatDateLabel(analytics.range.from)} to {formatDateLabel(analytics.range.to)}</span>
                                    </div>
                                    {analytics.dailyTraffic.length ? (
                                        <div className="flex items-end gap-2 h-56">
                                            {analytics.dailyTraffic.map((item) => {
                                                const height = dailyPeak > 0 ? `${Math.max((item.visits / dailyPeak) * 100, 8)}%` : '8%';
                                                return (
                                                    <div key={item.date} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-2">
                                                        <div className="w-full rounded-t-xl bg-gradient-to-t from-[#D4AF37] to-[#F9D423]" style={{ height }} />
                                                        <div className="text-[11px] text-gray-500 text-center leading-tight">{formatDateLabel(item.date)}</div>
                                                        <div className="text-[11px] font-semibold text-[#2C3E50]">{item.visits}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : <p className="text-sm text-gray-500">No visits recorded in this range yet.</p>}
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                        <h3 className="text-lg font-bold text-[#2C3E50] mb-4">Traffic Sources</h3>
                                        <MiniBarList emptyLabel="No traffic source data yet." items={analytics.sources} labelKey="source" />
                                    </div>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                        <h3 className="text-lg font-bold text-[#2C3E50] mb-4">Devices</h3>
                                        <MiniBarList emptyLabel="No device data yet." items={analytics.devices} labelKey="deviceType" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-100"><h3 className="text-lg font-bold text-[#2C3E50]">Top Pages</h3></div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[680px] text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
                                                    <th className="px-5 py-3">Screen</th><th className="px-5 py-3">Path</th><th className="px-5 py-3">Visits</th><th className="px-5 py-3">Unique</th><th className="px-5 py-3">Last Visit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.topPages.length ? analytics.topPages.map((page) => (
                                                    <tr key={`${page.path}-${page.screenName}`} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="px-5 py-3 font-semibold text-[#2C3E50]">{page.screenName}</td>
                                                        <td className="px-5 py-3 text-sm text-gray-600">{page.path}</td>
                                                        <td className="px-5 py-3 text-sm text-gray-800">{page.visits}</td>
                                                        <td className="px-5 py-3 text-sm text-gray-800">{page.uniqueVisitors}</td>
                                                        <td className="px-5 py-3 text-sm text-gray-500">{formatDateTime(page.lastVisitedAt)}</td>
                                                    </tr>
                                                )) : <tr><td colSpan="5" className="px-5 py-6 text-sm text-gray-500">No page visits recorded yet.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-100"><h3 className="text-lg font-bold text-[#2C3E50]">Recent Visits</h3></div>
                                    <div className="p-5 space-y-3 max-h-[420px] overflow-y-auto">
                                        {analytics.recentVisits.length ? analytics.recentVisits.map((visit, index) => (
                                            <div key={`${visit.path}-${visit.visitedAt}-${index}`} className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div><p className="font-semibold text-[#2C3E50]">{visit.screenName}</p><p className="text-xs text-gray-500 mt-1">{visit.path}</p></div>
                                                    <span className="text-xs rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600 uppercase">{visit.deviceType}</span>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"><span>Source: {visit.source}</span><span>{formatDateTime(visit.visitedAt)}</span></div>
                                            </div>
                                        )) : <p className="text-sm text-gray-500">No recent visits recorded yet.</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                <h3 className="text-lg font-bold text-[#2C3E50] mb-4">Browser Breakdown</h3>
                                <MiniBarList emptyLabel="No browser data yet." items={analytics.browsers} labelKey="browserName" />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;

import { API_BASE_URL } from './apiBase';

const VISITOR_KEY = 'limitlessart_visitor_id';
const SESSION_KEY = 'limitlessart_session_id';

export const getOrCreateAnalyticsId = (key) => {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const next = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(key, next);
    return next;
};

export const trackAnalyticsVisit = ({ pageTitle = '', path = '/', referrer = '', screenName }) => {
    if (typeof window === 'undefined') {
        return;
    }

    if (path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/api')) {
        return;
    }

    const payload = {
        path,
        screenName,
        pageTitle: pageTitle || document.title || '',
        visitorId: getOrCreateAnalyticsId(VISITOR_KEY),
        sessionId: getOrCreateAnalyticsId(SESSION_KEY),
        referrer: referrer || document.referrer || '',
        userAgent: navigator.userAgent || '',
        visitedAt: new Date().toISOString()
    };

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(`${API_BASE_URL}/analytics/track`, blob);
        return;
    }

    fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
    }).catch(() => {});
};

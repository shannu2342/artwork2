import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAnalyticsVisit } from '../services/analyticsService';

const SCREEN_NAMES = {
    '/': 'Home',
    '/register': 'Registration',
    '/contact': 'Contact Us',
    '/gallery': 'Gallery'
};

const inferScreenName = (pathname) => SCREEN_NAMES[pathname] || pathname.replace(/^\//, '') || 'Home';

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
            return;
        }

        trackAnalyticsVisit({
            path: `${location.pathname}${location.search || ''}`,
            screenName: inferScreenName(location.pathname),
            pageTitle: document.title || ''
        });
    }, [location.pathname, location.search]);

    return null;
};

export default AnalyticsTracker;

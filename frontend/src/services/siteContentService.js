import { buildAuthHeaders, notifyAdminSessionExpired } from './adminAuthService';
import { API_BASE_URL } from './apiBase';

const siteContentUrl = (key) => `${API_BASE_URL}/site-content/${key}`;

const getErrorMessage = async (response, fallbackMessage) => {
    if (response.status === 401) {
        notifyAdminSessionExpired();
        return 'Session expired. Please login again.';
    }

    try {
        const payload = await response.json();
        if (payload?.error && typeof payload.error === 'string') {
            return payload.error;
        }
    } catch (_error) {
        // ignore and use fallback
    }

    return fallbackMessage;
};

export const fetchSiteContent = async (key) => {
    const response = await fetch(siteContentUrl(key));

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to fetch site content'));
    }

    const payload = await response.json();
    return payload?.data || null;
};

export const saveSiteContent = async (key, data) => {
    const response = await fetch(siteContentUrl(key), {
        method: 'PUT',
        headers: buildAuthHeaders({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ data })
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to save site content'));
    }

    return response.json();
};

export const uploadSiteImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: formData
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to upload image'));
    }

    return response.json();
};

export const uploadSiteVideo = async (file) => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${API_BASE_URL}/uploads/video`, {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: formData
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to upload video'));
    }

    return response.json();
};

const fetchContentByType = async (type, limit = 0) => {
    const params = new URLSearchParams({ type });
    if (limit > 0) {
        params.set('limit', String(limit));
    }
    const response = await fetch(`${API_BASE_URL}/content?${params.toString()}`, {
        headers: buildAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(await getErrorMessage(response, `Failed to fetch ${type.toLowerCase()} entries`));
    }

    return response.json();
};

export const fetchRegistrations = async () => fetchContentByType('Registration');
export const fetchContacts = async () => fetchContentByType('Contact', 50);
export const fetchInternships = async () => fetchContentByType('Internship', 50);

export const fetchAdminAnalytics = async (days = 30, screen = '') => {
    const params = new URLSearchParams({ days: String(days) });
    if (screen) {
        params.set('screen', screen);
    }
    const response = await fetch(`${API_BASE_URL}/admin/analytics?${params.toString()}`, {
        headers: buildAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to fetch analytics'));
    }

    return response.json();
};

export const API_BASE = API_BASE_URL;

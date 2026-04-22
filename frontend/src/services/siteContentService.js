import { buildAuthHeaders } from './adminAuthService';
import { API_BASE_URL } from './apiBase';

const siteContentUrl = (key) => `${API_BASE_URL}/site-content/${key}`;

const getErrorMessage = async (response, fallbackMessage) => {
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

export const fetchRegistrations = async () => {
    const response = await fetch(`${API_BASE_URL}/content?type=${encodeURIComponent('Registration')}`, {
        headers: buildAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to fetch registrations'));
    }

    return response.json();
};

export const fetchContacts = async () => {
    const response = await fetch(`${API_BASE_URL}/content?type=${encodeURIComponent('Contact')}&limit=50`, {
        headers: buildAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to fetch contacts'));
    }

    return response.json();
};

export const API_BASE = API_BASE_URL;

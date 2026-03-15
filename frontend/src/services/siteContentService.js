const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const siteContentUrl = (key) => `${API_BASE_URL}/site-content/${key}`;

export const fetchSiteContent = async (key) => {
    const response = await fetch(siteContentUrl(key));

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Failed to fetch site content');
    }

    const payload = await response.json();
    return payload?.data || null;
};

export const saveSiteContent = async (key, data) => {
    const response = await fetch(siteContentUrl(key), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    });

    if (!response.ok) {
        throw new Error('Failed to save site content');
    }

    return response.json();
};

export const uploadSiteImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        let errorMessage = 'Failed to upload image';

        try {
            const payload = await response.json();
            if (payload?.error) {
                errorMessage = payload.error;
            }
        } catch (_error) {
            // Keep generic message for non-JSON responses.
        }

        throw new Error(errorMessage);
    }

    return response.json();
};

export const fetchRegistrations = async () => {
    const response = await fetch(`${API_BASE_URL}/content`);
    if (!response.ok) {
        throw new Error('Failed to fetch registrations');
    }

    const records = await response.json();
    return records.filter((item) => item.type === 'Registration');
};

export const API_BASE = API_BASE_URL;

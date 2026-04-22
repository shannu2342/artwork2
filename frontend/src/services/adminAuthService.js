import { API_BASE_URL } from './apiBase';

const ADMIN_TOKEN_KEY = 'adminAuthToken';
const ADMIN_USER_KEY = 'adminAuthUser';

const readStoredUser = () => {
    try {
        const serialized = localStorage.getItem(ADMIN_USER_KEY);
        if (!serialized) {
            return null;
        }
        return JSON.parse(serialized);
    } catch (_error) {
        return null;
    }
};

const getErrorMessage = async (response, fallbackMessage) => {
    try {
        const payload = await response.json();
        if (payload?.error && typeof payload.error === 'string') {
            return payload.error;
        }
    } catch (_error) {
        // ignore and return fallback
    }
    return fallbackMessage;
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY) || '';

export const getAdminUser = () => readStoredUser();

export const setAdminSession = (token, user) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    if (user) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    }
};

export const clearAdminSession = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
};

export const buildAuthHeaders = (baseHeaders = {}) => {
    const token = getAdminToken();
    if (!token) {
        return baseHeaders;
    }

    return {
        ...baseHeaders,
        Authorization: `Bearer ${token}`
    };
};

export const loginAdmin = async ({ username, password }) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, 'Could not login. Please try again.');
        throw new Error(message);
    }

    const payload = await response.json();
    if (!payload?.token) {
        throw new Error('Login response is missing token.');
    }

    setAdminSession(payload.token, payload.user || null);
    return payload;
};

export const fetchAdminProfile = async () => {
    const token = getAdminToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/me`, {
        headers: buildAuthHeaders()
    });

    if (!response.ok) {
        clearAdminSession();
        const message = await getErrorMessage(response, 'Session expired. Please login again.');
        throw new Error(message);
    }

    const payload = await response.json();
    if (payload?.user) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(payload.user));
    }

    return payload;
};

export const logoutAdmin = async () => {
    const token = getAdminToken();

    try {
        if (token) {
            await fetch(`${API_BASE_URL}/admin/logout`, {
                method: 'POST',
                headers: buildAuthHeaders()
            });
        }
    } finally {
        clearAdminSession();
    }
};

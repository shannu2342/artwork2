const normalizeApiBase = (rawBase) => {
    let cleaned = (rawBase || 'http://localhost:5000').replace(/\/+$/, '');

    if (cleaned.endsWith('/api/content')) {
        cleaned = cleaned.replace(/\/api\/content$/, '/api');
        return cleaned;
    }

    if (cleaned.endsWith('/content')) {
        cleaned = cleaned.replace(/\/content$/, '');
    }

    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
};

export const API_BASE_URL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

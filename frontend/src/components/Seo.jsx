import { useEffect } from 'react';

const ensureMetaTag = (selector, attributes) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
        tag = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
        document.head.appendChild(tag);
    }
    return tag;
};

const ensureLinkTag = (selector, attributes) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
        tag = document.createElement('link');
        Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
        document.head.appendChild(tag);
    }
    return tag;
};

const normalizeUrl = (siteUrl, pathname = '/') => {
    const base = String(siteUrl || 'https://limitlessart.org').replace(/\/+$/, '');
    const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${base}${path}`;
};

const Seo = ({
    title,
    description,
    keywords,
    image,
    siteUrl,
    pathname = '/',
    type = 'website',
    structuredData = null
}) => {
    useEffect(() => {
        const canonicalUrl = normalizeUrl(siteUrl, pathname);
        document.title = title;

        ensureMetaTag('meta[name="description"]', { name: 'description' }).setAttribute('content', description || '');
        ensureMetaTag('meta[name="keywords"]', { name: 'keywords' }).setAttribute('content', keywords || '');
        ensureMetaTag('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title || '');
        ensureMetaTag('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', description || '');
        ensureMetaTag('meta[property="og:type"]', { property: 'og:type' }).setAttribute('content', type);
        ensureMetaTag('meta[property="og:url"]', { property: 'og:url' }).setAttribute('content', canonicalUrl);
        ensureMetaTag('meta[property="og:image"]', { property: 'og:image' }).setAttribute('content', normalizeUrl(siteUrl, image || '/logo.jpg'));
        ensureMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }).setAttribute('content', 'summary_large_image');
        ensureMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }).setAttribute('content', title || '');
        ensureMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }).setAttribute('content', description || '');
        ensureMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }).setAttribute('content', normalizeUrl(siteUrl, image || '/logo.jpg'));
        ensureLinkTag('link[rel="canonical"]', { rel: 'canonical' }).setAttribute('href', canonicalUrl);

        const scriptId = 'seo-structured-data';
        let scriptTag = document.getElementById(scriptId);
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.type = 'application/ld+json';
            scriptTag.id = scriptId;
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = structuredData ? JSON.stringify(structuredData) : '';
    }, [description, image, keywords, pathname, siteUrl, structuredData, title, type]);

    return null;
};

export default Seo;

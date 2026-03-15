import { useCallback, useEffect, useState } from 'react';
import {
    SITE_CONTENT_KEY,
    cloneSiteContent,
    defaultSiteContent,
    mergeSiteContent
} from '../data/siteContent';
import { fetchSiteContent, saveSiteContent } from '../services/siteContentService';

const buildContent = (remoteContent) => mergeSiteContent(defaultSiteContent, remoteContent || {});

export const useSiteContent = () => {
    const [content, setContent] = useState(() => cloneSiteContent(defaultSiteContent));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [lastSavedAt, setLastSavedAt] = useState(null);

    const refreshContent = useCallback(async () => {
        setLoading(true);

        try {
            const remoteData = await fetchSiteContent(SITE_CONTENT_KEY);
            setContent(buildContent(remoteData));
            setError('');
        } catch (requestError) {
            console.error('Failed to load site content:', requestError);
            setContent(cloneSiteContent(defaultSiteContent));
            setError('Could not load saved site content. Showing default content.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshContent();
    }, [refreshContent]);

    const persistContent = useCallback(async (nextContent) => {
        setSaving(true);

        try {
            await saveSiteContent(SITE_CONTENT_KEY, nextContent);
            setLastSavedAt(new Date());
            setError('');
        } catch (requestError) {
            console.error('Failed to save site content:', requestError);
            setError('Could not save changes. Please try again.');
            throw requestError;
        } finally {
            setSaving(false);
        }
    }, []);

    const updateContent = useCallback(
        async (updater) => {
            const draft = cloneSiteContent(content);
            const nextContent = typeof updater === 'function' ? updater(draft) : updater;
            const normalizedContent = buildContent(nextContent);

            setContent(normalizedContent);

            try {
                await persistContent(normalizedContent);
            } catch (requestError) {
                await refreshContent();
                throw requestError;
            }
        },
        [content, persistContent, refreshContent]
    );

    const resetToDefault = useCallback(async () => {
        const defaults = cloneSiteContent(defaultSiteContent);
        setContent(defaults);
        await persistContent(defaults);
    }, [persistContent]);

    return {
        content,
        error,
        lastSavedAt,
        loading,
        saving,
        refreshContent,
        resetToDefault,
        updateContent
    };
};

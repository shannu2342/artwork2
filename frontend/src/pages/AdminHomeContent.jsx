import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Eye, ImagePlus, Pencil, Plus, RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { uploadSiteImage, uploadSiteVideo } from '../services/siteContentService';

const getByPath = (object, path) => path.reduce((cursor, key) => cursor[key], object);

const SectionCard = ({ title, description, children }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#2C3E50]">{title}</h2>
            {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        <div className="p-6 space-y-6">{children}</div>
    </section>
);

const GALLERY_VIDEO_MAX_SECONDS = 150;

const getGalleryMediaType = (item) => {
    if (item?.mediaType === 'video' && item?.video) return 'video';
    if (item?.image) return 'image';
    if (item?.video) return 'video';
    return item?.mediaType === 'video' ? 'video' : 'image';
};

const getGalleryMediaUrl = (item) => (getGalleryMediaType(item) === 'video' ? item?.video || '' : item?.image || '');

const readVideoDuration = (file) =>
    new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const probe = document.createElement('video');

        probe.preload = 'metadata';
        probe.onloadedmetadata = () => {
            const duration = Number(probe.duration || 0);
            URL.revokeObjectURL(objectUrl);
            resolve(duration);
        };
        probe.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Unable to read video duration. Please use a valid video file.'));
        };
        probe.src = objectUrl;
    });

const EditableTextField = ({ label, multiline = false, maxLength = multiline ? 420 : 120, onSave, value }) => {
    const [draft, setDraft] = useState(value || '');
    const [editing, setEditing] = useState(false);
    const [working, setWorking] = useState(false);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        setDraft(value || '');
    }, [value]);

    const handleSave = async () => {
        setWorking(true);
        setLocalError('');

        try {
            await onSave(draft);
            setEditing(false);
        } catch (_error) {
            setLocalError('Failed to save this text field.');
        } finally {
            setWorking(false);
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
                    {editing ? (
                        multiline ? (
                            <textarea
                                rows={4}
                                value={draft}
                                maxLength={maxLength}
                                onChange={(event) => setDraft(event.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        ) : (
                            <input
                                value={draft}
                                maxLength={maxLength}
                                onChange={(event) => setDraft(event.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        )
                    ) : (
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words">{value || 'No text set.'}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">{draft.length}/{maxLength} characters</p>
                </div>
                <button
                    type="button"
                    onClick={() => setEditing((current) => !current)}
                    className="shrink-0 inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Edit Text
                </button>
            </div>

            {editing ? (
                <div className="mt-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={working}
                        className="rounded-lg bg-[#2C3E50] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1f2d3a] disabled:opacity-60"
                    >
                        {working ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setDraft(value || '');
                            setEditing(false);
                            setLocalError('');
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            ) : null}

            {localError ? <p className="mt-2 text-xs text-red-600">{localError}</p> : null}
        </div>
    );
};

const EditableImageField = ({ label, onSave, value }) => {
    const inputRef = useRef(null);
    const [working, setWorking] = useState(false);
    const [localError, setLocalError] = useState('');

    const selectImage = () => {
        inputRef.current?.click();
    };

    const handleFilePick = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setLocalError('Please choose a valid image file.');
            return;
        }

        setLocalError('');
        setWorking(true);

        try {
            const uploaded = await uploadSiteImage(file);
            await onSave(uploaded.url);
        } catch (error) {
            setLocalError(error instanceof Error ? error.message : 'Failed to save image. Please try again.');
        } finally {
            setWorking(false);
            event.target.value = '';
        }
    };

    const handleRemoveImage = async () => {
        setWorking(true);
        setLocalError('');

        try {
            await onSave('');
        } catch (_error) {
            setLocalError('Failed to remove image. Please try again.');
        } finally {
            setWorking(false);
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-40">
                {value ? (
                    <img src={value} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 font-semibold">
                        No image yet
                    </div>
                )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={selectImage}
                    disabled={working}
                    className="inline-flex items-center rounded-lg bg-[#D4AF37] px-3 py-2 text-xs font-semibold text-white hover:bg-[#b8962d] disabled:opacity-60"
                >
                    <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                    {value ? 'Change Photo' : 'Add Image'}
                </button>
                {value ? (
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={working}
                        className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                        Remove Image
                    </button>
                ) : null}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />
            </div>
            {localError ? <p className="mt-2 text-xs text-red-600">{localError}</p> : null}
        </div>
    );
};

const EditableGalleryMediaField = ({ label, item, onSave }) => {
    const inputRef = useRef(null);
    const [working, setWorking] = useState(false);
    const [localError, setLocalError] = useState('');

    const mediaType = getGalleryMediaType(item);
    const mediaUrl = getGalleryMediaUrl(item);

    const pickFile = (accept) => {
        if (!inputRef.current) return;
        inputRef.current.accept = accept;
        inputRef.current.click();
    };

    const handleFilePick = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isImage && !isVideo) {
            setLocalError('Please choose a valid image or video file.');
            event.target.value = '';
            return;
        }

        setLocalError('');
        setWorking(true);

        try {
            if (isVideo) {
                const duration = await readVideoDuration(file);
                if (!Number.isFinite(duration) || duration <= 0) {
                    throw new Error('Unable to validate video duration. Please choose another file.');
                }
                if (duration > GALLERY_VIDEO_MAX_SECONDS) {
                    throw new Error('Gallery videos must be 2 minutes 30 seconds or shorter.');
                }

                const uploaded = await uploadSiteVideo(file);
                await onSave({
                    mediaType: 'video',
                    video: uploaded.url,
                    image: ''
                });
            } else {
                const uploaded = await uploadSiteImage(file);
                await onSave({
                    mediaType: 'image',
                    image: uploaded.url,
                    video: ''
                });
            }
        } catch (error) {
            setLocalError(error instanceof Error ? error.message : 'Failed to save media. Please try again.');
        } finally {
            setWorking(false);
            event.target.value = '';
        }
    };

    const handleRemoveMedia = async () => {
        setWorking(true);
        setLocalError('');

        try {
            await onSave({
                mediaType: 'image',
                image: '',
                video: ''
            });
        } catch (_error) {
            setLocalError('Failed to remove media. Please try again.');
        } finally {
            setWorking(false);
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                    {mediaType === 'video' ? 'Video' : 'Image'}
                </span>
                <span>Videos must be 2 min 30 sec or shorter.</span>
            </div>
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-48">
                {mediaUrl ? (
                    mediaType === 'video' ? (
                        <video src={mediaUrl} className="w-full h-full object-cover" controls playsInline preload="metadata" />
                    ) : (
                        <img src={mediaUrl} alt={label} className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 font-semibold">
                        No media yet
                    </div>
                )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => pickFile('image/*')}
                    disabled={working}
                    className="inline-flex items-center rounded-lg bg-[#D4AF37] px-3 py-2 text-xs font-semibold text-white hover:bg-[#b8962d] disabled:opacity-60"
                >
                    <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                    {mediaUrl && mediaType === 'image' ? 'Change Image' : 'Upload Image'}
                </button>
                <button
                    type="button"
                    onClick={() => pickFile('video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska')}
                    disabled={working}
                    className="inline-flex items-center rounded-lg border border-[#2C3E50] px-3 py-2 text-xs font-semibold text-[#2C3E50] hover:bg-gray-100 disabled:opacity-60"
                >
                    {mediaUrl && mediaType === 'video' ? 'Change Video' : 'Upload Video'}
                </button>
                {mediaUrl ? (
                    <button
                        type="button"
                        onClick={handleRemoveMedia}
                        disabled={working}
                        className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                        Remove Media
                    </button>
                ) : null}
                <input ref={inputRef} type="file" className="hidden" onChange={handleFilePick} />
            </div>
            {localError ? <p className="mt-2 text-xs text-red-600">{localError}</p> : null}
        </div>
    );
};


const SECTION_LINKS = [
    { key: 'hero', title: 'Home', description: 'Edit hero title, subtitle, button, and banner image.' },
    { key: 'about', title: 'About', description: 'Edit about text, highlights, and the YouTube video block.' },
    { key: 'programs', title: 'Programs', description: 'Edit mission, vision, and all program cards.' },
    { key: 'mentors', title: 'Mentors', description: 'Edit mentor photos, roles, and descriptions.' },
    { key: 'gallery', title: 'Gallery', description: 'Edit gallery images, labels, and the full gallery page details.' },
    { key: 'workshops', title: 'Workshops', description: 'Edit workshop cards, dates, and expiry behavior.' },
    { key: 'testimonials', title: 'Testimonials', description: 'Edit parent testimonial cards and quotes.' }
];

const SectionChooserCard = ({ section }) => (
    <Link
        to={`/admin/content/${section.key}`}
        className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg"
    >
        <h3 className="text-xl font-black text-[#2C3E50]">{section.title}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{section.description}</p>
        <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#D4AF37]">Open Section</span>
    </Link>
);

const ItemCard = ({ children, title, onRemove }) => (
    <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2C3E50]">{title}</h3>
            {onRemove ? (
                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                </button>
            ) : null}
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const AdminHomeContent = () => {
    const { section } = useParams();
    const {
        content,
        error,
        lastSavedAt,
        loading,
        refreshContent,
        resetToDefault,
        saving,
        updateContent
    } = useSiteContent();

    const home = content.home;

    const lastSavedLabel = useMemo(() => {
        if (!lastSavedAt) {
            return 'No recent save in this session';
        }

        return lastSavedAt.toLocaleString();
    }, [lastSavedAt]);

    const updateByPath = async (path, nextValue) => {
        await updateContent((draft) => {
            const target = getByPath(draft, path.slice(0, -1));
            target[path[path.length - 1]] = nextValue;
            return draft;
        });
    };

    const updateArrayItem = async (path, index, key, value) => {
        await updateContent((draft) => {
            const targetArray = getByPath(draft, path);
            targetArray[index][key] = value;
            return draft;
        });
    };

    const addArrayItem = async (path, templateItem) => {
        await updateContent((draft) => {
            const targetArray = getByPath(draft, path);
            targetArray.push(templateItem);
            return draft;
        });
    };

    const removeArrayItem = async (path, index) => {
        await updateContent((draft) => {
            const targetArray = getByPath(draft, path);
            if (targetArray.length <= 1) {
                return draft;
            }
            targetArray.splice(index, 1);
            return draft;
        });
    };

    const sectionTitle = SECTION_LINKS.find((item) => item.key === section)?.title || 'Home Content';
    const showSection = (key) => section === key;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" />
                    <p className="mt-3 text-gray-600 font-medium">Loading Home content from MySQL...</p>
                </div>
            </div>
        );
    }

    if (!section) {
        return (
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-[#2C3E50] to-[#1f2d3a] rounded-2xl p-6 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black">Home Content Manager</h1>
                            <p className="text-gray-200 mt-1 text-sm">Choose a section below to edit it on its own page. This keeps editing cleaner and faster.</p>
                            <p className="text-xs mt-2 text-gray-300">Last saved: {lastSavedLabel}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => void refreshContent()}
                                className="inline-flex items-center rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </button>
                            <Link
                                to="/"
                                target="_blank"
                                className="inline-flex items-center rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-white hover:bg-[#be9c31]"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Home
                            </Link>
                        </div>
                    </div>
                    {saving ? <p className="text-xs text-[#F9D423] mt-3">Saving to MySQL...</p> : null}
                    {error ? <p className="text-xs text-red-200 mt-2">{error}</p> : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {SECTION_LINKS.map((item) => (
                        <SectionChooserCard key={item.key} section={item} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#2C3E50] to-[#1f2d3a] rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <Link to="/admin/content" className="inline-flex items-center gap-2 text-sm font-semibold text-[#F9D423] hover:text-white mb-3">
                            <ArrowLeft className="w-4 h-4" />
                            Back To Section List
                        </Link>
                        <h1 className="text-2xl font-black">{sectionTitle} Editor</h1>
                        <p className="text-gray-200 mt-1 text-sm">
                            Edit only the {sectionTitle.toLowerCase()} section here. Each save is sent to Node.js/Express and stored in MySQL.
                        </p>
                        <p className="text-xs mt-2 text-gray-300">Last saved: {lastSavedLabel}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => void refreshContent()}
                            className="inline-flex items-center rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                        <button
                            type="button"
                            onClick={() => void resetToDefault()}
                            className="inline-flex items-center rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Defaults
                        </button>
                        <Link
                            to="/"
                            target="_blank"
                            className="inline-flex items-center rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-white hover:bg-[#be9c31]"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Home
                        </Link>
                    </div>
                </div>
                {saving ? <p className="text-xs text-[#F9D423] mt-3">Saving to MySQL...</p> : null}
                {error ? <p className="text-xs text-red-200 mt-2">{error}</p> : null}
            </div>

            {showSection('hero') ? (
            <SectionCard title="Hero Section" description="Main banner section at the top of Home page.">
                <EditableImageField
                    label="Hero Background Image"
                    value={home.hero.backgroundImage}
                    onSave={(value) => updateByPath(['home', 'hero', 'backgroundImage'], value)}
                />
                <EditableTextField
                    label="Hero Title"
                    value={home.hero.title}
                    onSave={(value) => updateByPath(['home', 'hero', 'title'], value)}
                />
                <EditableTextField
                    label="Hero Subtitle"
                    multiline
                    value={home.hero.subtitle}
                    onSave={(value) => updateByPath(['home', 'hero', 'subtitle'], value)}
                />
                <EditableTextField
                    label="Hero Button Text"
                    value={home.hero.ctaText}
                    onSave={(value) => updateByPath(['home', 'hero', 'ctaText'], value)}
                />
                <EditableTextField
                    label="Hero Button Link"
                    value={home.hero.ctaLink}
                    onSave={(value) => updateByPath(['home', 'hero', 'ctaLink'], value)}
                />
            </SectionCard>
            ) : null}

            {showSection('about') ? (
            <SectionCard title="About" description="Organisation intro content.">
                <EditableTextField
                    label="Section Title"
                    value={home.whoWeAre.title}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'title'], value)}
                />
                <EditableTextField
                    label="Description"
                    multiline
                    maxLength={520}
                    value={home.whoWeAre.description}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'description'], value)}
                />
                <EditableTextField
                    label="Video Title"
                    value={home.whoWeAre.videoTitle}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'videoTitle'], value)}
                />
                <EditableTextField
                    label="YouTube Video URL"
                    value={home.whoWeAre.videoUrl}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'videoUrl'], value)}
                />
                <EditableTextField
                    label="Video Right Text"
                    multiline
                    maxLength={280}
                    value={home.whoWeAre.videoDescription}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'videoDescription'], value)}
                />

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Highlights</h3>
                    {home.highlights.map((highlight, index) => (
                        <ItemCard
                            key={`${highlight.title}-${index}`}
                            title={`Highlight ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'highlights'], index)}
                        >
                            <EditableTextField
                                label="Icon Name (Palette, Shield, Star, Heart, Users, BookOpen)"
                                value={highlight.icon}
                                onSave={(value) => updateArrayItem(['home', 'highlights'], index, 'icon', value)}
                            />
                            <EditableTextField
                                label="Highlight Text"
                                value={highlight.title}
                                onSave={(value) => updateArrayItem(['home', 'highlights'], index, 'title', value)}
                            />
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'highlights'], { icon: 'Star', title: 'New Highlight' })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Highlight
                    </button>
                </div>
            </SectionCard>
            ) : null}

            {showSection('programs') ? (
            <>
            <SectionCard title="Mission & Vision (Inside Programs)" description="These cards appear inside the Programs section.">
                <EditableTextField
                    label="Mission Title"
                    value={home.missionVision.missionTitle}
                    onSave={(value) => updateByPath(['home', 'missionVision', 'missionTitle'], value)}
                />
                <EditableTextField
                    label="Mission Text"
                    multiline
                    value={home.missionVision.missionText}
                    onSave={(value) => updateByPath(['home', 'missionVision', 'missionText'], value)}
                />
                <EditableTextField
                    label="Vision Title"
                    value={home.missionVision.visionTitle}
                    onSave={(value) => updateByPath(['home', 'missionVision', 'visionTitle'], value)}
                />
                <EditableTextField
                    label="Vision Text"
                    multiline
                    value={home.missionVision.visionText}
                    onSave={(value) => updateByPath(['home', 'missionVision', 'visionText'], value)}
                />
            </SectionCard>

            <SectionCard title="Programs" description="Program introduction and cards.">
                <EditableTextField
                    label="Section Title"
                    value={home.whatWeDo.title}
                    onSave={(value) => updateByPath(['home', 'whatWeDo', 'title'], value)}
                />
                <EditableTextField
                    label="Section Description"
                    multiline
                    value={home.whatWeDo.description}
                    onSave={(value) => updateByPath(['home', 'whatWeDo', 'description'], value)}
                />

                <div className="space-y-3">
                    {home.programs.map((program, index) => (
                        <ItemCard
                            key={`${program.title}-${index}`}
                            title={`Program ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'programs'], index)}
                        >
                            <EditableTextField
                                label="Icon Name"
                                value={program.icon}
                                onSave={(value) => updateArrayItem(['home', 'programs'], index, 'icon', value)}
                            />
                            <EditableTextField
                                label="Program Title"
                                value={program.title}
                                onSave={(value) => updateArrayItem(['home', 'programs'], index, 'title', value)}
                            />
                            <EditableTextField
                                label="Program Description"
                                multiline
                                value={program.description}
                                onSave={(value) => updateArrayItem(['home', 'programs'], index, 'description', value)}
                            />
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'programs'], {
                                icon: 'Palette',
                                title: 'New Program',
                                description: 'Write program details here.'
                            })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Program
                    </button>
                </div>
            </SectionCard>
            </>
            ) : null}

            {showSection('mentors') ? (
            <SectionCard title="Mentors Section" description="Mentor cards with photo and text.">
                <EditableTextField
                    label="Section Title"
                    value={home.team.title}
                    onSave={(value) => updateByPath(['home', 'team', 'title'], value)}
                />

                <div className="space-y-3">
                    {home.team.members.map((member, index) => (
                        <ItemCard
                            key={`${member.name}-${index}`}
                            title={`Mentor ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'team', 'members'], index)}
                        >
                            <EditableImageField
                                label="Profile Image"
                                value={member.avatar}
                                onSave={(value) => updateArrayItem(['home', 'team', 'members'], index, 'avatar', value)}
                            />
                            <EditableTextField
                                label="Name"
                                value={member.name}
                                onSave={(value) => updateArrayItem(['home', 'team', 'members'], index, 'name', value)}
                            />
                            <EditableTextField
                                label="Role"
                                value={member.role}
                                onSave={(value) => updateArrayItem(['home', 'team', 'members'], index, 'role', value)}
                            />
                            <EditableTextField
                                label="Description"
                                multiline
                                value={member.description}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'team', 'members'], index, 'description', value)
                                }
                            />
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'team', 'members'], {
                                name: 'New Mentor',
                                role: 'Role',
                                description: 'Mentor description',
                                avatar: ''
                            })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Mentor
                    </button>
                </div>
            </SectionCard>
            ) : null}

            {showSection('gallery') ? (
            <SectionCard title="Gallery Section" description="Gallery images, short videos, and labels.">
                <EditableTextField
                    label="Section Title"
                    value={home.gallery.title}
                    onSave={(value) => updateByPath(['home', 'gallery', 'title'], value)}
                />
                <EditableTextField
                    label="Section Description"
                    multiline
                    value={home.gallery.description}
                    onSave={(value) => updateByPath(['home', 'gallery', 'description'], value)}
                />
                <EditableTextField
                    label="View All Button Text"
                    value={home.gallery.viewAllText}
                    onSave={(value) => updateByPath(['home', 'gallery', 'viewAllText'], value)}
                />
                <EditableTextField
                    label="Gallery Page Title"
                    value={home.gallery.pageTitle}
                    onSave={(value) => updateByPath(['home', 'gallery', 'pageTitle'], value)}
                />
                <EditableTextField
                    label="Gallery Page Description"
                    multiline
                    maxLength={240}
                    value={home.gallery.pageDescription}
                    onSave={(value) => updateByPath(['home', 'gallery', 'pageDescription'], value)}
                />

                <div className="space-y-3">
                    {home.gallery.items.map((item, index) => (
                        <ItemCard
                            key={`${item.title}-${index}`}
                            title={`Gallery Item ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'gallery', 'items'], index)}
                        >
                            <EditableGalleryMediaField
                                label="Gallery Media"
                                item={item}
                                onSave={async (value) => {
                                    await updateContent((draft) => {
                                        const galleryItem = draft.home.gallery.items[index];
                                        galleryItem.mediaType = value.mediaType;
                                        galleryItem.image = value.image;
                                        galleryItem.video = value.video;
                                        return draft;
                                    });
                                }}
                            />
                            <EditableTextField
                                label="Media Title"
                                value={item.title}
                                onSave={(value) => updateArrayItem(['home', 'gallery', 'items'], index, 'title', value)}
                            />
                            <EditableTextField
                                label="Media Subtitle"
                                value={item.subtitle}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'gallery', 'items'], index, 'subtitle', value)
                                }
                            />
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'gallery', 'items'], {
                                mediaType: 'image',
                                image: '',
                                video: '',
                                title: 'New Artwork',
                                subtitle: 'View Masterpiece'
                            })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Gallery Item
                    </button>
                </div>
            </SectionCard>
            ) : null}

            {showSection('workshops') ? (
            <SectionCard title="Workshops Section" description="Workshop cards with image and details.">
                <EditableTextField
                    label="Section Title"
                    value={home.workshops.title}
                    onSave={(value) => updateByPath(['home', 'workshops', 'title'], value)}
                />
                <EditableTextField
                    label="Section Button Text"
                    value={home.workshops.ctaText}
                    onSave={(value) => updateByPath(['home', 'workshops', 'ctaText'], value)}
                />

                <div className="space-y-3">
                    {home.workshops.items.map((workshop, index) => (
                        <ItemCard
                            key={`${workshop.title}-${index}`}
                            title={`Workshop ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'workshops', 'items'], index)}
                        >
                            <EditableImageField
                                label="Workshop Image"
                                value={workshop.image}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'workshops', 'items'], index, 'image', value)
                                }
                            />
                            <EditableTextField
                                label="Workshop Title"
                                value={workshop.title}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'workshops', 'items'], index, 'title', value)
                                }
                            />
                            <EditableTextField
                                label="Workshop Description"
                                multiline
                                value={workshop.description}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'workshops', 'items'], index, 'description', value)
                                }
                            />
                            <EditableTextField
                                label="Schedule"
                                value={workshop.schedule}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'workshops', 'items'], index, 'schedule', value)
                                }
                            />
                            <div className="rounded-xl border border-gray-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Workshop Date</p>
                                <input
                                    type="date"
                                    value={workshop.date || ''}
                                    onChange={(event) => void updateArrayItem(['home', 'workshops', 'items'], index, 'date', event.target.value)}
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />
                                <p className="mt-2 text-xs text-gray-500">If the selected date passes, this workshop will automatically show as expired on the website.</p>
                            </div>
                            <EditableTextField
                                label="Status Badge"
                                value={workshop.status}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'workshops', 'items'], index, 'status', value)
                                }
                            />
                            <div className="rounded-xl border border-gray-200 p-4">
                                <label className="inline-flex items-center gap-3 text-sm font-semibold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(workshop.allowInternship)}
                                        onChange={(event) => void updateArrayItem(['home', 'workshops', 'items'], index, 'allowInternship', event.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                    Show Internship Apply Button For This Workshop
                                </label>
                                <p className="mt-2 text-xs text-gray-500">If enabled, this workshop will show both Children and Internship apply options. If disabled, only the children option will appear.</p>
                            </div>
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'workshops', 'items'], {
                                title: 'New Workshop',
                                description: 'Workshop details here.',
                                schedule: 'Every Friday',
                                date: '',
                                status: 'Open for Registration',
                                allowInternship: false,
                                image: ''
                            })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Workshop
                    </button>
                </div>
            </SectionCard>
            ) : null}

            {showSection('testimonials') ? (
            <SectionCard title="Testimonials Section" description="Parent feedback cards.">
                <EditableTextField
                    label="Section Title"
                    value={home.testimonials.title}
                    onSave={(value) => updateByPath(['home', 'testimonials', 'title'], value)}
                />
                <EditableTextField
                    label="Section Description"
                    multiline
                    value={home.testimonials.description}
                    onSave={(value) => updateByPath(['home', 'testimonials', 'description'], value)}
                />

                <div className="space-y-3">
                    {home.testimonials.items.map((item, index) => (
                        <ItemCard
                            key={`${item.name}-${index}`}
                            title={`Testimonial ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'testimonials', 'items'], index)}
                        >
                            <EditableTextField
                                label="Initials"
                                value={item.initials}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'testimonials', 'items'], index, 'initials', value)
                                }
                            />
                            <EditableTextField
                                label="Name"
                                value={item.name}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'testimonials', 'items'], index, 'name', value)
                                }
                            />
                            <EditableTextField
                                label="Role"
                                value={item.role}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'testimonials', 'items'], index, 'role', value)
                                }
                            />
                            <EditableTextField
                                label="Quote"
                                multiline
                                value={item.quote}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'testimonials', 'items'], index, 'quote', value)
                                }
                            />
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'testimonials', 'items'], {
                                initials: 'NA',
                                name: 'New Parent',
                                role: 'Parent',
                                quote: 'Write testimonial here.'
                            })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Testimonial
                    </button>
                </div>
            </SectionCard>
            ) : null}
        </div>
    );
};

export default AdminHomeContent;

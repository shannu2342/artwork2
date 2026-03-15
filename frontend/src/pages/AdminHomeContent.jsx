import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, ImagePlus, Pencil, Plus, RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { uploadSiteImage } from '../services/siteContentService';

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

const EditableTextField = ({ label, multiline = false, onSave, value }) => {
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
                                onChange={(event) => setDraft(event.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        ) : (
                            <input
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            />
                        )
                    ) : (
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words">{value || 'No text set.'}</p>
                    )}
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" />
                    <p className="mt-3 text-gray-600 font-medium">Loading Home content from MongoDB...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#2C3E50] to-[#1f2d3a] rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black">Home Section Manager</h1>
                        <p className="text-gray-200 mt-1 text-sm">
                            Edit text and images for the full Home page. Each save is sent to Node.js/Express and stored in MongoDB.
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
                {saving ? <p className="text-xs text-[#F9D423] mt-3">Saving to MongoDB...</p> : null}
                {error ? <p className="text-xs text-red-200 mt-2">{error}</p> : null}
            </div>

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

            <SectionCard title="Who We Are" description="Organisation intro content.">
                <EditableTextField
                    label="Section Title"
                    value={home.whoWeAre.title}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'title'], value)}
                />
                <EditableTextField
                    label="Description"
                    multiline
                    value={home.whoWeAre.description}
                    onSave={(value) => updateByPath(['home', 'whoWeAre', 'description'], value)}
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

            <SectionCard title="Mission & Vision (Inside What We Do)" description="These cards appear inside the What We Do section.">
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

            <SectionCard title="What We Do" description="Program introduction and cards.">
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

            <SectionCard title="Team Section" description="Team cards with photo and text.">
                <EditableTextField
                    label="Section Title"
                    value={home.team.title}
                    onSave={(value) => updateByPath(['home', 'team', 'title'], value)}
                />

                <div className="space-y-3">
                    {home.team.members.map((member, index) => (
                        <ItemCard
                            key={`${member.name}-${index}`}
                            title={`Team Member ${index + 1}`}
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
                                name: 'New Team Member',
                                role: 'Role',
                                description: 'Team member description',
                                avatar: ''
                            })
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Team Member
                    </button>
                </div>
            </SectionCard>

            <SectionCard title="Gallery Section" description="Gallery images and labels.">
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

                <div className="space-y-3">
                    {home.gallery.items.map((item, index) => (
                        <ItemCard
                            key={`${item.title}-${index}`}
                            title={`Gallery Item ${index + 1}`}
                            onRemove={() => void removeArrayItem(['home', 'gallery', 'items'], index)}
                        >
                            <EditableImageField
                                label="Artwork Image"
                                value={item.image}
                                onSave={(value) => updateArrayItem(['home', 'gallery', 'items'], index, 'image', value)}
                            />
                            <EditableTextField
                                label="Image Title"
                                value={item.title}
                                onSave={(value) => updateArrayItem(['home', 'gallery', 'items'], index, 'title', value)}
                            />
                            <EditableTextField
                                label="Image Subtitle"
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
                                image: '',
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
                            <EditableTextField
                                label="Status Badge"
                                value={workshop.status}
                                onSave={(value) =>
                                    updateArrayItem(['home', 'workshops', 'items'], index, 'status', value)
                                }
                            />
                        </ItemCard>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            void addArrayItem(['home', 'workshops', 'items'], {
                                title: 'New Workshop',
                                description: 'Workshop details here.',
                                schedule: 'Every Friday',
                                status: 'Open for Registration',
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
        </div>
    );
};

export default AdminHomeContent;

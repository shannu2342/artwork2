import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    Heart,
    Mail,
    MapPin,
    Palette,
    Phone,
    PlayCircle,
    Quote,
    Shield,
    Star,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import Seo from '../components/Seo';
import { trackAnalyticsVisit } from '../services/analyticsService';

const iconMap = { Palette, Users, Heart, Star, BookOpen, Shield };
const badgeStyles = [
    'bg-gradient-to-br from-[#D4AF37] to-[#F9D423]',
    'bg-[#2C3E50]',
    'bg-gradient-to-br from-[#2C3E50] to-gray-500'
];
const teamBorders = ['border-[#D4AF37]', 'border-[#2C3E50]', 'border-[#F9D423]'];
const externalLinkPattern = /^(https?:\/\/|mailto:|tel:)/i;

const resolveIcon = (iconName, fallback) => iconMap[iconName] || fallback;

const normalizeCtaLink = (rawLink) => {
    const link = (rawLink || '').trim();
    if (!link) return '/register';
    if (externalLinkPattern.test(link)) return link;
    const normalized = link.startsWith('/') ? link : `/${link}`;
    const allowedInternalLinks = new Set(['/', '/register', '/contact', '/gallery']);
    return allowedInternalLinks.has(normalized) ? normalized : '/register';
};

const displaySectionTitle = (value, legacyTitle, nextTitle) => {
    const title = (value || '').trim();
    if (!title || title.toLowerCase() === legacyTitle.toLowerCase()) return nextTitle;
    return title;
};

const normalizeYoutubeEmbedUrl = (value) => {
    const raw = (value || '').trim();
    if (!raw) return '';

    let embedUrl = raw;
    if (!raw.includes('youtube.com/embed/')) {
        const watchMatch = raw.match(/[?&]v=([^&]+)/);
        if (watchMatch?.[1]) embedUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
        const shortMatch = raw.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch?.[1]) embedUrl = `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    try {
        const url = new URL(embedUrl);
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');
        url.searchParams.set('playsinline', '1');
        url.searchParams.set('rel', '0');
        return url.toString();
    } catch (_error) {
        return embedUrl;
    }
};

const parseWorkshopDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isWorkshopExpired = (value) => {
    const parsed = parseWorkshopDate(value);
    if (!parsed) return false;
    const endOfDay = new Date(parsed);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() < Date.now();
};

const formatWorkshopDate = (value) => {
    const parsed = parseWorkshopDate(value);
    if (!parsed) return '';
    return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const getGalleryItemMediaType = (item) => {
    if (item?.mediaType === 'video' && item?.video) return 'video';
    if (item?.image) return 'image';
    if (item?.video) return 'video';
    return 'image';
};

const getGalleryItemMediaUrl = (item) => {
    const mediaType = getGalleryItemMediaType(item);
    return mediaType === 'video' ? item?.video || '' : item?.image || '';
};

const hasGalleryMedia = (item) => Boolean(getGalleryItemMediaUrl(item));

const Home = () => {
    const { content } = useSiteContent();
    const home = content.home;
    const site = content.site;
    const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

    const heroImage = home.hero.backgroundImage || '';
    const heroCtaLink = normalizeCtaLink(home.hero.ctaLink);
    const isHeroCtaExternal = externalLinkPattern.test(heroCtaLink);
    const aboutTitle = displaySectionTitle(home.whoWeAre.title, 'Who We Are', 'About');
    const programsTitle = displaySectionTitle(home.whatWeDo.title, 'What We Do', 'Programs');
    const mentorsTitle = displaySectionTitle(home.team.title, 'About Our Team', 'Mentors');
    const featuredGalleryItems = useMemo(() => home.gallery.items.filter(hasGalleryMedia).slice(0, 6), [home.gallery.items]);
    const youtubeEmbedUrl = normalizeYoutubeEmbedUrl(home.whoWeAre.videoUrl);
    const visibleWorkshops = useMemo(
        () => home.workshops.items.map((workshop) => ({ ...workshop, expired: isWorkshopExpired(workshop.date) })),
        [home.workshops.items]
    );

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setSelectedGalleryItem(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        const sectionMap = [
            { id: 'hero-section', screenName: 'Home', path: '/' },
            { id: 'who-we-are', screenName: 'About', path: '/#about' },
            { id: 'what-we-do', screenName: 'Programs', path: '/#programs' },
            { id: 'team', screenName: 'Mentors', path: '/#mentors' },
            { id: 'gallery', screenName: 'Gallery', path: '/#gallery' },
            { id: 'workshops', screenName: 'Workshops', path: '/#workshops' }
        ];
        const seenKey = 'limitlessart_seen_sections';
        const seen = new Set(JSON.parse(window.sessionStorage.getItem(seenKey) || '[]'));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const target = sectionMap.find((item) => item.id === entry.target.id);
                    if (!target || seen.has(target.id)) return;
                    seen.add(target.id);
                    window.sessionStorage.setItem(seenKey, JSON.stringify([...seen]));
                    trackAnalyticsVisit({ path: target.path, screenName: target.screenName, pageTitle: document.title });
                });
            },
            { threshold: 0.55 }
        );
        sectionMap.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full">
            <Seo
                title={site.seo.homeTitle || site.seo.defaultTitle}
                description={site.seo.homeDescription || site.seo.defaultDescription}
                keywords={site.seo.keywords}
                image={site.seo.ogImage}
                siteUrl={site.seo.siteUrl}
                pathname="/"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: site.organizationName,
                    url: site.seo.siteUrl,
                    logo: `${site.seo.siteUrl.replace(/\/+$/, '')}/logo.jpg`,
                    sameAs: [site.social.instagramUrl, site.social.youtubeUrl].filter(Boolean),
                    contactPoint: [{ '@type': 'ContactPoint', telephone: site.contact.phone, email: site.contact.email, contactType: 'customer support' }]
                }}
            />

            <section id="hero-section" className="relative h-[100dvh] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a252f]/90 via-[#2C3E50]/70 to-[#D4AF37]/30 mix-blend-multiply z-10" />
                    {heroImage ? (
                        <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} src={heroImage} alt="Children creating art" className="w-full h-full object-cover filter brightness-75" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a252f] via-[#2C3E50] to-[#D4AF37]/80" />
                    )}
                </div>
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="mb-8">
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F9D423] to-[#D4AF37] drop-shadow-lg tracking-tight mb-4">{home.hero.title}</h1>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-[#F9D423] to-transparent mx-auto rounded-full"></div>
                    </motion.div>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-xl md:text-4xl text-gray-100 mb-10 font-medium drop-shadow-xl">{home.hero.subtitle}</motion.p>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                        {isHeroCtaExternal ? (
                            <a href={heroCtaLink} target="_blank" rel="noreferrer" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#1a252f] transition-all duration-300 bg-gradient-to-r from-[#F9D423] to-[#D4AF37] rounded-full shadow-2xl hover:scale-105 hover:shadow-[#D4AF37]/50 overflow-hidden"><span className="relative">{home.hero.ctaText}</span></a>
                        ) : (
                            <Link to={heroCtaLink} className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#1a252f] transition-all duration-300 bg-gradient-to-r from-[#F9D423] to-[#D4AF37] rounded-full shadow-2xl hover:scale-105 hover:shadow-[#D4AF37]/50 overflow-hidden"><span className="relative">{home.hero.ctaText}</span></Link>
                        )}
                    </motion.div>
                </div>
            </section>

            <section id="who-we-are" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
                    <div className="text-center mb-6">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-[#2C3E50] mb-4">{aboutTitle}</motion.h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full"></div>
                    </div>
                    <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2">
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">{home.whoWeAre.description}</p>
                        </motion.div>
                        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
                            {home.highlights.map((item, idx) => {
                                const IconComponent = resolveIcon(item.icon, Palette);
                                return (
                                    <motion.div key={`${item.title}-${idx}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group">
                                        <div className="bg-[#f8fafc] w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"><IconComponent className="w-8 h-8 text-[#D4AF37]" /></div>
                                        <h4 className="font-bold text-[#2C3E50]">{item.title}</h4>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-[#2C3E50] rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl border border-[#2C3E50] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                        <div className="relative overflow-hidden rounded-3xl bg-black/20 border border-white/10 aspect-video">
                            {youtubeEmbedUrl ? (
                                <iframe className="w-full h-full" src={youtubeEmbedUrl} title={home.whoWeAre.videoTitle || 'About video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/70"><PlayCircle className="w-16 h-16 text-[#F9D423]" /><p className="font-semibold">Video preview will appear here</p></div>
                            )}
                        </div>
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F9D423] mb-4"><PlayCircle className="w-4 h-4" /> Story Video</p>
                            <h3 className="text-3xl md:text-4xl font-black mb-4">{home.whoWeAre.videoTitle || 'Our Story In Motion'}</h3>
                            <p className="text-lg text-gray-200 leading-relaxed">{home.whoWeAre.videoDescription}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="what-we-do" className="py-24 bg-gray-50 relative">
                <div className="absolute top-40 left-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl font-black text-[#2C3E50] mb-6">{programsTitle}</motion.h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">{home.whatWeDo.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
                        {home.programs.map((program, index) => {
                            const IconComponent = resolveIcon(program.icon, Palette);
                            const iconRotation = index % 2 === 0 ? 'group-hover:rotate-12' : 'group-hover:-rotate-12';
                            return (
                                <motion.div key={`${program.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + index * 0.1 }} className="bg-white rounded-3xl shadow-xl p-10 hover:-translate-y-3 transition-transform duration-500 border border-gray-100 group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F9D423] to-[#D4AF37] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    <div className={`w-20 h-20 rounded-2xl bg-gray-50 shadow-inner flex items-center justify-center mb-8 ${iconRotation} transition-transform duration-500`}><IconComponent className="w-10 h-10 text-[#D4AF37]" /></div>
                                    <h3 className="text-2xl font-black text-[#2C3E50] mb-4">{program.title}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed">{program.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="team" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-[#2C3E50] mb-4">{mentorsTitle}</motion.h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {home.team.members.map((member, index) => (
                            <motion.div key={`${member.name}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 + 0.1 }} className="text-center group bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100">
                                <div className={`w-40 h-40 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 ${teamBorders[index % teamBorders.length]} shadow-lg group-hover:scale-110 transition-all duration-500`}>
                                    {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">Add Image</div>}
                                </div>
                                <h3 className="text-2xl font-black text-[#2C3E50] mb-1">{member.name}</h3>
                                <p className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wider text-sm">{member.role}</p>
                                <p className="text-gray-600 font-light">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="gallery" className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 relative">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl font-black text-[#2C3E50] mb-6">{home.gallery.title}</motion.h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">{home.gallery.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredGalleryItems.map((item, index) => {
                            const mediaType = getGalleryItemMediaType(item);
                            const mediaUrl = getGalleryItemMediaUrl(item);
                            return (
                            <motion.div key={`${item.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="h-72 rounded-2xl overflow-hidden shadow-xl group relative cursor-pointer" role="button" tabIndex={0} onClick={() => setSelectedGalleryItem(item)} onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setSelectedGalleryItem(item);
                                }
                            }}>
                                {mediaType === 'video' ? (
                                    <>
                                        <video src={mediaUrl} className="w-full h-full object-cover transform scale-105 group-hover:scale-125 transition duration-700 ease-in-out" muted playsInline preload="metadata" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                            <PlayCircle className="h-16 w-16 text-white drop-shadow-xl" />
                                        </div>
                                    </>
                                ) : (
                                    <img src={mediaUrl} alt={item.title || 'Gallery Art'} className="w-full h-full object-cover transform scale-105 group-hover:scale-125 transition duration-700 ease-in-out" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/90 via-[#2C3E50]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-8">
                                    <span className="text-white font-bold text-xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</span>
                                    <span className="text-[#F9D423] font-semibold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.subtitle}</span>
                                </div>
                            </motion.div>
                        );
                        })}
                    </div>
                    <div className="mt-12 text-center">
                        <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full bg-[#2C3E50] px-8 py-4 font-bold text-white hover:bg-[#1f2d3a] transition-all shadow-lg">{home.gallery.viewAllText || 'View All Images'} <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                </div>
            </section>

            <section id="workshops" className="py-24 bg-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9D423]/5 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-8">
                        <div className="w-full md:w-auto text-center md:text-left">
                            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-[#2C3E50] mb-4">{home.workshops.title}</motion.h2>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] rounded-full mx-auto md:mx-0"></div>
                        </div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mt-8 md:mt-0 w-full md:w-auto text-center">
                            {isHeroCtaExternal ? <a href={heroCtaLink} target="_blank" rel="noreferrer" className="inline-block bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white px-10 py-4 rounded-full font-bold transition-all duration-300">{home.workshops.ctaText}</a> : <Link to={heroCtaLink} className="inline-block bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white px-10 py-4 rounded-full font-bold transition-all duration-300">{home.workshops.ctaText}</Link>}
                        </motion.div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {visibleWorkshops.map((workshop, index) => {
                            const expired = workshop.expired;
                            const workshopDate = formatWorkshopDate(workshop.date);
                            return (
                                <motion.div key={`${workshop.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + index * 0.1 }} className={`bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group ${expired ? 'opacity-80' : ''}`}>
                                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                                        {workshop.image ? <img src={workshop.image} alt={workshop.title || 'Workshop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">Add Image</div>}
                                        <div className={`absolute top-4 right-4 backdrop-blur-sm text-xs font-bold px-4 py-1.5 rounded-full shadow-sm ${expired ? 'bg-red-100 text-red-700' : 'bg-white/90 text-green-700'}`}>{expired ? 'Expired' : workshop.status}</div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-black text-[#2C3E50] mb-3 group-hover:text-[#D4AF37] transition-colors">{workshop.title}</h3>
                                        <p className="text-gray-500 mb-6 font-light leading-relaxed">{workshop.description}</p>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                <span className="text-[#D4AF37] font-bold flex items-center bg-[#D4AF37]/10 px-4 py-2 rounded-lg">{workshop.schedule}</span>
                                                {workshopDate ? <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-semibold"><CalendarDays className="w-4 h-4 text-[#2C3E50]" /> {workshopDate}</span> : null}
                                                {workshop.allowInternship && !expired ? <span className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 font-semibold text-violet-700">Internship Open</span> : null}
                                            </div>
                                            <div className="pt-4 border-t border-gray-100">
                                                {expired ? (
                                                    <span className="text-sm font-bold text-red-600">Registration closed for this workshop.</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-3">
                                                        <Link
                                                            to={`/register?workshop=${index}&type=children`}
                                                            className="inline-flex items-center justify-center rounded-full bg-[#2C3E50] px-4 py-2 text-sm font-bold text-white hover:bg-[#1f2d3a] transition"
                                                        >
                                                            Children
                                                        </Link>
                                                        {workshop.allowInternship ? (
                                                            <Link
                                                                to={`/register?workshop=${index}&type=internship`}
                                                                className="inline-flex items-center justify-center rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a252f] transition"
                                                            >
                                                                Internship
                                                            </Link>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="testimonials" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 relative">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl font-black text-[#2C3E50] mb-6">{home.testimonials.title}</motion.h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">{home.testimonials.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {home.testimonials.items.map((testimonial, index) => (
                            <motion.div key={`${testimonial.name}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + index * 0.1 }} className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300">
                                <Quote className="absolute top-6 right-8 w-12 h-12 text-[#D4AF37]/20 group-hover:text-[#D4AF37]/40 transition-colors duration-300" />
                                <div className="flex items-center gap-4 mb-6"><div className={`w-14 h-14 ${badgeStyles[index % badgeStyles.length]} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}>{testimonial.initials}</div><div><h4 className="font-bold text-[#2C3E50] text-lg">{testimonial.name}</h4><p className="text-sm text-gray-500">{testimonial.role}</p></div></div>
                                <p className="text-gray-600 leading-relaxed italic z-10 relative">"{testimonial.quote}"</p>
                                <div className="flex gap-1 mt-6">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-5 h-5 fill-[#F9D423] text-[#F9D423]" />)}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact-us" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-[#2C3E50] mb-4">Contact Us</motion.h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Need help with registration or program details? Reach out and our team will respond quickly.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-2xl font-black text-[#2C3E50] mb-6">Contact Information</h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-[#D4AF37] mt-0.5" /><div><p className="font-semibold text-[#2C3E50]">Email</p><a href={`mailto:${site.contact.email}`} className="text-gray-600 hover:text-[#D4AF37]">{site.contact.email}</a></div></div>
                                <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-[#D4AF37] mt-0.5" /><div><p className="font-semibold text-[#2C3E50]">Phone</p><a href={`tel:${site.contact.phone.replace(/\s+/g, '')}`} className="text-gray-600 hover:text-[#D4AF37]">{site.contact.phone}</a></div></div>
                                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5" /><div><p className="font-semibold text-[#2C3E50]">Address</p><p className="text-gray-600">{site.contact.address}</p></div></div>
                            </div>
                        </div>
                        <div className="bg-[#2C3E50] rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between">
                            <div><h3 className="text-2xl font-black text-[#F9D423] mb-4">Let’s Talk</h3><p className="text-gray-200 leading-relaxed">For full enquiry form and program-specific questions, use our Contact page. For immediate help, use the WhatsApp button at bottom-right.</p></div>
                            <div className="mt-8 flex flex-col sm:flex-row gap-3"><Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#F9D423] to-[#D4AF37] text-[#1a252f] hover:brightness-95 transition">Open Contact Form</Link><Link to="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold border border-white/30 hover:bg-white/10 transition">Go to Register</Link></div>
                        </div>
                    </div>
                </div>
            </section>

            {selectedGalleryItem ? (
                <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setSelectedGalleryItem(null)}>
                    <div className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <button type="button" onClick={() => setSelectedGalleryItem(null)} className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">×</button>
                        {getGalleryItemMediaType(selectedGalleryItem) === 'video' ? (
                            <video
                                src={getGalleryItemMediaUrl(selectedGalleryItem)}
                                className="w-full max-h-[80vh] bg-black"
                                controls
                                playsInline
                                autoPlay
                            />
                        ) : (
                            <img src={getGalleryItemMediaUrl(selectedGalleryItem)} alt={selectedGalleryItem.title || 'Gallery artwork'} className="w-full max-h-[80vh] object-contain bg-black" />
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Home;

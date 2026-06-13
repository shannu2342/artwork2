import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useSiteContent } from '../hooks/useSiteContent';

const Gallery = () => {
    const { content } = useSiteContent();
    const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
    const site = content.site;
    const gallery = content.home.gallery;
    const getMediaType = (item) => {
        if (item?.mediaType === 'video' && item?.video) return 'video';
        if (item?.image) return 'image';
        if (item?.video) return 'video';
        return 'image';
    };

    const getMediaUrl = (item) => (getMediaType(item) === 'video' ? item?.video || '' : item?.image || '');
    const items = useMemo(() => gallery.items.filter((item) => getMediaUrl(item)), [gallery.items]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedGalleryItem(null);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <>
            <Seo
                title={gallery.pageTitle || `${gallery.title} | ${site.organizationName}`}
                description={gallery.pageDescription || gallery.description || site.seo.defaultDescription}
                keywords={site.seo.keywords}
                image={site.seo.ogImage}
                siteUrl={site.seo.siteUrl}
                pathname="/gallery"
            />
            <div className="min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14">
                        <div>
                            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C3E50] hover:text-[#D4AF37] mb-4">
                                <ArrowLeft className="w-4 h-4" />
                                Back To Home
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-black text-[#2C3E50] mb-4">{gallery.pageTitle || gallery.title}</h1>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] rounded-full mb-6"></div>
                            <p className="text-lg text-gray-600 max-w-3xl">{gallery.pageDescription || gallery.description}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm text-sm text-gray-600">
                            Total Items: <span className="font-bold text-[#2C3E50]">{items.length}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => {
                            const mediaType = getMediaType(item);
                            const mediaUrl = getMediaUrl(item);
                            return (
                            <motion.div
                                key={`${item.title}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="h-80 rounded-3xl overflow-hidden shadow-xl group relative cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedGalleryItem(item)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setSelectedGalleryItem(item);
                                    }
                                }}
                            >
                                {mediaType === 'video' ? (
                                    <>
                                        <video
                                            src={mediaUrl}
                                            className="w-full h-full object-cover transform scale-105 group-hover:scale-125 transition duration-700 ease-in-out"
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                            <PlayCircle className="h-16 w-16 text-white drop-shadow-xl" />
                                        </div>
                                    </>
                                ) : (
                                    <img src={mediaUrl} alt={item.title || 'Gallery artwork'} className="w-full h-full object-cover transform scale-105 group-hover:scale-125 transition duration-700 ease-in-out" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/90 via-[#2C3E50]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-8">
                                    <span className="text-white font-bold text-xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</span>
                                    <span className="text-[#F9D423] font-semibold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.subtitle}</span>
                                </div>
                            </motion.div>
                        );
                        })}
                    </div>
                </div>
            </div>

            {selectedGalleryItem ? (
                <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setSelectedGalleryItem(null)}>
                    <div className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <button type="button" onClick={() => setSelectedGalleryItem(null)} className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
                            <X className="w-5 h-5" />
                        </button>
                        {getMediaType(selectedGalleryItem) === 'video' ? (
                            <video
                                src={getMediaUrl(selectedGalleryItem)}
                                className="w-full max-h-[80vh] bg-black"
                                controls
                                playsInline
                                autoPlay
                            />
                        ) : (
                            <img src={getMediaUrl(selectedGalleryItem)} alt={selectedGalleryItem.title || 'Gallery artwork'} className="w-full max-h-[80vh] object-contain bg-black" />
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Gallery;

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_PHONE = '919654168888';
const DEFAULT_MESSAGE =
    'Hi Limitless Art Org, I would like to know more about workshops, registration, and support options.';

const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

const FloatingWhatsApp = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {open ? (
                <div className="mb-4 w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-[#0f766e] px-4 py-3 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src="/logo.jpg"
                                alt="Limitless Art"
                                className="w-10 h-10 rounded-full border-2 border-white/60 object-cover"
                            />
                            <div className="min-w-0">
                                <p className="font-bold leading-tight truncate">Limitless Art Org</p>
                                <p className="text-xs text-white/80">online</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-white/90 hover:text-white"
                            aria-label="Close WhatsApp card"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="px-4 py-4 bg-[#f8fafc]">
                        <div className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm max-w-[85%]">
                            Hi, how can we help you?
                        </div>
                    </div>

                    <div className="p-4 pt-2">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full inline-flex items-center justify-center rounded-full bg-[#25d366] hover:bg-[#1fb85a] text-white font-bold py-2.5 transition-colors"
                        >
                            Start chat
                        </a>
                    </div>
                </div>
            ) : null}

            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="w-14 h-14 rounded-full bg-[#25d366] text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
                aria-label="Open WhatsApp chat"
            >
                <MessageCircle className="w-7 h-7" />
            </button>
        </div>
    );
};

export default FloatingWhatsApp;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, GraduationCap, Loader2 } from 'lucide-react';
import Seo from '../components/Seo';
import { useSearchParams } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { API_BASE } from '../services/siteContentService';

const OPTION_CLASS = (active) =>
    `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
        active
            ? 'bg-[#2C3E50] text-white shadow-lg'
            : 'bg-white text-[#2C3E50] border border-gray-200 hover:bg-gray-50'
    }`;

const CHILD_DEFAULTS = {
    parentName: '',
    childName: '',
    age: '',
    email: '',
    phone: '',
    interests: '',
    message: ''
};

const INTERNSHIP_DEFAULTS = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    areaOfInterest: '',
    experience: '',
    message: ''
};

const Registration = () => {
    const { content } = useSiteContent();
    const site = content.site;
    const [searchParams] = useSearchParams();

    const workshopIndex = Number(searchParams.get('workshop') || -1);
    const selectedWorkshop = Number.isInteger(workshopIndex) && workshopIndex >= 0
        ? content.home.workshops.items[workshopIndex] || null
        : null;
    const allowInternship = selectedWorkshop ? Boolean(selectedWorkshop.allowInternship) : true;
    const requestedType = searchParams.get('type') === 'internship' ? 'internship' : 'children';
    const [formType, setFormType] = useState(() => (requestedType === 'internship' && allowInternship ? 'internship' : 'children'));
    const workshopHeading = selectedWorkshop?.title || '';
    const [childForm, setChildForm] = useState(CHILD_DEFAULTS);
    const [internshipForm, setInternshipForm] = useState(INTERNSHIP_DEFAULTS);
    const [status, setStatus] = useState('idle');

    const handleChildChange = (event) => {
        setChildForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleInternshipChange = (event) => {
        setInternshipForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('loading');

        const payload =
            formType === 'children'
                ? {
                      title: `Registration for ${childForm.childName || 'Child'}`,
                      type: 'Registration',
                      data: { ...childForm, workshopTitle: workshopHeading }
                  }
                : {
                      title: `Internship application from ${internshipForm.fullName || 'Applicant'}`,
                      type: 'Internship',
                      data: { ...internshipForm, workshopTitle: workshopHeading }
                  };

        try {
            const response = await fetch(`${API_BASE}/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                setStatus('error');
                return;
            }

            setStatus('success');
            setChildForm(CHILD_DEFAULTS);
            setInternshipForm(INTERNSHIP_DEFAULTS);
            setTimeout(() => setStatus('idle'), 5000);
        } catch (_error) {
            setStatus('error');
        }
    };

    return (
        <>
            <Seo
                title={site.seo.registrationTitle || site.seo.defaultTitle}
                description={site.seo.registrationDescription || site.seo.defaultDescription}
                keywords={site.seo.keywords}
                image={site.seo.ogImage}
                siteUrl={site.seo.siteUrl}
                pathname="/register"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'EducationalOccupationalProgram',
                    name: `${site.organizationName} Registration`,
                    description: site.seo.registrationDescription || site.seo.defaultDescription,
                    provider: {
                        '@type': 'Organization',
                        name: site.organizationName,
                        url: site.seo.siteUrl
                    }
                }}
            />
            <div className="bg-gray-50 min-h-[100dvh] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                    >
                        <div className="bg-[#2C3E50] px-8 py-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                            <h1 className="text-3xl font-extrabold text-[#D4AF37] relative z-10">Join {site.organizationName}</h1>
                            <p className="mt-2 text-gray-300 relative z-10 text-lg">
                                {workshopHeading ? `Apply for ${workshopHeading}.` : 'Choose whether you want to register a child or apply for an internship.'}
                            </p>
                        </div>

                        <div className="px-8 py-10">
                            <div className="mb-8 flex flex-wrap gap-3 justify-center">
                                <button type="button" onClick={() => setFormType('children')} className={OPTION_CLASS(formType === 'children')}>
                                    <GraduationCap className="w-4 h-4" />
                                    Children
                                </button>
                                {allowInternship ? (
                                    <button type="button" onClick={() => setFormType('internship')} className={OPTION_CLASS(formType === 'internship')}>
                                        <Briefcase className="w-4 h-4" />
                                        Internship
                                    </button>
                                ) : null}
                            </div>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                                    <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">
                                        {formType === 'children' ? 'Registration Successful!' : 'Internship Application Sent!'}
                                    </h2>
                                    <p className="text-gray-600">
                                        We have received your details and will contact you shortly.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full transition-colors"
                                    >
                                        Submit Another Form
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {status === 'error' ? (
                                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-200 font-medium">
                                            Could not submit right now. Please try again.
                                        </div>
                                    ) : null}

                                    {formType === 'children' ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Parent/Guardian Name</label>
                                                    <input
                                                        type="text"
                                                        name="parentName"
                                                        value={childForm.parentName}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleChildChange}
                                                        placeholder="Enter parent or guardian name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Child's Name</label>
                                                    <input
                                                        type="text"
                                                        name="childName"
                                                        value={childForm.childName}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleChildChange}
                                                        placeholder="Enter child's name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Child's Age</label>
                                                    <input
                                                        type="number"
                                                        name="age"
                                                        value={childForm.age}
                                                        min="3"
                                                        max="25"
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleChildChange}
                                                        placeholder="Enter age"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={childForm.phone}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleChildChange}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={childForm.email}
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                    onChange={handleChildChange}
                                                    placeholder="Enter email address"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Child's Core Interests & Needs</label>
                                                <textarea
                                                    name="interests"
                                                    value={childForm.interests}
                                                    rows="3"
                                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="Share interests, learning goals, or support needs"
                                                    onChange={handleChildChange}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={childForm.message}
                                                    rows="3"
                                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="Add any extra details"
                                                    onChange={handleChildChange}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={internshipForm.fullName}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleInternshipChange}
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={internshipForm.email}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleInternshipChange}
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={internshipForm.phone}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleInternshipChange}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={internshipForm.city}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                        onChange={handleInternshipChange}
                                                        placeholder="Enter your city"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Area Of Interest</label>
                                                <input
                                                    type="text"
                                                    name="areaOfInterest"
                                                    value={internshipForm.areaOfInterest}
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                                    onChange={handleInternshipChange}
                                                    placeholder="For example: design, teaching support, social media"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Experience / Background</label>
                                                <textarea
                                                    name="experience"
                                                    value={internshipForm.experience}
                                                    rows="3"
                                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="Share your education, skills, or relevant experience"
                                                    onChange={handleInternshipChange}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Why Do You Want To Apply?</label>
                                                <textarea
                                                    name="message"
                                                    value={internshipForm.message}
                                                    rows="3"
                                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="Tell us why you want to intern with us"
                                                    onChange={handleInternshipChange}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-gradient-to-r from-[#F9D423] to-[#D4AF37] hover:from-[#e5c21f] hover:to-[#c4a130] text-[#1a252f] font-extrabold py-4 px-8 rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                                    Submitting Details...
                                                </>
                                            ) : formType === 'children' ? (
                                                'Submit Children Registration'
                                            ) : (
                                                'Submit Internship Application'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Registration;

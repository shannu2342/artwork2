import { motion } from 'framer-motion';
import { Palette, Users, Heart, Star, BookOpen, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* We will add an image back ground here */}
                    <div className="absolute inset-0 bg-[#2C3E50]/70 mix-blend-multiply" />
                    <img src="/hero.png" alt="Children creating art" className="w-full h-full object-cover filter brightness-75" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-[#D4AF37] mb-6 drop-shadow-md"
                    >
                        Limitless Art
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-3xl text-white mb-8 font-medium drop-shadow-md"
                    >
                        Empowering specially-abled children through art and skill development.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <a href="/register" className="inline-block bg-[#F9D423] hover:bg-[#D4AF37] text-black font-bold text-lg py-4 px-10 rounded-full shadow-xl transform transition hover:scale-105">
                            Join Our Workshop
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are */}
            <section id="who-we-are" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">Who We Are</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2">
                            <p className="text-lg text-gray-700 leading-relaxed text-justify">
                                Limitless Art is an inclusive organisation dedicated to nurturing the abilities of specially-abled children through art and practical skill learning. We identify each child's interests and tailor experiences that build creative competence, emotional resilience, and practical abilities. Our supportive environment encourages self-expression, independence and pathways to meaningful opportunities.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center text-center">
                                <Palette className="w-12 h-12 text-[#D4AF37] mb-3" />
                                <h4 className="font-bold text-[#2C3E50]">Creative Outlets</h4>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center text-center">
                                <Shield className="w-12 h-12 text-[#D4AF37] mb-3" />
                                <h4 className="font-bold text-[#2C3E50]">Safe Space</h4>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center text-center">
                                <Star className="w-12 h-12 text-[#D4AF37] mb-3" />
                                <h4 className="font-bold text-[#2C3E50]">Skill Building</h4>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center text-center">
                                <Heart className="w-12 h-12 text-[#D4AF37] mb-3" />
                                <h4 className="font-bold text-[#2C3E50]">Emotional Support</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section id="mission" className="py-20 bg-[#2C3E50] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="bg-white/10 p-10 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h2 className="text-3xl font-bold text-[#D4AF37] mb-6 flex items-center">
                                <Heart className="mr-4 w-8 h-8" /> Our Mission
                            </h2>
                            <p className="text-lg leading-relaxed">
                                To empower specially-abled children by developing artistic skills, confidence and independence through structured, compassionate art education.
                            </p>
                        </div>
                        <div className="bg-white/10 p-10 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h2 className="text-3xl font-bold text-[#D4AF37] mb-6 flex items-center">
                                <Star className="mr-4 w-8 h-8" /> Our Vision
                            </h2>
                            <p className="text-lg leading-relaxed">
                                To build a global inclusive platform where specially-abled artists can learn, grow, showcase their talent, and earn from their creativity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section id="what-we-do" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">What We Do</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">We use interest-based learning that adapts to each child’s comfort and strengths, blending technical skill training with emotional support.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Program 1 */}
                        <div className="bg-white rounded-2xl shadow-md p-8 hover:-translate-y-2 transition duration-300">
                            <div className="bg-[#D4AF37]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Palette className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Art Workshops</h3>
                            <p className="text-gray-600">Short, hands-on sessions focusing on creativity, engagement and confidence building.</p>
                        </div>

                        {/* Program 2 */}
                        <div className="bg-white rounded-2xl shadow-md p-8 hover:-translate-y-2 transition duration-300">
                            <div className="bg-[#D4AF37]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <BookOpen className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Structured Courses</h3>
                            <p className="text-gray-600">Progressive modules that teach drawing, painting and craft skills in accessible formats.</p>
                        </div>

                        {/* Program 3 */}
                        <div className="bg-white rounded-2xl shadow-md p-8 hover:-translate-y-2 transition duration-300">
                            <div className="bg-[#D4AF37]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Psychological Support</h3>
                            <p className="text-gray-600">Ongoing emotional and behavioural guidance to make learning comfortable and confidence-focused.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section id="team" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">About Our Team</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Founder */}
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-[#D4AF37] shadow-lg group-hover:scale-105 transition duration-300">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Parul&backgroundColor=D4AF37`} alt="Founder" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C3E50]">Parul Phoughat</h3>
                            <p className="text-[#D4AF37] font-semibold mb-4">Founder</p>
                            <p className="text-gray-600 px-4">Leads vision, designs curriculum, and manages partnerships and program development.</p>
                        </div>

                        {/* Art Teacher */}
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-[#2C3E50] shadow-lg group-hover:scale-105 transition duration-300">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=2C3E50`} alt="Art Teacher" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C3E50]">Art Educators</h3>
                            <p className="text-[#D4AF37] font-semibold mb-4">Specialized Teachers</p>
                            <p className="text-gray-600 px-4">Deliver workshops, adapt techniques for accessibility, and mentor students in creative skills.</p>
                        </div>

                        {/* Psychologist */}
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-[#F9D423] shadow-lg group-hover:scale-105 transition duration-300">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Psychologist&backgroundColor=F9D423`} alt="Psychologist" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C3E50]">Support Team</h3>
                            <p className="text-[#D4AF37] font-semibold mb-4">Psychologists</p>
                            <p className="text-gray-600 px-4">Provide emotional support, behaviour strategies, and ensure learning is trauma-informed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">Our Gallery</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-600">A showcase of beautiful artwork created by our talented students.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Placeholder images */}
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="h-64 rounded-xl overflow-hidden shadow-md group relative">
                                <img src={`https://picsum.photos/seed/${item + 50}/600/400`} alt="Gallery Art" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg border-2 border-white px-4 py-2 rounded-lg">View Artwork</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workshops */}
            <section id="workshops" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b pb-8">
                        <div>
                            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">Upcoming Workshops</h2>
                            <div className="w-24 h-1 bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <div className="mt-8 md:mt-0">
                            <a href="/register" className="bg-[#2C3E50] hover:bg-[#D4AF37] text-white px-8 py-3 rounded-full font-bold transition-colors">
                                See All Details
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-shadow">
                            <div className="h-48 bg-gray-200">
                                <img src="https://picsum.photos/seed/work1/600/400" alt="Workshop" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Open</span>
                                <h3 className="text-xl font-bold text-[#2C3E50] mt-4 mb-2">Finger Painting Basics</h3>
                                <p className="text-gray-600 mb-4 text-sm">A gentle introduction to expressive art.</p>
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-[#D4AF37]">Every Saturday</span>
                                    <a href="/register" className="text-[#2C3E50] underline">Register</a>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-shadow">
                            <div className="h-48 bg-gray-200">
                                <img src="https://picsum.photos/seed/work2/600/400" alt="Workshop" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Open</span>
                                <h3 className="text-xl font-bold text-[#2C3E50] mt-4 mb-2">Sensory Crafts</h3>
                                <p className="text-gray-600 mb-4 text-sm">Working with clay, textures and mild colors.</p>
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-[#D4AF37]">Every Sunday</span>
                                    <a href="/register" className="text-[#2C3E50] underline">Register</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;

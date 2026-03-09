import { motion } from 'framer-motion';
import { Palette, Users, Heart, Star, BookOpen, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-[100dvh] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a252f]/90 via-[#2C3E50]/70 to-[#D4AF37]/30 mix-blend-multiply z-10" />
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src="/hero.png"
                        alt="Children creating art"
                        className="w-full h-full object-cover filter brightness-75"
                    />
                </div>
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-8"
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F9D423] to-[#D4AF37] drop-shadow-lg tracking-tight mb-4">
                            Limitless Art
                        </h1>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-[#F9D423] to-transparent mx-auto rounded-full"></div>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-4xl text-gray-100 mb-10 font-medium drop-shadow-xl"
                    >
                        Empowering specially-abled children <br className="hidden md:block" /> through art and skill development.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <a href="/register" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#1a252f] transition-all duration-300 bg-gradient-to-r from-[#F9D423] to-[#D4AF37] rounded-full shadow-2xl hover:scale-105 hover:shadow-[#D4AF37]/50 focus:outline-none overflow-hidden">
                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                            <span className="relative">Join Our Workshop</span>
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer"
                    onClick={() => document.getElementById('who-we-are').scrollIntoView({ behavior: 'smooth' })}
                >
                    <div className="w-8 h-14 border-2 border-white/50 rounded-full flex justify-center p-2">
                        <div className="w-1.5 h-3 bg-white rounded-full mt-1"></div>
                    </div>
                </motion.div>
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
            <section id="gallery" className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 relative">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl font-black text-[#2C3E50] mb-6"
                        >
                            Our Gallery
                        </motion.h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F9D423] mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">A showcase of beautiful artwork created by our talented students.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Placeholder images with premium hover effects */}
                        {[1, 2, 3, 4, 5, 6].map((item, i) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="h-72 rounded-2xl overflow-hidden shadow-xl group relative cursor-pointer"
                            >
                                <img src={`https://picsum.photos/seed/${item + 50}/600/400`} alt="Gallery Art" className="w-full h-full object-cover transform scale-105 group-hover:scale-125 transition duration-700 ease-in-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/90 via-[#2C3E50]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-8">
                                    <span className="text-white font-bold text-xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Student Art #{item}</span>
                                    <span className="text-[#F9D423] font-semibold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">View Masterpiece</span>
                                </div>
                            </motion.div>
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

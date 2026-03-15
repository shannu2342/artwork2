export const SITE_CONTENT_KEY = 'home-page';

export const defaultSiteContent = {
    home: {
        hero: {
            title: 'Limitless Art',
            subtitle: 'Empowering specially-abled children through art and skill development.',
            ctaText: 'Join Our Workshop',
            ctaLink: '/register',
            backgroundImage: '/hero.png'
        },
        whoWeAre: {
            title: 'Who We Are',
            description:
                "Limitless Art is an inclusive organisation dedicated to nurturing the abilities of specially-abled children through art and practical skill learning. We identify each child's interests and tailor experiences that build creative competence, emotional resilience, and practical abilities. Our supportive environment encourages self-expression, independence and pathways to meaningful opportunities."
        },
        highlights: [
            { icon: 'Palette', title: 'Creative Outlets' },
            { icon: 'Shield', title: 'Safe Space' },
            { icon: 'Star', title: 'Skill Building' },
            { icon: 'Heart', title: 'Emotional Support' }
        ],
        missionVision: {
            missionTitle: 'Our Mission',
            missionText:
                'To empower specially-abled children by developing artistic skills, confidence and independence through structured, compassionate art education.',
            visionTitle: 'Our Vision',
            visionText:
                'To build a global inclusive platform where specially-abled artists can learn, grow, showcase their talent, and earn from their creativity.'
        },
        whatWeDo: {
            title: 'What We Do',
            description:
                'We use interest-based learning that adapts to each child\'s comfort and strengths, blending technical skill training with emotional support.'
        },
        programs: [
            {
                icon: 'Palette',
                title: 'Art Workshops',
                description:
                    'Short, hands-on sessions focusing on creativity, engagement and confidence building through practical artistic tasks.'
            },
            {
                icon: 'BookOpen',
                title: 'Structured Courses',
                description:
                    'Progressive modules that teach drawing, painting and craft skills in highly accessible, adaptable formats for every child.'
            },
            {
                icon: 'Users',
                title: 'Psychological Support',
                description:
                    'Ongoing emotional and behavioural guidance to make learning comfortable, focused, and confidence-building.'
            }
        ],
        team: {
            title: 'About Our Team',
            members: [
                {
                    name: 'Parul Phoughat',
                    role: 'Founder',
                    description:
                        'Leads vision, designs curriculum, and manages partnerships and program development.',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parul&backgroundColor=D4AF37',
                    accentClass: 'border-[#D4AF37]'
                },
                {
                    name: 'Art Educators',
                    role: 'Specialized Teachers',
                    description:
                        'Deliver workshops, adapt techniques for accessibility, and mentor students in creative skills.',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=2C3E50',
                    accentClass: 'border-[#2C3E50]'
                },
                {
                    name: 'Support Team',
                    role: 'Psychologists',
                    description:
                        'Provide emotional support, behaviour strategies, and ensure learning is trauma-informed.',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Psychologist&backgroundColor=F9D423',
                    accentClass: 'border-[#F9D423]'
                }
            ]
        },
        gallery: {
            title: 'Our Gallery',
            description: 'A showcase of beautiful artwork created by our talented students.',
            items: [
                { image: 'https://picsum.photos/seed/51/600/400', title: 'Student Art #1', subtitle: 'View Masterpiece' },
                { image: 'https://picsum.photos/seed/52/600/400', title: 'Student Art #2', subtitle: 'View Masterpiece' },
                { image: 'https://picsum.photos/seed/53/600/400', title: 'Student Art #3', subtitle: 'View Masterpiece' },
                { image: 'https://picsum.photos/seed/54/600/400', title: 'Student Art #4', subtitle: 'View Masterpiece' },
                { image: 'https://picsum.photos/seed/55/600/400', title: 'Student Art #5', subtitle: 'View Masterpiece' },
                { image: 'https://picsum.photos/seed/56/600/400', title: 'Student Art #6', subtitle: 'View Masterpiece' }
            ]
        },
        workshops: {
            title: 'Upcoming Workshops',
            ctaText: 'View Full Schedule',
            items: [
                {
                    title: 'Finger Painting Basics',
                    description:
                        'A gentle introduction to expressive art focusing on tactile sensory experiences.',
                    schedule: 'Every Saturday',
                    status: 'Open for Registration',
                    image: 'https://picsum.photos/seed/work1/600/400'
                },
                {
                    title: 'Sensory Crafts',
                    description:
                        'Working with clay, textures, and mild colors to stimulate creativity and motor skills.',
                    schedule: 'Every Sunday',
                    status: 'Open for Registration',
                    image: 'https://picsum.photos/seed/work2/600/400'
                },
                {
                    title: 'Creative Story Art',
                    description:
                        'Story-led drawing sessions that improve communication, focus, and visual imagination.',
                    schedule: 'Every Wednesday',
                    status: 'Open for Registration',
                    image: 'https://picsum.photos/seed/work3/600/400'
                }
            ]
        },
        testimonials: {
            title: 'What Parents Say',
            description: 'Heartwarming stories from our diverse community.',
            items: [
                {
                    initials: 'SJ',
                    name: 'Sarah Jenkins',
                    role: 'Parent of 8-year-old',
                    quote:
                        'The workshops at Limitless Art have been a game changer for my son. He has found a beautiful way to express himself through colors. The teachers are so incredibly patient and kind.'
                },
                {
                    initials: 'MR',
                    name: 'Michael Rodriguez',
                    role: 'Parent of 12-year-old',
                    quote:
                        'Finding an inclusive space where my daughter feels truly accepted was hard. Since joining Limitless Art, her confidence has skyrocketed, and her sensory crafts are beautifully displayed in our home.'
                },
                {
                    initials: 'AP',
                    name: 'Anita Patel',
                    role: 'Parent of 10-year-old',
                    quote:
                        "The psychological support integrated into the art program is brilliant. It isn't just an art class; it's a therapeutic environment where our kids can thrive without pressure or judgment."
                }
            ]
        }
    }
};

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

export const cloneValue = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => cloneValue(item));
    }

    if (isPlainObject(value)) {
        const result = {};
        Object.keys(value).forEach((key) => {
            result[key] = cloneValue(value[key]);
        });
        return result;
    }

    return value;
};

export const mergeSiteContent = (base, override) => {
    if (Array.isArray(base)) {
        if (!Array.isArray(override)) {
            return cloneValue(base);
        }

        return override.map((item, index) => {
            const baseItem = base[index];
            if (isPlainObject(baseItem) && isPlainObject(item)) {
                return mergeSiteContent(baseItem, item);
            }
            return cloneValue(item);
        });
    }

    if (isPlainObject(base)) {
        const merged = {};
        const keys = new Set([...Object.keys(base), ...Object.keys(override || {})]);

        keys.forEach((key) => {
            const baseValue = base[key];
            const overrideValue = override ? override[key] : undefined;

            if (overrideValue === undefined) {
                merged[key] = cloneValue(baseValue);
                return;
            }

            if (Array.isArray(baseValue) || isPlainObject(baseValue)) {
                merged[key] = mergeSiteContent(baseValue, overrideValue);
                return;
            }

            merged[key] = cloneValue(overrideValue);
        });

        return merged;
    }

    return override === undefined ? cloneValue(base) : cloneValue(override);
};

export const cloneSiteContent = (content = defaultSiteContent) => cloneValue(content);

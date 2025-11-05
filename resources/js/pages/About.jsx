// File: resources/js/Pages/About.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function About() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);

            // Check which sections are in viewport
            const sections = document.querySelectorAll('[data-animate]');
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
                if (isVisible) {
                    setVisibleSections((prev) => new Set([...prev, section.dataset.animate]));
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const teamMembers = [
        { initial: 'A', color: 'from-rose-400 to-rose-600', role: 'Visionary' },
        { initial: 'V', color: 'from-purple-400 to-purple-600', role: 'Creator' },
        { initial: 'H', color: 'from-blue-400 to-blue-600', role: 'Innovator' },
        { initial: 'I', color: 'from-emerald-400 to-emerald-600', role: 'Dreamer' },
    ];

    const values = [
        {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'Friendship First',
            description: 'Built on trust, love, and the bond that brings us together',
            gradient: 'from-rose-400 to-pink-600',
        },
        {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
            title: 'Artisan Heritage',
            description: 'Honoring Jaipur\'s traditional Sanganeri craftsmanship',
            gradient: 'from-purple-400 to-indigo-600',
        },
        {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            title: 'Premium Quality',
            description: 'Only the finest cotton for comfort that lasts',
            gradient: 'from-blue-400 to-cyan-600',
        },
        {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: 'Made with Love',
            description: 'Every piece carries our heart and story',
            gradient: 'from-emerald-400 to-teal-600',
        },
    ];

    return (
        <MainLayout>
            <Head title="About Us - Avhira" />

            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
                <div
                    className="h-full bg-gradient-to-r from-[#be1e2d] to-[#ff6a6a] transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-20 sm:-mt-24 lg:-mt-32">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf5f6] via-white to-[#faf5f6]">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23be1e2d" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                        }} />
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-gradient-to-br from-[#be1e2d]/10 to-[#ff6a6a]/10 animate-float"
                            style={{
                                width: `${Math.random() * 300 + 100}px`,
                                height: `${Math.random() * 300 + 100}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${Math.random() * 10 + 15}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 text-center py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-block mb-6 animate-fade-in">
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg"
                                  style={{ 
                                      background: 'linear-gradient(135deg, #be1e2d 0%, #9a1824 100%)',
                                      color: 'white'
                                  }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                Our Story
                            </span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            Every Story Begins with
                            <br />
                            <span className="bg-gradient-to-r from-[#be1e2d] to-[#ff6a6a] bg-clip-text text-transparent">
                                A Beautiful Connection
                            </span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            Four friends. One dream. A brand born from friendship and destiny.
                        </p>
                    </div>
                </div>
            </section>

            {/* Origin Story Section */}
            <section className="py-16 sm:py-20 lg:py-28 bg-white" data-animate="origin">
                <div className={`container mx-auto px-4 lg:px-8 xl:px-16 max-w-6xl transition-all duration-1000 ${
                    visibleSections.has('origin') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Text Content */}
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="text-sm font-bold uppercase tracking-wider text-[#be1e2d] bg-[#be1e2d]/10 px-4 py-2 rounded-full">
                                    📍 Ahmedabad
                                </span>
                            </div>
                            
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Where It All
                                <span className="block text-[#be1e2d]">Began</span>
                            </h2>
                            
                            <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
                                <p>
                                    We were <strong className="text-[#be1e2d]">four individuals from different corners of the country</strong>, brought together by destiny at the same workplace. What started as a simple friendship soon grew into a bond that felt like family.
                                </p>
                                <p>
                                    Through endless conversations, shared dreams, and late-night ideas, one thought kept returning &mdash; <em className="text-[#be1e2d] font-semibold">let&apos;s build something together that will keep us connected forever</em>.
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    That's how AVHIRA was born - a name crafted with love, carrying a part of each one of us within it.
                                </p>
                            </div>
                        </div>

                        {/* Team Initials Animation */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6 sm:gap-8">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={member.initial}
                                        className="group relative animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className={`aspect-square rounded-3xl bg-gradient-to-br ${member.color} p-1 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                            <div className="w-full h-full bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                                                <span className={`text-6xl sm:text-7xl font-bold bg-gradient-to-br ${member.color} bg-clip-text text-transparent`}>
                                                    {member.initial}
                                                </span>
                                                <span className="text-sm sm:text-base font-medium text-gray-600 mt-2">
                                                    {member.role}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Connecting Lines */}
                                        {index < 3 && (
                                            <div className="absolute top-1/2 left-full w-6 h-0.5 bg-gradient-to-r from-[#be1e2d]/30 to-transparent hidden lg:block" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Center Heart */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#be1e2d] to-[#ff6a6a] flex items-center justify-center shadow-2xl animate-pulse">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Philosophy Section */}
            <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-[#faf5f6] to-white" data-animate="philosophy">
                <div className={`container mx-auto px-4 lg:px-8 xl:px-16 max-w-6xl transition-all duration-1000 ${
                    visibleSections.has('philosophy') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            More Than Just
                            <span className="block text-[#be1e2d]">A Clothing Brand</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            AVHIRA is an emotion stitched with friendship, trust, and creativity. Inspired by the vibrant soul of Jaipur, we create premium cotton collections that celebrate the art of Sanganeri prints.
                        </p>
                    </div>

                    {/* Split Content */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#be1e2d] to-[#9a1824]" />
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M0 0h20v20H0V0zm20 20h20v20H20V20z"/%3E%3C/g%3E%3C/svg%3E")'
                                }} />
                            </div>
                            <div className="relative z-10 p-8 sm:p-10 lg:p-12 text-white">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Our Craft</h3>
                                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                                    Each piece is thoughtfully designed and ethically made through our own manufacturing and collaboration with local artisans, ensuring quality, comfort, and a lasting connection to India&apos;s cultural roots.
                                </p>
                            </div>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600" />
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Ccircle cx="20" cy="20" r="3"/%3E%3C/g%3E%3C/svg%3E")'
                                }} />
                            </div>
                            <div className="relative z-10 p-8 sm:p-10 lg:p-12 text-white">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Our Dream</h3>
                                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                                    To make every person feel special, confident, and connected to the colorful spirit of India. Every AVHIRA design reflects positivity, grace, and timeless Indian artistry.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-20 lg:py-28 bg-white" data-animate="values">
                <div className={`container mx-auto px-4 lg:px-8 xl:px-16 max-w-7xl transition-all duration-1000 ${
                    visibleSections.has('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="inline-block px-5 py-2.5 rounded-full text-sm font-bold mb-5"
                              style={{ 
                                  background: 'linear-gradient(135deg, #be1e2d 0%, #9a1824 100%)',
                                  color: 'white'
                              }}>
                            What Drives Us
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                            Our Core Values
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {values.map((value, index) => (
                            <div
                                key={value.title}
                                className="group relative animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="h-full p-6 sm:p-8 rounded-3xl bg-white border-2 border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                        <div className="w-8 h-8 text-white">
                                            {value.icon}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed">
                                        {value.description}
                                    </p>

                                    <div className={`absolute inset-x-0 bottom-0 h-1.5 rounded-b-3xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Message Section */}
            <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden" data-animate="final">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#be1e2d] to-[#9a1824]" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                    }} />
                </div>

                <div className={`container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 text-center max-w-4xl transition-all duration-1000 ${
                    visibleSections.has('final') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-16 h-1 bg-white/40 rounded-full" />
                        <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <div className="w-16 h-1 bg-white/40 rounded-full" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                        Because for us, AVHIRA isn't just a brand
                    </h2>
                    
                    <p className="text-xl sm:text-2xl md:text-3xl text-white/95 font-medium leading-relaxed mb-8">
                        It's our story, our bond, and our heart —
                        <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                            Shared with You ✨
                        </span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-12">
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">4</div>
                            <div className="text-sm sm:text-base text-white/80">Friends United</div>
                        </div>
                        <div className="hidden sm:block w-px h-16 bg-white/20" />
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">1</div>
                            <div className="text-sm sm:text-base text-white/80">Dream Realized</div>
                        </div>
                        <div className="hidden sm:block w-px h-16 bg-white/20" />
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">∞</div>
                            <div className="text-sm sm:text-base text-white/80">Stories to Tell</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add custom animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                    }
                }
                
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </MainLayout>
    );
}

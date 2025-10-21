import { Head } from '@inertiajs/react';

export default function Maintenance({ message }) {
    return (
        <>
            <Head title="Site Maintenance" />
            
            <div className="min-h-screen bg-gradient-to-br from-avhira-bg to-white flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <svg 
                            className="w-32 h-32 mx-auto text-avhira-primary" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <div className="mb-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                We'll Be Back Soon!
                            </h1>
                            <div className="w-24 h-1 bg-avhira-primary mx-auto rounded-full"></div>
                        </div>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {message}
                        </p>

                        {/* Maintenance Icon */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-avhira-primary/10 rounded-full">
                                <svg 
                                    className="w-10 h-10 text-avhira-primary animate-pulse" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                                    />
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="text-gray-500 mb-6">
                            <p className="mb-2">Our team is working hard to improve your experience.</p>
                            <p>Thank you for your patience!</p>
                        </div>

                        {/* Contact Info */}
                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Need immediate assistance?{' '}
                                <a 
                                    href="mailto:support@avhira.com" 
                                    className="text-avhira-primary hover:text-avhira-primary-dark font-medium"
                                >
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-gray-500">
                        <p className="text-sm">© 2025 Avhira. All rights reserved.</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .5;
                    }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </>
    );
}

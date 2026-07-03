import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Policy({ title, sections, lastRevised }) {
    return (
        <MainLayout>
            <Head title={`${title} - AVHIRA`} />
            
            <div className="bg-neutral-50 py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
                    <p className="text-gray-500 mb-8">Last Revised: {lastRevised}</p>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12">
                        <div className="prose prose-neutral max-w-none prose-headings:text-avhira-red prose-a:text-avhira-red hover:prose-a:underline">
                            {sections.map((section, idx) => (
                                <div key={idx} className="mb-10 last:mb-0">
                                    {section.title && <h2 className="text-2xl font-semibold mb-4 text-gray-800">{section.title}</h2>}
                                    <div className="text-gray-600 space-y-4" dangerouslySetInnerHTML={{ __html: section.content }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

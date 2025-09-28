'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import { projects, ProjectType } from '@/config/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import Chatbot from '@/components/Chatbot';
import SegmentedControl from '@/components/SegmentedControl';
import SlideIn from '@/components/SlideIn';

export default function Home() {
  const [selectedType, setSelectedType] = useState<ProjectType>('SaaS');
  
  const filteredProjects = projects.filter(project => project.type === selectedType);
  
  const reviews = [
    {
      name: 'Sarah Johnson',
      country: 'US',
      role: 'CTO',
      company: 'Acme Health',
      avatar: 'https://i.pravatar.cc/72?img=47',
      text:
        'Joel shipped our React Native MVP in record time with clean, maintainable code. Communication and initiative were outstanding throughout.',
      rating: 5,
    },
    {
      name: 'James Wright',
      country: 'GB',
      role: 'Head of Product',
      company: 'FinTechly',
      avatar: 'https://i.pravatar.cc/72?img=12',
      text:
        'We hit an aggressive launch date thanks to Joel’s pragmatic engineering and thoughtful UX touches. A reliable partner end-to-end.',
      rating: 5,
    },
    {
      name: 'Michael Lee',
      country: 'US',
      role: 'Founder',
      company: 'EduLabs',
      avatar: 'https://randomuser.me/api/portraits/men/24.jpg',
      text:
        'Rock-solid TypeScript, great attention to detail, and proactive problem-solving. Would definitely work with Joel again.',
      rating: 5,
    },
  ];

  return (
    <SlideIn>
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Hero />

      <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center md:items-start mb-8 gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-palm-green">Projects</h2>
            <p className="text-sm sm:text-base text-gray-400">
              <span className="text-gray-900 dark:text-gray-100 font-medium">$30 USD/hr</span>
              <span className="hidden md:inline"> • </span>
              <span> UTC+3 (Nairobi)</span>
            </p>
          </div>
          <SegmentedControl value={selectedType} onChange={setSelectedType} />
        </div>
        <ProjectsCarousel projects={filteredProjects} />
      </section>
      
      <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-palm-green">Reviews</h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">What clients say about working together</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={r.avatar}
                  alt={`${r.name} avatar`}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-800"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.name}</span>
                    <img
                      src={`https://flagcdn.com/${r.country.toLowerCase()}.svg`}
                      alt={`${r.country} flag`}
                      className="h-3.5 w-5 rounded-sm ring-1 ring-gray-200 dark:ring-gray-800"
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{r.role}, {r.company}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-yellow-500" aria-label={`Rated ${r.rating} out of 5`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.15 3.532a1 1 0 00.95.69h3.708c.969 0 1.371 1.24.588 1.81l-3 2.18a1 1 0 00-.364 1.118l1.15 3.532c.3.921-.755 1.688-1.54 1.118l-3-2.18a1 1 0 00-1.176 0l-3 2.18c-.784.57-1.838-.197-1.539-1.118l1.15-3.532a1 1 0 00-.364-1.118l-3-2.18c-.783-.57-.38-1.81.588-1.81h3.708a1 1 0 00.95-.69l1.15-3.532z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
      
      <CTA />
      <Chatbot />
    </main>
    </SlideIn>
  );
}

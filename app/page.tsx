'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import { projects, ProjectType } from '@/config/projects';
import ProjectCard from '@/components/ProjectCard';
import Chatbot from '@/components/Chatbot';
import SegmentedControl from '@/components/SegmentedControl';

export default function Home() {
  const [selectedType, setSelectedType] = useState<ProjectType>('SaaS');
  
  const filteredProjects = projects.filter(project => project.type === selectedType);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Hero />

      <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 text-center md:text-left">
            <h2 className="text-3xl font-bold">Projects</h2>
            <p className="text-sm sm:text-base text-gray-400">
              <span className="text-gray-900 dark:text-gray-100 font-medium">$30 USD/hr</span>
              <span className="hidden md:inline"> • </span>
              <span> UTC+3 (Nairobi)</span>
            </p>
          </div>
          <SegmentedControl value={selectedType} onChange={setSelectedType} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
      <Chatbot />
    </main>
  );
}

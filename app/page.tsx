import Hero from '@/components/Hero';
import { projects } from '@/config/projects';
import ProjectCard from '@/components/ProjectCard';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Hero />

      <section className="max-w-5xl mx-auto px-4 sm:px-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2 text-center md:text-left">
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="text-sm sm:text-base text-gray-400 md:ml-4">
            <span className="text-gray-900 dark:text-gray-100 font-medium">$30 USD/hr</span>
            <span className="hidden md:inline"> • </span>
            <span>UTC+3 (Nairobi)</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
          <Chatbot />
    </main>
  );
}

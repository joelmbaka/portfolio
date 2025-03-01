import Hero from '@/components/Hero';
import { projects } from '@/config/projects';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Hero />

      <section className="max-w-5xl mx-auto px-4 sm:px-8 md:px-6">
        <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Side Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

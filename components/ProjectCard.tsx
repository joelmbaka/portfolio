import { Project } from '@/config/projects';
import { ArrowUpRight } from 'lucide-react';
import { Suspense } from 'react';
import ImageCarousel from '@/components/ImageCarousel';

function ProjectCardContent({ project }: { project: Project }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.title}</h3>
        <div className="flex items-center gap-3">
        {project.url && (
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            <ArrowUpRight size={20} />
          </a>
        )}
      </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="mt-4">
          <ImageCarousel images={project.screenshots} />
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {project.tech.map((tech) => (
          <span 
            key={tech}
            className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Suspense fallback={<div className="animate-pulse h-[640px] bg-gray-800 rounded-xl" />}>
      <ProjectCardContent project={project} />
    </Suspense>
  );
}
import { Project } from '@/config/projects';
import { ArrowUpRight, Download } from 'lucide-react';
import { Suspense } from 'react';

function ProjectCardContent({ project }: { project: Project }) {
  return (
    <div className="border border-gray-800 rounded-xl p-6 hover:bg-gray-900 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-2xl font-bold text-gray-100">{project.title}</h3>
        <div className="flex items-center gap-3">
        {project.url && (
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <ArrowUpRight size={20} />
          </a>
        )}
        {project.artifact && (
          <a
            href={project.artifact}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="text-gray-400 hover:text-green-500 transition-colors"
          >
            <Download size={20} />
          </a>
        )}
      </div>
      </div>
      <p className="text-gray-400 mt-2">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.tech.map((tech) => (
          <span 
            key={tech}
            className="px-3 py-1 text-sm rounded-full bg-blue-900/20 text-blue-400"
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
    <Suspense fallback={<div className="animate-pulse h-48 bg-gray-800 rounded-xl" />}>
      <ProjectCardContent project={project} />
    </Suspense>
  );
}
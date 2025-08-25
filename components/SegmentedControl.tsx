'use client';

import { ProjectType } from '@/config/projects';

interface SegmentedControlProps {
  value: ProjectType;
  onChange: (value: ProjectType) => void;
}

export default function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  const options: { label: string; value: ProjectType }[] = [
    { label: 'SaaS', value: 'SaaS' },
    { label: 'Enterprise', value: 'Enterprise' }
  ];

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-6 py-2 text-sm font-medium transition-all duration-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0
            ${value === option.value
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

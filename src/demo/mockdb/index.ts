import type { BusinessDemoConfig } from '../types';

const modules = import.meta.glob('./companies/*.ts', {
  eager: true,
  import: 'default',
}) as Record<string, BusinessDemoConfig>;

export const demoRegistry: Record<string, BusinessDemoConfig> = {};

for (const path in modules) {
  const config = modules[path];
  if (config?.slug) {
    demoRegistry[config.slug] = config;
  }
}

export function getDemoConfig(slug: string): BusinessDemoConfig | undefined {
  return demoRegistry[slug];
}

export function getAllDemoSlugs(): string[] {
  return Object.keys(demoRegistry);
}

import type { DemoCompanyConfig } from './types';

const modules = import.meta.glob('./companies/*.ts', {
  eager: true,
  import: 'default',
}) as Record<string, DemoCompanyConfig>;

export const demoRegistry: Record<string, DemoCompanyConfig> = {};

for (const path in modules) {
  const config = modules[path];
  if (config?.slug) {
    demoRegistry[config.slug] = config;
  }
}

export function getDemoConfig(slug: string): DemoCompanyConfig | undefined {
  return demoRegistry[slug];
}

export function getAllDemoSlugs(): string[] {
  return Object.keys(demoRegistry);
}

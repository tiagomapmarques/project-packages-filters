/// <reference types="project-packages" />

declare module 'project-packages-filters' {
  function vendorPackages(extraRules: ProjectModule, useDefaults?: boolean, packageJsonLocation?: string): string[];
  function helperPackages(extraRules: ProjectModule, useDefaults?: boolean, packageJsonLocation?: string): string[];
}

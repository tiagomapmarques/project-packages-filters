import { resolve } from 'path';
import * as findRoot from 'find-root';
import { getAllOfType } from 'project-packages';

declare function require(str: string): any;

const testDependency = (literals: string[], regex: string[], useDefaults: boolean, positive: boolean) => (str: string) => {
  let allLiterals = literals;
  let allRegex = regex;

  if (useDefaults) {
    allLiterals = allLiterals.concat(getAllOfType('literals'));
    allRegex = allRegex.concat(getAllOfType('regex'));
  }

  let matches = false;
  allRegex.forEach((testString) => {
    const re = new RegExp(testString);
    matches = matches || re.test(str);
  });
  allLiterals.forEach((testString) => {
    matches = matches || testString === str;
  });
  return positive ? matches : !matches;
};

const getPackageJsonData = (packageJsonLocation?: string) =>
  require(resolve(`${packageJsonLocation || findRoot('./')}/package.json`));

export const vendorPackages = (packageJsonLocation: string = './', literals: string[] = [], regex: string[] = [], useDefaults: boolean = true) =>
  Object.keys(getPackageJsonData(packageJsonLocation).dependencies).filter(
    testDependency(literals, regex, useDefaults, false)
  );

export const helperPackages = (packageJsonLocation: string = './', literals: string[] = [], regex: string[] = [], useDefaults: boolean = true) =>
  Object.keys(getPackageJsonData(packageJsonLocation).dependencies).filter(
    testDependency(literals, regex, useDefaults, true)
  );

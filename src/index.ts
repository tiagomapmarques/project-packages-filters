import { resolve } from 'path';
import * as findRoot from 'find-root';
import { getAllOfType, ProjectModule } from 'project-packages';

// tslint:disable-next-line:no-any
declare function require(str: string): any;

const emptyRules: ProjectModule = {
  literals: [],
  regex: [],
};

const testDependency = (
  literals: string[],
  regex: string[],
  useDefaults: boolean,
  positive: boolean,
) => (str: string) => {
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

export const vendorPackages = (extraRules: ProjectModule = emptyRules, useDefaults: boolean = true, packageJsonLocation: string = './') =>
  Object.keys(getPackageJsonData(packageJsonLocation).dependencies).filter(
    testDependency(extraRules.literals || [], extraRules.regex || [], useDefaults, false),
  );

export const helperPackages = (extraRules: ProjectModule = emptyRules, useDefaults: boolean = true, packageJsonLocation: string = './') =>
  Object.keys(getPackageJsonData(packageJsonLocation).dependencies).filter(
    testDependency(extraRules.literals || [], extraRules.regex || [], useDefaults, true),
  );

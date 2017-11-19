"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var findRoot = require("find-root");
var project_packages_1 = require("project-packages");
var testDependency = function (literals, regex, useDefaults, positive) { return function (str) {
    var allLiterals = literals;
    var allRegex = regex;
    if (useDefaults) {
        allLiterals = allLiterals.concat(project_packages_1.getAllOfType('literals'));
        allRegex = allRegex.concat(project_packages_1.getAllOfType('regex'));
    }
    var matches = false;
    allRegex.forEach(function (testString) {
        var re = new RegExp(testString);
        matches = matches || re.test(str);
    });
    allLiterals.forEach(function (testString) {
        matches = matches || testString === str;
    });
    return positive ? matches : !matches;
}; };
var getPackageJsonData = function (packageJsonLocation) {
    return require(path_1.resolve((packageJsonLocation || findRoot('./')) + "/package.json"));
};
exports.vendorPackages = function (packageJsonLocation, literals, regex, useDefaults) {
    if (packageJsonLocation === void 0) { packageJsonLocation = './'; }
    if (literals === void 0) { literals = []; }
    if (regex === void 0) { regex = []; }
    if (useDefaults === void 0) { useDefaults = true; }
    return Object.keys(getPackageJsonData(packageJsonLocation).dependencies).filter(testDependency(literals, regex, useDefaults, false));
};
exports.helperPackages = function (packageJsonLocation, literals, regex, useDefaults) {
    if (packageJsonLocation === void 0) { packageJsonLocation = './'; }
    if (literals === void 0) { literals = []; }
    if (regex === void 0) { regex = []; }
    if (useDefaults === void 0) { useDefaults = true; }
    return Object.keys(getPackageJsonData(packageJsonLocation).dependencies).filter(testDependency(literals, regex, useDefaults, true));
};

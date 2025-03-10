import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const glob = require('glob');

type LicenseObj = {
  author?: string;
  content?: string;
  description?: string;
  type?: string;
  url?: string;
  version: string;
};

type AboutLibrariesLibraryJsonPayload = {
  artifactVersion: string;
  description: string;
  developers: { name: string; organisationUrl: string }[];
  licenses: string[];
  name: string;
  tag: string;
  uniqueId: string;
};

type AboutLibrariesLicenseJsonPayload = {
  content: string;
  hash: string;
  name: string;
  url: string;
};

type LicensePlistPayload = {
  body: string;
  name: string;
  source?: string;
  version: string;
};

function compareObjects(a: unknown, b: unknown): boolean {
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  const entriesA = Object.entries(a);
  const entriesB = Object.entries(b);

  return (
    entriesA.length === entriesB.length &&
    entriesA
      .map(([keyA, valueA]) => {
        const entry = entriesB.find(([keyB]) => keyA === keyB);

        if (!entry) {
          return valueA === entry;
        }

        const [, valueB] = entry;

        return compareObjects(valueA, valueB);
      })
      .reduce((acc, curr) => acc && curr, true)
  );
}

/**
 * Makes a deep-check between array items and provided object, returns true if array has provided object.
 */
export function arrayIncludesObject(array?: unknown[], object?: unknown) {
  return array?.map((item) => compareObjects(item, object)).reduce((acc, curr) => acc || curr, false);
}

/**
 * Scans `package.json` and searches for all packages under `dependencies` field. Supports monorepo projects.
 */
export function scanDependencies(appPackageJsonPath: string) {
  const appPackageJson = require(path.resolve(appPackageJsonPath));
  const dependencies: Record<string, string> = appPackageJson.dependencies;

  return Object.keys(dependencies).reduce(
    (acc, dependency) => {
      try {
        const localPackageJsonPath = getPackageJsonPath(dependency);

        if (!localPackageJsonPath) {
          console.warn(`[react-native-legal] skipping ${dependency} could not find package.json`);
          return acc;
        }

        const localPackageJson = require(path.resolve(localPackageJsonPath));
        const licenseFiles = glob.sync('LICEN{S,C}E{.md,}', {
          cwd: path.dirname(localPackageJsonPath),
          absolute: true,
          nocase: true,
          nodir: true,
          ignore: '**/{__tests__,__fixtures__,__mocks__}/**',
        });

        acc[dependency] = {
          author: parseAuthorField(localPackageJson),
          content: licenseFiles?.[0] ? fs.readFileSync(licenseFiles[0], { encoding: 'utf-8' }) : undefined,
          description: localPackageJson.description,
          type: parseLicenseField(localPackageJson),
          url: parseRepositoryFieldToUrl(localPackageJson),
          version: localPackageJson.version,
        };
      } catch (error) {
        console.warn(`[react-native-legal] could not process package.json for ${dependency}`);
      }

      return acc;
    },
    {} as Record<string, LicenseObj>,
  );
}

function needsQuoting(value: string) {
  return (
    value === '' || // empty string
    /^[#:>|-]/.test(value) || // starts with special char
    /^['"{}[\],&*#?|<>=!%@`]/.test(value) || // starts with indicator chars
    /^[\s]|[\s]$/.test(value) || // has leading/trailing whitespace
    /^[\d.+-]/.test(value) || // looks like a number/bool/null
    /[\n"'\\\s]/.test(value) || // contains newlines, quotes, backslash, or spaces
    /^(true|false|yes|no|null|on|off)$/i.test(value) // is a YAML keyword
  );
}

function formatYamlKey(key: string) {
  return /[@/_.]/.test(key) ? `"${key}"` : key;
}

function formatYamlValue(value: string, indent: number) {
  if (value.includes('\n')) {
    const indentedValue = value
      .split('\n')
      .map((line) => `${' '.repeat(indent)}${line}`)
      .join('\n');

    // Return the block indicator on the same line as the content
    return `|${indentedValue ? '\n' + indentedValue : ''}`;
  }

  if (needsQuoting(value)) {
    if (value.includes("'") && !value.includes('"')) {
      return `"${value.replace(/["\\]/g, '\\$&')}"`;
    }

    return `'${value.replace(/'/g, "''")}'`;
  }

  return value;
}

function toYaml(obj: unknown, indent = 0): string {
  const spaces = ' '.repeat(indent);

  if (obj == null) return '';

  if (Array.isArray(obj)) {
    return obj.map((item) => `${spaces}- ${toYaml(item, indent + 2).trimStart()}`).join('\n');
  }

  if (typeof obj === 'object') {
    return Object.entries(obj)
      .filter(([, v]) => v != null)
      .map(([key, value]) => {
        const formattedKey = formatYamlKey(key);
        const formattedValue = toYaml(value, indent + 2);

        if (Array.isArray(value)) {
          return `${spaces}${formattedKey}:\n${formattedValue}`;
        }

        if (typeof value === 'object' && value !== null) {
          return `${spaces}${formattedKey}:\n${formattedValue}`;
        }

        if (typeof value === 'string' && value.includes('\n')) {
          return `${spaces}${formattedKey}: ${formattedValue}`;
        }

        return `${spaces}${formattedKey}: ${formattedValue}`;
      })
      .join('\n');
  }

  return typeof obj === 'string' ? formatYamlValue(obj, indent) : String(obj);
}

/**
 * Generates LicensePlist-compatible metadata for NPM dependencies
 *
 * This will take scanned NPM licenses and produce following output inside iOS project's directory:
 *
 * | - ios
 * | ---- myawesomeapp
 * | ---- myawesomeapp.xcodeproj
 * | ---- myawesomeapp.xcodeworkspace
 * | ---- license_plist.yml <--- generated LicensePlist config with NPM dependencies
 * | ---- Podfile
 * | ---- Podfile.lock
 */
export function generateLicensePlistNPMOutput(licenses: Record<string, LicenseObj>, iosProjectPath: string) {
  const renames: Record<string, string> = {};
  const licenseEntries = Object.entries(licenses).map(([dependency, licenseObj]) => {
    const normalizedName = normalizePackageName(dependency);

    if (dependency !== normalizedName) {
      renames[normalizedName] = dependency;
    }

    return {
      name: normalizedName,
      version: licenseObj.version,
      ...(licenseObj.url && { source: licenseObj.url }),
      body: licenseObj.content ?? licenseObj.type ?? 'UNKNOWN',
    } as LicensePlistPayload;
  });

  const yamlDoc = {
    ...(Object.keys(renames).length > 0 && { rename: renames }),
    manual: licenseEntries,
  };

  const yamlContent = [
    '# BEGIN Generated NPM license entries',
    toYaml(yamlDoc),
    '# END Generated NPM license entries',
  ].join('\n');

  fs.writeFileSync(path.join(iosProjectPath, 'license_plist.yml'), yamlContent, { encoding: 'utf-8' });
}

/**
 * Generates AboutLibraries-compatible metadata for NPM dependencies
 *
 * This will take scanned NPM licenses and produce following output inside android project's directory:
 *
 * | - android
 * | ---- app
 * | ---- config <--- generated AboutLibraries config directory
 * | ------- libraries <--- generated directory with JSON files list of NPM dependencies
 * | ------- licenses <--- generated directory with JSON files list of used licenses
 * | ---- build.gradle
 * | ---- settings.gradle
 */
export function generateAboutLibrariesNPMOutput(licenses: Record<string, LicenseObj>, androidProjectPath: string) {
  const aboutLibrariesConfigDirPath = path.join(androidProjectPath, 'config');
  const aboutLibrariesConfigLibrariesDirPath = path.join(aboutLibrariesConfigDirPath, 'libraries');
  const aboutLibrariesConfigLicensesDirPath = path.join(aboutLibrariesConfigDirPath, 'licenses');

  if (!fs.existsSync(aboutLibrariesConfigDirPath)) {
    fs.mkdirSync(aboutLibrariesConfigDirPath);
  }

  if (!fs.existsSync(aboutLibrariesConfigLibrariesDirPath)) {
    fs.mkdirSync(aboutLibrariesConfigLibrariesDirPath);
  }

  if (!fs.existsSync(aboutLibrariesConfigLicensesDirPath)) {
    fs.mkdirSync(aboutLibrariesConfigLicensesDirPath);
  }

  Object.entries(licenses)
    .map(([dependency, licenseObj]) => {
      return {
        artifactVersion: licenseObj.version,
        content: licenseObj.content ?? '',
        description: licenseObj.description ?? '',
        developers: [{ name: licenseObj.author ?? '', organisationUrl: '' }],
        licenses: [prepareAboutLibrariesLicenseField(licenseObj)],
        name: dependency,
        tag: '',
        type: licenseObj.type,
        uniqueId: normalizePackageName(dependency),
      };
    })
    .map((jsonPayload) => {
      const libraryJsonPayload: AboutLibrariesLibraryJsonPayload = {
        artifactVersion: jsonPayload.artifactVersion,
        description: jsonPayload.description,
        developers: jsonPayload.developers,
        licenses: jsonPayload.licenses,
        name: jsonPayload.name,
        tag: jsonPayload.tag,
        uniqueId: jsonPayload.uniqueId,
      };
      const licenseJsonPayload: AboutLibrariesLicenseJsonPayload = {
        content: jsonPayload.content,
        hash: jsonPayload.licenses[0],
        name: jsonPayload.type ?? '',
        url: '',
      };
      const libraryJsonFilePath = path.join(
        aboutLibrariesConfigLibrariesDirPath,
        `${normalizePackageName(jsonPayload.name)}.json`,
      );
      const licenseJsonFilePath = path.join(aboutLibrariesConfigLicensesDirPath, `${licenseJsonPayload.hash}.json`);

      fs.writeFileSync(libraryJsonFilePath, JSON.stringify(libraryJsonPayload));

      if (!fs.existsSync(licenseJsonFilePath)) {
        fs.writeFileSync(licenseJsonFilePath, JSON.stringify(licenseJsonPayload));
      }
    });
}

function prepareAboutLibrariesLicenseField(license: LicenseObj) {
  if (!license.type) {
    return '';
  }

  return `${license.type}_${sha512(license.content ?? license.type)}`;
}

function sha512(text: string) {
  return crypto.createHash('sha512').update(text).digest('hex');
}

function parseAuthorField(json: { author: string | { name: string } }) {
  if (typeof json.author === 'object' && typeof json.author.name === 'string') {
    return json.author.name;
  }

  if (typeof json.author === 'string') {
    return json.author;
  }
}

function parseLicenseField(json: { license: string | { type: string } }) {
  if (typeof json.license === 'object' && typeof json.license.type === 'string') {
    return json.license.type;
  }

  if (typeof json.license === 'string') {
    return json.license;
  }
}

function parseRepositoryFieldToUrl(json: { repository: string | { url?: string } }) {
  if (typeof json.repository === 'object' && typeof json.repository.url === 'string') {
    return normalizeRepositoryUrl(json.repository.url);
  }

  if (typeof json.repository === 'string') {
    return normalizeRepositoryUrl(json.repository);
  }
}

function normalizeRepositoryUrl(url: string) {
  return url
    .replace('git+ssh://git@', 'git://')
    .replace('.git', '')
    .replace('git+https://github.com', 'https://github.com')
    .replace('.git', '')
    .replace('git://github.com', 'https://github.com')
    .replace('.git', '')
    .replace('git@github.com:', 'https://github.com/')
    .replace('.git', '')
    .replace('github:', 'https://github.com/')
    .replace('.git', '');
}

function getPackageJsonPath(dependency: string) {
  try {
    return require.resolve(`${dependency}/package.json`);
  } catch (error) {
    return resolvePackageJsonFromEntry(dependency);
  }
}

function resolvePackageJsonFromEntry(dependency: string) {
  try {
    const entryPath = require.resolve(dependency);
    const packageDir = findPackageRoot(entryPath);

    if (!packageDir) return null;

    const packageJsonPath = path.join(packageDir, 'package.json');

    return fs.existsSync(packageJsonPath) ? packageJsonPath : null;
  } catch {
    return null;
  }
}

function findPackageRoot(entryPath: string) {
  let currentDir = path.dirname(entryPath);
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) return currentDir;
    currentDir = path.dirname(currentDir);
  }
}

function normalizePackageName(packageName: string): string {
  return packageName.replace('/', '_');
}

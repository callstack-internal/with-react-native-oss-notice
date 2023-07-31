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
  developers: { name: string, organisationUrl: string }[];
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

  return entriesA.length === entriesB.length && entriesA.map(
    ([ keyA, valueA ]) => {
      const entry = entriesB.find(([ keyB ]) => keyA === keyB);

      if (!entry) {
        return valueA === entry;
      }

      const [ , valueB ] = entry;

      return compareObjects(valueA, valueB);
    })
    .reduce((acc, curr) => acc && curr, true);
}

export function arrayIncludesObject(array?: unknown[], object?: unknown) {
  return array
    ?.map((item) => compareObjects(item, object))
    .reduce((acc, curr) => acc || curr, false);
}

export function scanDependencies(appPackageJsonPath: string) {
  const appPackageJson = require(path.resolve(appPackageJsonPath));
  const dependencies: Record<string, string> = appPackageJson.dependencies;

  return Object.keys(dependencies).reduce((acc, dependency) => {
    const localPackageJsonPath = require.resolve(`${dependency}/package.json`);
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

    return acc;
  }, {} as Record<string, LicenseObj>);
}

export function generateLicensePlistNPMOutput(licenses: Record<string, LicenseObj>, iosProjectPath: string) {
  const librariesPayload = Object.entries(licenses).map(([ dependency, licenseObj ]) => {
    return {
      source: licenseObj.url,
      name: dependency,
      version: licenseObj.version,
      body: licenseObj.content ?? licenseObj.type ?? 'UNKNOWN',
    } as LicensePlistPayload;
  }).reduce((acc, yamlPayload) => {
    return acc + `  - name: ${yamlPayload.name}
    version: ${yamlPayload.version}
${yamlPayload.source ? `    source: ${yamlPayload.source}\n` : ''}    body: |-\n      ${yamlPayload.body.split('\n').join('\n      ')}\n`;
  }, 'manual:\n# BEGIN Generated NPM license entries\n').concat('# END Generated NPM license entries\n');

  fs.writeFileSync(path.join(iosProjectPath, 'license_plist.yml'), librariesPayload, { encoding: 'utf-8' });
}

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

  Object.entries(licenses).map(([ dependency, licenseObj ]) => {
    return {
      artifactVersion: licenseObj.version,
      content: licenseObj.content ?? '',
      description: licenseObj.description ?? '',
      developers: [{ name: licenseObj.author ?? '', organisationUrl: '' }],
      licenses: [ prepareAboutLibrariesLicenseField(licenseObj) ],
      name: dependency,
      tag: '',
      type: licenseObj.type,
      uniqueId: dependency.replace('/', '_'),
    };
  }).map((jsonPayload) => {
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
    const libraryJsonFilePath = path.join(aboutLibrariesConfigLibrariesDirPath, `${jsonPayload.name}.json`);
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
  return url.replace('git+ssh://git@', 'git://')
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

import path from 'path';

import xcode from 'xcode';

const glob = require('glob');

const ignoredPaths = ['**/@(Carthage|Pods|vendor|node_modules)/**'];

export function getApplicationNativeTarget(iosProjectPath: string) {
  return getIOSPbxProj(iosProjectPath).pbxproj.getTarget('com.apple.product-type.application');
}

export function getIOSProjectName(iosProjectPath: string) {
  const [appDelegatePath] = glob.sync('*/AppDelegate.@(m|mm|swift)', {
    cwd: iosProjectPath,
    absolute: true,
    nocase: true,
    nodir: true,
    ignore: ignoredPaths,
  });

  return path.basename(path.dirname(appDelegatePath));
}

export function getIOSPbxProj(iosProjectPath: string) {
  const [xcodeprojPath] = glob.sync('*.xcodeproj', {
    cwd: iosProjectPath,
    absolute: true,
    nocase: true,
    nodir: false,
    ignore: ignoredPaths,
  });
  const pbxprojPath = path.join(xcodeprojPath, 'project.pbxproj');
  const pbxproj = xcode.project(pbxprojPath);

  pbxproj.parseSync();
  return { pbxproj, pbxprojPath };
}

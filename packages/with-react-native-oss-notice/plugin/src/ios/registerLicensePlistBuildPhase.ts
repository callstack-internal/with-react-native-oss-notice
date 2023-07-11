import type { ExpoConfig } from 'expo/config';
import { IOSConfig, withXcodeProject } from 'expo/config-plugins';
import { GENERATE_LICENSE_PLIST_BUILD_PHASE_COMMENT } from './licensePlistConstants';

export function registerLicensePlistBuildPhase(config: ExpoConfig): ExpoConfig {
  return withXcodeProject(config, (exportedConfig) => {
    const projectName = IOSConfig.XcodeUtils.getProjectName(exportedConfig.modRequest.projectRoot);
    const projectTargetId = IOSConfig.XcodeUtils.getApplicationNativeTarget({
      project: exportedConfig.modResults,
      projectName,
    }).uuid;

    /**
     * The tricky logic starts here, as there's no direct expo config plugin helper to add build phase.
     * 
     * So instead, let's interact directly with `XcodeProject` instance from `xcode` library.
     * The build phase will generate licenses metadata using `LicensePlist` library and store it inside `Settings.bundle`.
     * 
     * This will return an object with the uuid of the newly created build phase and its associated comment.
     */
    const newBuildPhase = exportedConfig.modResults.addBuildPhase(
      [],
      'PBXShellScriptBuildPhase',
      GENERATE_LICENSE_PLIST_BUILD_PHASE_COMMENT,
      projectTargetId,
      {
        shellPath: '/bin/sh',
        shellScript: '${PODS_ROOT}/LicensePlist/license-plist --output-path ./Settings.bundle',
      },
    );

    /**
     * In order to correctly link all metadata from `Settings.bundle` to the app
     * the newly created build phase has to be invoked before `Copy Bundle Resources` build phase.
     * 
     * To make sure that happens, let's put newly created build phase as a first in the sequence.
     * It can be done by overriding `PBXNativeTarget["buildPhases"]` array.
     */
    const nativeTargetSection = exportedConfig.modResults.pbxNativeTargetSection();
    const newBuildPhasesInNativeTarget = [
      { value: newBuildPhase.uuid, comment: GENERATE_LICENSE_PLIST_BUILD_PHASE_COMMENT }
    ].concat(
      nativeTargetSection[projectTargetId]
        .buildPhases
        .filter(({ value }: { value: string }) => value !== newBuildPhase.uuid)
    );

    exportedConfig.modResults.hash.project.objects['PBXNativeTarget'][projectTargetId].buildPhases = newBuildPhasesInNativeTarget;

    return exportedConfig;
  });
}

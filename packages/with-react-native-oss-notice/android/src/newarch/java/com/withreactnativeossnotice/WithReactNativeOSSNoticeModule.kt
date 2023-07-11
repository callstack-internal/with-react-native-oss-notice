package com.withreactnativeossnotice

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = WithReactNativeOSSNoticeModule.NAME)
class WithReactNativeOSSNoticeModule(
    reactContext: ReactApplicationContext
) : NativeWithReactNativeOSSNoticeSpec(reactContext) {
    override fun getName() = NAME

    override fun launchLicenseListScreen(licenseHeaderText: String) {
        launchLicenseListScreen(reactApplicationContext, licenseHeaderText)
    }

    companion object {
        const val NAME = WithReactNativeOSSNoticeModuleImpl.NAME
    }
}

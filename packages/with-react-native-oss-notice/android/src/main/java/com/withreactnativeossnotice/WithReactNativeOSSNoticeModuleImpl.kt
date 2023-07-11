package com.withreactnativeossnotice

import com.facebook.react.bridge.ReactApplicationContext
import com.mikepenz.aboutlibraries.LibsBuilder

object WithReactNativeOSSNoticeModuleImpl {
    const val NAME = "WithReactNativeOSSNotice"

    fun launchLicenseListScreen(reactContext: ReactApplicationContext, licenseHeaderText: String) {
        val intent = LibsBuilder().withActivityTitle(licenseHeaderText).intent(reactContext)
        reactContext.currentActivity?.startActivity(intent)
    }
}

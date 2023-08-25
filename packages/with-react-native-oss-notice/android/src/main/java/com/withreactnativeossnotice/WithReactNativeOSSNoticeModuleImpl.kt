package com.withreactnativeossnotice

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.mikepenz.aboutlibraries.LibsBuilder

object WithReactNativeOSSNoticeModuleImpl {
    const val NAME = "WithReactNativeOSSNoticeModule"

    fun launchLicenseListScreen(reactContext: ReactApplicationContext, licenseHeaderText: String) {
        val context = reactContext.currentActivity ?: return
        val intent = Intent(context, WithReactNativeOSSNoticeActivity::class.java).apply {
            this.putExtra("data", LibsBuilder())
            this.putExtra(LibsBuilder.BUNDLE_TITLE, licenseHeaderText)
        }

        context.startActivity(intent)
    }
}

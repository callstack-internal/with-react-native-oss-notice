package com.reactnativelegal

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.turbomodule.core.interfaces.TurboModule

class ReactNativeLegalTurboPackage: TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return when (name) {
            ReactNativeLegalModule.NAME -> ReactNativeLegalModule(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        val moduleList: Array<Class<out NativeModule?>> = arrayOf(
            ReactNativeLegalModule::class.java
        )
        val reactModuleInfoMap: MutableMap<String, ReactModuleInfo> = HashMap()
        for (moduleClass in moduleList) {
            val reactModule = moduleClass.getAnnotation(ReactModule::class.java) ?: continue
            reactModuleInfoMap[reactModule.name] =
                ReactModuleInfo(
                    reactModule.name,
                    moduleClass.name,
                    true,
                    reactModule.needsEagerInit,
                    reactModule.isCxxModule,
                    TurboModule::class.java.isAssignableFrom(moduleClass)
                )
        }
        return ReactModuleInfoProvider { reactModuleInfoMap }
    }
}

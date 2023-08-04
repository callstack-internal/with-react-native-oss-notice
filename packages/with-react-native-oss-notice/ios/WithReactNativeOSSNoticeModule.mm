#import "WithReactNativeOSSNoticeModule.h"

#import "WithReactNativeOSSNotice-Swift.h"

#if RCT_NEW_ARCH_ENABLED
#import "WithReactNativeOSSNotice.h"

@interface WithReactNativeOSSNoticeModule () <NativeWithReactNativeOSSNoticeSpec>
@end
#endif

@implementation WithReactNativeOSSNoticeModule

RCT_EXPORT_MODULE(WithReactNativeOSSNoticeModule)

RCT_EXPORT_METHOD(launchLicenseListScreen : (NSString *)licenseHeaderText)
{
    [WithReactNativeOSSNoticeModuleImpl launchLicenseListScreenWithLicenseHeaderText:licenseHeaderText];
}

#if RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeWithReactNativeOSSNoticeSpecJSI>(params);
}
#endif

@end

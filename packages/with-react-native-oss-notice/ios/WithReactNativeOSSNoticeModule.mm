#import "WithReactNativeOSSNoticeModule.h"

#import "WithReactNativeOSSNotice-Swift.h"

#if RCT_NEW_ARCH_ENABLED
#import "WithReactNativeOSSNotice.h"

@interface WithReactNativeOSSNoticeModule () <NativeWithReactNativeOSSNoticeModuleSpec>
@end
#endif

@implementation WithReactNativeOSSNoticeModule

RCT_EXPORT_MODULE(WithReactNativeOSSNotice)

RCT_EXPORT_METHOD(launchLicenseListScreen : (NSString *)licenseHeaderText)
{
    [WithReactNativeOSSNoticeModuleImpl launchLicenseListScreenWithLicenseHeaderText:licenseHeaderText];
}

#if RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeWithReactNativeOSSNoticeModuleSpecJSI>(params);
}
#endif

@end

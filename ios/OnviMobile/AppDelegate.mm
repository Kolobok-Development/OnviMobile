#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNBranch/RNBranch.h>

// Объявление интерфейса для Swift-класса
@interface YooKassaDeepLinkHandler : NSObject
+ (BOOL)handleOpenWithUrl:(NSURL *)url sourceApplication:(NSString *)sourceApplication;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  [FIRApp configure];
  
  self.moduleName = @"OnviMobile";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#pragma mark - Deep Linking

// Обработка URL Schemes (iOS 9+)
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  NSString *sourceApplication = options[UIApplicationOpenURLOptionsSourceApplicationKey];
  
  // Обработка YooKassa через Swift-класс
  if ([YooKassaDeepLinkHandler handleOpenWithUrl:url sourceApplication:sourceApplication]) {
    return YES;
  }
  
  if ([RNBranch application:app openURL:url options:options]) {
    return YES;
  }
  
  return [RCTLinkingManager application:app openURL:url options:options];
}

// Обработка Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  if ([RNBranch continueUserActivity:userActivity]) {
    return YES;
  }
  
  return [RCTLinkingManager application:application
                              continueUserActivity:userActivity
                                restorationHandler:restorationHandler];
}

@end

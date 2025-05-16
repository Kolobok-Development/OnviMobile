#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNBranch/RNBranch.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // Инициализация Branch
  [FIRApp configure]; // Инициализация Firebase
  
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
  [RNBranch application:app openURL:url options:options]; // Branch
  return [RCTLinkingManager application:app openURL:url options:options]; // React Native
}

// Обработка URL Schemes (iOS 8-)
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation 
{
  [RNBranch application:application openURL:url sourceApplication:sourceApplication annotation:annotation]; // Branch
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation]; // React Native
}

// Обработка Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler 
{
  // 1. Сначала Branch обрабатывает ссылку
  BOOL handledByBranch = [RNBranch continueUserActivity:userActivity];
  
  // 2. Затем React Native
  BOOL handledByRN = [RCTLinkingManager application:application 
                              continueUserActivity:userActivity 
                                restorationHandler:restorationHandler];
  
  return handledByBranch || handledByRN;
}

@end
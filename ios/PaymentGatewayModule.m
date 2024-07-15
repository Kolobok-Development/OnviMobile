//
//  PaymentGatewayModule.m
//  OnviMobile
//
//  Created by Evgeniy Shomin on 2024-04-29.
//

#import "PaymentGatewayModule-Bridging-Header.h"
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PaymentGatewayModule, RCTViewManager);

RCT_EXTERN_METHOD(startTokenize:(NSDictionary *)params
                  callbacker:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(confirmPayment:(NSDictionary *)params
                  callbacker:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(dismiss)

@end

package com.onvimobile;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.onvimobile.settings.Settings;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.HashSet;
import java.util.Set;

import ru.yoomoney.sdk.kassa.payments.Checkout;
import ru.yoomoney.sdk.kassa.payments.TokenizationResult;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.Amount;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.GooglePayCardNetwork;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.GooglePayParameters;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.MockConfiguration;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentMethodType;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentParameters;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.SavePaymentMethod;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.TestParameters;
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.UiParameters;
import ru.yoomoney.sdk.kassa.payments.ui.color.ColorScheme;

public class PaymentGatewayModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final int REQUEST_CODE_TOKENIZE = 33;
    private static final int REQUEST_CODE_3DSECURE = 35;
    private Callback paymentCallback;
    PaymentGatewayModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        reactContext.addActivityEventListener(mActivityEventListener);

    }

    @NonNull
    @Override
    public String getName() {
        return "YooKassaPaymentGateway";
    }

    @ReactMethod
    public void startTokenize(ReadableMap payload, Callback callback) {
        final Settings settings = new Settings(this.reactContext);
        UiParameters uiParameters = new UiParameters(true, new ColorScheme(Color.rgb(191, 250, 0)));
        this.paymentCallback = callback;

        Activity currentActivity = getCurrentActivity();

        //Getting data
        String clientApplicationKey = payload.getString("clientApplicationKey");
        String shopId = String.valueOf(payload.getString("shopId"));
        String title = payload.getString("title");
        String subtitle = payload.getString("subtitle");
        String amount = String.valueOf(payload.getDouble("price"));

        ReadableArray paymentTypes = payload.hasKey("paymentMethodTypes") ? payload.getArray("paymentMethodTypes") : null;
        String authCenterClientId = payload.hasKey("authCenterClientId") ? payload.getString("authCenterClientId") : null;
        String userPhoneNumber = payload.hasKey("userPhoneNumber") ? payload.getString("userPhoneNumber") : null;
        String gatewayId = payload.hasKey("gatewayId") ? payload.getString("gatewayId") : null;
        String returnUrl = payload.hasKey("returnUrl") ? payload.getString("returnUrl") : null;
        String customerId = payload.hasKey("customerId") ? payload.getString("customerId") : null;
        ReadableArray googlePaymentTypes = payload.hasKey("googlePaymentMethodTypes") ? payload.getArray("googlePaymentMethodTypes") : null;

        Boolean isDebug = payload.hasKey("isDebug") ? Boolean.valueOf(payload.getBoolean("isDebug")) : false;

        final Set<PaymentMethodType> paymentMethodTypes = getPaymentMethodTypes(paymentTypes, authCenterClientId != null);
        final Set<GooglePayCardNetwork> googlePaymentMethodTypes = getGooglePaymentMethodTypes(googlePaymentTypes);

        PaymentParameters paymentParameters = new PaymentParameters(
                new Amount(new BigDecimal(amount), Currency.getInstance("RUB")),
                title,
                subtitle,
                clientApplicationKey,
                shopId,
                SavePaymentMethod.OFF,
                paymentMethodTypes,
                gatewayId,
                returnUrl,
                userPhoneNumber,
                new GooglePayParameters(googlePaymentMethodTypes),
                authCenterClientId,
                customerId
        );



        try {
            TestParameters testParameters = new TestParameters(true, true,
                    new MockConfiguration(false, true, 5, new Amount(BigDecimal.TEN, Currency.getInstance("RUB"))));
            Intent intent = isDebug ?
                    Checkout.createTokenizeIntent(this.reactContext, paymentParameters, testParameters) :
                    Checkout.createTokenizeIntent(this.reactContext, paymentParameters);
            Log.d("PaymentLog", "Started payment activity");
            Log.d("PaymentLog", paymentParameters.toString());
            getCurrentActivity().startActivityForResult(intent, REQUEST_CODE_TOKENIZE);
        }catch (Exception e){
            Log.d("PaymentLog", "Launch error " + e);
            WritableMap response = new WritableNativeMap();
            response.putString("code", "ERROR_UNKNOWN");
            response.putString("message", e.toString());
            paymentCallback.invoke(false, response);

        }

    }

    @ReactMethod
    public void confirmPayment(ReadableMap payload, Callback callback) {
            this.paymentCallback = callback;

            String confirmationUrl = payload.getString("confirmationUrl");
            String _paymentMethodType = String.valueOf(payload.getString("paymentMethodType"));
            PaymentMethodType paymentMethodType = PaymentMethodType.valueOf(_paymentMethodType.toUpperCase());

            Intent intent = Checkout.createConfirmationIntent(this.reactContext, confirmationUrl, paymentMethodType);

            Activity activity = getCurrentActivity();

            if (activity == null) {
                WritableMap response = new WritableNativeMap();
                response.putString("code", "ERROR_UNKNOWN");
                response.putString("message", "Payment confirmation error.");
                paymentCallback.invoke(false, response );
                return;
            }

            activity.startActivityForResult(intent, REQUEST_CODE_3DSECURE);

    }

    @ReactMethod
    public void dismiss() {
        return;
    }

    @NonNull
    private static Set<PaymentMethodType> getPaymentMethodTypes(ReadableArray paymentTypes, Boolean authCenterClientIdProvided) {
        final Set<PaymentMethodType> paymentMethodTypes = new HashSet<>();

        if (paymentTypes == null) {
            paymentMethodTypes.add(PaymentMethodType.BANK_CARD);
            paymentMethodTypes.add(PaymentMethodType.SBERBANK);
            paymentMethodTypes.add(PaymentMethodType.GOOGLE_PAY);

            if (authCenterClientIdProvided) {
                paymentMethodTypes.add(PaymentMethodType.YOO_MONEY);
            }
        } else {
            for (int i = 0; i < paymentTypes.size(); i++) {
                String upperType = paymentTypes.getString(i).toUpperCase();
                switch (upperType) {
                    case "BANK_CARD":
                        paymentMethodTypes.add(PaymentMethodType.BANK_CARD);
                        break;
                    case "SBERBANK":
                        paymentMethodTypes.add(PaymentMethodType.SBERBANK);
                        break;
                    case "GOOGLE_PAY":
                        paymentMethodTypes.add(PaymentMethodType.GOOGLE_PAY);
                        break;
                    case "YOO_MONEY":
                        if (authCenterClientIdProvided) {
                            paymentMethodTypes.add(PaymentMethodType.YOO_MONEY);
                        }
                        break;
                }
            }
        }

        return paymentMethodTypes;
    }

    @NonNull
    private static Set<GooglePayCardNetwork> getGooglePaymentMethodTypes(ReadableArray googlePaymentTypes) {
        final Set<GooglePayCardNetwork> googlePaymentMethodTypes = new HashSet<>();

        if (googlePaymentTypes == null) {
            googlePaymentMethodTypes.add(GooglePayCardNetwork.AMEX);
            googlePaymentMethodTypes.add(GooglePayCardNetwork.DISCOVER);
            googlePaymentMethodTypes.add(GooglePayCardNetwork.JCB);
            googlePaymentMethodTypes.add(GooglePayCardNetwork.MASTERCARD);
            googlePaymentMethodTypes.add(GooglePayCardNetwork.VISA);
            googlePaymentMethodTypes.add(GooglePayCardNetwork.INTERAC);
            googlePaymentMethodTypes.add(GooglePayCardNetwork.OTHER);
        } else {
            for (int i = 0; i < googlePaymentTypes.size(); i++) {
                String upperType = googlePaymentTypes.getString(i).toUpperCase();
                switch (upperType) {
                    case "AMEX":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.AMEX);
                        break;
                    case "DISCOVER":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.DISCOVER);
                        break;
                    case "JCB":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.JCB);
                        break;
                    case "MASTERCARD":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.MASTERCARD);
                        break;
                    case "VISA":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.VISA);
                        break;
                    case "INTERAC":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.INTERAC);
                        break;
                    case "OTHER":
                        googlePaymentMethodTypes.add(GooglePayCardNetwork.OTHER);
                        break;
                }
            }
        }

        return googlePaymentMethodTypes;
    }


    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == REQUEST_CODE_TOKENIZE) {
                switch (resultCode){
                    case Activity.RESULT_OK:
                        final TokenizationResult result = Checkout.createTokenizationResult(data);
                        String token = result.getPaymentToken();
                        String type = result.getPaymentMethodType().name().toLowerCase();
                        WritableMap payload = new WritableNativeMap();
                        payload.putString("token", token);
                        payload.putString("paymentMethodType", type);
                        paymentCallback.invoke(payload);
                        break;
                    case Activity.RESULT_CANCELED:
                        Log.d("PaymentLog", "RESULT CANACELED SENDING CALLBACK");
                        WritableMap response = new WritableNativeMap();
                        response.putString("code", "ERROR_PAYMENT_CANCELLED");
                        response.putString("message", "Payment Canceled");
                        paymentCallback.invoke(null, response);
                        break;

                }
            }


            if (requestCode == REQUEST_CODE_3DSECURE) {
                    switch (resultCode) {
                        case Activity.RESULT_OK:
                            WritableMap payload = new WritableNativeMap();
                            payload.putString("message", "verified");
                            paymentCallback.invoke(payload);
                            break;
                        case Activity.RESULT_CANCELED:
                            WritableMap response = new WritableNativeMap();
                            response.putString("code", "ERROR_PAYMENT_CANCELLED");
                            response.putString("message", "Verification Canceled");
                            paymentCallback.invoke(null, response);
                            break;
                    }
            }
        }
    };

}

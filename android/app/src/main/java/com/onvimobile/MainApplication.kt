package com.onvimobile

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

import io.branch.rnbranch.*

class MainApplication : Application(), ReactApplication {

   override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              add(PaymentGatewayPackage())
            },
    )
  }

  override fun onCreate() {
    super.onCreate()
    RNBranchModule.getAutoInstance(this)
    RNBranchModule.enableLogging();
    loadReactNative(this)
  }
}

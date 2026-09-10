package com.docop.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onBackPressed() {
        // Let Android's Back gesture replay the in-app page history first.
        // The default system behaviour is preserved when Home is the only page.
        if (bridge != null && bridge.getWebView() != null && bridge.getWebView().canGoBack()) {
            bridge.getWebView().goBack();
            return;
        }
        super.onBackPressed();
    }
}

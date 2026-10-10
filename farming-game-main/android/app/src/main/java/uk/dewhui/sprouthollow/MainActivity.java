package uk.dewhui.sprouthollow;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // The web layer reads palette ink for the splash screen and the letterbox.
        // It must be set before the WebView is created so the very first frame
        // already wears the game's colour, not the framework white.
        getWindow().setStatusBarColor(0xFF1B1A24);
        getWindow().setNavigationBarColor(0xFF1B1A24);
        super.onCreate(savedInstanceState);
    }
}
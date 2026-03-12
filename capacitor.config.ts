import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.tarotiav2',
  appName: 'Tarot y Rituales Gratis MFF',
  webDir: 'www',
  plugins: {
    EdgeToEdge: {
      backgroundColor: "#FFFFFF" // fondo de status/navigation bar (cámbialo si tu app es oscura)
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 1500,
      backgroundColor: "#ffffffff",
      androidScaleType: "CENTER_CROP",
    },
  }
};

export default config;

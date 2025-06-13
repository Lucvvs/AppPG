import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'AppPG',
  webDir: 'www',
  server: {
    url: 'http://192.168.100.9:8100',
    cleartext: true
  }
};

export default config;
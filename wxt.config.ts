import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  runner: {
    openDevtools: true,
    openConsole: true,
  },
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
  },
});

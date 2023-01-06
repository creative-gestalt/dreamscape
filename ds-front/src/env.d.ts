/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_BASE_URL: string;
  readonly VITE_SERVER_ADDRESS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

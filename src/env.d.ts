/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_SUBTITLE: string
  readonly VITE_APP_COMPANY: string
  readonly VITE_APP_COPYRIGHT_START_YEAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SPOTIFY_AUTH_KEY: string;
  readonly SPOTIFY_REFRESH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="@rsbuild/core/types" />

declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

interface ImportMetaEnv {
  PUBLIC_ENVIRONMENT: string;
  PUBLIC_API_URL: string;
  PUBLIC_ENABLE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

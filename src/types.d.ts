import { ReactNode } from "react";

declare namespace Overlays {
  export interface Renderer {
    render(content: ReactNode): void;
    destroy(): void;
  }
  export type ContentPayload = {
    createRenderer(key: string, scope?: string): Renderer;
  };
  export type RootPayload = {
    renderContent(scope?: string): ReactNode[];
  };
  export type ContentValue = () => ContentPayload;
  export type RootValue = () => RootPayload;
}

export = Overlays;
export as namespace Overlays;
declare module "overlays" {
  export = Overlays;
}

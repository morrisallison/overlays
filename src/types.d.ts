import { ReactElement } from "react";
import type { OverlaysManager } from "./OverlaysManager";

declare namespace Overlays {
  export interface OverlayRootProps {
    scope?: string;
  }
  export interface OverlayProps {
    children?: ReactElement | null;
    id: string;
    scope?: string;
  }
  export type OverlaysContextValue = () => OverlaysManager;
}

export = Overlays;
export as namespace Overlays;
declare module "overlays" {
  export = Overlays;
}

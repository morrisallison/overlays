import { ReactElement } from "react";
import type { OverlaysManager } from "./OverlaysManager";

export interface OverlayRootProps {
  scope?: string;
}

export interface OverlayProps {
  children?: ReactElement | null;
  id: string;
  scope?: string;
}

export type OverlaysContextValue = () => OverlaysManager;

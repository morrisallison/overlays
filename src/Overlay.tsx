import { useOverlaysContext } from "./context";
import { OverlayProps } from "./types";

export function Overlay(props: OverlayProps) {
  return useOverlaysContext().useRenderOverlay(props);
}

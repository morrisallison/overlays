import { useOverlaysContext } from "./context";
import { OverlayProps } from "./types";

export function Overlay(props: OverlayProps) {
  useOverlaysContext().useUpdateOverlay(props);

  return null;
}

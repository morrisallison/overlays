import { useOverlaysContext } from "./context";
import { OverlayRootProps } from "./types";

export function OverlayRoot(props: OverlayRootProps) {
  return useOverlaysContext().useRenderRoot(props);
}

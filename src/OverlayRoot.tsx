import { memo } from "react";
import { useOverlaysContext } from "./context";
import { OverlayRootProps } from "./types";

export const OverlayRoot = memo(function OverlayRoot(props: OverlayRootProps) {
  return useOverlaysContext().useRenderRoot(props);
});

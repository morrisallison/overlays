import { memo } from "react";
import { useOverlaysContext } from "./context";
import { OverlayProps } from "./types";

export const Overlay = memo(function Overlay(props: OverlayProps) {
  useOverlaysContext().useUpdateOverlay(props);

  return null;
});

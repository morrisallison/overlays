import React, { memo, ReactNode, useCallback, useMemo } from "react";

import { OverlaysContext } from "./context";
import { OverlaysManager } from "./OverlaysManager";

export const OverlayProvider = memo(function OverlayProvider(props: {
  children: ReactNode;
}) {
  const manager = useMemo(() => new OverlaysManager(), []);
  const value = useCallback(() => manager, [manager]);

  return (
    <OverlaysContext.Provider value={value}>
      {props.children}
    </OverlaysContext.Provider>
  );
});

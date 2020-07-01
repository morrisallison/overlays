import React, { useContext, useMemo } from "react";

import { RootContext } from "./context";

type Props = {
  scope?: string;
};

export function OverlayRoot(props: Props) {
  const { scope } = props;
  const rootContext = useContext(RootContext);
  const overlays = useMemo(() => rootContext().renderContent(scope), [
    rootContext,
    scope
  ]);

  return <>{overlays}</>;
}

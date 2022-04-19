import { ReactNode, useCallback, useEffect, useState } from "react";
import { OverlayProps, OverlayRootProps } from "./types";

const DEFAULT_SCOPE = "@@OVERLAYS";

type OverlayId = string;
type Scope = string;
type Content = Map<OverlayId, ReactNode>;

function useForceUpdate() {
  const setValue = useState(true)[1];

  return useCallback(() => setValue((value) => !value), [setValue]);
}

export class OverlaysManager {
  private rootUpdateHandlers = new Map<Scope, () => void>();

  private content = new Map<Scope, Content | void>();

  public useRenderOverlay({
    children,
    id,
    scope = DEFAULT_SCOPE,
  }: OverlayProps): ReactNode {
    this.updateOverlay({ children, id, scope });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      return () => {
        this.removeOverlay(scope, id);
      };
    }, [id, scope]);

    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  public useRenderRoot({ scope = DEFAULT_SCOPE }: OverlayRootProps): ReactNode {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const forceUpdate = useForceUpdate();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      this.rootUpdateHandlers.set(scope, forceUpdate);

      return () => {
        this.rootUpdateHandlers.delete(scope);
      };
    }, [forceUpdate, scope]);

    return this.renderContent(scope);
  }

  private getScopedContent(scope: string = DEFAULT_SCOPE) {
    const scopedContent = this.content.get(scope);

    if (scopedContent) return scopedContent;

    const newScopedContent = new Map<OverlayId, ReactNode>();

    this.content.set(scope, newScopedContent);

    return newScopedContent;
  }

  private renderContent(scope: string) {
    return Array.from(this.getScopedContent(scope).values());
  }

  private triggerRootUpdate(scope: Scope) {
    this.rootUpdateHandlers.get(scope)?.();
  }

  private updateOverlay({ children, id, scope = DEFAULT_SCOPE }: OverlayProps) {
    this.getScopedContent(scope).set(id, children);
    this.triggerRootUpdate(scope);
  }

  private removeOverlay(scope: Scope, id: OverlayId) {
    this.getScopedContent(scope).delete(id);
    this.triggerRootUpdate(scope);
  }
}

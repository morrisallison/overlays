import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { OverlayProps, OverlayRootProps } from "./types";

const DEFAULT_SCOPE = "@@OVERLAYS";

type OverlayId = string;
type Scope = string;
type Content = Map<OverlayId, ReactNode>;

function useForceUpdate() {
  const [_value, setValue] = useState(0);

  return useCallback(() => setValue(Math.random), []);
}

export class OverlaysManager {
  private content = new Map<Scope, Content | void>();
  private rootUpdateHandlers = new Map<Scope, () => void>();
  private rootUpdatePending = new Map<Scope, boolean>();

  public useUpdateOverlay({
    children,
    id,
    scope = DEFAULT_SCOPE,
  }: OverlayProps) {
    this.updateOverlay({ children, id, scope });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      return () => {
        this.removeOverlay(scope, id);
      };
    }, [id, scope]);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  public useRenderRoot({ scope = DEFAULT_SCOPE }: OverlayRootProps) {
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
    const entries = Array.from(this.getScopedContent(scope).entries());
    const jsx = entries.reduce<JSX.Element[]>((result, [id, children]) => {
      return [...result, <Fragment key={id}>{children}</Fragment>];
    }, []);

    return <>{jsx}</>;
  }

  private getRootUpdateHandler(scope: Scope) {
    return this.rootUpdateHandlers.get(scope);
  }

  private rootUpdateAllowed(scope: Scope) {
    return (
      !!this.getRootUpdateHandler(scope) && !this.rootUpdatePending.get(scope)
    );
  }

  private triggerRootUpdate(scope: Scope) {
    if (!this.rootUpdateAllowed(scope)) return;

    this.rootUpdatePending.set(scope, true);

    queueMicrotask(() => {
      // The handler must be referenced inside `queueMicrotask`
      // otherwise the handler may have been removed by the time
      // `queueMicrotask` is called.
      this.getRootUpdateHandler(scope)?.();
      this.rootUpdatePending.set(scope, false);
    });
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

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import nextTick from "next-tick";

import { RootContext, ContentContext } from "./context";

const DEFAULT_SCOPE = "@@OVERLAYS";

type OverlayKey = string;
type Scope = string;
type Content = Map<OverlayKey, ReactNode>;

function createOverlayContexts(forceUpdate: () => void) {
  const content: Record<Scope, Content | void> = {};

  function getScopedContent(scope: string = DEFAULT_SCOPE) {
    const scopedContent = content[scope];

    if (scopedContent) return scopedContent;

    const newScopedContent = new Map<OverlayKey, ReactNode>();

    content[scope] = newScopedContent;

    return newScopedContent;
  }

  function renderContent(scope?: string) {
    return Array.from(getScopedContent(scope).values());
  }

  function createRootContext() {
    return () => ({ renderContent });
  }

  let rootContext = createRootContext();
  let shouldUpdateRoots = false;

  function effect() {
    shouldUpdateRoots = true;

    return () => {
      shouldUpdateRoots = false;
    };
  }

  function renderNode(
    key: string,
    scope: string | undefined,
    overlayContent: ReactNode
  ) {
    getScopedContent(scope).set(key, overlayContent);

    if (!shouldUpdateRoots) return;

    nextTick(() => {
      rootContext = createRootContext();
      forceUpdate();
    });
  }

  function createRenderer(key: string, scope?: string) {
    let isDestroyed = false;

    function render(overlayContent: ReactNode) {
      if (isDestroyed) return;

      renderNode(key, scope, overlayContent);
    }

    function destroy() {
      if (isDestroyed) return;

      isDestroyed = true;

      renderNode(key, scope, null);
      getScopedContent(scope).delete(key);
    }

    return { render, destroy };
  }

  const contentContext = () => ({ createRenderer });

  function getRootContext() {
    return rootContext;
  }

  function getContentContext() {
    return contentContext;
  }

  return {
    effect,
    getContentContext,
    getRootContext
  };
}

function useForceUpdate() {
  const setValue = useState(true)[1];

  return useCallback(() => setValue(value => !value), [setValue]);
}

function useOverlayContexts() {
  const forceUpdate = useForceUpdate();
  const contexts = useMemo(() => createOverlayContexts(forceUpdate), [
    forceUpdate
  ]);

  useEffect(contexts.effect, []);

  return contexts;
}

export function OverlayProvider(props: { children: ReactNode }) {
  const { getRootContext, getContentContext } = useOverlayContexts();

  return (
    <RootContext.Provider value={getRootContext()}>
      <ContentContext.Provider value={getContentContext()}>
        {props.children}
      </ContentContext.Provider>
    </RootContext.Provider>
  );
}

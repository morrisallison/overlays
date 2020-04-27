import React, { PureComponent, ReactNode } from "react";
import nextTick from "next-tick";

import { RootContext, ContentContext } from "./context";

const DEFAULT_SCOPE = "@@OVERLAYS";

type Content = Map<ContentId, ReactNode>;
type ContentId = number;

export class OverlayProvider extends PureComponent {
  private idCounter = 0;
  private content: Record<string, Content | void> = {};

  state = {
    contentContext: this.createContentContext(),
    rootContext: this.createRootContext()
  };

  private renderNode(
    scope: string | undefined,
    id: number,
    content: ReactNode,
    callback?: () => void
  ) {
    this.getScopedContent(scope).set(id, content);
    nextTick(() => this.updateRootContext(callback));
  }

  private createRenderer = (scope?: string) => {
    const id = ++this.idCounter;

    let isDestroyed = false;

    const render = (content: ReactNode) => {
      if (isDestroyed) return;

      this.renderNode(scope, id, content);
    };

    const destroy = () => {
      if (isDestroyed) return;

      isDestroyed = true;

      this.renderNode(scope, id, null, () => {
        this.getScopedContent(scope).delete(id);
      });
    };

    return { render, destroy };
  };

  private getScopedContent(scope: string = DEFAULT_SCOPE) {
    const scopedContent = this.content[scope];

    if (scopedContent) return scopedContent;

    const newScopedContent = new Map<number, ReactNode>();

    this.content[scope] = newScopedContent;

    return newScopedContent;
  }

  private renderContent = (scope?: string) => {
    return Array.from(this.getScopedContent(scope).values());
  };

  private createContentContext() {
    return () => ({
      createRenderer: this.createRenderer
    });
  }

  private createRootContext() {
    return () => ({
      renderContent: this.renderContent
    });
  }

  private updateRootContext(callback?: () => void) {
    this.setState(
      {
        rootContext: this.createRootContext()
      },
      callback
    );
  }

  render() {
    return (
      <RootContext.Provider value={this.state.rootContext}>
        <ContentContext.Provider value={this.state.contentContext}>
          {this.props.children}
        </ContentContext.Provider>
      </RootContext.Provider>
    );
  }
}

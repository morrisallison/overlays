import React, { PureComponent, ReactNode } from "react";
import nextTick from "next-tick";

import { RootContext, ContentContext } from "./context";

const DEFAULT_SCOPE = "@@OVERLAYS";

let idCounter = 0;

type Content = Map<ContentId, ReactNode>;
type ContentId = number;

export class OverlayProvider extends PureComponent {
  content: Record<string, Content | void> = {};

  state = {
    contentContext: this.createContentContext(),
    rootContext: this.createRootContext()
  };

  createRenderer = (scope?: string) => {
    const id = ++idCounter;
    const renderer = {
      render: (content: ReactNode) => {
        this.getScopedContent(scope).set(id, content);
        nextTick(() => this.updateRootContext());
      },
      destroy: () => {
        this.getScopedContent(scope).delete(id);
      }
    };

    return renderer;
  };

  getScopedContent(scope: string = DEFAULT_SCOPE) {
    const scopedContent = this.content[scope];

    if (scopedContent) return scopedContent;

    const newScopedContent = new Map<number, ReactNode>();

    this.content[scope] = newScopedContent;

    return newScopedContent;
  }

  renderContent = (scope?: string) => {
    return Array.from(this.getScopedContent(scope).values());
  };

  createContentContext() {
    return () => ({
      createRenderer: this.createRenderer
    });
  }

  createRootContext() {
    return () => ({
      renderContent: this.renderContent
    });
  }

  updateRootContext() {
    this.setState({
      rootContext: this.createRootContext()
    });
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

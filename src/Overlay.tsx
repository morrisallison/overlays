import React, { isValidElement, PureComponent, ReactElement } from "react";

import { ContentContext } from "./context";
import { Renderer } from "./types";

type Props = {
  children?: ReactElement | null;
  scope?: string;
};

export class Overlay extends PureComponent<Props> {
  static contextType = ContentContext;

  context!: React.ContextType<typeof ContentContext>;

  private renderer?: Renderer;
  private shouldRender = true;

  private getRenderer() {
    const { renderer } = this;

    if (renderer) return renderer;

    const newRenderer = this.context().createRenderer(this.props.scope);

    this.renderer = newRenderer;

    return newRenderer;
  }

  componentWillUnmount() {
    this.shouldRender = false;

    if (this.renderer) {
      this.renderer.destroy();
      delete this.renderer;
    }
  }

  render() {
    const { children } = this.props;

    if (children !== null) {
      if (!isValidElement(children)) {
        throw new Error("[overlays] Invalid node type.");
      }

      if (!children.key) {
        console.warn(
          "[overlays] An overlay node is missing a key. Overlay nodes are rendered from arrays, so each node should have a key."
        );
      }
    }

    if (this.shouldRender) {
      this.getRenderer().render(children);
    }

    return null;
  }
}

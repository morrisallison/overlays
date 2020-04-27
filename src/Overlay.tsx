import React, { PureComponent } from "react";

import { ContentContext } from "./context";
import { Renderer } from "./types";

type Props = {
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
    if (this.shouldRender) {
      this.getRenderer().render(this.props.children);
    }

    return null;
  }
}

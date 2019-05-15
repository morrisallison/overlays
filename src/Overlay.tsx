import React, { PureComponent } from "react";

import { ContentContext } from "./context";
import { Renderer } from "./types";

type Props = {
  scope?: string;
};

export class Overlay extends PureComponent<Props> {
  static contextType = ContentContext;

  context!: React.ContextType<typeof ContentContext>;
  renderer?: Renderer;

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.destroy();
    }
  }

  getRenderer() {
    const { renderer } = this;

    if (renderer) return renderer;

    const newRenderer = this.context().createRenderer(this.props.scope);

    this.renderer = newRenderer;

    return newRenderer;
  }

  render() {
    this.getRenderer().render(this.props.children);

    return null;
  }
}

import React, { PureComponent } from "react";

import { RootContext } from "./context";

type Props = {
  scope?: string;
};

export class OverlayRoot extends PureComponent<Props> {
  static contextType = RootContext;

  context!: React.ContextType<typeof RootContext>;

  render() {
    return this.context().renderContent(this.props.scope);
  }
}

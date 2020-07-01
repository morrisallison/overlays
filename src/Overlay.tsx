import React, {
  Fragment,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";

import { ContentContext } from "./context";

type Props = {
  children?: ReactElement | null;
  id: string;
  scope?: string;
};

export function Overlay(props: Props) {
  const { children, id, scope } = props;
  const contentContext = useContext(ContentContext);
  const shouldRender = useRef(true);
  const renderer = useMemo(() => contentContext().createRenderer(id, scope), [
    contentContext,
    id,
    scope
  ]);

  useEffect(() => () => renderer.destroy(), [renderer]);
  useEffect(
    () => () => {
      shouldRender.current = false;
    },
    []
  );

  if (shouldRender.current) {
    renderer.render(<Fragment key={id}>{children}</Fragment>);
  }

  return null;
}

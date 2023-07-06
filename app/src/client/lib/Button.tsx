import React from "react";

export default function Button(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
): JSX.Element {
  return (
    <a className="button" {...props}>
      {props.children}
    </a>
  );
}

import React from "react";

export default function Button(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
): JSX.Element {
  return (
    <a {...props} className={props.className + ' button'}>
      {props.children}
    </a>
  );
}

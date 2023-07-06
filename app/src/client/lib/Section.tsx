import React from "react";

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

export default function Section(props: Props): JSX.Element {
  return (
    <div className="my-4">
      {props.children}
    </div>
  );
}

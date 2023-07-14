import React from "react";

type Props = {
  contents: string;
  lastModified: Date;
  reviewerName: string;
};

export default function PeerFeedbackView(props: Props): JSX.Element {
  let reviewText = '';
  try {
    const obj = JSON.parse(props.contents);
    reviewText = obj.reviewText;
  } catch (e) {
  }
  return (
    <div className="mt-4">
      <div>
        Written by <b>{props.reviewerName}</b> at {props.lastModified.toLocaleString()}
      </div>
      <div
        className="mt-4 p-2" 
        style={{
          borderLeft: "solid 10px #eee",
          backgroundColor: "#f8f8f8",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: reviewText }} />
      </div>
      <hr />
    </div>
  );
}

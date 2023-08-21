import React from "react";
import { BiHomeAlt, BiCool, BiCoffee, BiUserVoice, BiUser, BiGroup } from "react-icons/bi";

type Props = {
  contents: string;
  lastModified: Date;
  reviewerName: string;
  isFeedbackForManager?: boolean;
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
      <h6>
        {props.isFeedbackForManager ? (
            <span>
              <BiCoffee className="feather" /> Manager
            </span>
          ) : (
            <span>
              <BiUserVoice className="feather" /> Peer
            </span>
          )
        }
        {' '}feedback written by <b>{props.reviewerName}</b>
      </h6>
      <small>Submitted: {props.lastModified.toLocaleString()}</small>
      <div
        className="mt-4 p-2 reviewContainer" 
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

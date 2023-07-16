import React from "react";
import formatDate from "./formatDate";

type Props = {
  selfReview: Record<string, any>;
  employeeName: string;
};

export default function SelfReviewView(props: Props): JSX.Element {
  let lookBack = '';
  let lookForward = '';
  try {
    const parsed = JSON.parse(props.selfReview.contents);
    lookBack = parsed.lookBack;
    lookForward = parsed.lookForward;
  } catch (e) {}
  return (
    (lookBack || lookForward) ? (
      <div>
        <h5>Self review by: <b>{props.employeeName}</b></h5>
        <small>
          Submitted: {formatDate(props.selfReview.lastModified)}
        </small>
        <h6 className="mt-4">Lookback</h6>
        <div
          className="mt-2 p-2" 
          style={{
            borderLeft: "solid 10px #eee",
            backgroundColor: "#f8f8f8",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: lookBack }} />
        </div>
        <h6 className="mt-4">Look forward</h6>
        <div
          className="mt-2 p-2" 
          style={{
            borderLeft: "solid 10px #eee",
            backgroundColor: "#f8f8f8",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: lookForward }} />
        </div>
      </div>
    ) : (
      <div>
        Self review not submitted
      </div>
    )
  );
}

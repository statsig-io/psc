import React from "react";
import Button from "./Button";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  lastModified: Date;
  canSave: boolean;
  submitted?: boolean;
  handleSave: (submit: boolean) => void;
};

export default function SaveFeedbackButton(props: Props): JSX.Element {
  const promptBeforeSubmit = () => {
    const result = confirm(
      'Are you sure you want to submit?\n' +
      'You won\'t be able to edit your feedback after submission.'
    );
    if (!result) {
      return;
    }
    props.handleSave(true);
  };
  return (<>
    { 
      props.canSave ? (
        <div className='mt-3'>
          <Button onClick={() => props.handleSave(false)}>Save</Button>
          <Button className="ml-2 green" onClick={promptBeforeSubmit}>
            Submit
          </Button>
        </div>
      ) : (
        <div className='mt-3'>
          {
            props.submitted ? (
              'Congratulations!  You have submitted this review/feedback.'
            ) : (
              'Review/Feedback cannot be edited after submission/deadline.'
            )
          }
        </div>
      )
    }
    <div>
      <small>Last Saved: {
        props.lastModified.getTime() > 0 ? 
          props.lastModified.toLocaleString() : 
          'Never'
      }</small>
    </div>
  </>);
}

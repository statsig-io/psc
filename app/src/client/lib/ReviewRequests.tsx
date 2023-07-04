import React from "react";
import Select from "react-select";

export type Suggestion = {
  value: string;
  label: string;
}

type Props = {
  employeeName: string;
  alias: string;
  requests: string[];
  suggestions: Array<Suggestion>;
};

export default function ReviewRequests(props: Props): JSX.Element {
  const suggestions = props.suggestions.filter(s => s.value !== props.alias);
  return (
    <div className="d-flex">
      <div className="p-2" style={{flex: 1}}>
        <strong>{props.employeeName}</strong>
      </div>
      <div className="p-2" style={{flex: 3}}>
        <Select 
          options={suggestions} 
          isMulti={true}
          className="basic-multi-select"
        />
      </div>
    </div>
  );
}

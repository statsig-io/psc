import React, { useEffect, useState } from "react";
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
  onChange: (e: { alias: string, changes: any }) => void;
};

export default function ReviewRequests(props: Props): JSX.Element {
  const [requests, setRequests] = useState(Array<Suggestion>());
  const suggestions = props.suggestions.filter(s => s.value !== props.alias);
  const handleChange = (changes: any) => {
    props.onChange({ 
      alias: props.alias,
      changes
    });
    setRequests(changes);
    console.log(changes);
  };
  useEffect(() => {
    setRequests(props.requests.map(r => (
      { value: r, label: suggestions.find(s => s.value === r)?.label ?? r }
    )));
  }, [props.requests]);
  return (
    <div className="d-flex align-items-center">
      <div style={{flex: 1}}>
        <strong>{props.employeeName}</strong>
      </div>
      <div className="p-2" style={{flex: 3}}>
        <Select 
          options={suggestions} 
          isMulti={true}
          className="basic-multi-select"
          onChange={handleChange}
          value={requests}
        />
      </div>
    </div>
  );
}

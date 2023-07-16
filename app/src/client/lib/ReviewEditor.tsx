import dynamic from 'next/dynamic';
import React from "react";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  contents: string;
  readonly?: boolean;
  onChange: (value: string) => void;
};

export default function ReviewEditor(props: Props): JSX.Element {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet',
    'link'
  ];
  return (
    <ReactQuill 
      value={props.contents}
      onChange={props.onChange}
      modules={modules}
      formats={formats}
      readOnly={props.readonly}
      theme='snow'
      className={ props.readonly ? 'readonly' : 'normal' }
    />
  );
}

import dynamic from 'next/dynamic';
import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  contents: string;
  readonly?: boolean;
  onChange: (value: string) => void;
};

export default function ReviewEditor(props: Props): JSX.Element {
  const [wordCount, setWordCount] = useState<number>(0);

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
    'indent',
    'link'
  ];

  const handleEditorChange = (content: string) => {
    const words = content.trim().split(/\s+/);
    const nonEmptyWords = words.filter(word => word !== '');
    setWordCount(nonEmptyWords.length);
    props.onChange(content);
  };

  return (
    <div>
      <p>Word Count: {wordCount}</p>
      <ReactQuill 
        value={props.contents}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        readOnly={props.readonly}
        theme='snow'
        className={ props.readonly ? 'readonly' : 'normal' }
      />
    </div>
  );
}

import dynamic from 'next/dynamic';
import React from "react";
import { UnprivilegedEditor } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  contents: string;
  readonly?: boolean;
  onChange: (value: string) => void;
};

export default function ReviewEditor(props: Props): JSX.Element {
  const [wordCount, setWordCount] = React.useState(0);
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
  const updateWordCount = (editor: UnprivilegedEditor) => {
    const text = editor.getText();
    setWordCount(text.trim().split(/\s+/).length);
  };
  const onChange = (value: string, delta: any, source: any, editor: UnprivilegedEditor) => {
    updateWordCount(editor);
    props.onChange(value);
  };
  const onBlur = (range: any, source: any, editor: UnprivilegedEditor) => {
    updateWordCount(editor);
  };
  return (<>
    <ReactQuill 
      value={props.contents}
      onChange={onChange}
      onBlur={onBlur}
      modules={modules}
      formats={formats}
      readOnly={props.readonly}
      theme='snow'
      className={ props.readonly ? 'readonly' : 'normal' }
    />
    <small className='float-right mt-3 pr-2'>{wordCount} words</small>
  </>);
}

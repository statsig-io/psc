import Image from 'next/image'
import { signIn } from 'next-auth/react';
import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import ReviewRequests from '@/client/lib/ReviewRequests';
import type { Suggestion } from '@/client/lib/ReviewRequests';
import Section from '@/client/lib/Section';
import Button from '@/client/lib/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import ReviewEditor from '@/client/lib/ReviewEditor';

export default function ReportReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [report, setReport] = useState({} as Record<string, any>);
  const [contents, setContents] = useState('');

  const reportAlias = new URL(window.location.href).searchParams.get('alias');
  
  useEffect(() => {
    apicall('get_report_review', { reportAlias }).then((data) => {
      console.log(data);
      setContents(data.contents);
      setLastModified(new Date(data.lastModified));
      setReport(data.report);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (value: string) => {
    setContents(value);
  };

  const handleSave = () => {
    console.log(contents);
    const tid = toast.loading('Saving report review');
    apicall('set_report_review', { reportAlias, contents }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Report review saved');
    }).catch((err) => {
      toast.error(`Error saving report review: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
    });
  };

  return (
    <LoggedInPage title='Report Review' isLoading={isLoading}>
      <div className='border p-3 bg-light'>
        <h5>Tips for a good review for your report</h5>
        <ul>
          <li>Focus on strengths and results</li>
          <li>Call out patterns observed in peer feedback</li>
          <li>Share positives and critical elements discussed in calibration</li>
          <li>Make it useful for them to grow and flourish</li>
        </ul>
      </div>
      <div className='mt-4'>
        You are sharing feedback for: <b>{report.employeeName}</b>
      </div>
      <div style={{ height: 600, position: 'relative', marginTop: 20 }}>
        <ReviewEditor 
          contents={contents}
          onChange={handleChange}
        />
      </div>
      <div className='mt-3'>
        <Button onClick={() => handleSave()}>Save</Button>
      </div>
      <div>
        <small>Last Saved: {
          lastModified.getTime() > 0 ? lastModified.toLocaleString() : 'Never'
        }</small>
      </div>
    </LoggedInPage>
  );
}

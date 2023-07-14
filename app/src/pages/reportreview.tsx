import Image from 'next/image'
import { signIn } from 'next-auth/react';
import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import ReviewRequests from '@/client/lib/ReviewRequests';
import Section from '@/client/lib/Section';
import Button from '@/client/lib/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import ReviewEditor from '@/client/lib/ReviewEditor';
import Select from "react-select";
import Split from 'react-split';
import PeerFeedbackView from '@/client/lib/PeerFeedbackView';

type Suggestion = {
  value: string;
  label: string;
}
const ratingOptions = [
  { value: 'tnte', label: 'Too new to evaluate' },
  { value: 'mn', label: 'Meets None' },
  { value: 'ms', label: 'Meets Some' },
  { value: 'mm', label: 'Meets Most' },
  { value: 'ma', label: 'Meets All' },
  { value: 'ee', label: 'Exceeds Expectations' },
  { value: 'ge', label: 'Greatly Exceeds'},
] as Array<Suggestion>;

export default function ReportReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [report, setReport] = useState({} as Record<string, any>);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState({} as Suggestion);
  const [peerFeedbacks, setPeerFeedbacks] = useState([] as Array<Record<string, any>>);
  const [employeeNames, setEmployeeNames] = useState([] as Array<Record<string, any>>);

  const reportAlias = new URL(window.location.href).searchParams.get('alias');
  
  useEffect(() => {
    apicall('get_report_review', { reportAlias }).then((data) => {
      console.log(data);
      let obj = {} as Record<string, any>;
      try {
        obj = JSON.parse(data.contents);
      } catch (e) {}
      setReviewText(obj.reviewText);
      setRating(ratingOptions.find((r) => r.value === obj.rating) ?? {} as Suggestion);
      setPeerFeedbacks(data.peerFeedbacks);
      setEmployeeNames(data.employeeNames);

      setLastModified(new Date(data.lastModified));
      setReport(data.report);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (value: string) => {
    setReviewText(value);
  };

  const handleSave = () => {
    const tid = toast.loading('Saving report review');
    const contents = JSON.stringify({ reviewText, rating: rating.value });
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
      <Split
        sizes={[50, 50]}
        minSize={300}
        gutterSize={16}
        direction='horizontal'
        cursor='col-resize'
        className='mt-4 split'
      >
        <div>
          <h5>
            You are sharing feedback for: <b>{report.employeeName}</b>
          </h5>
          <Select 
            options={ratingOptions}
            placeholder='Select a rating' 
            className='mt-4'
            value={rating}
            onChange={(e) => { setRating(e as Suggestion); }}
          />
          <div style={{ height: 600, position: 'relative', marginTop: 20 }}>
            <ReviewEditor 
              contents={reviewText}
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
        </div>
        <div>
          <h5>Peer feedback for: <b>{report.employeeName}</b></h5>
          { 
            peerFeedbacks.map((f) => (
              <PeerFeedbackView
                contents={f.contents}
                lastModified={new Date(f.lastModified)}
                reviewerName={employeeNames.find(e => e.alias === f.reviewer)?.employeeName ?? f.reviewer}
              />
            ))
          }
        </div>
      </Split>
    </LoggedInPage>
  );
}

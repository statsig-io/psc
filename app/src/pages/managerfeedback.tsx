import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import ReviewEditor from '@/client/lib/ReviewEditor';
import SaveFeedbackButton from '@/client/lib/SaveFeedbackButton';

export default function ManagerFeedbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [reviewText, setReviewText] = useState('');
  const [apiData, setApiData] = useState({} as Record<string, any>);
  
  useEffect(() => {
    apicall('get_manager_feedback').then((data) => {
      console.log(data);
      setApiData(data);
      try {
        const contents = JSON.parse(data.contents);
        setReviewText(contents.reviewText as string);
      } catch (e) {}
      setLastModified(new Date(data.lastModified));
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (value: string) => {
    setReviewText(value);
  };

  const handleSave = (submit = false) => {
    const tid = toast.loading('Saving manager feedback');
    const contents = JSON.stringify({ reviewText });
    apicall('set_manager_feedback', { contents, submit }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Manager feedback saved');
    }).catch((err) => {
      toast.error(`Error saving manager feedback: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
      if (submit) {
        window.location.reload();
      }
    });
  };

  return (
    <LoggedInPage title='Manager Feedback' isLoading={isLoading}>
      <div className='border p-3 bg-light'>
        <h5>Tips for sharing a good manager feedback</h5>
        <ul>
          <li>Give concrete examples</li>
          <li>Focus on actions & behavior vs personality</li>
          <li>Keep it &lt;200 words</li>
        </ul>
      </div>
      <div className='mt-4'>
        You are reviewing: <b>{apiData?.manager?.employeeName}</b>
      </div>
      <div style={{ height: 400, position: 'relative', marginTop: 20 }}>
        <ReviewEditor 
          contents={reviewText}
          onChange={handleChange}
          readonly={!apiData?.canEdit}
        />
      </div>
      <SaveFeedbackButton
        canSave={apiData?.canEdit}
        handleSave={handleSave}
        lastModified={lastModified} 
        submitted={apiData?.submitted}
      />
    </LoggedInPage>
  );
}

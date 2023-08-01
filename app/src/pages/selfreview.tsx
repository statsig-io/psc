import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import ReviewEditor from '@/client/lib/ReviewEditor';
import SaveFeedbackButton from '@/client/lib/SaveFeedbackButton';
import formatDate from '@/client/lib/formatDate';
import { dirtyNavigation, usePreventDirtyNav } from '@/client/lib/usePreventDirtyNav';

export default function SelfReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [lookBack, setLookBack] = useState('');
  const [lookForward, setLookForward] = useState('');
  const [apiData, setApiData] = useState({} as Record<string, any>);
  
  usePreventDirtyNav();
  useEffect(() => {
    apicall('get_self_review').then((data) => {
      setApiData(data);
      try {
        const parsed = JSON.parse(data.contents ?? '{}');
        setLookBack(parsed.lookBack);
        setLookForward(parsed.lookForward);
      } catch (e) {
        console.log(e);
      }
      setLastModified(new Date(data.lastModified));
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleLookBackChange = (value: string) => {
    setLookBack(value);
    dirtyNavigation(true);
  };

  const handleLookForwardChange = (value: string) => {
    setLookForward(value);
    dirtyNavigation(true);
  };

  const handleSave = (submit = false) => {
    const tid = toast.loading('Saving self-review');
    const contents = JSON.stringify({ lookBack, lookForward });
    apicall('set_self_review', { contents, submit }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Self-review saved');
      dirtyNavigation(true);
    }).catch((err) => {
      toast.error(`Error saving self-review: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
      if (submit) {
        window.location.reload();
      }
    });
  };

  return (
    <LoggedInPage title='Self Review' isLoading={isLoading}>
      <div className='border p-3 bg-light'>
        <h5>Tips for a good self-review</h5>
        <ul>
          <li>Be factual, let data speak</li>
          <li>Avoid superlatives</li>
          <li>Bulleted points are better than walls of text</li>
          <li>Keep it &lt;300 words</li>
          <li><a href="https://www.notion.so/statsig/Levels-Expectations-056c521502344ba29d5fbcc9b35932d6">Refer to expectations for your level here</a></li>
        </ul>
      </div>
      <div className='mt-3'>
        <h5>
          Share your impact last half, what went well, and what didn't:
        </h5>
        <small>Self review due: {formatDate(apiData?.dueDate)}</small>
        <div className='mt-2' style={{ height: 400, position: 'relative' }}>
          <ReviewEditor 
            contents={lookBack}
            readonly={!apiData?.canEdit}
            onChange={handleLookBackChange}
          />
        </div>
      </div>
      <div className='mt-3'>
        <h5>What are your key areas for growth next half</h5>
        <div className="mt-2" style={{ height: 260, position: 'relative' }}>
          <ReviewEditor 
            contents={lookForward}
            readonly={!apiData?.canEdit}
            onChange={handleLookForwardChange}
          />
        </div>
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

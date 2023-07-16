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

export default function PeerFeedbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [apiData, setApiData] = useState({} as Record<string, any>);
  const [reviewText, setReviewText] = useState('');

  const peerAlias = new URL(window.location.href).searchParams.get('alias');
  usePreventDirtyNav();
  useEffect(() => {
    apicall('get_peer_feedback', { peerAlias }).then((data) => {
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
    dirtyNavigation(true);
  };

  const handleSave = (submit = false) => {
    const tid = toast.loading('Saving peer feedback');
    const contents = JSON.stringify({ reviewText });
    apicall(
      'set_peer_feedback', 
      { peerAlias, contents, submit }
    ).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Peer feedback saved');
      dirtyNavigation(false);
    }).catch((err) => {
      toast.error(`Error saving peer feedback: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
      if (submit) {
        window.location.reload();
      }
    });
  };

  return (
    <LoggedInPage title='Peer Feedback' isLoading={isLoading}>
      <div className='border p-3 bg-light'>
        <h5>Tips for a good peer feedback</h5>
        <ul>
          <li>Be factual and include examples</li>
          <li>Focus on results vs. effort</li>
          <li>Keep it &lt;200 words</li>
        </ul>
      </div>
      <div className='mt-4'>
        You are sharing feedback for: <b>{apiData?.peer?.employeeName}</b>
      </div>
      <small>Review due: {formatDate(apiData?.dueDate)}</small>
      <div style={{ height: 400, position: 'relative', marginTop: 20 }}>
        <ReviewEditor 
          contents={reviewText}
          onChange={handleChange}
          readonly={!apiData.canEdit}
        />
      </div>
      <SaveFeedbackButton
        canSave={apiData.canEdit}
        handleSave={handleSave}
        lastModified={lastModified}
        submitted={apiData.submitted}
      />
    </LoggedInPage>
  );
}

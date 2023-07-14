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

export default function PeerFeedbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [peer, setPeer] = useState({} as Record<string, any>);
  const [reviewText, setReviewText] = useState('');

  const peerAlias = new URL(window.location.href).searchParams.get('alias');
  
  useEffect(() => {
    apicall('get_peer_feedback', { peerAlias }).then((data) => {
      console.log(data);
      try {
        const contents = JSON.parse(data.contents);
        setReviewText(contents.reviewText as string);
      } catch (e) {}
      setLastModified(new Date(data.lastModified));
      setPeer(data.peer);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (value: string) => {
    setReviewText(value);
  };

  const handleSave = () => {
    const tid = toast.loading('Saving peer feedback');
    const contents = JSON.stringify({ reviewText });
    apicall('set_peer_feedback', { peerAlias, contents }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Peer feedback saved');
    }).catch((err) => {
      toast.error(`Error saving peer feedback: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
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
        You are sharing feedback for: <b>{peer.employeeName}</b>
      </div>
      <div style={{ height: 400, position: 'relative', marginTop: 20 }}>
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
    </LoggedInPage>
  );
}

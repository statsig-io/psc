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

export default function SelfReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [lookBack, setLookBack] = useState('');
  const [lookForward, setLookForward] = useState('');
  
  useEffect(() => {
    apicall('get_self_review').then((data) => {
      try {
        const parsed = JSON.parse(data.contents);
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
  };

  const handleLookForwardChange = (value: string) => {
    setLookForward(value);
  };

  const handleSave = () => {
    const tid = toast.loading('Saving self-review');
    const contents = JSON.stringify({ lookBack, lookForward });
    apicall('set_self_review', { contents }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Self-review saved');
    }).catch((err) => {
      toast.error(`Error saving self-review: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
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
        </ul>
      </div>
      <div className='mt-3'>
        <h5>Share your impact last half, what went well, and what didn't</h5>
        <div style={{ height: 400, position: 'relative' }}>
          <ReviewEditor 
            contents={lookBack}
            onChange={handleLookBackChange}
          />
        </div>
      </div>
      <div className='mt-3'>
        <h5>Share what you plan to work on this half</h5>
        <div style={{ height: 260, position: 'relative' }}>
          <ReviewEditor 
            contents={lookForward}
            onChange={handleLookForwardChange}
          />
        </div>
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

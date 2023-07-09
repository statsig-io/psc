import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import Button from '@/client/lib/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import ReviewEditor from '@/client/lib/ReviewEditor';

export default function ManagerFeedbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [manager, setManager] = useState({} as Record<string, any>);
  const [contents, setContents] = useState('');
  
  useEffect(() => {
    apicall('get_manager_feedback').then((data) => {
      console.log(data);
      setContents(data.contents);
      setLastModified(new Date(data.lastModified));
      setManager(data.manager);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (value: string) => {
    setContents(value);
  };

  const handleSave = () => {
    console.log(contents);
    const tid = toast.loading('Saving manager feedback');
    apicall('set_manager_feedback', { contents }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Manager feedback saved');
    }).catch((err) => {
      toast.error(`Error saving manager feedback: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
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
        You are reviewing: <b>{manager?.employeeName}</b>
      </div>
      <div style={{ height: 400, position: 'relative', marginTop: 20 }}>
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

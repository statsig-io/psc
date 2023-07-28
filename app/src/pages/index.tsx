import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import ReviewRequests from '@/client/lib/ReviewRequests';
import type { Suggestion } from '@/client/lib/ReviewRequests';
import Section from '@/client/lib/Section';
import Button from '@/client/lib/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import { Statsig } from 'statsig-react';

export default function Portal() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportsAndRequests, setReportsAndRequests] = 
    useState(Array<Record<string, any>>());
  const [suggestions, setSuggestions] = useState(Array<Suggestion>());
  const [requests, setRequests] = useState<Record<string, string[]>>({});
  const { data: session } = useSession();

  useEffect(() => {
    apicall('get_feedback_requests').then((data) => {
      console.log(data);
      setReportsAndRequests(data.reportsAndRequests);
      setSuggestions(data.employees?.map((e: any) => { 
        return { 
          value: e.alias, label: e.employeeName 
        };
      }).filter(
        (e: any) => e.value !== session?.user?.email?.split('@')[0]
      ).sort(
        (a: any, b: any) => a.label.localeCompare(b.label))
      );

      const requests: Record<string, string[]> = {};
      data.reportsAndRequests.forEach((r: any) => {
        requests[r.alias] = r.requests;
      });
      setRequests(requests);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleRequestsChange = (e: { alias: string, changes: any }) => {
    const newRequests = { ...requests };
    newRequests[e.alias] = e.changes.map((c: any) => c.value);
    setRequests(newRequests);
  };

  const handleSave = () => {
    console.log(requests);
    const tid = toast.loading('Saving feedback requests');
    apicall('set_feedback_requests', { requests }).then((data) => {
      toast.success('Feedback requests saved');
    }).catch((err) => {
      toast.error(`Error saving feedback requests: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
    });
  };
  const reviewConfig = Statsig.getConfig('review_config');
  
  return (
    <LoggedInPage title='Statsig Performance Review' isLoading={isLoading}>
      <div className='border p-3 bg-light'>
        <div>
          <h4>Sequence</h4>
          <ol>
            <li>If you're a manager, request peer feedback for your reports</li>
            <li>Fill out self-review</li>
            <li>Fill out manager feedback</li>
            <li>Fill out peer feedback if you have any requested from you</li>
          </ol>
        </div>
        <hr />
        <div>
          <h4>Important Dates</h4>
          <ol>
            <li>
              Review start: <b>{
                new Date(reviewConfig.get('review_start', '0')).toDateString()
              }</b>
            </li>
            <li>
              Self, Manager & Peer feedback due: <b>{
                new Date(reviewConfig.get('feedback_due', '0')).toDateString()
              }</b>
            </li>
            <li>
              Calibration: <b>{
                new Date(reviewConfig.get('calibration', '0')).toDateString()
              }</b>
            </li>
            <li>
              Managers start delivering review: <b>{
                new Date(reviewConfig.get('reviews_begin', '0')).toDateString()
              }</b>
            </li>
          </ol>
        </div>
      </div>
      {
        reportsAndRequests.length > 0 && (<>
          <hr />
          <div className="mt-3">
            <h5>Peer feedback requests</h5>
            <div>
              As a manager with direct reports, you can assign feedback requests 
              to your reports.  Pick between <b>3-5</b> peers to request 
              feedback from.
            </div>
            <Section>
              {
                reportsAndRequests.map((r) => (
                  <div>
                    <ReviewRequests 
                      employeeName={r.employeeName}
                      alias={r.alias}
                      requests={r.requests}
                      suggestions={suggestions}
                      onChange={handleRequestsChange}
                    />
                  </div>
                ))
              }
            </Section>

            <Section>
              <Button onClick={() => handleSave()}>Save</Button>
            </Section>
          </div>
        </>)
      }
    </LoggedInPage>
  );
}

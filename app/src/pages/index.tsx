import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import ReviewRequests from '@/client/lib/ReviewRequests';
import type { Suggestion } from '@/client/lib/ReviewRequests';
import Section from '@/client/lib/Section';
import Button from '@/client/lib/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Portal() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportsAndRequests, setReportsAndRequests] = 
    useState(Array<Record<string, any>>());
  const [suggestions, setSuggestions] = useState(Array<Suggestion>());
  const [requests, setRequests] = useState<Record<string, string[]>>({});

  useEffect(() => {
    apicall('get_feedback_requests').then((data) => {
      setReportsAndRequests(data.reportsAndRequests);
      setSuggestions(data.employees?.map((e: any) => { 
        return { 
          value: e.alias, label: e.employeeName 
        };
      }).sort((a: any, b: any) => a.label.localeCompare(b.label)));

      const requests: Record<string, string[]> = {};
      data.reportsAndRequests.forEach((r: any) => {
        requests[r.alias] = r.requests;
      });
      setRequests(requests);
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
  
  return (
    <LoggedInPage title='Statsig Performance Review' isLoading={isLoading}>
      <div>
        <h5>Sequence</h5>
        <ol>
          <li>If you're a manager, request peer feedback for your reports</li>
          <li>Fill out self-review</li>
          <li>Fill out manager feedback</li>
          <li>Fill out peer feedback if you have any requested from you</li>
        </ol>
      </div>
      {
        reportsAndRequests.length > 0 && (
          <div className="mt-5">
            <hr />
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
        )
      }
    </LoggedInPage>
  );
}

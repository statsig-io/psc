import Image from 'next/image'
import { signIn } from 'next-auth/react';
import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/lib/apicall';
import ReviewRequests from '@/client/lib/ReviewRequests';
import type { Suggestion } from '@/client/lib/ReviewRequests';
import Section from '@/client/lib/Section';
import Button from '@/client/lib/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AssignPage() {
  const [reportsAndRequests, setReportsAndRequests] = 
    useState(Array<Record<string, any>>());
  const [suggestions, setSuggestions] = useState(Array<Suggestion>());
  const [requests, setRequests] = useState<Record<string, string[]>>({});

  useEffect(() => {
    apicall('get_reports_with_feedback_requests').then((data) => {
      console.log(data);
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
    apicall('set_feedback_requests', requests).then((data) => {
      toast.done(tid);
      toast.success('Feedback requests saved');
    }).catch((err) => {
      toast.done(tid);
      toast.error(`Error saving feedback requests: ${err.message}`);
    });
  };

  return (
    <LoggedInPage title='Request Feedback'>
      {
        reportsAndRequests.length > 0 ? (
          <div>
            As a manager with direct reports, you can assign feedback requests 
            to your reports.
          </div>
        ) : (
          <div>
            You do not have any direct reports and so can safely skip this page.
          </div>
        )
      }
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
      <ToastContainer position='bottom-right' newestOnTop={true}
        closeOnClick={true} pauseOnHover={true} />
    </LoggedInPage>
  );
}

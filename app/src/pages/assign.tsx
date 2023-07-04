import Image from 'next/image'
import { signIn } from 'next-auth/react';
import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/lib/apicall';
import ReviewRequests from '@/client/lib/ReviewRequests';
import type { Suggestion } from '@/client/lib/ReviewRequests';

export default function AssignPage() {
  const [reportsAndRequests, setReportsAndRequests] = 
    useState(Array<Record<string, any>>());
  const [suggestions, setSuggestions] = useState(Array<Suggestion>());
  useEffect(() => {
    apicall('get_reports_with_feedback_requests').then((data) => {
      console.log(data);
      setReportsAndRequests(data.reportsAndRequests);
      setSuggestions(data.employees?.map((e: any) => { 
        return { 
          value: e.alias, label: e.employeeName 
        };
      }).sort((a: any, b: any) => a.label.localeCompare(b.label)));
    });
  }, []);
  return (
    <LoggedInPage title='Request Feedback'>
      <div>
        Hello World
      </div>
      <div>
        {reportsAndRequests.map((r) => (r.employeeName)).join('; ')}
      </div>
      <div>
        {
          reportsAndRequests.map((r) => (
            <div>
              <ReviewRequests 
                employeeName={r.employeeName}
                alias={r.alias}
                requests={r.requests}
                suggestions={suggestions}
              />
            </div>
          ))
        }
      </div>
    </LoggedInPage>
  );
}

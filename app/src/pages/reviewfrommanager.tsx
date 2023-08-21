import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import ratingOptions from '@/client/lib/ratingOptions';

const ratingMap = ratingOptions.reduce((acc: any, cur) => 
  Object.assign(acc, { [cur.value]: cur.label }, {})
) as Record<string, string>;

export default function ReviewFromManagerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({} as Record<string, any>);
  
  useEffect(() => {
    apicall('get_review_from_manager').then((data) => {
      setApiData(data);
      console.log(data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <LoggedInPage title='Review from Manager' isLoading={isLoading}>
      <div className='mt-3'>
        <h4>
          Rating: {ratingMap[apiData?.rating]}
        </h4>
      </div>
      <div className='mt-3'>
        <div>
          <div dangerouslySetInnerHTML={{ __html: apiData?.review }} />
        </div>
      </div>
    </LoggedInPage>
  );
}

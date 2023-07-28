import LoggedInPage from '@/client/lib/LoggedInPage';
import { useEffect, useState } from 'react';
import apicall from '@/client/lib/apicall';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import ReviewEditor from '@/client/lib/ReviewEditor';
import Select from "react-select";
import Split from 'react-split';
import PeerFeedbackView from '@/client/lib/PeerFeedbackView';
import SaveFeedbackButton from '@/client/lib/SaveFeedbackButton';
import formatDate from '@/client/lib/formatDate';
import SelfReviewView from '@/client/lib/SelfReviewView';
import { dirtyNavigation, usePreventDirtyNav } from '@/client/lib/usePreventDirtyNav';

type Suggestion = {
  value: string;
  label: string;
}
const ratingOptions = [
  { value: 'tnte', label: 'Too new to evaluate' },
  { value: 'mn', label: 'Meets None' },
  { value: 'ms', label: 'Meets Some' },
  { value: 'mm', label: 'Meets Most' },
  { value: 'ma', label: 'Meets All' },
  { value: 'ee', label: 'Exceeds Expectations' },
  { value: 'ge', label: 'Greatly Exceeds'},
] as Array<Suggestion>;

export default function ReportReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date(0));
  const [reviewText, setReviewText] = useState('');
  const [calibrationNotes, setCalibrationNotes] = useState('');
  const [rating, setRating] = useState({} as Suggestion);
  const [flaggedForPromotion, setFlaggedForPromotion] = useState(false);
  const [apiData, setApiData] = useState({} as Record<string, any>);

  usePreventDirtyNav();
  const reportAlias = new URL(window.location.href).searchParams.get('alias');
  if (!reportAlias) {
    window.location.href = '/';
  }
  
  useEffect(() => {
    apicall('get_report_review', { reportAlias }).then((data) => {
      setApiData(data);
      let obj = {} as Record<string, any>;
      try {
        obj = JSON.parse(data.contents);
        setReviewText(obj.reviewText);
        setRating(
          ratingOptions.find((r) => r.value === obj.rating) ?? {} as Suggestion,
        );
        setCalibrationNotes(obj.calibrationNotes);
        setFlaggedForPromotion(obj.flaggedForPromotion ?? false);
      } catch (e) {}
      
      setLastModified(new Date(data.lastModified));
    }).finally(() => {
      setIsLoading(false);
      setTimeout(() => {
        dirtyNavigation(false);
      }, 200);
    });
  }, []);

  const handleSave = () => {
    const tid = toast.loading('Saving report review');
    const contents = JSON.stringify({ 
      reviewText,
      rating: rating.value,
      calibrationNotes,
      flaggedForPromotion,
    });
    apicall('set_report_review', { reportAlias, contents }).then((data) => {
      setLastModified(new Date(data.lastModified));
      toast.success('Report review saved');
      dirtyNavigation(false);
    }).catch((err) => {
      toast.error(`Error saving report review: ${err.message}`);
    }).finally(() => {
      toast.done(tid);
    });
  };

  return (
    <LoggedInPage title='Report Review' isLoading={isLoading}>
      <div className='border p-3 bg-light'>
        <h5>Tips for a good review for your report</h5>
        <ul>
          <li>Focus on strengths and results</li>
          <li>Call out patterns observed in peer feedback</li>
          <li>Share positives and critical elements discussed in calibration</li>
          <li>Make it useful for them to grow and flourish</li>
        </ul>
      </div>
      <Split
        sizes={[50, 50]}
        minSize={300}
        gutterSize={16}
        direction='horizontal'
        cursor='col-resize'
        className='mt-4 split'
      >
        <div>
          <h5>
            You are sharing feedback for: <b>{apiData.report?.employeeName}</b>
          </h5>
          <small>Review due: {formatDate(apiData?.dueDate)}</small>
          <div className='mt-4'>
            <h6 className='d-inline'>
              Calibration Notes (not shared)
            </h6>
            <div className='d-inline ml-3'>
              <label>
                <input 
                  type="checkbox" 
                  className="align-middle" 
                  checked={flaggedForPromotion}
                  onChange={(e) => {
                    setFlaggedForPromotion(e.target.checked);
                    dirtyNavigation(true);
                  }}
                /> Flag for promotion
              </label>
            </div>
          </div>
          <div style={{ height: 300, position: 'relative', marginTop: 8 }}>
            <ReviewEditor 
              contents={calibrationNotes}
              onChange={(t) => {
                setCalibrationNotes(t);
                dirtyNavigation(true);
              }}
              readonly={!apiData?.canEdit}
            />
          </div>
          <h6 className='mt-4'>Rating & Review (will be shared)</h6>
          <div>
            <Select 
              options={ratingOptions}
              placeholder='Select a rating' 
              className='mt-2'
              value={rating}
              onChange={(e) => { setRating(e as Suggestion); }}
              isDisabled={!apiData?.canEdit}
            />
          </div>
          <div style={{ height: 600, position: 'relative', marginTop: 20 }}>
            <ReviewEditor 
              contents={reviewText}
              onChange={(t) => {
                setReviewText(t);
                dirtyNavigation(true);
              }}
              readonly={!apiData?.canEdit}
            />
          </div>
          <SaveFeedbackButton
            lastModified={lastModified}
            handleSave={handleSave}
            canSave={apiData?.canEdit}
          />
        </div>
        <div>
          <SelfReviewView
            selfReview={
              apiData?.peerFeedbacks?.find(
                (f: any) => f.reviewer === f.reviewee
              )
            }
            employeeName={apiData.report?.employeeName}
          />
          <hr />
          <h5>Feedback for: <b>{apiData.report?.employeeName}</b></h5>
          { 
            apiData?.peerFeedbacks?.
              filter((f: any) => f.reviewer !== f.reviewee).
              map((f: any) => (
                <PeerFeedbackView
                  contents={f.contents}
                  lastModified={new Date(f.lastModified)}
                  reviewerName={
                    apiData?.employeeNames.find(
                      (e: any) => e.alias === f.reviewer
                    )?.employeeName ?? f.reviewer
                  }
                  isFeedbackForManager={f.isFeedbackForManager}
                />
              ))
          }
        </div>
      </Split>
    </LoggedInPage>
  );
}

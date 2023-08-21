import React, { useEffect } from "react";
import { BiHomeAlt, BiCool, BiCoffee, BiUserVoice, BiUser, BiGroup, BiStreetView } from "react-icons/bi";
import apicall from "./apicall";

type Props = {};

function buildPeerList(peerRequests: Array<any>) {
  return (
    <ul className="nav flex-column">
    {
      peerRequests.length === 0 ? (
        <div className="nav-item"><small>None requested</small></div>
      ): (
        peerRequests.map((p: any) => {
          return (
            <li className="nav-item" key={`_peer_${p.alias}`}>
              <a className="nav-link" href={`/peerfeedback?alias=${p.alias}`}>
                <BiUser className="feather" />
                {p.employeeName}
              </a>
            </li>
          )
        })
      )
    }
    </ul>
  );
}

function buildReportsList(reportsList: Array<any>) {
  return (
    reportsList.length === 0 ? null : (
      <>
        <hr />
        <li className="nav-item nav-link">
          <BiGroup className="feather" />
          Your Reports
        </li>
        <li className="nav-item pl-2">
          <ul className="nav flex-column">
          { 
            reportsList.map((p: any) => {
              return (
                <li className="nav-item" key={`_report_${p.alias}`}>
                  <a className="nav-link" href={`/reportreview?alias=${p.alias}`}>
                    <BiUser className="feather" />
                    {p.employeeName}
                  </a>
                </li>
              )
            })
          }
          </ul>
        </li>
      </>
    )
  );
}



export default function Sidebar(props: Props): JSX.Element {
  const [hasReviewFromManager, setHasReviewFromManager] = React.useState(false);
  const [peerRequests, setPeerRequests] = React.useState([]);
  const [allReports, setAllReports] = React.useState([]);
  useEffect(() => {
    apicall('get_peer_requests').then((data) => {
      setPeerRequests(data);
    });
    apicall('get_reports').then((data) => {
      setAllReports(data);
    });
    apicall('get_has_review_from_manager').then((data) => {
      setHasReviewFromManager(data.hasReviewFromManager);
    });
  }, []);
  return (
    <div className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link" href="/">
              <BiHomeAlt className="feather" />
              Home
            </a>
          </li>
          <hr />
          <li className="nav-item">
            <a className="nav-link" href="/selfreview">
              <BiCool className="feather" />
              You
            </a>
          </li>
          {hasReviewFromManager && (
            <li className="nav-item">
              <a className="nav-link text-info" href="/reviewfrommanager">
                <BiStreetView className="feather" />
                Review from Manager
              </a>
            </li>
          )}
          <li className="nav-item">
            <a className="nav-link" href="/managerfeedback">
              <BiCoffee className="feather" />
              Your Manager
            </a>
          </li>
          <hr />
          <li className="nav-item nav-link">
            <BiUserVoice className="feather" />
            Peers
          </li>
          <li className="nav-item pl-2">
            {buildPeerList(peerRequests)}
          </li>
          {buildReportsList(allReports)}          
        </ul>
      </div>
    </div>
  );
}

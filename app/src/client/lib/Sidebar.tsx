import React from "react";
import { BiHomeAlt, BiAddToQueue } from "react-icons/bi";

type Props = {};

export default function Sidebar(props: Props): JSX.Element {
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
          <li className="nav-item">
            <a className="nav-link" href="/assign">
              <BiAddToQueue className="feather" />
              Assign
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

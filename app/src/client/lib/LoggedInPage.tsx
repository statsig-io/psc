import { signIn, signOut, useSession } from "next-auth/react";

import Head from "next/head";
import Link from "next/link";
import React from "react";
import Sidebar from "./Sidebar";

type Props = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  rightAccessory?: React.ReactNode;
  titleBackLink?: React.ReactNode;
};

export default function LoggedInPage(props: Props): JSX.Element {
  const { data: session } = useSession();
  return (
    <div id="internPage">
      <Head>
        <title>{props.title} | Statsig Intern</title>
      </Head>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <img
          className="navbar-brand"
          src="/img/statsig-logo.svg"
          width="140"
        />
        <ul className="navbar-nav mr-auto">
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="nav-item">
            <span className="nav-link">[{session?.user?.email}]</span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => signOut()}>
              Sign out
            </a>
          </li>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>
                {props.titleBackLink}
                {props.title}
              </h2>
              {props.rightAccessory}
            </div>
            <div>{props.children}</div>
          </main>

        </div>
        
      </div>
    </div>
  );
}

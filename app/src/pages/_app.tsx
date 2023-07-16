import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { AppProps } from 'next/app';
import Head from "next/head";
import { StatsigProvider } from 'statsig-react';

export default function MyApp({ 
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>Statsig Performance Review</title>
      </Head>
      <SessionProvider session={session}>
        <SessionWrapper>
          <Component {...pageProps} />
        </SessionWrapper>
      </SessionProvider>
    </>
  );
}

function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}): null | JSX.Element {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  if (
    session &&
    email &&
    (email.endsWith("@statsig.com") || email.endsWith("@statsig.io"))
  ) {
    return (
      <StatsigProvider
        user={{
          userID: session?.user?.name ?? undefined,
        }}
        sdkKey="client-lP8cs9ZR5CvCLqqZg5qSKqIKg1vWhZopB3jbUXs7fpH"
        options={{ api: "https://latest.api.statsig.com/v1" }}
        waitForInitialization={true}
      >
        <>{children}</>
      </StatsigProvider>
    );
  } else if (status === "loading") {
    return null;
  } else {
    return (
      <div style={{ padding: "80px", margin: "auto", textAlign: "center" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Sign in
        </button>
      </div>
    );
  }
}
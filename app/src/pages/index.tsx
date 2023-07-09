import Image from 'next/image'
import { signIn } from 'next-auth/react';
import LoggedInPage from '@/client/lib/LoggedInPage';

export default function Portal() {
  return (
    <LoggedInPage title='Statsig Performance Review'>
      <div>
        Hello World
      </div>
    </LoggedInPage>
  );
}
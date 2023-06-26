import Image from 'next/image'

export default function Index() {
  return (
    <main className="flex min-h-screen flex-col justify-between mx-16 max-w-5xl mx-auto">
      <div className="max-h-20 py-2">
        <Image src="/images/statsig-logo.svg" width="193" height="40" alt="Statsig Logo" />
      </div>
    </main>
  );
}

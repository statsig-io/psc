import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

function nullthrows<T>(x: T | null | undefined): T {
  if (x) {
    return x;
  }
  throw new Error('Got unexpected null or undefined');
}

const Secrets = {
  NEXT_PUBLIC_AZURE_AD_CLIENT_ID: nullthrows(process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID),
  NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET: nullthrows(process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET),
  NEXT_PUBLIC_AZURE_AD_TENANT_ID: nullthrows(process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID),
  NEXTAUTH_SECRET: nullthrows(process.env.NEXTAUTH_SECRET),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3010',
  PSC_CONN_STRING: nullthrows(process.env.PSC_CONN_STRING),
  STATSIG_SERVER_KEY: nullthrows(process.env.STATSIG_SERVER_KEY),
  REVIEW_PERIOD: nullthrows(process.env.REVIEW_PERIOD),
};

process.env.NEXTAUTH_URL = Secrets.NEXTAUTH_URL;
export default Secrets;
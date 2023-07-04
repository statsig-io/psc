import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import secrets from '@/lib/secrets';

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: secrets.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
      clientSecret: secrets.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
      tenantId: secrets.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
      authorization: {
        params: { scope: 'openid email profile User.Read  offline_access' },
      },
      httpOptions: { timeout: 10000 },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          accessToken: account.id_token,
          accessTokenExpires: account?.expires_at
            ? account.expires_at * 1000
            : 0,
          refreshToken: account.refresh_token,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires - 100000 || 0) {
        return token;
      }
    },
    async session({ session, token }) {
      if (session) {
        session.user = token.user;
        session.error = token.error;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
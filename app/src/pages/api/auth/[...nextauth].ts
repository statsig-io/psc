import type { NextApiRequest, NextApiResponse } from "next";
import type { CookiesOptions, NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";

import AzureProvider from "next-auth/providers/azure-ad";
import Secrets from '@/server/lib/secrets';
import EncryptionUtils from "@/server/lib/EncryptionUtils";

const sessionAge = 7 * 24 * 3600;
export const getAuthOptions = (
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions => {
  const cookies = defaultCookies(req.url?.startsWith("https://") ?? true);
  return {
    providers: [
      AzureProvider({
        clientId: Secrets.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
        clientSecret: Secrets.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
        tenantId: Secrets.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
        idToken: true,
        authorization: { params: { scope: "User.Read email openid" } },
      }),
    ],
    cookies: cookies,
    secret: Secrets.NEXTAUTH_SECRET,
    session: { maxAge: sessionAge },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const verifiedEmail =
          profile?.email?.endsWith("@statsig.com") ||
          profile?.email?.endsWith("@statsig.io");

        console.log(`Granted for: ${profile?.email}`);

        if (profile?.email) {
          const cookieValue = EncryptionUtils.encrypt(profile.email);
          if (cookieValue) {
            res.setHeader(
              "Set-Cookie",
              `psc_auth=${cookieValue};Max-Age=${sessionAge};Path=/`
            );
          }
        }
        return true;
      },
    },
  };
};

//
function defaultCookies(useSecureCookies: boolean): CookiesOptions {
  const cookiePrefix = (useSecureCookies ? "__Secure-" : "") + "psc.";
  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    }
  };
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, getAuthOptions(req, res));
};

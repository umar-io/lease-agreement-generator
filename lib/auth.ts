// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user:         schema.user,
      session:      schema.session,
      account:      schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled:          true,
    requireEmailVerification: false, // set true when you add email (Resend)
  },

  // Add Google OAuth later — just uncomment
  // socialProviders: {
  //   google: {
  //     clientId:     process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },

  session: {
    expiresIn:         60 * 60 * 24 * 7,  // 7 days
    updateAge:         60 * 60 * 24,       // refresh if older than 1 day
    cookieCache: {
      enabled:   true,
      maxAge:    5 * 60,                   // cache session for 5 minutes
    },
  },

  user: {
    additionalFields: {
      // extend the user table with your own fields
      plan: {
        type:         "string",
        defaultValue: "FREE",
        input:        false, // not set by user directly
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;
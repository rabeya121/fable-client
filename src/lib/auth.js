// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";

// const client = new MongoClient(process.env.MONGODB_URL);

// export const auth = betterAuth({
//   database: {
//     db: client.db("fable"),
//     type: "mongodb",
//   },
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "user",
//       },
//     },
//   },
// });   

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db("fables");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
});
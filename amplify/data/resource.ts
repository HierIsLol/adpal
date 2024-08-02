import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// == STEP 1 ===============================================================
// The section below creates a Todo database table with a "content" field and an "isDone" field as a boolean.
// The authorization rule below specifies that any user authenticated via an API key can "create", "read",
// "update", and "delete" any "Todo" records.
// =========================================================================
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(), // New field added
    })
    .authorization((allow) => [
      allow.owner(), // Allowing owners to perform CRUD operations
      allow.publicApiKey(), // Allowing API key access
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as documentVersions from "../documentVersions.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as myFunctions from "../myFunctions.js";
import type * as projectDictionaries from "../projectDictionaries.js";
import type * as projects from "../projects.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  documentVersions: typeof documentVersions;
  documents: typeof documents;
  http: typeof http;
  myFunctions: typeof myFunctions;
  projectDictionaries: typeof projectDictionaries;
  projects: typeof projects;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

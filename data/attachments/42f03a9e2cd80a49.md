# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\auth.api.spec.ts >> API – Auth Endpoints (/api/auth) >> POST /api/auth/login >> [NEGATIVE] Empty email → 400 Bad Request (validation error)
- Location: tests\api\auth.api.spec.ts:69:9

# Error details

```
TypeError: apiRequestContext.post: Invalid URL
```

# Test source

```ts
  1  | /**
  2  |  * Auth API Helper
  3  |  * Uses Playwright's built-in APIRequestContext for direct HTTP API tests.
  4  |  * No Axios dependency required — Playwright handles everything.
  5  |  */
  6  | import { APIRequestContext, expect } from "@playwright/test";
  7  | import { API } from "../../constants/apiEndpoints";
  8  | 
  9  | const BASE_URL = process.env.API_BASE_URL;
  10 | 
  11 | export interface LoginPayload {
  12 |   email: string;
  13 |   password: string;
  14 | }
  15 | 
  16 | export interface ForgotPasswordPayload {
  17 |   email: string;
  18 | }
  19 | 
  20 | export interface ResetPasswordPayload {
  21 |   token: string;
  22 |   newPassword: string;
  23 | }
  24 | 
  25 | export async function apiLogin(
  26 |   request: APIRequestContext,
  27 |   payload: LoginPayload
  28 | ) {
> 29 |   const response = await request.post(`${BASE_URL}${API.AUTH.LOGIN}`, {
     |                                  ^ TypeError: apiRequestContext.post: Invalid URL
  30 |     data: payload,
  31 |     headers: { "Content-Type": "application/json" },
  32 |   });
  33 |   return response;
  34 | }
  35 | 
  36 | export async function apiLogout(request: APIRequestContext, token: string) {
  37 |   const response = await request.post(`${BASE_URL}${API.AUTH.LOGOUT}`, {
  38 |     headers: {
  39 |       "Content-Type": "application/json",
  40 |       Authorization: `Bearer ${token}`,
  41 |     },
  42 |   });
  43 |   return response;
  44 | }
  45 | 
  46 | export async function apiForgotPassword(
  47 |   request: APIRequestContext,
  48 |   payload: ForgotPasswordPayload
  49 | ) {
  50 |   const response = await request.post(
  51 |     `${BASE_URL}${API.AUTH.FORGOT_PASSWORD}`,
  52 |     {
  53 |       data: payload,
  54 |       headers: { "Content-Type": "application/json" },
  55 |       timeout: 30000,
  56 |     }
  57 |   );
  58 |   return response;
  59 | }
  60 | 
  61 | export async function apiResetPassword(
  62 |   request: APIRequestContext,
  63 |   payload: ResetPasswordPayload
  64 | ) {
  65 |   const response = await request.post(`${BASE_URL}${API.AUTH.RESET_PASSWORD}`, {
  66 |     data: payload,
  67 |     headers: { "Content-Type": "application/json" },
  68 |   });
  69 |   return response;
  70 | }
  71 | 
  72 | export async function loginAndGetToken(
  73 |   request: APIRequestContext,
  74 |   payload: LoginPayload
  75 | ): Promise<string | null> {
  76 |   const response = await apiLogin(request, payload);
  77 |   if (!response.ok()) return null;
  78 |   const body = await response.json();
  79 |   return body?.data?.token ?? null;
  80 | }
  81 | 
```
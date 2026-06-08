/**
 * Auth API Helper
 * Uses Playwright's built-in APIRequestContext for direct HTTP API tests.
 * No Axios dependency required — Playwright handles everything.
 */
import { APIRequestContext, expect } from "@playwright/test";
import { API } from "../../constants/apiEndpoints";

const BASE_URL = process.env.API_BASE_URL;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export async function apiLogin(
  request: APIRequestContext,
  payload: LoginPayload
) {
  const response = await request.post(`${BASE_URL}${API.AUTH.LOGIN}`, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}

export async function apiLogout(request: APIRequestContext, token: string) {
  const response = await request.post(`${BASE_URL}${API.AUTH.LOGOUT}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function apiForgotPassword(
  request: APIRequestContext,
  payload: ForgotPasswordPayload
) {
  const response = await request.post(
    `${BASE_URL}${API.AUTH.FORGOT_PASSWORD}`,
    {
      data: payload,
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );
  return response;
}

export async function apiResetPassword(
  request: APIRequestContext,
  payload: ResetPasswordPayload
) {
  const response = await request.post(`${BASE_URL}${API.AUTH.RESET_PASSWORD}`, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}

export async function loginAndGetToken(
  request: APIRequestContext,
  payload: LoginPayload
): Promise<string | null> {
  const response = await apiLogin(request, payload);
  if (!response.ok()) return null;
  const body = await response.json();
  return body?.data?.token ?? null;
}

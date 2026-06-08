/**
 * Profile API Helper
 * Playwright-native HTTP calls against user profile endpoints.
 */
import { APIRequestContext } from "@playwright/test";
import { API } from "../../constants/apiEndpoints";

const BASE_URL = process.env.API_BASE_URL;

/** GET /api/user-profile/profile (requires Bearer token) */
export async function apiGetProfile(request: APIRequestContext, token: string) {
  const response = await request.get(`${BASE_URL}${API.USER_PROFILE.GET}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response;
}

/** PUT /api/user-profile/update-profile (requires Bearer token) */
export async function apiUpdateProfile(
  request: APIRequestContext,
  token: string,
  payload: Record<string, unknown>
) {
  const response = await request.put(`${BASE_URL}${API.USER_PROFILE.UPDATE}`, {
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response;
}

/** GET /api/user-profile/profile without token (should fail with 401) */
export async function apiGetProfileUnauthorized(request: APIRequestContext) {
  const response = await request.get(`${BASE_URL}${API.USER_PROFILE.GET}`);
  return response;
}

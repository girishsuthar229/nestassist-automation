/**
 * Services API Helper
 * Playwright-native HTTP calls against services/categories endpoints.
 */
import { APIRequestContext } from "@playwright/test";
import { API } from "../../constants/apiEndpoints";

const BASE_URL = process.env.API_BASE_URL;

/** GET /api/services */
export async function apiGetServices(
  request: APIRequestContext,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await request.get(`${BASE_URL}${API.SERVICES.LIST}`, {
    headers,
  });
  return response;
}

/** GET /api/services/:id */
export async function apiGetServiceDetail(
  request: APIRequestContext,
  id: number,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await request.get(
    `${BASE_URL}${API.SERVICES.DETAIL(String(id))}`,
    { headers }
  );
  return response;
}

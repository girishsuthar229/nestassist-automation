import { APIRequestContext } from "@playwright/test";
import { API } from "../../constants/apiEndpoints";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

export async function apiGetServiceTypes(request: APIRequestContext) {
  const response = await request.get(`${BASE_URL}${API.SERVICES.TYPES}`);
  return response;
}

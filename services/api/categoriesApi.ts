import { APIRequestContext } from "@playwright/test";
import { API } from "../../constants/apiEndpoints";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

export async function apiGetCategories(request: APIRequestContext, serviceTypeId: number) {
  const response = await request.get(`${BASE_URL}${API.CATEGORIES.LIST_BY_SERVICE_TYPE(serviceTypeId)}`);
  return response;
}

export async function apiCreateCategories(request: APIRequestContext, serviceTypeId: number, payload: any) {
  const response = await request.post(`${BASE_URL}${API.CATEGORIES.LIST_BY_SERVICE_TYPE(serviceTypeId)}`, {
    data: payload
  });
  return response;
}

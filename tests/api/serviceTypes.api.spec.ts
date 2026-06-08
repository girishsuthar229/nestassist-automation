import { test, expect } from "@playwright/test";
import { apiGetServiceTypes } from "../../services/api/serviceTypesApi";

test.describe("API – Service Types Endpoints", () => {
  test("GET /api/service-types › [POSITIVE] Public endpoint should return list of service types", async ({
    request,
  }) => {
    const response = await apiGetServiceTypes(request);
    
    // Validate status
    expect(response.status()).toBe(200);

    // Validate response body shape
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBeTruthy();
    
    // Validate individual service type shape if data exists
    if (body.data.length > 0) {
      const serviceType = body.data[0];
      expect(serviceType).toHaveProperty("id");
      expect(serviceType).toHaveProperty("name");
      expect(serviceType).toHaveProperty("image");
      expect(serviceType).toHaveProperty("bannerImage");
    }
  });
});

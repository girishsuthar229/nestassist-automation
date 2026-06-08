import { test, expect } from "@playwright/test";
import { apiGetCategories } from "../../services/api/categoriesApi";

const MOCK_SERVICE_TYPE_ID = 8; // Based on the Python test logic

test.describe("API – Categories Endpoints", () => {
  test("GET /api/categories › [POSITIVE] Public endpoint should return list of categories for a service type", async ({
    request,
  }) => {
    const response = await apiGetCategories(request, MOCK_SERVICE_TYPE_ID);

    // Validate status
    expect(response.status()).toBe(200);

    // Validate response body shape
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBeTruthy();

    // Validate individual category shape if data exists
    if (body.data.length > 0) {
      const category = body.data[0];
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("service_type_id");
      expect(category.service_type_id).toBe(MOCK_SERVICE_TYPE_ID);
    }
  });
});

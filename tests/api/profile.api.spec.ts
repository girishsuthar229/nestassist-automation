/**
 * Profile API Tests – Direct HTTP Testing with Playwright request context
 *
 * Demonstrates:
 * - Playwright APIRequestContext for backend API calls
 * - Auth token injection via login first in beforeAll
 * - Protected endpoint testing (requires JWT)
 * - Positive (with token) & Negative (without token) scenarios
 *
 * ⚠️ REQUIRES: Backend running
 */
import { test, expect, request as playwrightRequest } from "@playwright/test";
import {
  apiGetProfile,
  apiGetProfileUnauthorized,
  apiUpdateProfile,
} from "../../services/api/profileApi";
import { apiLogin } from "../../services/api/authApi";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "homecare-admin@yopmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const PARTNER_EMAIL =
  process.env.PARTNER_EMAIL || "ravi.patel.cleanpro@yopmail.com";
const PARTNER_PASSWORD = process.env.PARTNER_PASSWORD || "Admin@123";

test.describe("API – User Profile Endpoint (/api/user-profile)", () => {
  let adminToken: string;
  let partnerToken: string;

  test.beforeAll(async () => {
    const apiContext = await playwrightRequest.newContext();

    const adminLoginRes = await apiLogin(apiContext, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    if (adminLoginRes.ok()) {
      adminToken = (await adminLoginRes.json()).data?.token;
    }

    const partnerLoginRes = await apiLogin(apiContext, {
      email: PARTNER_EMAIL,
      password: PARTNER_PASSWORD,
    });
    if (partnerLoginRes.ok()) {
      partnerToken = (await partnerLoginRes.json()).data?.token;
    }
  });

  test.describe("GET /api/user-profile/profile", () => {
    test("[NEGATIVE] Without token → 401 Unauthorized", async ({ request }) => {
      const response = await apiGetProfileUnauthorized(request);
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("[POSITIVE] Admin token → 200 with profile data", async ({
      request,
    }) => {
      if (!adminToken) test.skip();

      const profileResponse = await apiGetProfile(request, adminToken);
      expect(profileResponse.status()).toBe(200);

      const profileBody = await profileResponse.json();
      expect(profileBody.success).toBe(true);
      expect(profileBody.data).toHaveProperty("id");
      expect(profileBody.data).toHaveProperty("email");
      expect(profileBody.data).toHaveProperty("role");
      expect(profileBody.data).toHaveProperty("name");
    });

    test("[POSITIVE] Partner token → 200 with partner profile", async ({
      request,
    }) => {
      if (!partnerToken) test.skip();

      const profileResponse = await apiGetProfile(request, partnerToken);
      expect(profileResponse.status()).toBe(200);

      const profileBody = await profileResponse.json();
      expect(profileBody.data.role).toBe("SERVICE_PARTNER");
    });

    test("[NEGATIVE] Invalid/expired token → 403", async ({ request }) => {
      const response = await apiGetProfile(request, "invalid.jwt.token.here");
      expect(response.status()).toBe(403);
    });

    test("[POSITIVE] Profile response matches expected shape", async ({
      request,
    }) => {
      if (!adminToken) test.skip();

      const profileResponse = await apiGetProfile(request, adminToken);
      const body = await profileResponse.json();

      expect(body).toMatchObject({
        success: true,
        message: expect.any(String),
        data: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
        }),
      });
    });
  });

  test.describe("PUT /api/user-profile/update-profile", () => {
    test("[POSITIVE] Valid token → 200 updates profile data", async ({
      request,
    }) => {
      if (!adminToken) test.skip();

      const updatePayload = {
        type: "contact",
        role: "SUPER_ADMIN",
        mobile: "9856749621",
        email: "homecare-admin@yopmail.com",
        profile_address: "Near Karnavati Club, Ahmedabad, Gujarat",
      };

      const updateResponse = await apiUpdateProfile(
        request,
        adminToken,
        updatePayload
      );

      expect(updateResponse.status()).toBe(200);
      const updateBody = await updateResponse.json();

      expect(updateBody.success).toBe(true);
      expect(updateBody.data.mobile_number).toBe(updatePayload.mobile);
      expect(updateBody.data.email).toBe(updatePayload.email);
      expect(updateBody.data.profile_address).toBe(
        updatePayload.profile_address
      );
    });
  });
});

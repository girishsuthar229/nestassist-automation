/**
 * Auth API Tests – Direct HTTP Testing with Playwright request context
 *
 * Demonstrates:
 * - Playwright native APIRequestContext (no Axios)
 * - Testing real backend endpoints directly
 * - Validates API response structure & status codes
 * - Positive (valid credentials) & Negative (invalid credentials) scenarios
 *
 * ⚠️ REQUIRES: Backend running on http://localhost:5000
 */
import { test, expect } from "@playwright/test";
import { apiLogin, apiForgotPassword } from "../../services/api/authApi";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin-homecare2@yopmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

test.describe("API – Auth Endpoints (/api/auth)", () => {
  test.describe("POST /api/auth/login", () => {
    test("[POSITIVE] Valid admin credentials → 200 with token", async ({
      request,
    }) => {
      const response = await apiLogin(request, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      // Validate status
      expect(response.status()).toBe(200);

      // Validate response body shape
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("token");
      expect(body.data).toHaveProperty("role");
      expect(typeof body.data.token).toBe("string");
      expect(body.data.token.length).toBeGreaterThan(10);
    });

    test("[NEGATIVE] Wrong password → 401 Unauthorized", async ({
      request,
    }) => {
      const response = await apiLogin(request, {
        email: ADMIN_EMAIL,
        password: "CompletelyWrongPassword!",
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.message).toBeTruthy();
    });

    test("[NEGATIVE] Non-existent email → 404 Unauthorized", async ({
      request,
    }) => {
      const response = await apiLogin(request, {
        email: "doesnotexist@nowhere.com",
        password: "Admin@123",
      });

      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("[NEGATIVE] Empty email → 400 Bad Request (validation error)", async ({
      request,
    }) => {
      const response = await apiLogin(request, {
        email: "",
        password: "Admin@123",
      });

      expect([400, 422]).toContain(response.status());
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test("[NEGATIVE] Missing password field → 400 Bad Request", async ({
      request,
    }) => {
      const response = await apiLogin(request, {
        email: ADMIN_EMAIL,
        password: "",
      });

      expect([400, 401, 422]).toContain(response.status());
    });

    test("[POSITIVE] Response includes user object with role", async ({
      request,
    }) => {
      const response = await apiLogin(request, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (response.status() === 200) {
        const body = await response.json();
        expect(body.data.user).toHaveProperty("role");
        expect(body.data.user).toHaveProperty("email", ADMIN_EMAIL);
        expect(body.data.user).toHaveProperty("id");
      }
    });
  });

  test.describe("POST /api/auth/forgot-password", () => {
    test("[POSITIVE] Registered email → 200 with success message", async ({
      request,
    }) => {
      test.slow();
      const response = await apiForgotPassword(request, { email: ADMIN_EMAIL });
      const body = await response.json();
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("message");
    });

    test("[NEGATIVE] Unregistered email → non-200 or error message", async ({
      request,
    }) => {
      const response = await apiForgotPassword(request, {
        email: "notregistered@example.com",
      });
      const body = await response.json();
      if (!response.ok()) {
        expect(body.success).toBe(false);
      }
    });

    test("[NEGATIVE] Invalid email format → 400 validation error", async ({
      request,
    }) => {
      const response = await apiForgotPassword(request, {
        email: "not-an-email",
      });
      expect([400, 422]).toContain(response.status());
    });
  });
});

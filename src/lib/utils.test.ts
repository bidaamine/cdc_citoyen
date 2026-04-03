import { describe, expect, it } from "vitest";

import { nextExerciseYear, submissionWindowOpen } from "@/lib/utils";
import { validateUploadBatch } from "@/lib/uploads";
import { loginSchema } from "@/lib/validators";

describe("business helpers", () => {
  it("opens participation window only from january to march", () => {
    expect(submissionWindowOpen(new Date("2026-01-02"))).toBe(true);
    expect(submissionWindowOpen(new Date("2026-03-31"))).toBe(true);
    expect(submissionWindowOpen(new Date("2026-04-01"))).toBe(false);
  });

  it("computes the next exercise year", () => {
    expect(nextExerciseYear(new Date("2026-03-30"))).toBe(2027);
  });

  it("validates upload batches", () => {
    const result = validateUploadBatch([
      { size: 1024, type: "application/pdf" },
      { size: 2048, type: "image/png" },
    ]);

    expect(result.invalidType).toBe(false);
    expect(result.overTotal).toBe(false);
  });

  it("validates login input", () => {
    expect(
      loginSchema.safeParse({
        email: "citizen@cdc.dz",
        password: "demo12345",
      }).success,
    ).toBe(true);
  });
});

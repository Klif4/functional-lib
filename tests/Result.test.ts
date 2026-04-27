import { describe, it, expect, vi } from "vitest";
import { Result } from "../src/Result";

describe("Result", () => {
  describe("Result.ofSuccess", () => {
    it("creates a success", () => {
      expect(Result.ofSuccess(42).isSuccess()).toBe(true);
    });

    it("is not a failure", () => {
      expect(Result.ofSuccess(42).isFailure()).toBe(false);
    });
  });

  describe("Result.ofFailure", () => {
    it("creates a failure", () => {
      expect(Result.ofFailure("oops").isFailure()).toBe(true);
    });

    it("is not a success", () => {
      expect(Result.ofFailure("oops").isSuccess()).toBe(false);
    });
  });

  describe("isSuccess / isFailure", () => {
    it("isSuccess is true only for success", () => {
      expect(Result.ofSuccess(1).isSuccess()).toBe(true);
      expect(Result.ofFailure("err").isSuccess()).toBe(false);
    });

    it("isFailure is true only for failure", () => {
      expect(Result.ofFailure("err").isFailure()).toBe(true);
      expect(Result.ofSuccess(1).isFailure()).toBe(false);
    });
  });

  describe("onSuccess", () => {
    it("calls the callback with the value when success", () => {
      const fn = vi.fn();
      Result.ofSuccess(42).onSuccess(fn);
      expect(fn).toHaveBeenCalledWith(42);
    });

    it("does not call the callback when failure", () => {
      const fn = vi.fn();
      Result.ofFailure<number, string>("oops").onSuccess(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it("returns itself for chaining", () => {
      const result = Result.ofSuccess(1);
      expect(result.onSuccess(() => {})).toBe(result);
    });
  });

  describe("onFailure", () => {
    it("calls the callback with the error when failure", () => {
      const fn = vi.fn();
      Result.ofFailure("oops").onFailure(fn);
      expect(fn).toHaveBeenCalledWith("oops");
    });

    it("does not call the callback when success", () => {
      const fn = vi.fn();
      Result.ofSuccess(42).onFailure(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it("returns itself for chaining", () => {
      const result = Result.ofFailure("err");
      expect(result.onFailure(() => {})).toBe(result);
    });
  });

  describe("chaining onSuccess and onFailure", () => {
    it("can chain both handlers on a success", () => {
      const successFn = vi.fn();
      const failureFn = vi.fn();
      Result.ofSuccess(10).onSuccess(successFn).onFailure(failureFn);
      expect(successFn).toHaveBeenCalledWith(10);
      expect(failureFn).not.toHaveBeenCalled();
    });
  });

  describe("map", () => {
    it("transforms the value when success", () => {
      const result = Result.ofSuccess(2).map((x) => x * 3);
      expect(result.isSuccess()).toBe(true);
      result.onSuccess((v) => expect(v).toBe(6));
    });

    it("does not call the mapper when failure", () => {
      const fn = vi.fn();
      Result.ofFailure<number, string>("err").map(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it("preserves the error when failure", () => {
      const fn = vi.fn();
      Result.ofFailure<number, string>("err").map((x) => x * 2).onFailure(fn);
      expect(fn).toHaveBeenCalledWith("err");
    });
  });

  describe("get", () => {
    it("returns the value when success", () => {
      expect(Result.ofSuccess(7).get()).toBe(7);
    });

    it("throws when failure", () => {
      expect(() => Result.ofFailure("err").get()).toThrow();
    });
  });
});

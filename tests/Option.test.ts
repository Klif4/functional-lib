import { describe, it, expect, vi } from "vitest";
import { Option } from "../src/Option";

describe("Option", () => {
  describe("Option.of", () => {
    it("wraps a defined value as Some", () => {
      expect(Option.of(42).isSome()).toBe(true);
    });

    it("returns None for null", () => {
      expect(Option.of(null).isNone()).toBe(true);
    });

    it("returns None for undefined", () => {
      expect(Option.of(undefined).isNone()).toBe(true);
    });

    it("wraps falsy-but-defined values as Some (0, '', false)", () => {
      expect(Option.of(0).isSome()).toBe(true);
      expect(Option.of("").isSome()).toBe(true);
      expect(Option.of(false).isSome()).toBe(true);
    });
  });

  describe("Option.none", () => {
    it("creates a None", () => {
      expect(Option.none().isNone()).toBe(true);
    });
  });

  describe("isSome / isNone", () => {
    it("isSome is true for Some, false for None", () => {
      expect(Option.of("hello").isSome()).toBe(true);
      expect(Option.none<string>().isSome()).toBe(false);
    });

    it("isNone is true for None, false for Some", () => {
      expect(Option.none().isNone()).toBe(true);
      expect(Option.of("hello").isNone()).toBe(false);
    });
  });

  describe("map", () => {
    it("transforms the value when Some", () => {
      const result = Option.of(2).map((x) => x * 3);
      expect(result.getOrElse(0)).toBe(6);
    });

    it("does not call the mapper when None", () => {
      const fn = vi.fn();
      Option.none<number>().map(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it("returns None when None", () => {
      expect(Option.none<number>().map((x) => x * 3).isNone()).toBe(true);
    });

    it("can change the inner type", () => {
      const result: Option<string> = Option.of(42).map(String);
      expect(result.getOrElse("")).toBe("42");
    });
  });

  describe("getOrElse", () => {
    it("returns the inner value when Some", () => {
      expect(Option.of(99).getOrElse(0)).toBe(99);
    });

    it("returns the default when None", () => {
      expect(Option.none<number>().getOrElse(42)).toBe(42);
    });
  });
});

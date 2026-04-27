/**
 * Represents an optional value: either `Some<T>` (a value exists) or `None` (no value).
 *
 * Use `Option` instead of `null` or `undefined` to make the absence of a value
 * explicit and force callers to handle both cases.
 *
 * @example
 * ```ts
 * const name: Option<string> = Option.of(user.name);
 *
 * const greeting = name
 *   .map(n => `Hello, ${n}!`)
 *   .getOrElse("Hello, stranger!");
 * ```
 *
 * @typeParam T - The type of the wrapped value.
 */
export class Option<T> {
  private constructor(private readonly value: T | null | undefined) {}

  // ── Construction ─────────────────────────────────────────────────────────

  /**
   * Creates a `Some<T>` if `value` is neither `null` nor `undefined`,
   * otherwise returns `None`.
   *
   * @example
   * ```ts
   * Option.of(42)        // Some(42)
   * Option.of(null)      // None
   * Option.of(undefined) // None
   * Option.of(0)         // Some(0)  ← falsy but defined, still Some
   * ```
   */
  static of<T>(value: T | null | undefined): Option<T> {
    return new Option<T>(value);
  }

  /**
   * Returns the empty `Option` — `None`.
   *
   * @example
   * ```ts
   * Option.none<string>() // None
   * ```
   */
  static none<T = never>(): Option<T> {
    return new Option<T>(undefined);
  }

  // ── Type guards ──────────────────────────────────────────────────────────

  /**
   * Returns `true` when this Option holds a value (`Some`).
   */
  isSome(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  /**
   * Returns `true` when this Option is empty (`None`).
   */
  isNone(): boolean {
    return !this.isSome();
  }

  // ── Transformation ───────────────────────────────────────────────────────

  /**
   * Applies `fn` to the inner value and returns a new `Option<U>`.
   * Does nothing and returns `None` if this Option is empty.
   *
   * @example
   * ```ts
   * Option.of(2).map(x => x * 3)          // Some(6)
   * Option.none<number>().map(x => x * 3)  // None
   * ```
   */
  map<U>(fn: (value: T) => U): Option<U> {
    if (this.isNone()) return Option.none<U>();
    return Option.of(fn(this.value as T));
  }

  // ── Extraction ───────────────────────────────────────────────────────────

  /**
   * Returns the inner value when `Some`, or `defaultValue` when `None`.
   *
   * @example
   * ```ts
   * Option.of(5).getOrElse(0)        // 5
   * Option.none<number>().getOrElse(0) // 0
   * ```
   */
  getOrElse(defaultValue: T): T {
    return this.isSome() ? (this.value as T) : defaultValue;
  }
}

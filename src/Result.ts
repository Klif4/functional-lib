/**
 * Represents the outcome of an operation: either `Success<T>` or `Failure<E>`.
 *
 * Use `Result` instead of throwing exceptions to make error paths explicit
 * and composable.
 *
 * @example
 * ```ts
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) return Result.ofFailure("Division by zero");
 *   return Result.ofSuccess(a / b);
 * }
 *
 * divide(10, 2)
 *   .onSuccess(v => console.log("Result:", v))
 *   .onFailure(e => console.error("Error:", e));
 * ```
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the failure error.
 */
export class Result<T, E> {
  private constructor(
    private readonly _value: T | undefined,
    private readonly _error: E | undefined,
    private readonly _isSuccess: boolean,
  ) {}

  // ── Construction ─────────────────────────────────────────────────────────

  /**
   * Creates a successful `Result` wrapping `value`.
   *
   * @example
   * ```ts
   * Result.ofSuccess(42) // Success(42)
   * ```
   */
  static ofSuccess<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined, true);
  }

  /**
   * Creates a failed `Result` wrapping `error`.
   *
   * @example
   * ```ts
   * Result.ofFailure("not found") // Failure("not found")
   * ```
   */
  static ofFailure<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error, false);
  }

  // ── Type guards ──────────────────────────────────────────────────────────

  /**
   * Returns `true` when this Result is a success.
   */
  isSuccess(): boolean {
    return this._isSuccess;
  }

  /**
   * Returns `true` when this Result is a failure.
   */
  isFailure(): boolean {
    return !this._isSuccess;
  }

  // ── Callbacks ────────────────────────────────────────────────────────────

  /**
   * Calls `fn` with the success value if this Result is a success.
   * Returns `this` for chaining with {@link onFailure}.
   *
   * @example
   * ```ts
   * Result.ofSuccess(42)
   *   .onSuccess(v => console.log("value:", v))
   *   .onFailure(e => console.error("error:", e));
   * ```
   */
  onSuccess(fn: (value: T) => void): this {
    if (this._isSuccess) fn(this._value as T);
    return this;
  }

  /**
   * Calls `fn` with the error if this Result is a failure.
   * Returns `this` for chaining with {@link onSuccess}.
   *
   * @example
   * ```ts
   * Result.ofFailure("oops")
   *   .onSuccess(v => console.log("value:", v))
   *   .onFailure(e => console.error("error:", e));
   * ```
   */
  onFailure(fn: (error: E) => void): this {
    if (!this._isSuccess) fn(this._error as E);
    return this;
  }

  // ── Transformation ───────────────────────────────────────────────────────

  /**
   * Applies `fn` to the success value and returns a new `Result<U, E>`.
   * Passes the failure through unchanged if this Result is a failure.
   *
   * @example
   * ```ts
   * Result.ofSuccess(2).map(x => x * 3)          // Success(6)
   * Result.ofFailure<number, string>("err").map(x => x * 2) // Failure("err")
   * ```
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (!this._isSuccess) return Result.ofFailure<U, E>(this._error as E);
    return Result.ofSuccess<U, E>(fn(this._value as T));
  }

  // ── Extraction ───────────────────────────────────────────────────────────

  /**
   * Returns the success value.
   * Throws an error if this Result is a failure.
   *
   * @throws {Error} When called on a failure.
   *
   * @example
   * ```ts
   * Result.ofSuccess(7).get() // 7
   * Result.ofFailure("err").get() // throws Error
   * ```
   */
  get(): T {
    if (!this._isSuccess) throw new Error("Cannot get value of a failure Result");
    return this._value as T;
  }
}

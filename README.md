# @klif/functional-lib

Lightweight TypeScript functional primitives: `Option` and `Result`.

No dependencies. Fully typed. Designed to make absent values and error paths explicit without the overhead of a full functional library.

## Installation

```bash
yarn add @klif/functional-lib
# or
npm install @klif/functional-lib
```

## Option\<T\>

Represents a value that may or may not be present. Replaces `null` / `undefined` with an explicit, chainable container.

### Creating an Option

```ts
import { Option } from "@klif/functional-lib";

Option.of(42)        // Some(42) — value exists
Option.of(null)      // None     — no value
Option.of(undefined) // None     — no value
Option.of(0)         // Some(0)  — falsy but defined → Some
```

### Checking presence

```ts
const opt = Option.of(user.email);

opt.isSome() // true if a value is present
opt.isNone() // true if no value
```

### Transforming the value

`map` applies a function to the inner value and returns a new `Option`. Does nothing if the Option is `None`.

```ts
Option.of("hello")
  .map(s => s.toUpperCase())
  .getOrElse("no value") // "HELLO"

Option.none<string>()
  .map(s => s.toUpperCase())
  .getOrElse("no value") // "no value"
```

### Extracting the value

`getOrElse` returns the inner value, or a fallback if the Option is `None`.

```ts
Option.of(42).getOrElse(0)        // 42
Option.none<number>().getOrElse(0) // 0
```

### Full example

```ts
function findUser(id: string): Option<User> {
  const user = db.users.find(u => u.id === id);
  return Option.of(user);
}

const greeting = findUser("abc123")
  .map(u => `Hello, ${u.name}!`)
  .getOrElse("User not found");
```

---

## Result\<T, E\>

Represents the outcome of an operation — either a success holding a value `T`, or a failure holding an error `E`. Replaces thrown exceptions with an explicit, chainable return value.

### Creating a Result

```ts
import { Result } from "@klif/functional-lib";

Result.ofSuccess(42)       // Success(42)
Result.ofFailure("oops")   // Failure("oops")
```

### Checking the outcome

```ts
result.isSuccess() // true if successful
result.isFailure() // true if failed
```

### Reacting to the outcome

`onSuccess` and `onFailure` accept callbacks and return `this` for chaining. Only the matching callback is called.

```ts
Result.ofSuccess(42)
  .onSuccess(v => console.log("value:", v))   // called
  .onFailure(e => console.error("error:", e)); // skipped

Result.ofFailure("not found")
  .onSuccess(v => console.log("value:", v))   // skipped
  .onFailure(e => console.error("error:", e)); // called
```

### Transforming the value

`map` applies a function to the success value and returns a new `Result`. The failure passes through unchanged.

```ts
Result.ofSuccess(2)
  .map(x => x * 3)
  .onSuccess(v => console.log(v)); // 6

Result.ofFailure<number, string>("err")
  .map(x => x * 3)
  .onFailure(e => console.log(e)); // "err"
```

### Extracting the value

`get` returns the success value directly. Throws if the Result is a failure — use it only when you have already checked `isSuccess()`.

```ts
const result = Result.ofSuccess(7);
if (result.isSuccess()) {
  result.get(); // 7
}

Result.ofFailure("err").get(); // throws Error
```

### Full example

```ts
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Result.ofFailure("Division by zero");
  return Result.ofSuccess(a / b);
}

divide(10, 2)
  .map(v => Math.round(v))
  .onSuccess(v => console.log("Result:", v))
  .onFailure(e => console.error("Error:", e));
```

---

## API reference

### Option\<T\>

| Method | Signature | Description |
|---|---|---|
| `Option.of` | `(value: T \| null \| undefined) => Option<T>` | `Some` if value is defined, `None` otherwise |
| `Option.none` | `() => Option<T>` | Always returns `None` |
| `isSome` | `() => boolean` | `true` if a value is present |
| `isNone` | `() => boolean` | `true` if no value |
| `map` | `(fn: T => U) => Option<U>` | Transforms the inner value, no-op on `None` |
| `getOrElse` | `(defaultValue: T) => T` | Returns the value or the fallback |

### Result\<T, E\>

| Method | Signature | Description |
|---|---|---|
| `Result.ofSuccess` | `(value: T) => Result<T, E>` | Creates a success |
| `Result.ofFailure` | `(error: E) => Result<T, E>` | Creates a failure |
| `isSuccess` | `() => boolean` | `true` if success |
| `isFailure` | `() => boolean` | `true` if failure |
| `onSuccess` | `(fn: T => void) => this` | Callback on success, chainable |
| `onFailure` | `(fn: E => void) => this` | Callback on failure, chainable |
| `map` | `(fn: T => U) => Result<U, E>` | Transforms the success value, passes failure through |
| `get` | `() => T` | Returns the value or throws if failure |

## License

MIT

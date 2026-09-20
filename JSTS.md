# JS + TypeScript — оглавление для Senior

## Язык, типы и значения
→ [детализация](./JSTS-01.md)
1\. Примитивы vs объекты, boxing/unboxing
2\. `undefined`, `null`, `NaN`, `document.all` и особые значения
3\. `typeof`, `instanceof`, `Object.prototype.toString`
4\. Equality: `==` vs `===`, `Object.is`, SameValueZero
5\. Приведение типов, ToPrimitive, `valueOf`/`toString`
6\. Truthy/falsy, `??`, `||`, `&&`, optional chaining
7\. Числа: IEEE-754, точность, `BigInt`, `Number.isNaN`/`isFinite`
8\. Строки: Unicode, grapheme, `Intl`, нормализация
9\. Символы: well-known symbols, скрытые ключи
10\. `Object` vs `Map` vs `WeakMap`, ключи и порядок свойств
11\. `Set`/`WeakSet`, сравнение коллекций
12\. Структурная типизация vs номинальная (TS vs Java/C#)
13\. Type erasure: что исчезает в runtime
14\. `any` / `unknown` / `never` / `void`
15\. Literal types, widening, narrowing
16\. `const` assertions, `as const`, `readonly`
17\. `satisfies` vs type annotation vs assertion
18\. Type vs interface vs type alias: пересечения и различия
19\. Declaration merging
20\. Ambient types, `declare`, `.d.ts`
21\. Module augmentation, global augmentation
22\. Enums: numeric, string, const enum, pitfalls
23\. Tuple types, labeled tuples, variadic tuples
24\. Template literal types
25\. Branded / opaque types
26\. Discriminated unions, exhaustive `never` checks
27\. Index signatures, mapped types, `Record`
28\. Optional, `?`, `| undefined`, exactOptionalPropertyTypes
29\. Excess property checks
30\. Compatibility: assignability, bivariance функций, variance generics

## Область видимости, выполнение, `this`
→ [детализация](./JSTS-02.md)
31\. Lexical scope, scope chain, global object
32\. Hoisting, TDZ, `var`/`let`/`const`
33\. Closures: lifetime, утечки, модульный паттерн
34\. `this` в функциях, методах, колбэках, strict mode
35\. Arrow functions vs regular: `this`, `arguments`, `new`, prototype
36\. `call` / `apply` / `bind`, partial application
37\. `new`, `[[Construct]]`, `[[Call]]`
38\. Strict mode: отличия поведения
39\. IIFE, блочная область, module scope
40\. Temporal Dead Zone в классах и полях

## Объекты, прототипы, классы
→ [детализация](./JSTS-03.md)
41\. Prototype chain, `__proto__` vs `prototype`
42\. `Object.create`, null-prototype objects
43\. Property descriptors: writable, enumerable, configurable
44\. Getters/setters, accessors vs data properties
45\. `defineProperty`, `preventExtensions`, `seal`, `freeze`
46\. Inheritance: prototypal vs class
47\. `super`, `new.target`, derived constructors
48\. Static members, private fields `#`, WeakMap-emulation
49\. Class fields vs constructor assignment, initialization order
50\. Mixins, composition over inheritance
51\. `instanceof` pitfalls across realms/iframes
52\. Prototype pollution (JS) и защита
53\. `Object.assign`, spread, shallow vs deep copy
54\. Structured clone, `structuredClone`
55\. Immutability patterns без библиотек и с Immer-моделью мышления
56\. Property enumeration: `for…in`, `keys`, `getOwnProperty*`
57\. Symbols as unique keys, well-known: `toStringTag`, `hasInstance`, `iterator`
58\. Extending built-ins: Array/Error/Promise pitfalls
59\. `toJSON`, custom serialization
60\. `valueOf` и неявные преобразования объектов

## Функции и функциональный стиль
61\. First-class functions, higher-order functions
62\. Pure functions, side effects, referential transparency
63\. Currying, partial application, composition
64\. Recursion, TCO (и почему в JS его нет)
65\. Rest/spread, default parameters, parameter destructuring
66\. `arguments` vs rest, arrow limitations
67\. Function length, name, toString
68\. Generator functions vs async generators
69\. Iterator protocol, iterable protocol, `for…of`
70\. Custom iterables, infinite sequences
71\. `yield*`, two-way generators, `throw`/`return`
72\. Memoization, lazy evaluation
73\. Functors/monads на уровне практики: Promise, Array, Optional
74\. Point-free style: когда вреден
75\. Predicate types, type guards, assertion functions (`asserts`)
76\. Overload signatures vs implementation signature
77\. Function types: parameters contravariance, return covariance
78\. `this` parameter in TS
79\. Generic functions, inference, constraints, defaults
80\. Call signatures, construct signatures, callable objects

## Асинхронность и конкурентность
81\. Call stack, heap, queue
82\. Event loop: browsers vs Node (phases)
83\. Macrotasks vs microtasks
84\. `Promise` states, chaining, `thenable`
85\. `Promise.all` / `allSettled` / `race` / `any`
86\. Unhandled rejections
87\. `async`/`await`, desugaring, error boundaries
88\. Sequential vs parallel vs pool/limit concurrency
89\. Cancellation: AbortController, AbortSignal, race-cancel
90\. Timeouts, retries, backoff, jitter
91\. Async iterators, `for await…of`
92\. Streams: WHATWG ReadableStream / TransformStream
93\. Node streams vs Web streams
94\. `queueMicrotask`, `MutationObserver`, `MessageChannel` tricks
95\. `requestAnimationFrame`, `requestIdleCallback`
96\. Web Workers, SharedWorker, Service Worker (JS-модель)
97\. `postMessage`, structured clone, transferable
98\. SharedArrayBuffer, Atomics, memory model
99\. Deadlocks/starvation на уровне event loop
100\. Top-level await, module evaluation order
101\. Async context: `AsyncLocalStorage`, `AsyncContext` proposal
102\. Error propagation в графах промисов
103\. Backpressure
104\. Debounce / throttle / leading-trailing
105\. Scheduler / yielding long tasks (`scheduler.yield`)

## Модули, сборка, runtime-границы
106\. ESM vs CJS: syntax, live bindings, circular deps
107\. Default vs named exports, interop (`esModuleInterop`)
108\. Dynamic `import()`, `import.meta`
109\. Package exports, dual packages, `exports`/`imports` map
110\. Conditional exports: `import`/`require`/`types`/`browser`
111\. Tree-shaking, sideEffects, pure annotations
112\. Barrel files и стоимость re-export
113\. Module resolution: Node10, Node16, Bundler
114\. `paths`, `baseUrl`, path aliases vs runtime
115\. Isolated modules, `verbatimModuleSyntax`
116\. `import type` / `export type`, type-only imports
117\. Triple-slash directives
118\. Ambient modules, wildcard modules, `*.css`/`*.svg` types
119\. Monorepo types: project references, `composite`
120\. `skipLibCheck`, declaration emit, `d.ts` maps
121\. Runtime: browser vs Node vs Deno vs workers
122\. Realms, iframes, multiple JS heaps
123\. Polyfills vs transforms (core-js, SWC, Babel)
124\. Target/lib в tsconfig vs реальный runtime
125\. Feature detection vs UA sniffing

## TypeScript как система типов (глубоко)
126\. Control-flow analysis, narrowing
127\. Discriminant, `in`, `typeof`, `instanceof`, custom guards
128\. Distributive conditional types
129\. `infer`, nested infer, infer constraints
130\. Recursive types, tail-recursive conditional types
131\. Mapped types: `keyof`, remapping `as`, modifiers `-?`/`+readonly`
132\. Key remapping, filtering keys
133\. Indexed access types, `T[K]`, unions of keys
134\. `typeof` operator (TS), `keyof typeof`
135\. Utility types: `Partial`, `Required`, `Pick`, `Omit`, `Exclude`, `Extract`, `NonNullable`
136\. `ReturnType`, `Parameters`, `ConstructorParameters`, `InstanceType`
137\. `Awaited`, `ThisParameter`, `OmitThisParameter`
138\. Собственные utility types: DeepPartial, DeepReadonly, Paths, UnionToIntersection
139\. Intersection vs union: distributive laws, simplification
140\. `unique symbol`
141\. Const type parameters
142\. NoInfer, Exact types (паттерны)
143\. Variadic tuple inference
144\. Function overloads vs unions of functions
145\. Higher-kinded types: почему нет и как эмулировать
146\. Type predicates на массивах (`filter` + guard)
147\. Template literal inference для CSS/routes/events
148\. Pattern matching types (extract by shape)
149\. JSON-safe types, serializable constraints
150\. `strict`, `strictNullChecks`, `strictFunctionTypes`, `noUncheckedIndexedAccess`
151\. `noImplicitAny`, `noImplicitThis`, `useUnknownInCatchVariables`
152\. `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`
153\. `erasableSyntaxOnly` / isolatedDeclarations (новые ограничения)
154\. `satisfies` для конфигов и литеральных карт
155\. Assertion: `as`, `as const`, non-null `!`, опасность
156\. Type instantiation depth / complexity limits
157\. Performance типов: как не убить tsserver
158\. Display of types: hover, simplification, `Expand` helpers
159\. Variance annotations в будущем / текущие правила
160\. `this` types, polymorphic `this`
161\. Mixins typing, constructor type parameters
162\. Decorators: Stage 3, metadata, typing
163\. Abstract classes vs interfaces vs types
164\. Namespace (не модули): когда ещё встречаются
165\. JSX types: `JSX.Element`, `ReactElement`, intrinsic elements (без React-логики UI)
166\. Module vs script files, `export {}`
167\. `resolveJsonModule`
168\. Source maps, `inlineSources`, debugging TS
169\. `ts-reset` / DOM lib mismatches
170\. DefinitelyTyped, `@types/*`, versioning types

## Ошибки, контракты, валидация
171\. `Error` hierarchy, custom errors, `cause`, stack
172\. `try/catch/finally`, catch binding, optional catch
173\. Throw non-Error: почему плохо
174\. Result/Either vs exceptions
175\. Domain errors vs infrastructure errors
176\. Zod/Valibot/io-ts: runtime ↔ compile-time bridge
177\. Parsing vs validating vs typing
178\. Standard Schema / schema-first API
179\. `unknown` at boundaries: API, storage, postMessage
180\. Exhaustiveness и невозможные состояния
181\. Invariants, asserts, `never` after check
182\. Error serialization across workers/network

## Память, производительность JS
183\. GC: generational, mark-sweep, incremental
184\. Retainers, detached DOM/objects, leak patterns
185\. Closures holding large scopes
186\. Hidden classes / shapes (V8), megamorphic
187\. Inline caches, deopts
188\. Hidden costs: boxing, holes in arrays, sparse arrays
189\. Packed vs holey arrays, SMI vs double vs boxed
190\. Monomorphism в горячих путях
191\. Allocation pressure, object pooling (когда нет)
192\. Strings intern, concatenation, ropes
193\. `WeakRef`, `FinalizationRegistry`
194\. Memory profiling: heap snapshot, allocation timeline
195\. CPU profiling, flamegraphs
196\. Long tasks, INP, yielding
197\. Micro-benchmarks: как врать себе
198\. JSON.parse/stringify cost, streaming JSON
199\. Binary data: ArrayBuffer, TypedArray, DataView
200\. TextEncoder/Decoder, WASM interop at JS boundary
201\. `performance.now`, marks/measures
202\. Lazy init, code splitting at language level

## Коллекции, алгоритмы, данные
203\. Array methods: mutating vs non-mutating
204\. Stable sort, compare functions
205\. Typed arrays vs Array
206\. Map iteration order, insertion order guarantees
207\. Weak collections и GC-friendly caches
208\. Structural sharing
209\. Immer-like patches conceptually
210\. Diffing plain objects
211\. Deep equality
212\. Hashing in userland
213\. LRU/LFU caches
214\. Queue/stack/deque на массивах
215\. Binary search, slicing, windowing
216\. Sorting large lists, comparative vs radix
217\. Avoiding O(n²) в идиоматичном JS
218\. Numeric separators, typed numeric APIs
219\. Temporal API vs `Date` pitfalls
220\. `Intl`: Collator, NumberFormat, DateTimeFormat, PluralRules, RelativeTime

## Метапрограммирование
221\. `Proxy`: traps, invariants
222\. `Reflect` API
223\. Revocable proxies
224\. Observable/reactive на Proxy (модель)
225\. `eval`, `Function`, `new Function` — риски и CSP
226\. `with` (запрещённый)
227\. Dynamic property access vs types
228\. Decorators и metadata reflection
229\. AST-мышление: Babel/TS compiler API на уровне понятий
230\. Macro-like: babel plugins, const enum, dead code

## Безопасность на уровне языка
231\. Prototype pollution
232\. XSS sinks в строках/URL (без React-specific)
233\. Injection: SQL/command через шаблонные строки
234\. `innerHTML` vs text
235\. CSP и eval
236\. ReDoS
237\. Timing attacks на строках
238\. Secrets в бандле, source maps
239\. Safe integer, overflow
240\. `postMessage` origin checks
241\. Structured clone vs JSON: prototype loss
242\. Supply chain: prototype patching, monkey patching
243\. Frozen intrinsics / lockdown (SES) — идея
244\. `Object.create(null)` для словарей

## Браузерные и платформенные JS API (язык, не UI-фреймворк)
245\. Event target, capturing/bubbling, delegation
246\. `addEventListener` options: capture, once, passive, signal
247\. Microtask vs rendering pipeline
248\. `queueMicrotask` vs Promise.then
249\. Fetch: body streams, duplex, abort, CORS preflight (JS-сторона)
250\. Headers, FormData, URLSearchParams, URL, URLPattern
251\. Blob, File, FileReader, Object URLs
252\. IndexedDB vs Cache Storage vs localStorage
253\. History API, Navigation API (JS)
254\. Crypto.subtle
255\. Permissions, Clipboard
256\. IntersectionObserver, MutationObserver, ResizeObserver, PerformanceObserver
257\. CustomEvent, event retargeting
258\. Shadow DOM encapsulation на уровне JS-границ
259\. `structuredClone` vs MessageChannel
260\. `reportError`, ErrorEvent

## Node/серверный JS, который спрашивают Senior Frontend
261\. EventEmitter vs WhatWG EventTarget
262\. `process.nextTick` vs Promise vs setImmediate
263\. Buffer vs Uint8Array
264\. `fs` promises, streams
265\. Worker threads vs cluster
266\. ESM в Node, `type: module`, `.cjs/.mjs`
267\. `node:` protocol imports
268\. Undici fetch в Node
269\. Diagnostics channel, async_hooks (обзор)
270\. CPU-bound vs IO-bound на single thread

## Стиль, контракты API, DX
271\. Public API design: overloads, defaults, options objects
272\. Breaking changes: types as contract
273\. Semantic versioning для `.d.ts`
274\. Deprecation в JSDoc/TS
275\. JSDoc vs TS: `@typedef`, `@template`
276\. Documentation types: examples that typecheck
277\. Lint: ESLint, typescript-eslint type-aware rules
278\. `no-floating-promises`, `strict-boolean-expressions`
279\. Prettier vs compiler formatting limits
280\. `tsc --noEmit` vs transpile-only (SWC/Babel)
281\. Dual publish: ESM+CJS+types
282\. API Extractor, dts rollup
283\. Source of truth: types-first vs implementation-first

## Паттерны и архитектура на JS/TS
284\. Module pattern, revealing module
285\. Factory, builder, fluent API typing
286\. Strategy/policy as functions
287\. Observer vs pub/sub vs event emitter
288\. Middleware chain (onion)
289\. Dependency injection без фреймворка: factories, context
290\. Anti-corruption layer: DTO ↔ domain types
291\. Feature flags typing
292\. Finite state machines (XState-мышление) на union states
293\. Command/Query separation в функциях
294\. Retry/circuit breaker как HOF
295\. Adapter around vendor libs, typing wrappers
296\. Plugin systems: typed registries, declaration merging
297\. Event sourcing lite: typed events union
298\. Capability-based design (минимальные интерфейсы)
299\. Law of Demeter, object graphs
300\. Avoiding God objects / anemic vs rich (в TS-доменах)

## Тестирование языка и типов
301\. Unit vs integration для чистых функций
302\. Fake timers, event loop in tests
303\. Testing async: microtasks flush
304\. Property-based testing
305\. Snapshot of types (`expect-type`, `tsd`, `vitest` typecheck)
306\. Testing type guards
307\. Mocking modules: ESM pitfalls
308\. Determinism: clocks, RNG, locales
309\. Coverage vs mutation testing (идея)

## Стандарты, история, «почему так»
310\. ES5 → ES202x timeline: что реально важно
311\. TC39 stages, как читать proposals
312\. Why no integers, why this, why prototypical
313\. Annex B, sloppy mode leftovers
314\. `with`, `arguments.callee`, deprecated
315\. Temporal, records/tuples, pipeline, pattern matching — статус
316\. Iterator helpers, Set methods, Promise.try
317\. Explicit resource management: `using`, `Symbol.dispose`
318\. Decorators standardization vs legacy
319\. Import attributes, JSON modules
320\. Type annotations as comments / types as comments proposals

## Собеседованческие «ловушки» и задачи
321\. Closures in loops (`var` vs `let`)
322\. `this` quiz combinations
323\. Promise vs setTimeout order
324\. `[] == ![]`, coercion puzzles — и когда это не про seniority
325\. Flatten, debounce, promisify, retry, p-limit с нуля
326\. Event emitter с once/off
327\. Deep clone / deep equal
328\. `bind` polyfill, `new` polyfill
329\. Curry with placeholders
330\. LRU cache
331\. Async pool / map-limit
332\. Parse query string / URL
333\. Implement `Object.create` / `instanceof`
334\. Implement `Promise.all` / `allSettled`
335\. Type: `DeepReadonly`, `Pick`/`Omit`, `Path<T>`, `Get<T, Path>`
336\. Type: function composition types
337\. Type: event map `on(event, handler)` inference
338\. Type: builder with progressive types
339\. Type: CSS-in-JS / Tailwind class autocomplete
340\. Explain a 200-line type error

## Качество мышления Senior
341\. Когда типы врут: lies at the boundary
342\. Runtime completeness vs compile-time completeness
343\. Cost of abstraction vs cost of duplication
344\. Readability of types vs cleverness
345\. Breaking users of library types
346\. Migrating JS → TS: strategy, `allowJs`, `checkJs`, incremental
347\. `any` budget, escape hatches policy
348\. When not to type everything
349\. Debugging: sourcemaps, original vs generated
350\. Communicating tradeoffs: ESM, strictness, target

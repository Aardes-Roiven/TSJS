# Функции и функциональный стиль

Детализация секции 4 из [JSTS.md](./JSTS.md). Пункты **61–80**.

Конспект для собеседования: в каждой теме сначала **о чём речь и зачем спрашивают**, потом устройство, ловушки и TypeScript.

---

### 61. First-class functions, higher-order functions

О чём речь: в JavaScript функция — такое же значение, как число или объект. Её можно положить в переменную, передать аргументом, вернуть из другой функции, положить в массив. Это **first-class**. Функция, которая принимает или возвращает функцию, — **higher-order** (HOF). На Senior это не определение из учебника, а объяснение, почему `map`/`filter`, middleware, `useEffect` и `bind` устроены так, а не иначе, и чем это отличается от «метода, который просто вызывает колбэк внутри класса».

---

#### Функция как значение

У функции есть тело и окружение (замыкание, п. 33). Вызов — отдельная операция: `fn` и `fn()` это разные вещи. Без скобок передают **саму функцию**; со скобками — **результат вызова**.

```js
function greet(name) {
  return `hi, ${name}`;
}

const also = greet;      // то же значение
const text = greet("Ada"); // уже строка

[1, 2, 3].map(String);  // передали функцию
[1, 2, 3].map(String()); // TypeError: String() вернул "", это не функция
```

Класс с методом `handleClick` на экземпляре — не то же самое, что first-class функция: метод ещё зависит от `this` (п. 34). Стрелка или `bind` как раз делают из метода обычное значение, которое можно передать в `addEventListener`.

---

#### Higher-order: два направления

1. **Принимает функцию** — стратегия снаружи: `array.map(fn)`, `setTimeout(fn, 0)`, `fs.readFile(path, cb)`.
2. **Возвращает функцию** — фабрика поведения: `makeAdder(n)`, `debounce(fn)`, `withRetry(fn)`.

Часто оба сразу:

```js
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (called) return result;
    called = true;
    result = fn.apply(this, args);
    return result;
  };
}

const init = once(() => console.log("boot"));
init(); // "boot"
init(); // тишина, тот же result
```

`once` — HOF: взяла функцию, вернула другую. Состояние `called` живёт в замыкании, не в глобале.

---

#### Ловушка: передали вызов вместо функции

```js
button.addEventListener("click", handler()); // handler уже выполнился при регистрации
setTimeout(fetchData(), 1000);               // fetchData() сейчас, таймер получит Promise/undefined
users.filter(isActive());                    // isActive() должен вернуть функцию-предикат, иначе TypeError
```

Исключение — фабрика: `setTimeout(makeLogger("tick"), 0)` нормально, если `makeLogger` **возвращает** функцию.

Вторая ловушка: HOF, который зовёт колбэк синхронно (`arr.map`), vs отложенно (`then`, `setTimeout`). Замыкание видит переменные **на момент вызова колбэка**, не на момент передачи (п. 33, цикл + `var`).

---

#### TypeScript

Тип функции — `(a: A) => B` или call signature (п. 80). HOF типизируют дженериком, чтобы не потерять аргументы колбэка:

```ts
function map<T, U>(xs: T[], fn: (x: T, i: number) => U): U[] {
  return xs.map(fn);
}
```

`Function` как тип — почти `any` для вызова: принимают что угодно «с callable». В строгом коде — конкретная сигнатура или generic. Методы vs свойства-функции: `onClick?: () => void` в props — first-class; `onClick()` в классе без bind ломает `this` в рантайме, типы это часто **не** ловят, если `this` не аннотирован (п. 78).

Что сказать на собеседовании: функция — значение. HOF принимает или возвращает функцию. Путают `fn` и `fn()`. Типизация HOF — дженерик по колбэку, не `Function`.

---

### 62. Pure functions, side effects, referential transparency

О чём речь: **чистая** функция для одних и тех же аргументов всегда даёт тот же результат и ничего снаружи не меняет. **Побочный эффект** — запись в переменную снаружи, DOM, сеть, `Date.now()`, `Math.random()`, лог. **Referential transparency** — вызов можно мысленно заменить на его значение, и программа не изменится. На собеседовании это про тестируемость, предсказуемый рендер и почему `array.sort` «не функциональный», хотя выглядит как метод цепочки.

---

#### Три оси чистоты

1. **Детерминизм.** `add(1, 2)` всегда `3`. `now()` каждый раз другое — не чисто.
2. **Нет записи наружу.** Не трогает аргументы-объекты, глобал, DOM.
3. **Нет чтения скрытого входа.** Не читает глобал, который могут сменить между вызовами.

```js
function add(a, b) {
  return a + b; // чисто
}

function addTax(price, cart) {
  cart.total += price; // мутация аргумента — эффект
  return cart.total;
}

function stamp() {
  return Date.now(); // скрытый вход — часы
}
```

Чистота **относительна**: функция может быть чистой относительно данных и всё равно логировать. На практике говорят «чистая по данным»: не мутирует state, эффекты вынесены на край (`useEffect`, обработчик, слой I/O).

---

#### Прозрачность ссылок

Если `f` чистая, `f(x) + f(x)` можно заменить на `const y = f(x); y + y` — тот же смысл. Если внутри счётчик вызовов — нельзя: два вызова и один — разное.

Иммутабельность (п. 55) помогает чистоте: вернули новый объект, старый не тронули. Но новая ссылка каждый раз ломает `React.memo` / `===`, если не структурный sharing. Чистота значений и стабильность ссылок — разные требования.

---

#### Ловушка: «чистый» map с мутацией

```js
const users = [{ name: "Ada", n: 0 }];

users.map((u) => {
  u.n += 1; // эффект: исходный массив испорчен
  return u;
});

users[0].n; // 1
```

`map` создаёт новый **массив**, но те же объекты внутри. Цепочка `map`/`filter` не делает программу чистой сама по себе.

`sort`, `reverse`, `splice` мутируют исходный массив. `toSorted` / `[...xs].sort()` — копия, потом мутация копии.

---

#### TypeScript

Типы **не** кодируют чистоту: `(n: number) => number` может писать в модульный `let`. `readonly` / `ReadonlyArray` мешают мутации **в типах**, в рантайме массив тот же. Эффекты в сигнатуре иногда отмечают соглашением: `() => void` «что-то сделай», `() => T` «верни значение» — слабая эвристика. Для I/O на границе — `unknown` + парсер (п. 179), не «чистый тип».

Что сказать на собеседовании: чистота — тот же выход без скрытого входа и без записи наружу. Прозрачность — вызов заменяем значением. `map` не спасает, если мутируют элементы. Типы чистоту не доказывают.

---

### 63. Currying, partial application, composition

О чём речь: три приёма резать и склеивать функции. **Partial application** — зафиксировали часть аргументов, получили функцию от остальных (`bind`, свой `partial`). **Currying** — функция от многих аргументов превращается в цепочку унарных: `f(a)(b)(c)` вместо `f(a, b, c)`. **Composition** — `h(x) = f(g(x))`, вывод одного — вход другого. На собеседовании путают curry и partial, пишут нечитаемый point-free (п. 74) и забывают, что `bind` ещё фиксирует `this` (п. 36).

---

#### Partial: «уже знаем первые аргументы»

```js
function fetchJson(base, path) {
  return fetch(`${base}${path}`).then((r) => r.json());
}

const fromApi = fetchJson.bind(null, "https://api.example.com");
fromApi("/users"); // this = null, первый аргумент зафиксирован
```

`bind` — partial плюс `this`. Свой вариант без `this`:

```js
const partial = (fn, ...head) => (...tail) => fn(...head, ...tail);
const add = (a, b, c) => a + b + c;
const add1 = partial(add, 1);
add1(2, 3); // 6
```

Порядок важен: обычно фиксируют **слева**. Закрепить «дырку» посередине — placeholders (классика задачи, п. 329).

---

#### Curry: по одному аргументу

```js
const curryAdd = (a) => (b) => (c) => a + b + c;
curryAdd(1)(2)(3); // 6
```

В библиотеках (`ramda`, `lodash/fp`) curry ещё и **умеет** `f(a, b)` как `f(a)(b)`: смотрят `fn.length` (п. 67) и копят аргументы, пока не набрали. Default-параметры и rest ломают `length` — автокарри врёт.

Зачем: удобно подставлять в `map`: `users.map(get("name"))`, если `get = (key) => (obj) => obj[key]`. Цена — стек коротких функций и хуже стектрейс.

---

#### Композиция

```js
const compose = (f, g) => (x) => f(g(x)); // справа налево
const pipe = (f, g) => (x) => g(f(x));    // слева направо, ближе к чтению

const trimLower = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
);
trimLower("  OK "); // "ok"
```

Типы композиции: выход `g` должен быть входом `f`. В TS это отдельный ад (п. 336). На практике 2–3 функции руками или явные промежуточные `const`.

---

#### Ловушка: curry vs частичное vs колбэк с arity

```js
[1, 2, 3].map(parseInt); // [1, NaN, NaN] — map передаёт (value, index)
```

`parseInt("2", 2)` — двоичная система. Curry/`unary` спасает: `map((x) => parseInt(x, 10))` или `map(Number)`. Partial `parseInt.bind(null, _, 10)` в нативном JS нет.

`compose` асинхронных функций — это уже `then`-цепочка / `pipe` с Promise, не та же `compose` для синхронных значений (п. 73).

---

#### TypeScript

```ts
function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a) => (b) => fn(a, b);
}
```

Дальше 3+ аргументов — оверлоады или вариативные кортежи. `bind` в типах теряет rest/this, если не `bind<…>` аккуратно. Композиция многих функций плохо выводится: помогают оверлоады `pipe` по 2, 3, 4 аргументам.

Что сказать на собеседовании: partial фиксирует аргументы (часто слева); curry — цепочка унарных, иногда с накоплением по `length`. compose — f после g. `map(parseInt)` — arity. `bind` ещё про `this`.

---

### 64. Recursion, TCO (и почему в JS его нет)

О чём речь: функция вызывает себя, пока не упрётся в **базу**. Хвостовая рекурсия (tail call) — рекурсивный вызов **последнее**, что делает функция: можно не копить кадры стека, а переиспользовать текущий. В спецификации ES2015 это **proper tail calls**, в движках браузеров **нет**. На собеседовании ждут: «в теории да, в JS получишь RangeError», плюс как переписать цикл или trampoline.

---

#### База и шаг

```js
function fact(n) {
  if (n <= 1) return 1;      // база
  return n * fact(n - 1);    // шаг: после вызова ещё умножение — не хвост
}

fact(5); // 120
fact(100000); // RangeError: Maximum call stack size exceeded
```

Каждый вызов — кадр: локальные, адрес возврата. Глубина ~тысячи–десятки тысяч, не миллионы. Не полагаться на конкретное число.

Хвостовая форма:

```js
function factTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factTail(n - 1, n * acc); // последнее действие — вызов
}
```

В Scheme/Lua это цикл. В V8/SpiderMonkey/JavaScriptCore — всё равно рост стека. Safari когда-то включал PTC, потом откатили из‑за стектрейсов и отладки. **Не писать** код, который живёт только если TCO есть.

---

#### Что делать вместо TCO

1. **Цикл** — обычный Senior-ответ для аккумулятора.
2. **Явный стек** — DFS по дереву без рекурсии.
3. **Trampoline** — функция возвращает «thunk» `() => next()`, цикл зовёт, пока не значение.

```js
function trampoline(fn) {
  let x = fn;
  while (typeof x === "function") x = x();
  return x;
}

const factT = (n, acc = 1) =>
  n <= 1 ? acc : () => factT(n - 1, n * acc);

trampoline(() => factT(10000)); // число, стек плоский
```

Для деревьев React/DOM рекурсия нормальна: глубина UI не миллион. Для «сплющить огромный nested array» — цикл или очередь.

---

#### Ловушка: взаимная рекурсия и async

`even`/`odd` вызывают друг друга — тоже стек. `async function walk()` с `await walk(child)` **не** копит JS-стек так же: после await кадр может уйти, но очередь микротасков и память промисов — другая цена (п. 87). Это не TCO.

Оптимизация «движок свернёт рекурсию» — не контракт. Иногда JIT инлайнит мелкое, на `fact(1e5)` не рассчитывай.

---

#### TypeScript

Рекурсия значений и **рекурсия типов** — разное. `type Deep<T> = … Deep<T[K]>` упирается в instantiation depth (п. 156), это лимит компилятора, не call stack. TS не обещает TCO в emit: `function fact` останется рекурсией в JS.

Что сказать на собеседовании: хвост — вызов последнее действие. Спека PTC есть, в браузерах нет, будет RangeError. Пишем цикл, стек или trampoline. Глубина UI ок, миллион кадров нет.

---

### 65. Rest/spread, default parameters, parameter destructuring

О чём речь: три синтаксиса вокруг **списка аргументов**. Rest собирает хвост в массив. Spread разворачивает массив/объект в места. Default подставляет значение, если аргумент `undefined`. Деструктуризация в параметрах сразу достаёт поля. На Senior путают rest с `arguments`, default с `||`, spread объектов с глубокой копией.

---

#### Default: только undefined

```js
function f(x = 10, y = x + 1) {
  return [x, y];
}

f();          // [10, 11]
f(undefined); // [10, 11] — default сработал
f(null);      // [null, 1]  — null это значение, y = null + 1
f(0);         // [0, 1]
```

Defaults **ленивые**: выражение `x + 1` считается в момент вызова, если параметр отсутствует/`undefined`. Можно вызвать функцию, бросить ошибку, закрыть внешнее имя — всё это побочный эффект default. `y = x + 1` видит уже вычисленный `x`.

`||` подменит `0` и `""`. Default — нет. Для «нет значения» с `null` с сервера — `x ?? fallback` внутри, не параметр `=`.

---

#### Rest в параметрах и spread в вызове

```js
function g(first, ...rest) {
  return rest;
}

g(1, 2, 3);           // [2, 3] — настоящий Array
Math.max(...[1, 5, 2]); // 5
```

Rest — **последний** параметр. Нельзя `function h(...xs, last)`. Spread в вызове — список аргументов, не «массив как один аргумент» (`fn(arr)` vs `fn(...arr)`).

Слишком длинный spread (`fn(...hugeArray)`) бьёт лимит аргументов движка — RangeError. Для больших данных — цикл, не `apply`.

Spread объекта — **shallow** (п. 53): `{...a, ...b}` копирует ключи верхнего уровня.

---

#### Деструктуризация параметров

```js
function connect({ host = "localhost", port = 80 } = {}) {
  return `${host}:${port}`;
}

connect();                    // localhost:80 — весь аргумент default {}
connect({ port: 443 });       // localhost:443
connect(undefined);           // localhost:80
connect(null);                // TypeError: нельзя деструктурировать null
```

Паттерн `= {}` на всём параметре спасает «вызвали без аргументов». `null` не спасает: это не `undefined`. Вложенность `{ user: { name } }` падает, если `user` нет — default на вложенном объекте: `{ user: { name } = {} }`.

---

#### Ловушка: default + TDZ параметров

```js
function weird(a = b, b = 1) {
  return [a, b];
}
weird(); // ReferenceError: b в TDZ, пока не инициализировали второй параметр
```

Параметры слева направо, как `let`. Дальше по списку не видно.

`function f({ x } = { x: 1 }, x)` — тень имён, путаница. Не надо.

---

#### TypeScript

```ts
function connect({ host, port }: { host?: string; port?: number } = {}) {}
function log(msg: string, ...details: unknown[]) {}
```

Optional `x?: number` в типах разрешает **пропуск**, в рантайме это `undefined`. `x: number = 0` — параметр есть всегда после default. Rest типизируют кортежем: `...args: [string, number?]`. Spread в объект: `satisfies` / `as const` чтобы не расширить литерал (п. 16).

Что сказать на собеседовании: default только на undefined, не на null/0. Rest — массив хвоста, не arguments. Деструктур параметра + `= {}`. Spread мелкий. Параметры как let: TDZ слева направо.

---

### 66. `arguments` vs rest, arrow limitations

О чём речь: `arguments` — старый массив-подобный объект всех аргументов **обычной** функции. Rest — настоящий массив в сигнатуре. Стрелка **не имеет** своих `arguments`, `this`, `new.target`, `prototype` (п. 35). На собеседовании дают стрелку внутри функции и спрашивают, чей `arguments`; или требуют переписать legacy-код с `arguments` на rest.

---

#### Что такое arguments

```js
function sum() {
  let n = 0;
  for (let i = 0; i < arguments.length; i++) n += arguments[i];
  return n;
}

sum(1, 2, 3); // 6
Array.isArray(arguments); // false
arguments.map;            // undefined
```

Это объект с индексами `0..n-1`, `length`, иногда `callee` (запрещён в strict). Не массив: нет `map`/`slice`, пока не `Array.from(arguments)` / `[...arguments]`.

В **sloppy** mode `arguments[0]` и параметр `a` могут быть **связанными**:

```js
function sloppy(a) {
  arguments[0] = 99;
  return a;
}
sloppy(1); // 99 в нестрогом скрипте
```

В `"use strict"` и в большинстве модулей связь разорвана: `a` и `arguments[0]` независимы. Не опираться на aliasing.

---

#### Rest — замена

```js
function sum(...xs) {
  return xs.reduce((a, b) => a + b, 0);
}
```

Настоящий массив, свой, не «живой» view. Дальнейший `xs.push` не меняет способ вызова. Default и деструктур с rest работают предсказуемо.

---

#### Стрелка: чужие arguments

```js
function outer() {
  const arrow = () => arguments[0];
  const restFn = (...args) => args[0];
  return { arrow, restFn };
}

const o = outer(10);
o.arrow();           // 10 — arguments outer, не стрелки
o.arrow(99);         // всё ещё 10
o.restFn(99);        // 99
```

Стрелка берёт `arguments` из ближайшей **не-стрелочной** функции. На верхнем уровне модуля `arguments` нет — ReferenceError. Методы объекта стрелкой: нет своих arguments и нет своего this.

`function () {}` внутри стрелки заводит **свои** arguments.

---

#### Ловушка: из arguments в spread и strict

```js
function f() {
  const inner = () => arguments;
  return inner();
}
```

Рефакторинг `function f()` → `const f = () =>` ломает и `this`, и `arguments`. Тесты «зелёные» на прямом вызове, падают в колбэке.

`arguments.callee` — запрещён в strict, нужен был для безымянной рекурсии. Сейчас именованное `function fact()` или const + стрелка не для рекурсии без имени.

---

#### TypeScript

У `arguments` тип `IArguments`, слабый. Rest — кортеж/массив, нормальный inference. Стрелка в `.d.ts` как `(...args: any[]) =>` не отражает «нет arguments». `noImplicitThis` не про arguments. Переписывая `@types` колбэков, не ставить `Function` с arguments в документации как контракт — в стрелке его не будет.

Что сказать на собеседовании: arguments — array-like старой функции, в strict без alias на параметры. Rest — массив. У стрелки своих arguments нет, берёт снаружи. Рефактор function→arrow ломает arguments и this.

---

### 67. Function length, name, toString

О чём речь: у функции как у объекта есть служебные свойства. **`length`** — ожидаемое число параметров до rest/defaults (с оговорками). **`name`** — имя для стектрейса и DevTools. **`toString()`** — исходник функции как строка (или `[native code]`). На собеседовании: почему `bind` обнуляет length, почему анонимная стрелка вдруг называется `handler`, почему `fn.toString()` нельзя парсить как API.

---

#### length

```js
function a(x, y) {}
a.length; // 2

function b(x, y = 1, z) {}
b.length; // 1 — счёт останавливается на первом default

function c(x, ...rest) {}
c.length; // 1 — rest не входит

function d({ x }, y) {}
d.length; // 2 — деструктур считается за один параметр

const e = (x, y) => {};
e.length; // 2
```

Автокарри по `length` (lodash) ломается на defaults и rest: «функция ещё не наелась», хотя вызов уже полный.

`fn.bind(null, 1)` уменьшает length: связанный аргумент вычтен, минимум 0.

```js
function add(a, b, c) {}
add.bind(null, 1).length; // 2
```

---

#### name

```js
function named() {}
named.name; // "named"

const expr = function () {};
expr.name; // "expr" — ES6: имя из переменной слева

const obj = {
  method() {},
  arrow: () => {},
};
obj.method.name; // "method"
obj.arrow.name;  // "arrow"

(function () {}).name; // ""

function factory() {
  return function () {};
}
factory().name; // ""
```

`export default function () {}` — имя `"default"`. `obj['foo-bar'] = function () {}` — часто `""` или не то, что ждёшь.

`bind` добавляет префикс `"bound "`. Компиляторы/минификаторы **переименовывают** — `fn.name` в проде не контракт для бизнес-логики (`switch (fn.name)` — запах).

Сеттер `Object.defineProperty(fn, "name", { value: "x" })` возможен: `name` и `length` по умолчанию configurable.

---

#### toString

```js
function demo(x) {
  return x + 1;
}
demo.toString();
// "function demo(x) {\n  return x + 1;\n}"

Math.max.toString(); // "function max() { [native code] }"
```

Пробелы и комментарии могут сохраниться — удобно для Babel-макросов и плохих сериализаций. **Нельзя** надёжно распарсить аргументы из toString: разные движки, сборка, native. CSP и `Function` / eval — другая тема (п. 225).

---

#### Ловушка: потеря имени в обёртке

```js
function wrap(fn) {
  return (...args) => fn(...args);
}
function important() {}
wrap(important).name; // "" — анонимная стрелка
```

Для DevTools: `Object.defineProperty(wrapped, "name", { value: fn.name })` или именованная `function wrapped`. Логи «какой хендлер» по `.name` после `debounce` молчат.

---

#### TypeScript

`Function.length` / `.name` типизированы как `number` / `string`, литерал arity компилятор **не** гоняет (кроме специальных дженериков сами). `Parameters<F>["length"]` на уровне типов — другое, стирается. `toString` на типах не отражает исходник. Не строить перегрузки по `fn.length` в TS: в рантайме length врёт на default, в типах — по сигнатуре overload (п. 76).

Что сказать на собеседовании: length — число параметров до default/rest, bind уменьшает. name — для людей и стека, минификатор съест. toString — исходник или native, не API. Стрелка-обёртка теряет name.

---

### 68. Generator functions vs async generators

О чём речь: **генератор** — функция, которую можно поставить на паузу через `yield`. Вызов не выполняет тело до конца, а возвращает **итератор**. **Async generator** — то же плюс `await` и `yield` промисов; потребитель — `for await…of`. На собеседовании путают генератор с «функцией, которая возвращает массив», забывают `.next()`, и не отличают ленивую последовательность от `async function`, которая один раз резолвит массив.

---

#### Обычный генератор

```js
function* range(from, to) {
  for (let i = from; i < to; i++) {
    yield i;
  }
}

const it = range(0, 3);
it.next(); // { value: 0, done: false }
it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: false }
it.next(); // { value: undefined, done: true }

[...range(0, 3)]; // [0, 1, 2]
```

`function*` вернула объект с `next`. Тело бежит **между** yield. Первый `next()` стартует с начала до первого yield. Значение yield — поле `value`.

`return` из генератора ставит `done: true` и отдаёт value. После `done` дальнейшие `next` пустые (если нет finally).

Стрелок-генераторов нет: только `function*` / метод `*gen()` / `async function*`.

---

#### Пауза — не поток

Это кооперативная пауза в одном потоке JS, не OS-thread. Между `next()` генератор спит, стек снаружи свободен. Ошибки: `it.throw(err)` кидает внутрь на `yield` (п. 71).

`yield` выражения — вход снаружи: `next(x)` подставляет `x` как результат yield (п. 71).

---

#### Async generator

```js
async function* pages(url) {
  let next = url;
  while (next) {
    const res = await fetch(next);
    const data = await res.json();
    yield data.items;
    next = data.nextUrl;
  }
}

for await (const items of pages("/api")) {
  // каждый шаг — await next()
}
```

`next()` возвращает **Promise** `{ value, done }`. `for await` это прячет. Смешивать `for…of` с async generator нельзя: получите промисы как values или ошибку протокола.

Обычный `async function` один раз возвращает Promise со всем массивом — память сразу. Async generator — страница за страницей.

---

#### Ловушка: генератор исчерпывается

```js
function* once() {
  yield 1;
  yield 2;
}
const g = once();
[...g]; // [1, 2]
[...g]; // [] — тот же итератор уже done
```

`once` как фабрика: каждый `once()` — новый итератор. Объект с `[Symbol.iterator]: once` тоже одноразовый, если iterator = сам объект (п. 70).

`yield` в обычной функции — SyntaxError. `await` в `function*` без async — нет: нельзя. Нужен `async function*`.

---

#### TypeScript

```ts
function* range(from: number, to: number): Generator<number, void, unknown> {
  for (let i = from; i < to; i++) yield i;
}

async function* lines(): AsyncGenerator<string> {}
```

Три параметра `Generator<TYield, TReturn, TNext>`: что yield, что return, что принимает next. Часто `TNext` = `void`/`unknown`. `IterableIterator<T>` — упрощение, если двусторонность не нужна. Стирается до обычных функций в JS.

Что сказать на собеседовании: function* возвращает итератор, тело между yield. Async generator — next() это Promise, for await. Итератор одноразовый. TCO тут ни при чём, это пауза, не новый поток.

---

### 69. Iterator protocol, iterable protocol, `for…of`

О чём речь: два связанных протокола. **Iterable** — у объекта есть `[Symbol.iterator]()`, который возвращает итератор. **Iterator** — объект с `next()` → `{ value, done }`. `for…of`, spread массива, деструктур `[a, b] = xs` работают с **iterable**. На собеседовании путают `for…in` (ключи, включая прототип) и `for…of` (значения по итератору), и думают, что любой объект с `next` уже можно класть в `for…of`.

---

#### Два протокола

```js
const iterable = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        if (i >= 3) return { value: undefined, done: true };
        return { value: i++, done: false };
      },
    };
  },
};

for (const x of iterable) {
  // 0, 1, 2
}
```

`for…of` делает: взять `iterator = xs[Symbol.iterator]()`, потом крутить `next()` пока `done`. В конце зовёт `iterator.return?.()`, если вышли через `break`/`return`/`throw` — чтобы закрыть генератор (finally).

Массив, Map, Set, строка, TypedArray, `arguments`, NodeList (в браузере) — iterable. Голый `{}` — нет. `Object.keys` не делает объект iterable.

---

#### for…of vs for…in vs forEach

```js
const arr = ["a", "b"];
arr.extra = "z";

for (const k in arr) {
  // "0", "1", "extra" — ключи, enumerable, + прототип если enumerable
}

for (const v of arr) {
  // "a", "b" — только индексы массива по итератору
}

arr.forEach((v) => {}); // "a", "b" — значения своих индексов, extra не входит
```

Дыры массива — отдельная ось:

```js
const holes = [1, , 3];
holes.forEach((x) => console.log(x)); // 1, 3
for (const x of holes) console.log(x); // 1, undefined, 3
```

Итератор строки идёт по **UTF-16 code units**: суррогатная пара — две итерации, не графема (п. 8). Для grapheme — `Intl.Segmenter`.

---

#### Итератор сам по себе не iterable

```js
function* g() {
  yield 1;
}
const it = g();
it.next(); // 1 съели

for (const x of it) {
  // продолжит с остатка, потому что генератор — и iterator, и iterable (возвращает this)
}
```

Ручной `{ next() {…} }` без `[Symbol.iterator]` в `for…of` — TypeError: not iterable. Паттерн «итератор = себя»:

```js
const it = {
  next() {
    return { done: true };
  },
  [Symbol.iterator]() {
    return this;
  },
};
```

Тогда одноразовый: второй `for…of` пустой.

---

#### Ловушка: for…of и null, и живые коллекции

`for (const x of null)` — TypeError, не тихий skip. Optional: `for (const x of xs ?? [])`.

DOM `HTMLCollection` в старых местах **не** iterable; `NodeList` в современных браузерах да. Не гадать — `Array.from`.

`break` в `for…of` по генератору вызывает `return()` генератора — выполнится `finally` внутри `function*`. Это не баг, это закрытие.

---

#### TypeScript

`Iterable<T>` / `Iterator<T>` / `IterableIterator<T>` в lib. `for (const x of obj)` требует, чтобы `obj` был iterable; `noUncheckedIndexedAccess` тут ни при чём. `ArrayLike` (arguments) **не** Iterable в типах — нужен `Array.from`. Кастомный объект: объявить `[Symbol.iterator](): Iterator<T>`. Стирается до символа в JS.

Что сказать на собеседовании: iterable даёт iterator через Symbol.iterator; iterator — next. for…of по значениям протокола, for…in по ключам. Дыры массива: forEach пропускает, for…of даёт undefined. Генератор закрывается на break.

---

### 70. Custom iterables, infinite sequences

О чём речь: свой объект может быть источником значений без массива в памяти: диапазон, дерево, бесконечный счётчик, постраничный API. Делают `[Symbol.iterator]` или `function*`. Бесконечность **законна**, пока потребитель не возьмёт всё через `[...infinite]` — тогда зависание и память. На Senior это связь с ленивостью (п. 72) и почему React-список всё равно материализуют, а парсер токенов — нет.

---

#### Свой iterable без генератора

```js
function range(from, to) {
  return {
    [Symbol.iterator]() {
      let i = from;
      return {
        next() {
          if (i >= to) return { done: true, value: undefined };
          return { done: false, value: i++ };
        },
      };
    },
  };
}

for (const n of range(0, 1e9)) {
  if (n > 3) break; // память O(1), не миллиард элементов
  console.log(n);
}
```

Каждый `for…of` зовёт `[Symbol.iterator]()` заново — диапазон **многоразовый**. Генератор `function* range` как метод объекта — тоже многоразовый, если каждый раз новый генератор.

---

#### Бесконечная последовательность

```js
function* naturals() {
  let n = 0;
  for (;;) yield n++;
}

function take(n, iterable) {
  const out = [];
  for (const x of iterable) {
    if (out.length >= n) break;
    out.push(x);
  }
  return out;
}

take(5, naturals()); // [0, 1, 2, 3, 4]
```

`[...naturals()]` — бесконечный цикл. `Math.max(...naturals())` — то же плюс лимит аргументов.

Идиома: библиотеки `itertools` / свои `map`, `filter` на iterable, не на массив — цепочка ленивая, пока не `take`/`for`.

---

#### Дерево и вложенность

```js
function* walk(node) {
  yield node;
  for (const child of node.children ?? []) yield* walk(child);
}
```

`yield*` (п. 71) делегирует вложенному итератору. Рекурсия по глубине дерева — стек JS. Широкий BFS — очередь, свой iterator.

---

#### Ловушка: одноразовый vs многоразовый и мутация на ходу

```js
const ids = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
  },
};
[...ids]; // [1, 2]
[...ids]; // [1, 2] — новый генератор каждый раз
```

Если положить **уже созданный** генератор:

```js
const one = ids[Symbol.iterator]();
[...one]; // [1, 2]
[...one]; // []
```

Итерация массива, который **мутируют** в цикле — сюрпризы. Для своего iterator решить контракт: снимок или live. DOM HTMLCollection live; свой range обычно снимок границ в замыкании.

Бесконечный async generator без abort — утечка запросов. Нужен `break` / `AbortSignal` (п. 89).

---

#### TypeScript

```ts
function range(from: number, to: number): Iterable<number> {
  return {
    *[Symbol.iterator]() {
      for (let i = from; i < to; i++) yield i;
    },
  };
}
```

`IterableIterator<T>` когда объект и итератор один. Бесконечность типы не выражают: `Iterable<number>` молчит, конечен ли. Можно брендировать `FiniteIterable<T>` только соглашением. Не типизировать infinite как `T[]` — солжёте про память.

Что сказать на собеседовании: свой Symbol.iterator или generator. Многоразовость — новый итератор на каждый for…of. Бесконечные ок с take/break; spread убивает. Не путать генератор-значение и фабрику.

---

### 71. `yield*`, two-way generators, `throw`/`return`

О чём речь: генератор — не только «печатать значения наружу». Снаружи в него можно **послать** значение через `next(x)`, **кинуть ошибку** `throw(err)` и **закрыть** `return(value)`. `yield*` отдаёт управление другому итератору до его конца и прокидывает эти же сигналы. На собеседовании рисуют `yield*` как «spread в массив», забывают про двусторонность и про `finally` при `break`.

---

#### Two-way: yield как выражение

```js
function* ping() {
  const incoming = yield "ready";
  yield `got:${incoming}`;
}

const g = ping();
g.next();      // { value: "ready", done: false } — дошли до yield, ещё не приняли вход
g.next("hi");  // { value: "got:hi", done: false }
g.next();      // { value: undefined, done: true }
```

Первый `next()` **не** передаёт вход: тела ещё нет на yield. Аргумент первого `next` игнорируется. Дальше `next(x)` — это результат выражения `yield …` слева.

Идиома корутины: снаружи решают, чем кормить генератор (классический `run` для промисов до async/await).

---

#### throw и return снаружи

```js
function* guarded() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    yield `caught:${e}`;
  } finally {
    yield "cleanup";
  }
}

const g = guarded();
g.next();           // 1
g.throw("boom");    // caught:boom — ошибка встала на yield 1
g.next();           // cleanup
g.next();           // done
```

`g.throw` бросает в точку текущего `yield`. Если нет try — генератор падает, исключение выходит из `throw()`.

`g.return("end")` вызывает completion: прыжок в `finally`, потом `{ value: "end", done: true }` (если finally не yield'ит своё). `for…of` + `break` делает именно `return()`.

```js
function* withFinally() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("closed");
  }
}

for (const x of withFinally()) {
  break; // "closed"
}
```

---

#### yield*

```js
function* inner() {
  yield "a";
  yield "b";
  return "from-inner";
}

function* outer() {
  const ret = yield* inner();
  yield `ret:${ret}`;
}

[...outer()]; // ["a", "b", "ret:from-inner"]
```

`yield*` итерирует inner до done. **Return-значение** inner (не последний yield) приходит в `ret`. Это не то же, что `for (const x of inner()) yield x` — так потеряете return value, если сами не разберёте `next`.

`yield*` по массиву/строке — делегирование их итератору. `yield*` по не-iterable — TypeError.

Сигналы: `outer.throw(err)` в середине `yield* inner` пойдёт в `inner.throw`, если у inner есть такой метод (у генератора есть). Так закрывают вложенные генераторы.

---

#### Ловушка: первый next и yield* на бесконечном

```js
function* talk() {
  yield yield "ask";
}
const t = talk();
t.next("ignored"); // ask
t.next("answer");  // answer
```

Люди ждут, что `"ignored"` сразу станет результатом первого yield — нет.

`yield* naturals()` без take внутри outer — снова бесконечность. `return()` снаружи должен пробросить close во внутренний, иначе внутренний генератор висит (редко, но в кастомных iterator без `return` — утечка ресурса: файл не закрыли).

---

#### TypeScript

`Generator<TYield, TReturn, TNext>`: `TNext` — тип аргумента `next`, он же тип выражения `yield`. Несовпадение — частая ложь:

```ts
function* g(): Generator<string, void, number> {
  const n = yield "send-me-number";
  n.toFixed(0);
}
```

Потребитель в JS может вызвать `next("oops")`. Типы не проверяют вызовы итератора, если не типизировать сам `g`. `yield*` выводит TYield union. Стирается.

Что сказать на собеседовании: первый next стартует, вход со второго. throw/return входят в точку yield и в finally. yield* делегирует значения и закрытие, return внутреннего — в выражение yield*. break в for…of зовёт return.

---

### 72. Memoization, lazy evaluation

О чём речь: **мемоизация** — кэш «уже считали от этих аргументов». **Ленивость** — не считать, пока не попросили. Оба экономят работу и оба врут, если вход мутабельный или функция нечистая. На собеседовании ждут `Map` с ключом, WeakMap для объектов, почему `JSON.stringify` плохой ключ, и связь с React `useMemo` одной фразой без ухода в фреймворк.

---

#### Мемоизация

```js
function memoize(fn) {
  const cache = new Map();
  return function (x) {
    if (cache.has(x)) return cache.get(x);
    const y = fn(x);
    cache.set(x, y);
    return y;
  };
}

const costly = memoize((n) => n ** 2);
costly(3); // считает
costly(3); // из кэша
```

Ключ в `Map` — SameValueZero (п. 4): `NaN` ок, `0` и `-0` как один. Объекты — **по ссылке**: `{a:1}` каждый раз новый ключ, кэш бесполезен.

Несколько аргументов: кортеж нельзя ключом Map. Варианты: вложенные Map, сериализация, один объект-аргумент.

```js
function memoizeJson(fn) {
  const cache = new Map();
  return (...args) => {
    const k = JSON.stringify(args);
    if (cache.has(k)) return cache.get(k);
    const y = fn(...args);
    cache.set(k, y);
    return y;
  };
}
```

`JSON.stringify` теряет `undefined` в массиве, порядок ключей объекта, `Date`, циклы — бросит или соврёт. Для функций и символов — дырки. На проде ключ проектируют под домен (`id`, кортеж примитивов).

---

#### Lazy: отложить до первого чтения

```js
function lazy(factory) {
  let done = false;
  let value;
  return () => {
    if (!done) {
      value = factory();
      done = true;
    }
    return value;
  };
}

const config = lazy(() => JSON.parse(bigString));
// JSON ещё не парсили
config(); // парсим
config(); // тот же объект
```

Генераторы и iterable (п. 70) — ленивость **по шагам**, не один thunk. `&&` / `||` / `??` тоже ленивы к правому операнду. Геттер без кэша — «лениво» каждый раз заново.

`WeakMap` кэш: ключ-объект может собрает GC, кэш не удерживает. Для `memo(obj => derived)` где obj — временный, WeakMap правильнее Map (иначе утечка, п. 33/185).

---

#### Ловушка: нечистая функция и мутабельный ключ

```js
let n = 0;
const m = memoize(() => ++n);
m(); // 1
m(); // 1 — «застыло», хотя n живой; без аргумента весь мир один ключ
```

Мемоизация скрывает эффект: второй вызов не инкрементит. Для `Date.now` внутри — вечный первый снимок.

```js
const key = { id: 1 };
const cache = new Map();
cache.set(key, "A");
key.id = 2;
cache.get(key); // "A" — ключ та же ссылка, поле сменили, кэш не узнал
```

Реакт: `useMemo(() => f(x), [x])` — кэш на время жизни компонента и deps по `Object.is`, не глубоко. Языковая мемоизация — ваша Map, живёт сколько держите замыкание.

Размер кэша без LRU (п. 213) — утечка на уникальных ключах (`memo(requestId)` на каждый запрос).

---

#### TypeScript

```ts
function memoize<A, R>(fn: (a: A) => R): (a: A) => R {
  const cache = new Map<A, R>();
  return (a) => {
    if (cache.has(a)) return cache.get(a)!;
    const y = fn(a);
    cache.set(a, y);
    return y;
  };
}
```

`Map<A, R>` требует, чтобы `A` был валидным ключом в голове программиста: объекты по ссылке. Тип не запретит мутацию `A`. `lazy<T>(f: () => T): () => T` — фабрика один раз; если `T` промис, мемоизируется промис, не значение — и pending, и reject застрянут. Стирается.

Что сказать на собеседовании: memo — кэш по ключу, ключ объектов по ссылке, JSON опасен. Lazy — посчитать при первом чтении. Нечистым функциям memo врёт. WeakMap если ключ-объект должен умереть. Без лимита кэш течёт.

---

### 73. Functors/monads на уровне практики: Promise, Array, Optional

О чём речь: на собеседовании иногда произносят «монада». Senior-ответ — **не** лекция из категории, а: есть контейнер значения и операция `map` (функтор): применить функцию **внутри**, контейнер снаружи тот же вид. Если функция сама возвращает контейнер, `map` даст **вложенность**; чтобы склеить — `flatMap`/`then`/`chain` (монадический bind). Практика: `Array`, `Promise`, «Optional» как `T | null`. Без этого путают `then` с `map` и получают `Promise<Promise<T>>`.

---

#### Функтор: map сохраняет форму

```js
[1, 2, 3].map((x) => x + 1); // [2, 3, 4] — массив остался массивом

Promise.resolve(1).then((x) => x + 1); // Promise<number> — промис остался промисом
```

`map` для массива: длина может измениться? Нет, у map 1-в-1. `filter` — не функтор-map в этом смысле. Для Promise «один then» похож на map, **но** then ещё и разворачивает thenable (п. 84) — это уже ближе к flatMap.

Законы, которые стоит уметь сказать словами: `map(id)` ничего не делает; `map(f).map(g)` то же, что `map(x => g(f(x)))`. Ломаются, если `map` с эффектом или мутацией элементов.

---

#### Вложенность и flatMap

```js
[1, 2].map((x) => [x, x]);        // [[1, 1], [2, 2]]
[1, 2].flatMap((x) => [x, x]);    // [1, 1, 2, 2]

Promise.resolve(1).then((x) => Promise.resolve(x + 1));
// Promise<number>, не Promise<Promise<number>> — then flatten
```

У массива `flatMap` = map + flat 1 уровень. У промиса `then` **всегда** flatten thenable. Поэтому `then` нельзя бездумно называть map: если `f` вернула промис, вложенность схлопнется; если число — как map.

Optional в JS нет как типа рантайма. Паттерн:

```js
function mapOpt(x, f) {
  return x == null ? x : f(x);
}

function flatMapOpt(x, f) {
  return x == null ? x : f(x); // f сама возвращает T | null
}
```

`mapOpt` vs `flatMapOpt` совпадают по коду, если `null` поглощает; разница в типе `f`: `A => B` vs `A => B | null`. Цепочка `user && user.addr && user.addr.city` / `?.` — тот же bind для nullish.

---

#### Зачем это на практике

Единый способ писать «если внутри что-то есть — продолжи, иначе пронеси пустое». Массив пустой — `flatMap` даст пустой. Промис rejected — цепочка `then` пропустит success-колбэк (это **не** тот же закон, что у Array: ошибка — отдельный канал, п. 84). Поэтому Promise — «монада» с оговоркой про reject/throw.

Не тащить `class Functor` в прод ради названия. Именовать `map`/`flatMap` у своего Result (п. 174) — да, если команда это читает.

---

#### Ловушка: then как map и async в map

```js
[1, 2].map(async (x) => x + 1); // [Promise, Promise], не [2, 3]
await Promise.all([1, 2].map(async (x) => x + 1)); // [2, 3]
```

Array не знает про Promise: функтор массива не склеивается с функтором промиса сам. Нужен `Promise.all` или библиотека.

```js
p.then(JSON.parse).then(f);
// если parse кинул — reject; если f вернула промис — flatten
p.then((s) => JSON.parse(s)); // то же
```

`p.then(f, e)` vs `catch` — не про функторы, про два канала.

`optional.map(f)` если слямкали `null` и `undefined` и `0` — сломали Optional.

---

#### TypeScript

`Array<T>.map<U>` — классический функтор в типах. `Promise<T>.then` овергружен: если колбэк вернул `U | PromiseLike<U>`, исход `Promise<U>`. `T | null` не имеет методов: пишут свои `map` или сужают. Библиотеки `fp-ts` / `Effect` кодируют HKT (п. 145) — в интервью достаточно Array/Promise/nullable. Типы не доказывают законы.

Что сказать на собеседовании: map — функция внутри контейнера. Если f вернула контейнер, map вложит, flatMap/then склеит. Promise.then ещё flatten. Array.map + async = массив промисов. Optional — T | null своими map/flatMap или ?.. Категорные законы — проверка на мутацию, не библиотека в React.

---

### 74. Point-free style: когда вреден

О чём речь: **point-free** (tacit) — функция без явного упоминания аргумента: `const names = map(getName)` вместо `xs => xs.map(x => getName(x))`. Красиво в маленьких композициях, вредно когда прячется arity, `this`, ошибки, порядок аргументов. На Senior ждут вкус: не «FP элита», а читаемость и `map(parseInt)`.

---

#### Когда уместно

```js
const getName = (u) => u.name;
const names = users.map(getName); // аргумент один, совпал
```

Нет лишней обёртки `u => getName(u)` — ок, если `getName` унарная и не использует индекс.

`pipe(trim, lower, splitComma)` при именованных шагах читается как пайплайн данных. Имена шагов важнее отсутствия `x =>`.

---

#### Когда ломается

**Лишние аргументы колбэка:**

```js
["10", "10", "10"].map(parseInt); // [10, NaN, 2] — index как radix
```

`users.filter(Boolean)` выкинет `0` и `""`. Point-free предикат совпал по форме, не по смыслу.

**this:**

```js
const src = "ab";
["b"].map(src.includes); // TypeError или не то: includes оторвали от строки
["b"].map((ch) => src.includes(ch));
```

Метод как first-class теряет приёмник (п. 34). `map(src.includes.bind(src))` работает, но это уже не «чище».

**Порядок аргументов:**

```js
const eq = (a, b) => a === b;
// data.last(eq(1)) в lodash/fp — зависит, каррирован ли eq слева
```

Без карри `partial` слева vs данные справа — путаница. Явный `(x) => eq(1, x)` дешевле минуты чтения.

**Ошибки и типы:** точка останова и имя в стеке — анонимная композиция `compose(f, g, h)` показывает внутренности compose, не бизнес-шаг.

---

#### Ловушка: «убрать аргумент» ценой замыкания не туда

```js
const handlers = ids.map(id => debounce(() => save(id), 300));
// не point-free, зато id захвачен явно

const handlers2 = ids.map(debounce(save, 300));
// debounce(save, 300) уже функция — map зовёт её как (id, index, arr)
```

Второе почти наверняка не то, что думали: HOF вернула функцию не той arity.

Point-free плюс мутация: `xs.forEach(list.push)` — `push` получит extra args от forEach, `this` не массив. Классика.

---

#### TypeScript

Вывод ломается, как только снимаете аргумент: `compose` из многих функций плохо infers (п. 336). Явная `(x: User) => x.name` даёт точку для hover. `map(parseInt)` типы часто пропускают, потому что `parseInt` совместим с `(s: string, n: number) => number` слишком широко. Строже: `map((s) => parseInt(s, 10))`.

Что сказать на собеседовании: point-free — без имени аргумента. Ок для унарных совпавших колбэков. Вред: arity map, this методов, скрытый индекс, стек. Предпочитаю имя, если не очевидно.

---

### 75. Predicate types, type guards, assertion functions (`asserts`)

О чём речь: в JS проверка — обычный `typeof` / `in` / свой `isUser(x)`. В TS **type guard** — функция, чей возврат `x is T` **сужает** тип в `if`. **Assertion function** — `asserts x is T`: если вернулась, тип сужен; если нет — должна бросить. На собеседовании путают с `as T`, забывают что guard **врёт**, если в рантайме проверка слабее типа, и что стрелка-guard иногда не сужает.

---

#### Type predicate

```ts
function isString(x: unknown): x is string {
  return typeof x === "string";
}

function f(x: unknown) {
  if (isString(x)) {
    x.toUpperCase(); // string
  }
}
```

Без `x is string` компилятор видит `boolean` и **не** сужает. Это контракт с компилятором, стирается до `return typeof …`.

Нужен **параметр**, который сужаем, в сигнатуре: `x is T`. Для массивов `filter(isString)` выводит `string[]` (п. 146) — иначе `filter` оставляет `(string | number)[]`.

```ts
function isKey<K extends string>(k: string, obj: object): k is K {
  return k in obj;
}
```

Сложные guards легко врут: `return "id" in x` не значит `{ id: string }`.

---

#### asserts

```ts
function assertDefined<T>(x: T | undefined, msg: string): asserts x is T {
  if (x === undefined) throw new Error(msg);
}

function g(x: string | undefined) {
  assertDefined(x, "need x");
  x.length; // string
}
```

Если `asserts` функция **может не бросить** при провале — дальше в коде ложь, как `as`. `asserts x` без `is` (для truthy) — `asserts x` значит «после вызова x truthy».

Нельзя `return false` из asserts-функции как «не прошло»: тип обещает throw. Для ветвления — predicate `is`.

---

#### Ловушка: стрелка, this, неравенство проверки и типа

```ts
const isStr = (x: unknown): x is string => typeof x === "string";
```

Стрелки-guards обычно сужают. Проблемы:

1. Guard как метод: `if (this.isUser(x))` — зависит, видит ли CFA вызов (часто да, если не через переменную).
2. Сохранили guard в переменную высшего порядка — сужение может **пропасть**.
3. `function isNonEmpty(s: string | null): s is string { return true; }` — всегда true, типы врут, в рантайме null.

```ts
function isUser(x: unknown): x is { name: string } {
  return typeof x === "object" && x !== null && "name" in x;
}
// { name: unknown } по факту; name может быть number
```

`as` не проверяет. Guard проверяет ровно то, что написали в `return`.

`filter(Boolean)` в TS **не** убирает `null` сам, пока не `Boolean` overload / свой `isTruthy`. Часто пишут `s => s != null`.

---

#### TypeScript (сводка осей)

| Механизм | Рантайм | Сужение |
|---|---|---|
| `typeof` / `in` в `if` | да | CFA встроенное |
| `x is T` | ваша проверка | да, в then-ветке |
| `asserts x is T` | throw | после вызова |
| `as T` | нет | ложь сразу |

Emit: предикат стирается, остаётся boolean-функция. `asserts` стирается, остаётся throw. Не путать с `assert` из `node:assert` без аннотации — тогда сужения нет.

Что сказать на собеседовании: `x is T` учит компилятор сужать после true. asserts — сужает, если не бросила; обязана бросить. Проверка должна совпадать с T, иначе ложь как as. filter без предиката не сужает union.

---

### 76. Overload signatures vs implementation signature

О чём речь: в TS у функции может быть несколько **видимых** сигнатур (оверлоады) и одна **реализация** ниже. Снаружи вызывающий видит только оверлоады. Реализация должна принять **объединение** всех вариантов. В JS оверлодов нет: одна функция, ветки по `arguments.length` / типам значений. На собеседовании путают оверлод с union-параметром и забывают, что реализация не проверяется «построчно» против каждого оверлода.

---

#### Зачем несколько сигнатур

```ts
function width(x: string): number;
function width(x: string[]): number[];
function width(x: string | string[]): number | number[] {
  return typeof x === "string" ? x.length : x.map((s) => s.length);
}

width("ab");     // number
width(["a"]);    // number[]
width(Math.random() > 0.5 ? "a" : ["a"]); // ошибка: нет оверлода на union — классика
```

Union снаружи **не** выбирает оверлод автоматически: нужен ещё оверлод на `string | string[]` или generic. Иначе честный вызов с переменной-union падает в типах, хотя реализация умеет.

Порядок: **сверху вниз**, первый подходящий. Более узкие — выше.

---

#### Implementation signature

Последняя функция с телом — не часть публичного API (если не экспортируют типы так). Часто пишут шире: `any` / `unknown` / общий union.

```ts
function pick(a: object, key: string): unknown;
function pick(a: object, key: string): unknown {
  return (a as Record<string, unknown>)[key];
}
```

Тело проверяют **против implementation**, не против каждого оверлода отдельно. Можно написать оверлоды, которые тело не выполняет — компилятор не поймает:

```ts
function lie(x: string): string;
function lie(x: number): number;
function lie(x: string | number): string | number {
  return String(x); // для number оверлод обещал number, получили string
}
```

Это дыра. Тестами и узким implementation (`: any` ещё хуже — тело не проверят вовсе).

---

#### Ловушка: optional vs оверлод и стрелки

```ts
function f(x: number, y?: string): void;
function f(x: number, y: string, z: boolean): void; // плохо стыкуется с первым
function f(x: number, y?: string, z?: boolean) {}
```

Вызов `f(1, undefined as any, true)` — каша. Лучше options-object (п. 271), чем 4 оверлода.

У стрелок оверлоды через call signature в типе, не несколько `const f = …`:

```ts
type F = {
  (x: string): number;
  (x: string[]): number[];
};
const width: F = (x) => (typeof x === "string" ? x.length : x.map((s) => s.length));
```

На реализации стрелки всё равно одна ветка. `new` + call оверлоды — п. 80.

---

#### TypeScript vs JS

В `.d.ts` библиотек оверлоды описывают магию `document.createElement("a")` → `HTMLAnchorElement`. В emit останется одна function. Нельзя на оверлод положиться в рантайме: `createElement(Math.random() ? "a" : "div")` — типы хуже, чем узкий литерал.

Совместимость двух функций-оверлодов сложнее, чем простых (п. 144). Для вызывающего важнее: оверлод даёт точный return на литерале; union-параметр — честнее для переменных.

Что сказать на собеседовании: снаружи список сигнатур сверху вниз, внутри одна реализация на union. Реализацию не сверяют с каждым оверлодом — можно соврать. Union-аргумент сам оверлод не выберет. В JS это ветки по значениям.

---

### 77. Function types: parameters contravariance, return covariance

О чём речь: когда функцию **можно подставить** вместо другой. Результат — **ковариантен**: можно вернуть более узкое (`Dog`, где ждали `Animal`). Параметры при `strictFunctionTypes` — **контравариантны**: функция должна принимать **более широкое** (ждать `Animal`, где дадут `Dog` нельзя наоборот). На собеседовании это «почему колбэк `onChange(user: User)` не кладётся в `(obj: object) => void`» и зачем это чинит баги.

---

#### Возврат: сужать можно

```ts
type Animal = { kind: string };
type Dog = { kind: string; bark(): void };

type MakeAnimal = () => Animal;

const makeDog: () => Dog = () => ({ kind: "dog", bark() {} });
const f: MakeAnimal = makeDog; // ок: кто ждал Animal, получит Dog — поля kind хватит
```

Обратно `() => Animal` в `() => Dog` нельзя: вдруг без `bark`.

---

#### Параметры: расширять можно (контравариантность)

Нужно уметь обработать **всё**, что передаст вызывающий.

```ts
type Handler<T> = (x: T) => void;

const onAnimal: Handler<Animal> = (a) => console.log(a.kind);
const onDog: Handler<Dog> = (d) => d.bark();

function emitDog(h: Handler<Dog>) {
  h({ kind: "dog", bark() {} });
}

emitDog(onAnimal); // ок: onAnimal умеет любого Animal, в том числе Dog
emitDog(onDog);    // ок
```

Наоборот: `emitAnimal(h: Handler<Animal>)` вызвать с `onDog` **нельзя** при `strictFunctionTypes`: emit может дать кота, у `onDog` нет `bark` безопасного.

```ts
function emitAnimal(h: Handler<Animal>) {
  h({ kind: "cat" });
}
// emitAnimal(onDog); // ошибка — правильно
```

Интуиция «колбэк с более узким параметром — осторожнее» в типах **запрещена**, потому что вызывающий не обязан дать узкое.

---

#### Методы vs функциональные свойства: bivariance

Исторически **методы** в классах/интерфейсах сравнивают параметры **бивариантно** (и шире, и уже) — компромисс под `Array<Dog>` vs `Array<Animal>` и `push`. Это дыра:

```ts
interface AnimalH {
  on(x: Animal): void;
}
interface DogH {
  on(x: Dog): void;
}
// совместимость методов может пройти там, где для (x: T) => void — нет
```

`strictFunctionTypes` включает контравариантность для **function types** (свойства, параметры-функции), не для методов в классическом виде. Писать колбэки как свойства `(x: T) => void`, не как методы, если важен контракт.

---

#### Ловушка: optional и return void

```ts
type Fn = () => void;
const g = (): number => 1;
const h: Fn = g; // ок: return игнорируют (специальное правило void)
```

Можно подставить функцию, которая возвращает значение, туда где ждут `void` — специально, чтобы `forEach` принимал любые колбэки. Обратно нельзя, если ждут `number`.

Промисы: `() => Promise<Dog>` ковариантно к `() => Promise<Animal>` (если Promise ковариантен по T — да). Параметр ` (x: Animal) => Promise<void>` vs `(x: Dog) => …` — снова contra по x.

---

#### TypeScript

Выключается `strictFunctionTypes: false` — параметры функций снова бивариантны, как старый TS: больше назначается, больше багов в колбэках. `bivarianceHack` в React-типах (`bivarianceHack(x: T) {}` методом) — сознательная дыра для event handlers.

В JS дисперсии нет: подставится любая функция, упадёт в рантайме на `d.bark()`.

Что сказать на собеседовании: return можно сужать (covariance). Параметр колбэка — принимать шире (contravariance), иначе нам подсунут другого животного. Методы бивариантны, function types при strict — нет. void-return особый.

---

### 78. `this` parameter in TS

О чём речь: в JS `this` зависит от вызова (п. 34). TS может **описать** первый фейковый параметр `this: T` в функции: это не аргумент вызова, его нет в emit. Компилятор проверяет, что функцию зовут как метод подходящего объекта (или с `call`). На собеседовании: чем это отличается от параметра `self`, почему стрелка не берёт `this`-параметр так же, и `noImplicitThis`.

---

#### Аннотация this

```ts
function greet(this: { name: string }, punct: string) {
  return this.name + punct;
}

greet("!"); // ошибка: void не { name }
const user = { name: "Ada", greet };
user.greet("!"); // ок

greet.call({ name: "Bob" }, "!"); // ок
```

В JS сигнатура всё равно `function greet(punct)`. `this` в списке параметров TS стирается.

Объектный литерал: `const u = { name: "Ada", greet: greet }` — контекст вызова `u.greet()` даёт this = u.

---

#### Когда this: void

```ts
function standalone(this: void, x: number) {
  return x;
}
```

Запрещает `obj.fn = standalone; obj.fn()` если это потеряло бы смысл — на практике говорит «я не смотрю this». Утилиты без this так помечают.

`ThisParameterType<F>` / `OmitThisParameter<F>` (п. 137) достают или снимают этот фейковый параметр у типа функции.

---

#### Стрелки и классы

У стрелки `this` лексический. Параметр `this` на стрелке **нельзя** объявить как у function: синтаксис `this` в параметрах — для `function` / методов / function-typed.

В классе методы: `this` по умолчанию экземпляр. `this: this` полиморфный (п. 160) для билдеров. Стрелочное поле `h = () => this.x` в типах как свойство без this-параметра, в рантайме this объекта создания.

Колбэк:

```ts
button.addEventListener("click", function (this: HTMLButtonElement, ev) {
  this.disabled = true;
});
```

Стрелка внутри addEventListener this не кнопку — типы могут врать, если аннотировать this на стрелке нельзя и CFA не знает DOM.

---

#### Ловушка: вырванный метод и noImplicitThis

```ts
const f = user.greet;
f("!"); // TS ошибка, если greet с this-параметром; в JS this = undefined/global
```

Без аннотации `this` и при `noImplicitThis` обращение к `this.foo` в болтающейся function — ошибка «this implicitly any». С `this: any` дыра. С `this: User` — честно.

Передача `user.greet` в `setTimeout` — та же потеря; типы колбэка `() => void` часто **съедают** this-проверку, потому что Omit this. Тогда рантайм падает, компилятор молчит — граница типов колбэка.

---

#### TypeScript и emit

Стирается полностью. `strictBindCallApply` проверяет `call`/`apply`/`bind` против сигнатуры, включая this. Без флага bind слишком дырявый.

Не путать с параметром `this` в JSDoc `@this {T}` в JS-файлах с checkJs — та же идея.

Что сказать на собеседовании: this в параметрах TS — не аргумент, проверка вызывающего объекта, стирается. call/bind учитываются при strictBindCallApply. Вырванный метод ловит, пока тип колбэка не стёр this. Стрелка this не параметризует так.

---

### 79. Generic functions, inference, constraints, defaults

О чём речь: дженерик-функция — одна реализация, много типов, параметр типа `T` связывается **на вызове**. Вывод (inference) смотрит на аргументы. Constraint `T extends X` ограничивает. Default `T = string` если вывести не из чего. На Senior: почему `T` стал `unknown`, почему массив литералов расширился, зачем `NoInfer`, почему constraint не то же, что аргумент-рантайм.

---

#### Вывод с аргумента

```ts
function identity<T>(x: T): T {
  return x;
}

identity(1);        // T = number
identity<string>("a"); // явно
```

Несколько параметров: TS старается вывести из всех позиций, иногда берёт union.

```ts
function pair<T>(a: T, b: T): [T, T] {
  return [a, b];
}
pair(1, 2);     // [number, number]
pair(1, "x");   // ошибка, если T один; или never/union в старых трюках
```

`T` в **двух** аргументах без общего супер — конфликт. Тогда разные `T` и `U`.

---

#### Constraint и default

```ts
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

pluck({ a: 1, b: "s" }, "a"); // number
```

`K extends keyof T` — не рантайм проверка ключа, только типы. В JS `obj[key]` и так сработает для любого string.

```ts
function wrap<T extends { id: string }>(x: T): T {
  return x;
}

function create<T = string>(x?: T): T[] {
  return x === undefined ? [] : [x];
}
create();     // string[]
create(1);    // number[]
```

Default работает, когда T не выведен. Если передали аргумент — вывод побеждает default.

`T extends object` не запрещает `null` в старых либах (исторически); сейчас `object` без null. Не путать с runtime `typeof x === "object"`.

---

#### Где вывод ломается

1. **Пустой массив:** `identity([])` → `any[]` / `never[]` / `unknown[]` в зависимости от настроек и контекста.
2. **Контекст снаружи:** `const xs: string[] = map(n => n, [1])` — колбэк может вывестись от ожидаемого return.
3. **Слишком рано:** `f(x => x.a)` без типа `x` — implicit any, пока не указать generic явно или не дать объект первым.
4. **Ширение литералов:** `id(1)` как `number`, не `1`, если нет `as const` / `const T extends string`. Const type params (п. 141) фиксируют литерал.

```ts
function first<T>(xs: T[]): T | undefined {
  return xs[0];
}
first(["a", "b"]); // string, не "a" | "b"
```

---

#### Ловушка: generic не существует в рантайме

```ts
function parse<T>(s: string): T {
  return JSON.parse(s);
}
const u = parse<User>(raw); // T стёрся, это as T
```

Constraint `T extends User` тоже не проверит JSON. Нужен Zod (п. 176) или guard.

Два вызова — два T: `const f = identity; f(1); f("a")` ок. Зафиксировать: `const g: (x: number) => number = identity`.

`NoInfer<T>` (п. 142) запрещает выводить T из этой позиции — чтобы ключ не растащил T шире объекта.

---

#### TypeScript практика

Писать constraints по минимуму: `T extends object` ради `keyof` ок. Не `T extends any`. Defaults — для фабрик. Явный `<T>` — на границах parse и пустых коллекций. В emit — обычная function без T.

Что сказать на собеседовании: T выводится из аргументов, constraint — только компилятор, default если не вывели. Стирается, parse<T> врёт. Литералы ширятся. Два параметра одного T конфликтуют — разные T/U.

---

### 80. Call signatures, construct signatures, callable objects

О чём речь: в JS функция — объект: можно `fn.extra = 1`, бывают объекты с `[[Call]]` и с `[[Construct]]` (п. 37). В TS это описывают **call signature** `(x: T) => R` внутри типа, **construct signature** `new (x: T) => I`, иногда оба (jQuery, `Date`). На собеседовании: как типизировать `fs.existsSync` с полями, чем `new Foo` отличается от `Foo()`, и почему `typeof Class` не то же, что экземпляр.

---

#### Call signature

```ts
type Add = (a: number, b: number) => number;

type AddObj = {
  (a: number, b: number): number;
  description: string;
};

const add: AddObj = Object.assign(
  (a: number, b: number) => a + b,
  { description: "sum" },
);

add(1, 2);        // 3
add.description;  // "sum"
```

Короткий `(a) => b` и объект с `(a): b` — одно про вызов. Объектная форма нужна, когда **ещё поля**. Несколько call signatures — оверлоды (п. 76).

Callable object в рантайме — всё равно `typeof add === "function"`. Голый `{ description }` без функции **не** вызовется: типы могут врать, если написали call signature на не-функцию. Честный путь: функция + assign / `fn.prop =`.

---

#### Construct signature

```ts
type UserCtor = new (name: string) => { name: string };

const User: UserCtor = class {
  constructor(public name: string) {}
};

new User("Ada");
```

`typeof User` у класса — конструктор + статика, не экземпляр. Экземпляр — `User` как тип (instance side) vs значение `User` (constructor side).

```ts
class Point {
  static origin = 0;
  constructor(public x: number) {}
}

type Inst = Point;          // экземпляр
type Ctor = typeof Point;   // конструктор
```

`InstanceType<Ctor>`, `ConstructorParameters<Ctor>` (п. 136).

Интерфейс с `new`:

```ts
interface Clock {
  new (ms: number): { now(): number };
}
```

---

#### И call, и construct

```ts
interface DateLike {
  (value: number): string;
  new (value: number): Date;
}
```

В JS `Date(0)` строка, `new Date(0)` объект — разные `[[Call]]` / `[[Construct]]`. Типы это моделируют двумя сигнатурами. Свой класс в ES6: `Class()` без `new` в strict — TypeError, construct-only. Старый `function Fn()` умеет оба.

`new fn` где `fn` стрелка — TypeError в JS; в TS стрелка не assignable к `new (...)`.

---

#### Ловушка: Prototype и callable без new.target

```ts
function W(this: { n: number }, n: number) {
  if (new.target) {
    this.n = n;
  } else {
    return { n };
  }
}
```

Типизировать и `new W` и `W()` — две сигнатуры. Забыть construct — `new W` в типах ок, в реализации без this сломается (п. 37).

`Number` / `String` как callable vs construct — boxing (п. 1). В типах `typeof Number` уже overload в lib.

Передать класс туда, где ждали `(...args) => Inst` без `new` — в JS не вызовется как фабрика. Нужна обёртка `opts => new Ctor(opts)`.

---

#### TypeScript

Call/construct signatures стираются: остаётся JS-функция или класс. `this` в construct — экземпляр. Overload `new` vs call — порядок как у функций. Не описывать call signature на `interface` и ждать, что объектный литерал станет callable — emit не добавит `[[Call]]`.

Что сказать на собеседовании: функция-объект — call signature плюс поля. new — отдельная construct signature, typeof Class это конструктор. Date-подобные имеют оба. Стрелка не construct. Типы не создают callable из голого объекта.

---

Дальше по оглавлению — секция 5: асинхронность и конкурентность (п. 81+).

# Объекты, прототипы, классы

Детализация секции 3 из [JSTS.md](./JSTS.md). Пункты **41–60**.

Конспект для собеседования: в каждой теме сначала **о чём речь и зачем спрашивают**, потом устройство, ловушки и TypeScript.

---

### 41. Prototype chain, `__proto__` vs `prototype`

О чём речь: у объекта в JavaScript почти всегда есть скрытая ссылка на другой объект — прототип. Когда читают `obj.x`, а своего `x` нет, поиск идёт **по этой цепочке**, а не «магически в класс». На собеседовании путают три имени: слот `[[Prototype]]`, устаревший `__proto__` и свойство функции `.prototype`. Путаница даёт баги с `instanceof`, с методами и с тем, почему `obj.toString` существует у голого `{}`.

---

#### Модель: объект и цепочка

У объекта два слоя:

1. **Свои** свойства — то, что лежит непосредственно на нём (`obj.x = 1`, поля в конструкторе).
2. **`[[Prototype]]`** — ссылка на другой объект (или `null`). Это не массив «родителей», а один шаг. Дальше — прототип прототипа, пока не `null`.

Чтение `obj.foo`:

1. Есть собственное `foo`? Взять его.
2. Иначе взять `[[Prototype]]`. Если `null` — ответ `undefined`.
3. Иначе повторить поиск там.

Запись `obj.foo = 1` **по умолчанию** ставит собственное свойство на `obj`, даже если `foo` было на прототипе (исключение — сеттер на прототипе, п. 44). Цепочка нужна в первую очередь для **чтения** общих методов.

```js
const proto = { kind: "animal" };
const cat = { name: "Mila" };
Object.setPrototypeOf(cat, proto);

cat.name; // "Mila" — своё
cat.kind; // "animal" — с прототипа
cat.toString(); // с Object.prototype, ещё один шаг вверх
```

`toString` не копировали в `cat`. Он живёт на `Object.prototype`, а у обычного объекта `[[Prototype]]` указывает туда.

Конец цепочки у нормальных объектов — `Object.prototype`, у него прототип **`null`**. Не «глобал» и не `window`.

---

#### Три разных «прототипа»

Их постоянно называют одним словом. Это разные вещи.

**`[[Prototype]]`** — внутренний слот объекта. В коде его читают так:

```js
Object.getPrototypeOf(obj);
Reflect.getPrototypeOf(obj);
```

Пишут — `Object.setPrototypeOf` / `Reflect.setPrototypeOf` (медленно меняет форму объекта, в горячем коде лучше не трогать после создания).

**`obj.__proto__`** — не слот и не своё поле каждого объекта. Это геттер/сеттер на `Object.prototype`. Он читает и пишет тот же `[[Prototype]]`, но:

- это наследие, в новом коде берут `getPrototypeOf`;
- у объекта без `Object.prototype` в цепочке **нет** `__proto__` как аксессора (п. 42);
- присваивание `obj.__proto__ = x` может быть запрещено, если объект нерасширяемый.

**`Fn.prototype`** — обычное свойство **функции-конструктора** (и класса). Это объект, который станет `[[Prototype]]` экземпляров, когда напишут `new Fn()` (п. 37).

```js
function User(name) {
  this.name = name;
}
User.prototype.hi = function () {
  return this.name;
};

const u = new User("Anna");
Object.getPrototypeOf(u) === User.prototype; // true
u.__proto__ === User.prototype;              // true, через аксессор
u.prototype;                                 // undefined — у экземпляра нет .prototype
User.__proto__ === Function.prototype;       // true: User сам функция
```

Кратко:

| Имя | На ком живёт | Зачем |
|---|---|---|
| `[[Prototype]]` | у каждого объекта | куда идти за чужими свойствами |
| `__proto__` | аксессор на `Object.prototype` | старый способ увидеть/сменить слот |
| `Fn.prototype` | у функции/класса | шаблон для `new Fn` |

`User.prototype.constructor === User` по умолчанию. Если руками заменить `User.prototype = { ... }`, `constructor` часто теряют — чинят явной записью.

---

#### Цепочка встроенных

```js
const arr = [];
Object.getPrototypeOf(arr) === Array.prototype;                 // true
Object.getPrototypeOf(Array.prototype) === Object.prototype;    // true
Object.getPrototypeOf(Object.prototype) === null;               // true
```

Поэтому у массива есть `.map` (с `Array.prototype`) и `.toString` / `.hasOwnProperty` (с `Object.prototype`, если не перекрыли). Функция:

```js
function f() {}
Object.getPrototypeOf(f) === Function.prototype;
Function.prototype.__proto__ === Object.prototype; // Function.prototype — тоже объект
```

Класс — сахар над той же схемой: методы без `static` едут на `C.prototype`, сам `C` — функция, её прототип — `Function.prototype`.

---

#### Ловушка: правят `Object.prototype`

```js
Object.prototype.polluted = true;

const a = {};
a.polluted; // true — любой {} видит это
[1].polluted; // true — массив тоже доходит до Object.prototype
```

Цикл `for…in` по объекту внезапно видит `polluted` (enumerable). Это ядро prototype pollution (п. 52): если ключ из JSON попадает в `__proto__` или в `Object.prototype`, ломается «весь мир», не один словарь.

`obj.hasOwnProperty("x")` может сломаться, если кто-то положил своё `hasOwnProperty` на объект. Поэтому пишут `Object.prototype.hasOwnProperty.call(obj, "x")` или `Object.hasOwn(obj, "x")`.

---

#### TypeScript

Типы **не моделируют цепочку как runtime**. `interface` стирается, в JS прототипа от интерфейса нет. `class` даёт и тип экземпляра, и значение-конструктор; методы в типе видны, потому что компилятор знает класс, а не потому что он «ходит по `[[Prototype]]`».

`Object.getPrototypeOf(x)` в типах возвращает `any` / широкий объект — сужение по прототипу сами не получите. `instanceof` в TS сужает, но это проверка конструктора, не чтение `__proto__` (и она врёт между iframe, п. 51).

Что сказать на собеседовании: чтение идёт по `[[Prototype]]` вверх до `null`. `.prototype` — у функции, для `new`. `__proto__` — старый аксессор того же слота. Экземпляр не имеет `.prototype`. Общий код методов живёт на прототипе, не копируется в каждый объект.

---

### 42. `Object.create`, null-prototype objects

О чём речь: `new Fn()` всегда ставит прототип в `Fn.prototype` и ещё вызывает `Fn`. Иногда нужен объект с **точно выбранным** прототипом, без конструктора. Иногда нужен объект **без** `Object.prototype` — словарь, который не видит `toString` и не ломается ключом `"hasOwnProperty"`. Это `Object.create`.

---

#### Что делает `Object.create`

```js
const proto = {
  hi() {
    return "hi";
  },
};
const obj = Object.create(proto);
obj.hi(); // "hi"
Object.getPrototypeOf(obj) === proto; // true
```

Создаётся пустой объект (своих свойств нет), `[[Prototype]]` = первый аргумент. Конструктор не вызывается, `new` нет.

Второй аргумент — карта дескрипторов, как у `defineProperty` (п. 43, 45):

```js
const obj = Object.create(proto, {
  id: { value: 1, enumerable: true, writable: false },
});
obj.id; // 1
```

`Object.create(undefined)` — TypeError: прототип должен быть объект или `null`. Примитив нельзя.

---

#### Зачем, если есть `{ ... }` и `new`

Литерал `{ a: 1 }` всегда наследует `Object.prototype`. `new User` всегда бежит через конструктор и `User.prototype`.

`Object.create` нужен, когда:

- руками собирают наследование: `Child.prototype = Object.create(Parent.prototype)` (п. 46);
- нужен объект «как прототип», без лишних полей конструктора;
- нужен словарь без прототипа — `Object.create(null)`.

`Object.setPrototypeOf(obj, proto)` меняет слот у **уже существующего** объекта. `create` сразу рождает правильную форму — для движка это спокойнее.

---

#### `Object.create(null)` — карта без предков

```js
const map = Object.create(null);
map.toString;           // undefined — цепочка оборвана
map.hasOwnProperty;     // undefined
Object.getPrototypeOf(map); // null
```

Ключи только те, что запишете. `"toString"` как ключ данных больше не конфликтует с методом:

```js
const ordinary = {};
ordinary["toString"] = "oops";
typeof ordinary.toString; // "string" — сломали метод

const dict = Object.create(null);
dict["toString"] = "oops";
dict.toString; // "oops" как данные; метода и не было
```

`for…in` по `null`-объекту не лезет в `Object.prototype` (там нечего наследовать). `JSON.stringify` работает. Спред `{ ...dict }` копирует enumerable own-поля.

Цена: нет `__proto__` как аксессора, нет `.toString`. Отладка печатает иначе. `dict + ""` может дать TypeError (нечем приводить к примитиву). `hasOwnProperty` вызывают не как метод:

```js
Object.prototype.hasOwnProperty.call(dict, "x");
// или
Object.hasOwn(dict, "x");
```

Для настоящих словарей с произвольными ключами чаще берут `Map` (п. 10): любые ключи, не только строки, нет путаницы с прототипом.

---

#### Ловушка: `__proto__` в литерале vs create

```js
const a = JSON.parse('{"__proto__": {"admin": true}}');
// в современном JSON.parse обычно НЕ меняет прототип a

const b = { __proto__: { admin: true } };
b.admin; // true — литерал `__proto__` задаёт [[Prototype]]
```

Литерал `__proto__` — специальный синтаксис установки прототипа, не своё поле с таким именем. У `Object.create(null)` такого синтаксиса на объекте нет: присвоить `dict.__proto__ = x` создаст **обычное поле** `"__proto__"`, слот не изменит (нет сеттера с `Object.prototype`).

```js
const dict = Object.create(null);
dict.__proto__ = { admin: true };
dict.admin; // undefined
dict["__proto__"].admin; // true — это ключ, не цепочка
```

---

#### TypeScript

`Object.create(proto)` выводится слабо: часто `any` или пересечение, которое не повторяет методы `proto`. Лучше задать тип явно.

`Object.create(null)` даёт объект без прототипа; тип `Record<string, T>` врёт, что там есть все методы `Object`. Честнее:

```ts
const dict: { __proto__: null; [key: string]: string } = Object.create(null);
// или проще — Map<string, string>
```

Индексная сигнатура не запрещает ключ `"toString"` на обычном объекте. Если ключи снаружи — `Map` или `Object.create(null)` плюс узкий тип, не `{}`.

Что сказать на собеседовании: `Object.create(p)` — новый объект с прототипом `p`, без `new`. `create(null)` — словарь без `Object.prototype`: нет `toString`/`hasOwnProperty`, ключи не сталкиваются с методами. Для произвольных ключей часто лучше `Map`.

---

### 43. Property descriptors: writable, enumerable, configurable

О чём речь: у свойства объекта не только имя и значение. Есть флаги, которые решают, можно ли перезаписать, видно ли его в циклах, можно ли удалить или сменить на геттер. Без дескрипторов непонятно, почему `defineProperty` «прячет» поле, почему `length` у массива ведёт себя странно и почему `freeze` потом нельзя откатить.

---

#### Два вида свойств

**Данные (data property):** есть `value` и флаг `writable`.

**Аксессор (accessor):** есть `get` и/или `set`, поля `value`/`writable` нет (п. 44).

Общие флаги у обоих: `enumerable`, `configurable`.

Читают так:

```js
const obj = { a: 1 };
Object.getOwnPropertyDescriptor(obj, "a");
// { value: 1, writable: true, enumerable: true, configurable: true }
```

Только **собственное** свойство. Чего нет на объекте — `undefined`, даже если оно есть на прототипе. Все свои: `Object.getOwnPropertyDescriptors(obj)`.

---

#### Три флага

**`writable`** (только data): можно ли сделать `obj.a = 2`. Если `false`, присваивание в strict — TypeError, в sloppy тихо игнорируется. Значение всё ещё читается. У аксессора writable нет: «запись» — это вызов `set`.

**`enumerable`:** попадёт ли имя в `for…in`, `Object.keys`, спред `{ ...obj }`, `Object.assign`. `getOwnPropertyNames` видит и неперечислимые. Символы — отдельные API (`getOwnPropertySymbols`). Методы на `Array.prototype` неперечислимые — `for…in` по массиву не тащит `map`/`filter` с прототипа как «свои ключи массива», но собственные enumerable дырки/индексы — да.

**`configurable`:** можно ли `delete obj.a`, можно ли повторным `defineProperty` сменить флаги / превратить data в getter. Если `false`, почти всё заморожено. Исключение: у data можно сделать `writable: true → false` (односторонне), даже когда configurable уже false — так устроены некоторые встроенные.

```js
const obj = {};
Object.defineProperty(obj, "x", {
  value: 1,
  writable: false,
  enumerable: false,
  configurable: false,
});

obj.x = 2;          // strict: TypeError
delete obj.x;       // strict: TypeError
Object.keys(obj);   // []
```

---

#### Разные умолчания — главная ловушка

Литерал и присваивание:

```js
const a = { x: 1 };
a.y = 2;
// оба: writable true, enumerable true, configurable true
```

`Object.defineProperty` / второй аргумент `Object.create`: **всё, что не указали, false**.

```js
const b = {};
Object.defineProperty(b, "x", { value: 1 });
Object.getOwnPropertyDescriptor(b, "x");
// value: 1, writable: false, enumerable: false, configurable: false
```

Поле есть, `b.x === 1`, но `Object.keys(b)` пустой, присвоить нельзя, удалить нельзя. На собеседовании просят объяснить «положил через defineProperty — в JSON пропало»: `JSON.stringify` берёт enumerable собственные (геттеры вызывает, п. 44).

`Object.assign` и спред копируют enumerable own. Неперечислимые и с прототипа не копируют (кроме того, что assign берёт ещё get — читает значение).

---

#### TypeScript

Флаги в типах **не живут**. `readonly x: number` — проверка присваивания компилятором, в emit обычное writable-поле (если это поле класса с `readonly`, рантайм всё равно может перезаписать из JS). `Object.defineProperty` для типов невидим: после него TS не сделает свойство `readonly` сам.

`Object.getOwnPropertyDescriptor` типизирован широко. Для точной модели иммутабельности нужен `as const` / `readonly` на типе плюс `Object.freeze` в рантайме (п. 45) — это разные слои.

Что сказать на собеседовании: у свойства value/get-set плюс writable, enumerable, configurable. Литерал — все флаги true. defineProperty без указания — все false. configurable false запрещает delete и почти любую смену дескриптора.

---

### 44. Getters/setters, accessors vs data properties

О чём речь: свойство может не хранить значение, а вычислять его при чтении и перехватывать запись. Это аксессор. Его путают с «методом `getX()`» и с полем. На собеседовании ждут, где живёт `this`, почему геттер улетает в бесконечность и попадёт ли он в `JSON.stringify`.

---

#### Как объявить

Литерал:

```js
const user = {
  first: "Ada",
  last: "Lovelace",
  get fullName() {
    return `${this.first} ${this.last}`;
  },
  set fullName(v) {
    const [first, last] = v.split(" ");
    this.first = first;
    this.last = last;
  },
};

user.fullName; // "Ada Lovelace" — скобок нет, это чтение свойства
user.fullName = "Alan Turing";
user.first; // "Alan"
```

Класс: `get fullName()` / `set fullName()` на прототипе (один аксессор на все экземпляры). `Object.defineProperty` с `{ get, set }` — то же на конкретном объекте.

В дескрипторе нельзя смешать `value` и `get`. Либо data, либо accessor.

Только `get` — свойство «только для чтения» с точки зрения смысла; присваивание в strict без `set` — TypeError. Только `set` — читать можно, получите `undefined`.

---

#### Чем отличается от data и от метода

| | Data `fullName: "A"` | Accessor `get fullName()` | Метод `fullName() {}` |
|---|---|---|---|
| Чтение | готовое значение | вызов `get` | сама функция, пока не `()` |
| Запись | меняет `value` (если writable) | вызов `set` | замена функции на объекте |
| `this` | не нужен для хранения | объект, у которого читают/пишут | объект вызова (п. 34) |
| Работа каждый раз | нет | да | да, если вызвали |

Аксессор **не кэширует**, пока сами не положите результат в поле. Тяжёлый `get` в цикле — скрытая стоимость.

`this` в геттере — тот объект, через который читают, даже если геттер сидит на прототипе:

```js
const proto = {
  get kind() {
    return this._kind;
  },
};
const a = Object.create(proto);
a._kind = "cat";
a.kind; // "cat"
```

Сорвать геттер как функцию и вызвать голым нельзя так же, как метод: чтение `obj.kind` уже вызов. Но `Object.getOwnPropertyDescriptor(proto, "kind").get.call(other)` — да, `this` подставите руками.

---

#### Ловушка: рекурсия и JSON

Имя геттера и поля совпали:

```js
const obj = {
  get x() {
    return this.x; // снова этот же геттер
  },
};
obj.x; // RangeError: Maximum call stack
```

Внутреннее хранилище — другое имя (`_x`) или `#x` (п. 48).

`JSON.stringify` **вызывает** enumerable геттеры: в JSON попадает **результат**, не функция. Неenumerable геттер пропустит. `JSON.parse` создаёт data-свойства, геттеры из JSON сами не восстанавливаются.

```js
const obj = {
  get a() {
    return 1;
  },
};
JSON.stringify(obj); // '{"a":1}'
```

Спред `{ ...obj }` тоже **читает** enumerable ключи — геттер вызовется, в копии будет data `a: 1`, не геттер.

---

#### TypeScript

`get x(): number` в классе / интерфейсе — в типе это свойство `x: number` (иногда `readonly`, если нет setter). Компилятор не отличает «поле» и «геттер» при чтении. Emit геттера класса — настоящий accessor в JS, не стирается.

`get` в `interface` без реализации — только форма для класса. Объектный литерал с лишним/недостающим геттером проверяется как обычное свойство.

Что сказать на собеседовании: аксессор — get/set вместо value, скобок при чтении нет. this — объект доступа. stringify и спред материализуют значение. Нельзя писать `return this.x` внутри `get x`.

---

### 45. `defineProperty`, `preventExtensions`, `seal`, `freeze`

О чём речь: четыре уровня «запретить менять объект». Их путают с `const` (это про коробку переменной, не про поля) и думают, что `freeze` глубокий. На Senior спрашивают таблицу: что ещё можно сделать после каждой операции и что с вложенным объектом.

---

#### `defineProperty` / `defineProperties`

Точечная настройка одного имени: значение или get/set плюс флаги (п. 43). Возвращает тот же объект.

```js
const obj = { a: 1 };
Object.defineProperty(obj, "hidden", {
  value: 42,
  enumerable: false,
});
obj.hidden;     // 42
Object.keys(obj); // ["a"]
```

Переопределить можно, пока `configurable: true`. На нерасширяемом объекте **новое** имя через defineProperty нельзя, старые (если configurable) ещё меняют.

`Reflect.defineProperty` возвращает `true`/`false` вместо исключения — удобно, когда «попытаться».

---

#### Три защёлки на весь объект

Идут от слабой к сильной. Каждая включает предыдущую.

**`Object.preventExtensions(obj)`** — нельзя **добавить** новое собственное свойство. Старые можно менять, удалять, настраивать. Прототип в современной спеке тоже не меняют. Проверка: `Object.isExtensible(obj)`.

**`Object.seal(obj)`** — ещё и все **существующие** собственные свойства становятся `configurable: false`. Удалить нельзя, превратить data в getter нельзя. `writable` у data **не** сбрасывают: значение ещё можно присвоить. `Object.isSealed`.

**`Object.freeze(obj)`** — seal плюс у всех data `writable: false`. Не добавить, не удалить, не присвоить. Аксессоры остаются: `set` всё ещё вызовут, если он был. `Object.isFrozen`.

```js
const obj = { a: 1, nested: { b: 2 } };
Object.freeze(obj);

obj.a = 9;           // strict: TypeError
obj.z = 1;           // TypeError
delete obj.a;        // TypeError
obj.nested.b = 9;    // 9 — вложенный объект не заморожен
```

Это **shallow**. Глубокая заморозка — рекурсия своим кодом (или политика «не мутировать» без freeze).

`const obj = { a: 1 }` не мешает `obj.a = 2`. `const` запрещает `obj = другой`. Freeze запрещает менять поля текущего объекта.

---

#### Сводка

| | добавить поле | удалить / сменить дескриптор | `obj.a =` (data) | вложенный объект |
|---|---|---|---|---|
| обычный | да | да | да | как был |
| preventExtensions | нет | да | да | как был |
| seal | нет | нет | да | как был |
| freeze | нет | нет | нет | как был, мутабелен |

В sloppy режиме многие присваивания после freeze **молчат**, в strict / модуле / классе — TypeError. Массивы: freeze мешает `push`/`length`.

`Object.freeze` на прототипе защищает методы от подмены на этом объекте-прототипе, но не заменяет lockdown/SES (п. 243).

---

#### TypeScript

`Readonly<T>` и `readonly` в типе — компилятор. `Object.freeze(obj)` в `.d.ts` часто даёт `Readonly<T>` для верхнего слоя; вложенность зависит от lib. Это не глубокий `DeepReadonly` (п. 138). После freeze JS-код всё ещё может получить тот же объект из места без типов и мутировать вложенность.

`as const` делает литерал readonly в типах, в рантайме объект обычный, пока не freeze.

Что сказать на собеседовании: defineProperty настраивает одно свойство. preventExtensions / seal / freeze — ступени целостности объекта, freeze мелкий. const ≠ freeze. Вложенность не защищена.

---

### 46. Inheritance: prototypal vs class

О чём речь: в JS «наследование» — это цепочка прототипов, а не копия полей как в Java. `class extends` — удобный синтаксис над той же моделью плюс жёсткие правила `new` и `super`. На собеседовании просят написать наследника **без** `class` и сказать, чем класс всё-таки не «просто сахар».

---

#### Прототипное: делегирование

Экземпляр не содержит копию методов родителя. Он держит `[[Prototype]]` на объект с методами. Не нашли у себя — спросили у прототипа (п. 41). Это делегирование, не «subclass скопировал vtable в момент компиляции».

Руками до ES6:

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name;
};

function Cat(name, lives) {
  Animal.call(this, name); // поля родителя на this
  this.lives = lives;
}
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;
Cat.prototype.meow = function () {
  return this.speak() + " meow";
};

const c = new Cat("Mila", 9);
c instanceof Cat;    // true
c instanceof Animal; // true
c.meow();            // "Mila meow"
```

Три шага, которые забывают:

1. `Object.create(Animal.prototype)` — не `new Animal()`, иначе лишний экземпляр и побочки конструктора на прототипе.
2. Вернуть `constructor: Cat`, иначе `c.constructor === Animal`.
3. `Animal.call(this, …)` — иначе поля родителя не приедут (прототип несёт методы, не `this.name` из конструктора).

---

#### `class` — тот же каркас, другие запреты

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name;
  }
}

class Cat extends Animal {
  constructor(name, lives) {
    super(name);
    this.lives = lives;
  }
  meow() {
    return this.speak() + " meow";
  }
}
```

В рантайме: `Cat.prototype` → `Animal.prototype` → `Object.prototype`. Методы на прототипах, неenumerable (в отличие от `Cat.prototype.meow = fn`, которое enumerable). `Cat` нельзя вызвать без `new`. До `super()` нет `this` (п. 47, 40). Класс целиком strict.

Поэтому «сахар» неточный: семантика `new`, TDZ полей, `super`, неenumerable методы, `new.target` — не воспроизводятся одной заменой слова `class` на `function`.

---

#### Что наследовать

Цепочка **одна**. Множественного наследования классов нет. Второй «родитель» — миксин или композиция (п. 50).

Наследуют поведение (методы). Данные экземпляра кладут в конструкторе / полях на **этот** объект. Класть изменяемое `this.items = []` на `Parent.prototype` — общая дырка на всех детей.

`extends` работает и с `null`: `class X extends null` — прототип экземпляра не `Object.prototype` (редкость, много ломается).

---

#### Ловушка: подменили `.prototype` после экземпляров

```js
function C() {}
C.prototype.hi = () => "old";
const c = new C();
C.prototype = { hi: () => "new" }; // другой объект
c.hi();        // "old" — живой экземпляр держит старую ссылку
new C().hi();  // "new"
```

`instanceof` смотрит текущий `C.prototype` в цепочке объекта. После подмены старый `c instanceof C` может стать false.

---

#### TypeScript

`class Cat extends Animal` даёт и цепочку JS, и отношение типов: `Cat` assignable куда ждут `Animal` (с оговорками про методы и поля). `interface Cat extends Animal` — **только типы**, в JS ничего не появится. Смешивать «extends в типе» и «extends в рантайме» нельзя в одной фразе без пометки.

Структурность: объект `{ name, speak() }` может пройти там, где ждут `Animal`, даже без прототипа `Animal` — пока не проверят `instanceof`.

Что сказать на собеседовании: наследование — делегирование по [[Prototype]]. class extends расставляет ту же цепочку и запрещает вызов без new / без super. Руками: create(Parent.prototype), constructor, Parent.call(this). Методы общие, состояние — на экземпляре.

---

### 47. `super`, `new.target`, derived constructors

О чём речь: у наследника конструктор и методы должны уметь вызвать **родительскую** реализацию. `super(...)` и `super.method(...)` — не одно и то же. `new.target` говорит, какой конструктор написали после `new`, даже внутри родителя. Без этого путают порядок полей (п. 40) и ломают «абстрактный» базовый класс.

---

#### Derived constructor

Класс с `extends` — derived. Если свой `constructor` написали, **первым** осмысленным обращением к объекту должен быть `super(...)`:

```js
class Parent {
  constructor(n) {
    this.n = n;
  }
}

class Child extends Parent {
  constructor(n) {
    // console.log(this); // ReferenceError
    super(n);
    this.extra = 1; // теперь this есть
  }
}
```

`super(n)` вызывает конструктор родителя с текущим `new.target` (см. ниже). После него — поля Child, потом остаток конструктора Child (п. 40).

Если `constructor` у Child **не** писали, движок подставляет `constructor(...args) { super(...args); }`.

У класса **без** `extends` `super()` нельзя. У `extends null` правила особые (нужен другой путь создать объект).

Обычная функция вместо `super`: `Parent.call(this, n)` — старый паттерн. В `class` так не делают: `this` ещё не существует до `super`.

---

#### `super.method` в методе экземпляра

```js
class Parent {
  hello() {
    return "P";
  }
}

class Child extends Parent {
  hello() {
    return super.hello() + "C";
  }
}

new Child().hello(); // "PC"
```

`super.hello` ищет `hello` начиная с **прототипа родителя**, не с `this` (иначе сразу попали бы в свой `hello` и рекурсия). При этом `this` внутри родительского `hello` — всё ещё экземпляр Child.

Это привязано к месту, где метод **написан** (внутренний `[[HomeObject]]`), не к тому, как сорвали функцию. Стрелка в поле класса: своего `super` как у метода прототипа нет в том же виде; `super` в стрелке поля ссылается на лексику класса, не на динамический вызов.

В объекте-литерале `super` тоже бывает, если объект связан с прототипом через `Object.setPrototypeOf` / `__proto__` в литерале — редкость, на собеседовании достаточно класса.

---

#### `new.target`

Мета-свойство. Не точка на объекте, нельзя `obj.new.target`.

```js
class Parent {
  constructor() {
    console.log(new.target === Child); // true, если писали new Child()
    console.log(new.target === Parent); // true, если new Parent()
  }
}
class Child extends Parent {}
new Child();
```

Даже код **родителя** видит, что конструируют Child. Так делают «нельзя `new Parent`, только наследник»:

```js
class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error("extend me");
    }
  }
}
```

Вызов без `new` у class — TypeError до тела; у ordinary function `new.target === undefined` (п. 37).

Статический метод: `super.foo()` ищет статику родителя; `this` там — сам класс (или наследник, если вызвали `Child.foo()`).

---

#### Ловушка: метод из конструктора родителя

```js
class Parent {
  constructor() {
    this.setup();
  }
  setup() {
    this.value = 1;
  }
}

class Child extends Parent {
  value = 2;
  setup() {
    this.value = 3;
  }
}

new Child().value; // 2, не 3
```

Родитель зовёт `setup` — это метод Child, но поля Child ещё не ставились: `this.value = 3` запишется, потом поле `value = 2` **перезапишет**. Запрет тот же, что в п. 40: не вызывать overridable API из конструктора.

---

#### TypeScript

`super` проверяется: лишние аргументы, отсутствие конструктора у родителя (если не неявный). `new.target` типизирован как `Function | undefined` / конструктор — узко не выводят «это именно Child».

Абстрактный класс `abstract class A { abstract setup(): void }` — только компилятор: в JS класс обычный, `new A` возможно, если не защитили `new.target`. `abstract` стирается.

Что сказать на собеседовании: super() в derived — до this, вызывает родителя. super.method — старт поиска с прототипа родителя, this свой. new.target — кого написали после new, видно и в родителе. Не звать виртуальные методы из конструктора.

---

### 48. Static members, private fields `#`, WeakMap-emulation

О чём речь: данные бывают у **экземпляра**, у **класса как функции** (static) и **по-настоящему скрытые** (`#`). TypeScript-слово `private` на собеседовании часто путают с `#`: первое стирается, второе живёт в JS. Старый код прятал поля в `WeakMap`.

---

#### Static

`static foo` висит на самой функции `C`, не на `C.prototype` и не на экземпляре.

```js
class User {
  static count = 0;
  static create(name) {
    this.count++; // this === User, если User.create()
    return new User(name);
  }
  constructor(name) {
    this.name = name;
  }
}

User.count;          // 0
User.create("A");
User.count;          // 1
new User("B").count; // undefined — у экземпляра нет
```

Наследование: `class Admin extends User {}` — `Admin.create` находится на `User`, если своё не объявили (`[[Prototype]]` у `Admin` это `User`, не `Function.prototype` напрямую как у голой function). `this` внутри `User.create` при вызове `Admin.create()` — `Admin`. Поэтому `new this(name)` создаст Admin.

Обычная функция: «статика» — `User.create = function(){}`. Методы на `.prototype` статики не видят через экземпляр без `this.constructor`.

---

#### `#` — приват рантайма

```js
class Wallet {
  #balance = 0;
  deposit(n) {
    this.#balance += n;
  }
  getBalance() {
    return this.#balance;
  }
}

const w = new Wallet();
w.deposit(10);
w.getBalance(); // 10
w["#balance"];  // undefined — это не строковый ключ "#balance"
w.#balance;     // SyntaxError вне тела класса
```

Свойства с `#` нет в `Object.keys`, JSON, спреде. Доступ проверяется **брендом**: только код этого класса (и его статика/методы, где `#` в исходнике того же класса) может прочитать слот. Подкласс **не** видит `#balance` родителя:

```js
class Better extends Wallet {
  dump() {
    return this.#balance; // SyntaxError: #balance не в этом классе
  }
}
```

Чужой объект без слота: `Wallet.prototype.getBalance.call({})` — TypeError (failed brand check), не `undefined`.

`#m() { }` — приватный метод. `static #x` — приват на конструкторе.

Имена `#foo` lexically scoped: два класса могут иметь `#id` независимо.

---

#### WeakMap как эмуляция

До `#` и для сокрытия у произвольных объектов:

```js
const balances = new WeakMap();

class Wallet {
  constructor() {
    balances.set(this, 0);
  }
  deposit(n) {
    balances.set(this, balances.get(this) + n);
  }
}

const w = new Wallet();
balances.get(w); // 0, если WeakMap в этой области; снаружи модуля — нет
```

Пока жив экземпляр, запись жива. Собрали объект GC — запись из WeakMap уходит, нет утечки как у `Map` со сильными ключами. Снаружи модуля `balances` не экспортировали — поля недоступны (пока кто-то не импортировал ту же карту). Это инкапсуляция **модулем**, не брендом движка: внутри файла всё видно.

`#` не нужен WeakMap для полей экземпляра; WeakMap всё ещё полезен, когда прячут данные у **чужих** объектов (кэш на DOM-узле без поля на нём).

---

#### Ловушка: `private` в TypeScript

```ts
class A {
  private x = 1;
}
```

Emit по умолчанию: `this.x = 1`, обычное поле. Соседний JS и `a["x"]` читают. `private` / `protected` — только проверка компилятора. Настоящий рантайм: `#x` или WeakMap.

`private constructor` тоже стирается: в JS конструктор публичный.

---

#### TypeScript и `#`

`#x` в TS — то же поле в JS. Тип снаружи класса `#x` не видит. `A["#x"]` не работает как индекс.

Смешивать `private x` и `#x` в одной голове нельзя: разные системы. Для библиотеки, где важна скрытость от потребителя без TS, `#` или замыкание/WeakMap.

Что сказать на собеседовании: static на функции-классе, наследуется через прототип конструктора. `#` — слот с brand check, не строка, подкласс не видит чужой `#`. TS private стирается. WeakMap — скрытость через модуль и GC-дружелюбный ключ.

---

### 49. Class fields vs constructor assignment, initialization order

О чём речь: `this.x = 1` в конструкторе и `x = 1` в теле класса — разный момент и иногда разный дескриптор. От этого зависит, перетрёт ли ребёнок то, что записал родитель, попадёт ли поле в `for…in`, и что сделает TypeScript при emit. Порядок уже разбирался в п. 40; здесь ось «поле vs присваивание» и emit.

---

#### Где живёт значение

```js
class A {
  x = 1;
  y;
  constructor() {
    this.z = 3;
  }
  method() {}
}

const a = new A();
a.hasOwnProperty("x");      // true
a.hasOwnProperty("y");      // true (undefined)
a.hasOwnProperty("z");      // true
a.hasOwnProperty("method"); // false — метод на A.prototype
```

Публичные поля — **собственные** свойства экземпляра. Метод — на прототипе, один на всех. Поле-стрелка `h = () => this` — снова своя функция на каждом экземпляре (п. 35).

`y;` без инициализатора всё равно создаёт own-свойство `undefined` (в спеке define на экземпляр).

---

#### Порядок ещё раз, коротко

Без `extends`: создать объект → поля сверху вниз → тело `constructor`.

С `extends`: войти в Child → `super()` (поля и конструктор родителя) → поля Child → остаток конструктора Child.

Поэтому:

```js
class Parent {
  constructor() {
    this.x = 1;
  }
}
class Child extends Parent {
  x = 2;
}
new Child().x; // 2
```

Родитель записал `1`, затем поле ребёнка поставило `2`. Если ждали «конструктор родителя главнее» — сюрприз. Обратная ловушка п. 40: родитель вызвал метод до полей ребёнка.

Порядок **внутри** списка полей — сверху вниз. Нижнее поле не видно верхнему инициализатору (часто `undefined`, не всегда TDZ как у `let`).

---

#### Поле vs `this.x =` : дескриптор и перезапись

В спецификации публичное поле ближе к `Object.defineProperty(this, "x", { value, writable: true, enumerable: true, configurable: true })` — **define**, не «прочитай сеттер на прототипе и вызови».

Присваивание в конструкторе `this.x = 1` — обычный `[[Set]]`: если на прототипе сеттер `x`, он вызовется.

```js
class P {
  set x(v) {
    console.log("set", v);
  }
}
class C extends P {
  x = 1; // define на экземпляре, сеттер родителя может не вызваться
}
new C();
```

Зависит от `useDefineForClassFields` в TS и от движка. В современном JS поля — define. Старый emit TypeScript делал `this.x = 1` в конструкторе — сеттер срабатывал, и поле родителя могло вести себя иначе.

Ещё кейс: родитель в конструкторе сделал `Object.defineProperty(this, "x", { value: 1, writable: false })`. Поле ребёнка `x = 2` попытается redefine — может кинуть TypeError.

---

#### TypeScript emit

Флаги `useDefineForClassFields` и `target` / `useDefineForClassFields` по умолчанию в новых `target`:

- **define** (как спека): `Object.defineProperty`, перетирает то, что родитель положил через присваивание;
- **assign** (старый emit): поля переписываются в `constructor` как `this.x = …` после `super`.

`declare x: number` — **нет** emit, только тип: слот не создаётся, родительское значение не затирается. Им пользуются, когда поле реально ставит базовый класс / декоратор / фреймворк.

`readonly x = 1` в рантайме writable, если не freeze; readonly — компилятор.

---

#### Ловушка: поле с тем же именем, что метод родителя

```js
class Parent {
  hello() {
    return "P";
  }
}
class Child extends Parent {
  hello = () => "C";
}
new Child().hello(); // "C"
Parent.prototype.hello.call(new Child()); // всё ещё можно, но child.hello — своё поле
```

Поле на экземпляре **затеняет** метод прототипа при чтении `child.hello`. Случайно написать `hello = 1` — сломали вызов.

Что сказать на собеседовании: поля — own на экземпляре, методы — на прототипе. Derived: super (и родитель), потом поля ребёнка, потом его constructor. Поле ребёнка перетирает this.x родителя. В TS declare поле не эмитится; define vs assign меняет сеттеры и перезапись.

---

### 50. Mixins, composition over inheritance

О чём речь: в JS одна цепочка прототипов. Когда поведение нужно «подмешать» из нескольких мест, `extends` не хватает. Миксин копирует методы в класс; композиция держит помощника в поле и делегирует. Senior ожидают, почему глубокая иерархия классов ломается и чем mixin опасен для `super` и типов.

---

#### Проблема одной лестницы

`class Admin extends User extends Account extends Evented` — хрупко: порядок конструкторов, поля, «бог-объект», ромб «оба деда с hello()». `instanceof` знает только одну линию. Нужна лодка и полёт — не `extends Boat extends Plane`.

---

#### Миксин: скопировать методы

Простой вариант — присвоить функции на прототип:

```js
const Speakable = {
  speak() {
    return this.name;
  },
};

class User {
  constructor(name) {
    this.name = name;
  }
}
Object.assign(User.prototype, Speakable);

new User("Ada").speak(); // "Ada"
```

`this` при `user.speak()` — user (п. 34). `instanceof Speakable` нет: Speakable не конструктор.

Фабрика классов:

```js
const Speakable = (Base) =>
  class extends Base {
    speak() {
      return this.name;
    }
  };

class User {
  name = "Ada";
}
class TalkingUser extends Speakable(User) {}
new TalkingUser().speak(); // "Ada"
```

Цепочка настоящая: TalkingUser → анонимный класс с `speak` → User. Можно сложить `Speakable(Flyable(User))`. Порядок: кто ближе в цепочке, тот побеждает при одинаковых именах.

Минусы миксина:

- конфликт имён молчаливый;
- состояние миксина легко положить не туда (`Speakable.items = []` на прототипе — общее);
- `super` в скопированном через `Object.assign` методе привязан к **исходному** HomeObject, после копирования часто ломается;
- типы: TS не видит assign на prototype сам, нужна декларация или mixin-паттерн с конструкторным типом.

---

#### Композиция: объект внутри, а не «я есть»

```js
class Speaker {
  speak(name) {
    return name;
  }
}

class User {
  #speaker = new Speaker();
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.#speaker.speak(this.name);
  }
}
```

User **имеет** Speaker, а не является им. Менять реализацию, мокать в тесте, не тащить лишний `instanceof`. Нет борьбы за конструктор. Цена — чуть больше клея (`speak()` проксирует).

«Composition over inheritance» здесь буквально: делегировать соседу, а не наращивать `extends`, когда отношение не «is-a».

---

#### Когда что

| Ситуация | Обычно |
|---|---|
| настоящее is-a, один родитель, тот же жизненный цикл | `class extends` |
| кусок поведения на несколько несвязанных классов | mixin или HOF вокруг класса |
| стратегия, I/O, логгер, кэш | поле + делегирование |
| несколько независимых осей (полёт и плавание) | композиция, не двойной extends |

В React-мире то же чутьём: HOC/mixin устарели в пользу композиции пропсов и хуков — это не тема этого пункта, но мотив один.

---

#### Ловушка: миксин с конструктором и полями

```js
function Timestamped(Base) {
  return class extends Base {
    created = Date.now();
    constructor(...args) {
      super(...args);
    }
  };
}
```

Поля миксина встают в порядок derived-полей (п. 40, 49): могут перетереть `created` базы. Два миксина с полем `id` — последний в `extends` победит. Композиция с `#clock = new Clock()` конфликтов имён на экземпляре не создаёт.

`Object.assign(C.prototype, { get x() { ... } })` копирует **результат чтения** или аксессор — зависит от assign: assign копирует **значения**, геттер вызовется один раз при копировании. Для аксессоров нужен `defineProperty` / `getOwnPropertyDescriptors`.

---

#### TypeScript

Миксин с выводом:

```ts
type Ctor<T = {}> = new (...args: never[]) => T;

function Speakable<B extends Ctor>(Base: B) {
  return class extends Base {
    speak(this: { name: string }) {
      return this.name;
    }
  };
}
```

Дальше пересечение типов / `InstanceType`. Это шумно; для публичного API чаще явный интерфейс `implements Speakable` плюс композиция в рантайме. `implements` не добавляет методы в JS — только проверка.

Что сказать на собеседовании: одна prototype chain — не несколько extends. Миксин копирует или оборачивает класс; ломает super и имена. Композиция — «есть помощник», проще тестировать. assign не копирует геттеры как геттеры.

---

### 51. `instanceof` pitfalls across realms/iframes

О чём речь: `x instanceof Ctor` выглядит как «x — экземпляр класса Ctor». На самом деле это вопрос про **цепочку прототипов и конкретный объект `Ctor.prototype` в этом движке**. Два окна браузера, iframe, `vm` в Node, воркер — у каждого свой набор встроенных конструкторов. Массив из iframe «не массив» для родительского `Array`. П. 3 уже назвал проблему; здесь — модель realm и что писать вместо `instanceof` на границе.

---

#### Что проверяет оператор

Алгоритм (без `Symbol.hasInstance`):

1. Правый операнд должен быть объектом с `[[HasInstance]]` (функция / класс). Иначе TypeError: `"x" instanceof "Array"`.
2. Левый, если не объект, сразу `false`: `"a" instanceof String` — `false`. Бокс сам не происходит.
3. Берут `Ctor.prototype` и идут по `[[Prototype]]` левого. Нашли тот же объект — `true`. Дошли до `null` — `false`.

Сравниваются **ссылки на объекты-прототипы**, не имена классов и не «форма» полей.

```js
function User() {}
const u = new User();
u instanceof User; // true: User.prototype в цепочке u

User.prototype = {};
u instanceof User; // false: в цепочке старый прототип, новый .prototype другой
```

Перезаписали `.prototype` после `new` — старые экземпляры «перестали быть» User для `instanceof`. `constructor` на старом прототипе тоже разъедется (п. 41).

---

#### Realm: свой Array, свой Object

Realm — отдельное куча + свой набор встроенных. Iframe:

```js
const iframe = document.createElement("iframe");
document.body.append(iframe);
const OtherArray = iframe.contentWindow.Array;
const a = new OtherArray(1, 2, 3);

a instanceof Array;       // false — другой Array.prototype
a instanceof OtherArray;  // true
Array.isArray(a);         // true — бренд массива, не ссылка на конструктор
```

То же для `Date`, `Map`, `RegExp`, `Promise`, ошибок, `Object`. `obj instanceof Object` ложно, если объект создан в другом окне (у него другой `Object.prototype` в конце цепочки).

Поэтому проверки на границе (`postMessage`, iframe-виджет, `vm.runInNewContext`) не строят на `instanceof Array` / `instanceof Error`.

---

#### Подмена: `Symbol.hasInstance`

```js
class Even {
  static [Symbol.hasInstance](x) {
    return Number(x) % 2 === 0;
  }
}
2 instanceof Even; // true — не про прототип
```

Библиотека может так «притвориться» типом. Надёжная проверка встроенного — специализированный `is*` или `Object.prototype.toString.call` (п. 3, 57), не голый `instanceof`.

Bound-функция: `instanceof` смотрит на целевую функцию, но путаница с `.prototype` bound-функции (его нет как у обычной) на собеседовании встречается. Практичнее не проверять bound через `instanceof`.

---

#### Ловушка: ошибка из чужого бандла

Два копипаста класса `ValidationError` в разных чанках webpack — два конструктора. `catch (e)` + `e instanceof ValidationError` даёт `false`, хотя поля те же. Это тот же класс проблем, что realm: **другая ссылка на `.prototype`**. Лечат общим модулем ошибки, проверкой `e.name` / `e.code`, или `Error.isError` там, где он есть.

```js
try {
  iframe.contentWindow.eval("throw new TypeError('x')");
} catch (e) {
  e instanceof TypeError; // часто false
  e.name === "TypeError"; // true
}
```

---

#### TypeScript

`instanceof` сужает к экземпляру **того** класса, который видит компилятор. Если в рантайме объект из iframe, типы врут: ветка `if (x instanceof Array)` внутри считает `x` массивом родителя, а проверка ложна. Для неизвестного входа честнее `Array.isArray(x)` — type predicate на `any[]`.

`interface` нельзя справа от `instanceof` (стирается, п. 13). Только значение-конструктор.

Что сказать на собеседовании: `instanceof` — есть ли этот `Ctor.prototype` в цепочке, не «имя типа». Iframe/vm/дубликат класса ломают. Массивы — `Array.isArray`. Ошибки с границы — `name`/`cause`/`isError`, не слепой instanceof.

---

### 52. Prototype pollution (JS) и защита

О чём речь: если код рекурсивно мержит ненадёжный объект в ваш, злоумышленник может записать ключ `__proto__` или `constructor.prototype` и **подмешать свойства всему `Object.prototype`**. Дальше любой `{}` внезапно имеет `isAdmin: true`, `toString` ломается, `for…in` тащит мусор (п. 42). Это не «баг lodash из 2018», а модель: присваивание по динамическому ключу трогает прототип.

---

#### Как загрязняют цепочку

Обычный объект наследует `Object.prototype`. Сеттер `__proto__` живёт там (п. 41). Рекурсивный merge в духе:

```js
function merge(target, source) {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val && typeof val === "object") {
      if (!target[key]) target[key] = {};
      merge(target[key], val);
    } else {
      target[key] = val;
    }
  }
  return target;
}

merge({}, JSON.parse('{"__proto__": {"polluted": true}}'));
({}).polluted; // true, если присваивание key === "__proto__" сменило прототип / поля на Object.prototype
```

`JSON.parse` в современных движках **сам** обычно не меняет `[[Prototype]]` парса: ключ `"__proto__"` становится собственным свойством. Вредит следующий шаг: `target[key] = ...` или `Object.assign`, которые идут через сеттер / вложенный merge в `Object.prototype`.

Второй вектор — `constructor`:

```js
JSON.parse('{"constructor": {"prototype": {"polluted": true}}}');
```

Если merge зайдёт в `obj.constructor.prototype`, это снова `Object.prototype` у обычного `{}`.

---

#### Что ломается после pollution

```js
Object.prototype.isAdmin = true;

const user = { name: "Ada" };
user.isAdmin; // true — «поле» с прототипа
for (const k in user) {
  // name и isAdmin, если enumerable
}
```

Авторизация вида `if (user.isAdmin)`, шаблоны, `utils.merge(config, req.body)`, jQuery-плагины — классика CVE. Enumerable-поля на `Object.prototype` светятся в `for…in` по **каждому** объекту (п. 56).

---

#### Защита

1. **Не мержить незнакомца в объект с прототипом.** Тело запроса — в `Map`, в `Object.create(null)`, или явный allowlist ключей (`id`, `name`).
2. **Чёрный список недостаточно один:** фильтровать `__proto__`, `constructor`, `prototype` на каждом уровне. Забыли вложенность — дыра.
3. **Присваивать через `defineProperty` / `Object.defineProperties`**, не через `obj[key] =`, если ключ снаружи: так не вызывается сеттер `__proto__`.
4. **`Object.hasOwn` / `Object.prototype.hasOwnProperty.call`**, не `obj.hasOwnProperty` — после pollution `hasOwnProperty` могут подменить.
5. **`Object.freeze(Object.prototype)`** в теории стопит запись; на практике ломает библиотеки, которые патчат прототипы. Не первый инструмент приложения.
6. Node: `--disable-proto=delete` убирает аксессор (операционная мера, не замена аккуратного merge).

```js
function safeAssign(target, key, value) {
  if (key === "__proto__" || key === "constructor" || key === "prototype") {
    return;
  }
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
```

Спред `{ ...untrusted }` копирует own enumerable, включая строку `"__proto__"` как ключ в некоторых случаях, и **не** должен менять прототип цели так же, как сеттер на живом объекте — но рекурсивный «deep spread» руками снова пишет `target[k]`. Опасен алгоритм merge, не JSON сам по себе.

---

#### TypeScript

Типы merge (`lodash.merge`, спред) не моделируют pollution: `Partial<User>` не запретит ключ `"__proto__"` на `Record<string, unknown>`. На границе — `unknown` + Zod/парсер с `.strict()` и без свободного index signature, либо явные поля. `Object.create(null)` в типах легко притворится `Record<string, T>` и снова сожрёт любой ключ.

Что сказать на собеседовании: pollution — запись в `Object.prototype` через динамический ключ при merge. JSON.parse сегодня часто не сам виноват, виноват `obj[key] =` / глубокий assign. Защита — Map/null-prototype, allowlist, defineProperty, не слепой deep merge тела запроса.

---

### 53. `Object.assign`, spread, shallow vs deep copy

О чём речь: скопировать объект «чтобы не мутировать пропсы» в JS почти всегда **поверхностно**: новый корень, те же вложенные ссылки. `Object.assign` и `{ ...obj }` путают с глубоким клоном и с копией дескрипторов. На собеседовании ждут: что копируется, что становится data-свойством, куда деваются прототип, символы и геттеры.

---

#### Поверхностная копия

```js
const inner = { n: 1 };
const a = { inner, x: 2 };
const b = { ...a };
const c = Object.assign({}, a);

b.inner === a.inner; // true
b.inner.n = 9;
a.inner.n; // 9 — общее вложение
```

Новый объект `b`/`c`. Поля первого уровня — свои. Значения-объекты — **те же ссылки**. Мутация `b.inner` бьёт `a`. `const` тут ни при чём (п. 32): коробка `b` не переприсваивается, содержимое inner меняется.

Прототип источника **не** копируется: `{ ...a }` и `assign({}, a)` дают объект с `Object.prototype`, даже если `a` был `Object.create(parent)`.

---

#### Assign vs спред

Оба берут **enumerable own** ключи (строки и символы) и **читают** значение, затем пишут data-свойство на цель.

```js
const src = {
  get x() {
    return 1;
  },
};
const copy = { ...src };
Object.getOwnPropertyDescriptor(copy, "x");
// value: 1, writable true — геттера нет
```

Аксессор вызывается один раз, в копии лежит результат (п. 44, 50). Неenumerable (`defineProperty` с `enumerable: false`) не копируются. Методы с прототипа не копируются.

Нюансы:

- `Object.assign(target, ...sources)` **мутирует target** и возвращает его. Спред всегда новый литерал (если не писать `Object.assign(existing, { ... })`).
- Несколько источников: правый побеждает при одинаковом ключе.
- `assign` вызывает сеттеры на target; спред в литерал определяет own-поля. Поэтому `assign(objWithProtoSetter, src)` может сработать иначе, чем `{ ... }`.
- `null`/`undefined` в assign как источник пропускаются; спред `{ ...null }` в современном JS допустим и даёт `{}`.

---

#### Глубокая копия — отдельное решение

| Способ | Циклы | Функции | Date/Map | Потеря |
|---|---|---|---|---|
| спред / assign | нет, общие вложения | копирует ссылку на функцию | ссылка | прототип, неenumerable, геттеры |
| `JSON.parse(JSON.stringify(x))` | нет, бросит | выкинет | Date → строка ISO | `undefined`, symbol, bigint бросит |
| `structuredClone(x)` (п. 54) | да | бросит | клонирует | функции, DOM, WeakMap |
| ручной clone | как напишете | как напишете | как напишете | легко забыть ключ |

«Deep» без спецификации почти всегда баг на `Date`, regexp, классе, `#private`.

---

#### Ловушка: копирование «настроек» с вложенным массивом

```js
const defaults = { tags: ["a"] };
function withTag(cfg, tag) {
  const next = { ...cfg };
  next.tags.push(tag); // мутировали defaults.tags
  return next;
}
withTag(defaults, "b");
defaults.tags; // ["a", "b"]
```

Нужно `{ ...cfg, tags: [...cfg.tags, tag] }` или structuredClone / Immer (п. 55).

---

#### TypeScript

Спред объекта даёт пересечение типов источников, не «глубокий клон типа». `Readonly<T>` не мешает мутировать вложенность, если поля не `readonly` рекурсивно. `Object.assign` типизирован слабо (часто перегрузками, которые врут при многих аргументах). После копии с границы всё равно `unknown`, пока не распарсили.

Что сказать на собеседовании: assign и спред — shallow, enumerable own, геттер превращается в value. Вложенные объекты общие. Deep — JSON (криво) или structuredClone / явная раскладка полей. Прототип и неenumerable не едут.

---

### 54. Structured clone, `structuredClone`

О чём речь: алгоритм structured clone придумали для `postMessage` между окнами и воркерами: перенести **данные**, не функции и не живые DOM-узлы как есть. `structuredClone(value)` даёт тот же алгоритм внутри одного realm: глубокая копия с циклами, `Map`/`Set`/`Date`, без JSON-костыля. Senior отличает его от спреда и знает, на чём он падает.

---

#### Что клонируется

Копия **новая**, вложения не общие (в отличие от п. 53). Циклические ссылки сохраняются:

```js
const a = { n: 1 };
a.self = a;
const b = structuredClone(a);
b.self === b;     // true
b.self !== a;     // true
b.n = 2;
a.n;              // 1
```

Обычно клонируются: plain objects, массивы, `Date`, `RegExp` (без lastIndex-нюансов как у JSON), `Map`, `Set`, `ArrayBuffer` и typed arrays, `Blob`/`File` в поддерживающих средах, многие `Error` в новых движках, `boolean`/`number`/`string`/`bigint`/`null`.

Прототип пользовательского класса **теряется**: экземпляр `class Point {}` приедет plain-объектом с own-полями, не `instanceof Point`. `#private` не копируется как приват слота — клон не тот класс.

---

#### Что бросает или отбрасывает

```js
structuredClone({ fn() {} }); // DataCloneError — функция
structuredClone(document.body); // DataCloneError — DOM-узел
structuredClone(new WeakMap()); // DataCloneError
```

Symbol-ключи **отбрасываются**, значения-символы на строковых ключах тоже нельзя. `undefined` в массиве сохранится (в отличие от `JSON.stringify`, который сделает `null` в массиве). В объекте ключ со значением `undefined` structured clone умеет сохранить как undefined, JSON — выкинет ключ.

`toJSON` **не вызывается**: это не JSON. Кастомная сериализация для clone — отдельный протокол не тот же, что п. 59.

Transfer: `structuredClone(buf, { transfer: [buf] })` отдаёт копию логики сообщения и **отбирает** оригинал буфера (нейтрализует). Тема целиком — п. 97; здесь достаточно знать, что clone и transfer соседние.

---

#### vs JSON vs assign

```js
const src = { d: new Date("2020-01-01"), m: new Map([["a", 1]]), cycle: null };
src.cycle = src;

JSON.parse(JSON.stringify(src)); // цикл бросит; Date станет строкой; Map станет {}
structuredClone(src);            // Date и Map живые, цикл ок
{ ...src };                      // cycle и m — те же ссылки
```

Для `postMessage(data)` браузер сам structured-clone. Дублировать `JSON.parse(JSON.stringify)` «чтобы передать в worker» незачем, если данные клонируемые.

---

#### TypeScript

`structuredClone<T>(value: T): T` врёт так же, как аннотация на `JSON.parse`: классы и функции в `T` в рантайме не приедут. Тип после клона пользовательского класса честнее считать plain / `unknown` и сужать. На компиляцию не влияет — это рантайм Web/HTML, не emit TS.

Что сказать на собеседовании: structured clone — глубокая копия для данных сообщений. Циклы, Date, Map — да. Функции, DOM, WeakMap — нет. Класс превращается в данные без прототипа. Не JSON: toJSON не зовут.

---

### 55. Immutability patterns без библиотек и с Immer-моделью мышления

О чём речь: иммутабельность в JS — соглашение, не режим языка. `const` запрещает переприсвоить коробку, не замораживает поля (п. 16, 32). React и Redux ждут новые ссылки на изменившиеся куски. На собеседовании ждут паттерны без библиотеки и модель Immer: «пиши мутации на черновике, снаружи новый стейт».

---

#### Почему ссылка важна

```js
const prev = { items: [1], ok: true };
prev.items.push(2);
// тот же prev — PureComponent / memo / useEffect([state]) не увидят смену
```

Сравнение стейта часто `Object.is` / `===`. Мутация на месте оставляет ту же ссылку — подписчик спит. Нужен новый объект для **изменившихся** уровней, неизменные поддеревья можно оставить теми же (structural sharing).

---

#### Без библиотек

```js
const state = { user: { name: "Ada", tags: ["x"] }, n: 1 };

const renamed = {
  ...state,
  user: { ...state.user, name: "Bob" },
};

const tagged = {
  ...state,
  user: { ...state.user, tags: [...state.user.tags, "y"] },
};
```

Спред каждого уровня, который меняется. Массив — `slice` / `map` / `filter` / rest, не `push` на старом. Удаление ключа: `const { gone, ...rest } = obj`. Вложенность из пяти уровней делает это нечитаемым — тогда линтер (`no-param-reassign`) не спасёт от копипасты.

`Object.freeze(state)` ловит мутации в strict (п. 45). Глубокий freeze — рекурсия руками; вложенные до freeze всё ещё мутабельны. В проде freeze как «настоящая иммутабельность» редок: цена и ломание библиотек. Как отладка — ок.

`structuredClone(state)` даёт новый граф целиком, sharing нет: перерендер «всё новое», для большого стейта жирно.

---

#### Модель Immer

Immer: `produce(state, draft => { draft.user.name = "Bob" })`. Вы мутируете **proxy-черновик**. Библиотека записывает правки и строит новый стейт, шаря нетронутые ветки. Снаружи иммутабельно, внутри редьюсера — привычный императив.

Мыслить так можно и без пакета: «черновик — место, где разрешён push; наружу всегда return нового корня». Самописный produce на Proxy — учебная задача, в проде не дублировать Immer.

Ловушка Immer: утечка `draft` наружу (`setState(draft)`), асинхронная мутация черновика после `produce`, сравнение черновика с оригиналом. Черновик нельзя класть в стейт.

---

#### Ловушка: «скопировал корень»

```js
function add(state, item) {
  const next = { ...state };
  next.list = state.list;
  next.list.push(item);
  return next;
}
```

Корень новый, `list` старый — и мутирован. Подписчики на `state.list` могут не сработать, если смотрят на массив, а те, кто смотрит на корень, сработают. Баг гонок: оба мира сразу. Правило: меняешь массив — новая ссылка массива.

---

#### TypeScript

`readonly` / `Readonly<T>` / `ReadonlyArray<T>` — компилятор, в JS массив всё ещё с `push` (п. 16). `Readonly<T>` неглубокий: `user` внутри можно мутировать по типам, если не `Readonly` рекурсивно. Immer даёт типы `Draft<T>` vs `T`. Не путать `as const` (литералы) с иммутабельностью рантайма.

Что сказать на собеседовании: иммутабельность — новые ссылки на изменённых уровнях, не const и не мелкий freeze. Спред shallow. Immer — мутации черновика, снаружи новый граф и sharing. Утёкший draft — баг.

---

### 56. Property enumeration: `for…in`, `keys`, `getOwnProperty*`

О чём речь: «пройтись по полям объекта» в JS — пять разных API, и они видят разный набор ключей. Из-за этого `for…in` тащит inherited `polluted`, `Object.keys` молчит про символы, JSON «теряет» неenumerable. П. 43 уже сказал про флаг enumerable; здесь — кто что перечисляет и в каком порядке.

---

#### Свой vs унаследованный, строка vs символ

Свойство либо **own**, либо с прототипа. Ключ либо **строка**, либо **symbol**. Флаг enumerable включает или выключает «видимость в перечислении».

```js
const proto = { inherited: 1 };
const obj = Object.create(proto);
obj.own = 2;
Object.defineProperty(obj, "hidden", { value: 3, enumerable: false });
const s = Symbol("s");
obj[s] = 4;
```

---

#### Кто что видит

| API | Own? | Inherited enumerable? | Неenumerable | Символы |
|---|---|---|---|---|
| `for…in` | да | да | нет | нет |
| `Object.keys` / `values` / `entries` | да | нет | нет | нет |
| `Object.getOwnPropertyNames` | да | нет | строки да | нет |
| `Object.getOwnPropertySymbols` | да | нет | символы да | только они |
| `Reflect.ownKeys` | да | нет | да | да |

```js
for (const k in obj) {
  // "own", "inherited" — не hidden, не symbol
}
Object.keys(obj); // ["own"]
Object.getOwnPropertyNames(obj); // ["own", "hidden"]
Reflect.ownKeys(obj); // ["own", "hidden", s]
```

`for…in` по массиву идёт по индексам **и** enumerable полям на прототипе, не по `length` как методу (методы Array неenumerable). Всё равно для массива пишут `for…of` / индекс, не `for…in`.

Фильтр своих в старом коде: `if (Object.hasOwn(obj, k))` внутри `for…in`. Без фильтра pollution и миксины на прототипе всплывают.

---

#### Порядок

Для own строковых ключей спецификация:

1. целочисленные индексы по возрастанию (`"0"`, `"1"`, `"10"`);
2. остальные строки в порядке создания;
3. символы в порядке создания.

`Object.keys` символы не показывает, но строки — в этом порядке. Целочисленные ключи словаря `{"10": a, "2": b}` при обходе могут поехать `2` потом `10`, не как вставляли (п. 10). `Map` сохраняет вставку.

---

#### Ловушка: `for…in` по словарю с прототипом

```js
Object.prototype.polluted = "x";

const dict = { a: 1 };
const copy = {};
for (const k in dict) {
  copy[k] = dict[k];
}
copy.polluted; // "x" — скопировали с прототипа
```

`Object.assign({}, dict)` / `{ ...dict }` **не** копируют inherited. Именно поэтому спред безопаснее наивного `for…in` для клона. Словарь с произвольными ключами — `Map` или `Object.create(null)` (п. 42): `for…in` по null-prototype не лезет в `Object.prototype`.

`JSON.stringify` берёт enumerable own **строки**, вызывает геттеры и `toJSON` (п. 59). Неenumerable и символы пропускает.

---

#### TypeScript

`keyof T` — ключи типа, не результат `Object.keys`. `Object.keys(obj)` типизирован как `string[]`, не `(keyof T)[]`: в рантайме могут быть лишние enumerable поля. Итерация `for (const k of Object.keys(o))` не даёт безопасного `o[k]` как `T[k]` без уточнения. `for…in` ещё шире. Честный обход известных ключей — `(Object.keys(o) as (keyof T)[])` только если объект не расширяли, или `satisfies` + литерал.

Что сказать на собеседовании: for-in — own плюс inherited enumerable строки. keys — только own enumerable строки. Полный набор own — Reflect.ownKeys. Клон через for-in копирует pollution. Массивы for-in не обходят.

---

### 57. Symbols as unique keys, well-known: `toStringTag`, `hasInstance`, `iterator`

О чём речь: символ как ключ не сталкивается со строкой `"id"` из JSON и не всплывает в `Object.keys`. Well-known символы — крючки языка: «этот объект итерируемый», «так его зовут в toString», «так работает instanceof». П. 9 ввёл примитив; здесь — как объекты и классы этими крючками меняют операции.

---

#### Свой символ — скрытое own-поле

```js
const brand = Symbol("brand");
const user = { name: "Ada", [brand]: "User" };

Object.keys(user);              // ["name"]
JSON.stringify(user);           // {"name":"Ada"}
user[brand];                    // "User"
Object.getOwnPropertySymbols(user); // [brand]
```

Два `Symbol("brand")` **не равны**. Одинаковый символ между модулями — либо общий импорт константы, либо `Symbol.for("app.brand")` (глобальный реестр, в том числе риск коллизии по строке).

Не для секрета от атакующего: `Reflect.ownKeys` всё видно. Для отсутствия коллизии с пользовательскими ключами и с `for…in`.

`structuredClone` и JSON эти ключи не сохранят (п. 54, 59). Бренд только в памяти процесса.

---

#### `Symbol.iterator`

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let n = this.from;
    const last = this.to;
    return {
      next() {
        if (n <= last) return { value: n++, done: false };
        return { value: undefined, done: true };
      },
    };
  },
};

[...range]; // [1, 2, 3]
```

Без этого ключа `for…of` и спред по объекту — TypeError. Массив и строка уже имеют iterator на прототипе. Подробности протокола — п. 69; здесь факт: итерация смотрит **символ**, не метод `.iterator`.

---

#### `Symbol.toStringTag`

```js
class User {
  get [Symbol.toStringTag]() {
    return "User";
  }
}
Object.prototype.toString.call(new User()); // "[object User]"
```

`typeof` по-прежнему `"object"`. Тег нужен отладке и старым `isPlainObject`. Его можно подделать — для безопасности не годится один. Встроенные (`Map`, `Promise`) уже ставят тег.

---

#### `Symbol.hasInstance`

См. п. 51: статический метод на конструкторе подменяет `instanceof`. Писать на пользовательских классах редко; знать — чтобы не доверять instanceof слепо.

Другие well-known на объектах: `Symbol.toPrimitive` (п. 60), `Symbol.species` у коллекций (п. 58), `Symbol.asyncIterator`.

---

#### Ловушка: «пустой» объект в логе

```js
const cache = { [Symbol.for("id")]: 1 };
console.log(cache); // зависит от DevTools: часто {} или Object {Symbol(): 1}
JSON.stringify(cache); // {}
```

Сериализация «потеряла данные», хотя поле было. Для API — строковые ключи; символы для внутренних слотов.

---

#### TypeScript

`unique symbol` — тип конкретного символа, годится как ключ в объекте и для бренда (п. 25). `symbol` слишком широк: не отличить два ключа. Вычисляемое `[sym]: T` в интерфейсе требует, чтобы `sym` был `unique symbol`. Well-known (`Symbol.iterator`) уже описаны в lib DOM/ES: класс с методом `[Symbol.iterator]()` становится iterable для `for…of` в типах.

Что сказать на собеседовании: свой символ — уникальный ключ вне keys/JSON. Язык расширяется well-known: iterator, toStringTag, hasInstance, toPrimitive. Это не безопасность, это отсутствие коллизий и протокол. Clone/JSON символы не везут.

---

### 58. Extending built-ins: Array/Error/Promise pitfalls

О чём речь: `class MyArray extends Array` выглядит законно, но `map`/`slice` должны решить, какой конструктор взять для результата. Ошибки и промисы ещё капризнее: stack, `instanceof` после транспиляции, `then` который возвращает базовый `Promise`. Senior знает `Symbol.species`, зачем `Error.captureStackTrace` и почему патчить `Array.prototype` в приложении нельзя.

---

#### Array и `Symbol.species`

```js
class MyArray extends Array {
  uniq() {
    return this.filter((x, i, a) => a.indexOf(x) === i);
  }
}

const a = MyArray.from([1, 1, 2]);
const b = a.map((x) => x * 2);
b instanceof MyArray; // true в нативном ES-классе: species = this.constructor
a.uniq() instanceof MyArray;
```

Методы вроде `map` делают `new Species`. По умолчанию species — сам подкласс. Можно вернуть базовый массив:

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}
```

Тогда `map` даст `Array`, `uniq` если написан через `filter` — тоже. Ловушка: смешать ожидания «всегда MyArray» и species `Array`.

Транспиляция класса в ES5 **ломает** наследование массива: `length` и индексы ведут себя как у обычного объекта. Подкласс Array — только нативный `class` / современный target.

Не класть методы на `Array.prototype` в приложении: `for…in`, чужой код, коллизии имён. Свои функции `uniq(arr)` или обёртка, не прототип встроенного.

---

#### Error

```js
class ValidationError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ValidationError";
  }
}

const e = new ValidationError("bad", { cause: new Error("io") });
e instanceof ValidationError; // true в нативном class
e instanceof Error;           // true
e.cause;                      // вложенная причина (современные движки)
```

`name` сами: иначе в логе будет `"Error"`. Stack: V8 `Error.captureStackTrace(this, ValidationError)` убирает конструктор из стека; без него иногда лишняя рамка.

ES5-транспиляция: `instanceof ValidationError` часто **false**, пока не `Object.setPrototypeOf(this, new.target.prototype)` в конструкторе. В tsconfig `target` ниже ES2015 — та же история.

Дубликат класса в двух бандлах — снова п. 51.

---

#### Promise

```js
class Delay extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}
```

`then`/`catch` по умолчанию могут конструировать тот же подкласс. Неаккуратный подкласс ломает цепочку (ожидали thenable, получили не тот species). На практике кастомный Promise почти не пишут: обёртка с методами рядом, внутри обычный Promise.

`Promise.resolve` чужого thenable может вызвать `then` — не путать с `extends Promise`.

---

#### Ловушка: `map` вернул не то

```js
class Numbers extends Array {
  sum() {
    return this.reduce((a, b) => a + b, 0);
  }
}
new Numbers(1, 2).map(String).sum; // undefined, если species сменил тип на Array без sum
```

Либо species оставить Numbers и `map` строк всё ещё Numbers (странно для `sum`), либо не наследовать Array, а держать `{ values: number[], sum() }`.

---

#### TypeScript

`class E extends Error` нормально типизируется. `target`/`useDefineForClassFields` влияют на `instanceof` в emit — проверять в том runtime, куда собираете (п. 124). Подкласс `Array<T>` сохраняет `T` на методах, но species компилятор не моделирует до конца: `map` может в типах врать относительно рантайма. `lib` должна знать `cause` у Error, иначе опцию руками.

Что сказать на собеседовании: extends Array работает на нативном class, результат map зависит от species. Error — name, cause, setPrototypeOf если старый target. Promise лучше не наследовать. Прототипы встроенных в приложении не патчить.

---

### 59. `toJSON`, custom serialization

О чём речь: `JSON.stringify` не «вываливает все поля». Он вызывает `toJSON`, если метод есть, ходит только по enumerable own строкам, выкидывает `undefined` и функции, падает на `bigint` и на циклах. Кастомная сериализация — `toJSON` на прототипе или `replacer`. Обратно — `JSON.parse` + `reviver`, не магия типов (п. 13).

---

#### Что делает stringify

Порядок для объекта roughly:

1. Если есть `toJSON` — взять `value.toJSON(key)` и сериализовать **результат**.
2. Иначе enumerable own строковые ключи (геттеры вызываются).
3. `undefined`, функции, символы как значения объекта — ключ пропускается; в массиве `undefined`/функция становятся `null`.
4. `bigint` — TypeError, пока сами не превратите в строку.
5. Цикл — TypeError.

```js
const user = {
  id: 1,
  password: "x",
  toJSON() {
    return { id: this.id };
  },
};
JSON.stringify(user); // {"id":1} — password не уехал
```

`Date.prototype.toJSON` даёт ISO-строку. Поэтому JSON round-trip даты — строка, не `Date` (п. 53).

---

#### `replacer` и `reviver`

```js
JSON.stringify(user, ["id"]); // только ключ id, toJSON всё равно мог срезать раньше

JSON.stringify(obj, (key, value) => {
  if (key === "password") return undefined; // выкинуть
  if (typeof value === "bigint") return value.toString();
  return value;
});

JSON.parse(text, (key, value) => {
  if (key === "created" && typeof value === "string") return new Date(value);
  return value;
});
```

`replacer`-массив — allowlist ключей **на каждом объекте**, легко срезать вложенность нечаянно.

Второй аргумент `space` — отступы, не логика.

---

#### toJSON vs клон vs valueOf

`toJSON` для **JSON**. `structuredClone` его не зовёт (п. 54). `valueOf` / `toString` — для операторов и шаблонов (п. 60), stringify их не использует, если есть объекты: берёт поля или toJSON.

Несколько `toJSON` в цепочке прототипов — own ближе, как обычный метод.

---

#### Ловушка: потеря класса и undefined

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
JSON.stringify(new Point(1, 2)); // {"x":1,"y":2} — без бренда класса

JSON.stringify({ a: undefined, b: () => 0, c: Symbol() }); // {}
JSON.stringify([undefined, () => 0]); // [null,null]
```

После parse это не `Point`, не методы. Восстановление — reviver или схема (Zod) + конструктор. `#private` в JSON нет.

`toJSON` который возвращает `this` — риск цикла / бесконечной рекурсии, если stringify снова видит тот же объект без смены формы. Возвращайте plain data.

---

#### TypeScript

`JSON.stringify` принимает `any`/`unknown` по сути; тип возврата `string`. `JSON.parse` — `any` в старых typedef, честнее `unknown`. Метод `toJSON(): T` на классе не заставит parse вернуть класс. Типизируют DTO отдельно от доменной модели.

Что сказать на собеседовании: stringify зовёт toJSON, потом enumerable строки. undefined в объекте пропадает, в массиве — null. Date уезжает ISO. Классы и приваты не едут. Обратно — parse + reviver/схема, не аннотация User.

---

### 60. `valueOf` и неявные преобразования объектов

О чём речь: объект в арифметике, сравнении `==` или сложении сначала делают примитивом. Это `ToPrimitive` (п. 5): `Symbol.toPrimitive`, иначе `valueOf` / `toString` в порядке от подсказки. Здесь ось **объекта**: зачем Date ведёт себя как число и как строка, почему `[] + {}` и когда свой `valueOf` вреден в доменной модели.

---

#### Порядок ToPrimitive

Подсказка `hint`: `"number"`, `"string"`, `"default"`.

1. Если есть `obj[Symbol.toPrimitive]`, вызвать с hint. Вернуть **примитив**, иначе TypeError.
2. Иначе для `"string"`: сначала `toString`, потом `valueOf`. Для `"number"` и часто `"default"`: сначала `valueOf`, потом `toString`.
3. Метод пропускают, если его нет или он вернул объект. Оба вернули объекты — TypeError.

```js
const x = {
  valueOf() {
    return 10;
  },
  toString() {
    return "ten";
  },
};

Number(x); // 10 — числовой hint, valueOf
String(x); // "ten"
`${x}`;    // "ten" — строковый hint
x + 1;     // 11 — default у ordinary объекта ближе к числу, valueOf
```

`Date` особый: default hint как строка. `` `${date}` `` и `date + ""` — читаемая дата; `+date` / `date - 0` — timestamp через valueOf.

---

#### `valueOf` у встроенных

У боксов `Number`/`String`/`Boolean` `valueOf` достаёт примитив. Поэтому `new Number(1) == 1` истинно (`==` зовёт ToPrimitive), а `new Number(1) === 1` ложно (разные типы). Не создавать боксы.

```js
const n = new Number(1);
typeof n;        // "object"
n.valueOf();     // 1
n === 1;         // false
```

Массив: `valueOf` обычно возвращает сам массив (объект) → падают в `toString` → join через запятую. Отсюда `[1,2] + 3 === "1,23"`. Пустой `[]` → `""`.

Объект `{}`: `valueOf` возвращает себя, `toString` → `"[object Object]"` (или тег, п. 57).

```js
[] + {};     // "[object Object]"  — "" + "[object Object]"
// {} + [] в консоли может быть 0 из-за блока `{` и +[]
```

---

#### Свой valueOf на домене

```js
class Money {
  constructor(cents) {
    this.cents = cents;
  }
  valueOf() {
    return this.cents;
  }
}

const a = new Money(100);
a + 1;     // 101 — тихо уехали в число, валюта потерялась
a == 100;  // true
```

Удобно для демо, опасно в проде: неявное сложение «денег» с числом. Лучше явные `add`, `toCents`. Если уже нужен крючок языка — `Symbol.toPrimitive` с разбором hint и броском на `"default"`, чтобы `+` не молчал.

`Object.create(null)` без toString/valueOf в арифметике часто **TypeError** — нечем привести (п. 42).

---

#### Ловушка: valueOf вернул объект

```js
const bad = {
  valueOf() {
    return {};
  },
  toString() {
    return "ok";
  },
};
Number(bad); // NaN? нет: valueOf-объект пропускают, toString "ok", Number("ok") === NaN
String(bad); // "ok"
```

Если и `toString` вернёт объект — TypeError при `+bad` / `Number(bad)`.

`==` между объектом и примитивом тоже ToPrimitive. Два объекта — по ссылке, valueOf не зовут: `{} == {}` всегда false.

---

#### TypeScript

`valueOf` в типах часто наследуется как `Object.prototype.valueOf(): Object` — почти бесполезно. Компилятор **не** пересчитывает `a + 1`, если `a` класс: тип может остаться `number` или ошибка в зависимости от `plus` overloads, но coercion Money не моделируется. Не полагаться на типы вместо явного метода. `Symbol.toPrimitive` можно объявить методом с аргументом `"string" | "number" | "default"`.

Что сказать на собеседовании: объект в операторе сначала ToPrimitive. toPrimitive важнее; иначе valueOf/toString по hint. Date default — строка. Свой valueOf делает объект «как число» и прячет баги. Два объекта == по ссылке.

---

Дальше по оглавлению — секция 4: функции и функциональный стиль (п. 61+).

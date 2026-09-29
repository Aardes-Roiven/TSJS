# package.json, the type field, and npm scripts

Детализация п. 6 уровня «base», Node.js. Оглавление: [index.md](./index.md).

Конспект: сначала о чём речь и зачем это нужно на этом уровне, потом устройство, пример, ловушка и короткая формулировка, с которой тему можно закрыть.

#### О чём речь

`package.json` помечает корень пакета: имя, зависимости и команды, которыми этот пакет запускают. Поле `"type"` решает, чем является соседний файл `.js`. Без него это CommonJS, и `require` работает. Со значением `"module"` тот же `.js` становится модулем ECMAScript, и `require` падает с `ReferenceError`. Скрипт в поле `"scripts"` запускают через `npm`, а не набором команды в shell: `npm` сам встаёт в каталог пакета и видит программы из `node_modules`.

---

#### Модель

Один `package.json` описывает один пакет. Node ищет его вверх от файла, который выполняет. Поле `"type"` в найденном файле относится к `.js` этого пакета. Зависимости и lockfile — этот уровень, п. 7. Форматы модулей — этот уровень, п. 3 и п. 4.

Команда `npm start` читает `scripts.start` и запускает её отдельным процессом. Рабочий каталог этой команды — каталог, где лежит `package.json`, а не тот каталог, из которого вызвали `npm`.

---

#### Поле type выбирает формат .js

Нет поля `"type"`, или оно равно `"commonjs"`: файл `index.js` загружается как CommonJS. `"type": "module"`: тот же `index.js` загружается как модуль ECMAScript. Расширение `.mjs` остаётся модулем ECMAScript, а `.cjs` остаётся CommonJS при любом `type`. Встреча расширения и поля целиком — advanced, п. 37. Файл вне любого такого `package.json` — expert, п. 35.

#### npm run выполняет строку из scripts

`npm start` и `npm test` — короткие имена для `scripts.start` и `scripts.test`. Остальные имена вызывают так: `npm run greet`. Внутри скрипта каталог `node_modules/.bin` стоит в `PATH`, поэтому команда пакета пишется по имени. Аргументы самой программе передают после `--`: `npm start -- --port 9`. Без `--` их читает `npm`, а не программа.

`npm run` без имени печатает список скриптов.

---

#### Пример

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

```javascript
console.log("hello")
```

Файл программы называется `index.js` и лежит рядом с `package.json`. Команда `npm start` печатает `hello`. `npm run start` делает то же самое. Процесс `node` стартует в каталоге этого `package.json`.

---

#### Ловушка

`"type": "module"` меняет уже написанный `.js`, и `require` пропадает.

```json
{
  "type": "module"
}
```

```javascript
const fs = require("node:fs")
```

`node index.js` падает так: `ReferenceError: require is not defined in ES module scope, you can use import instead`. В тексте ошибки сказано, что файл считается модулем ECMAScript, потому что у него расширение `.js`, а в `package.json` стоит `"type": "module"`. Либо замените вызов на `import fs from "node:fs"`, либо уберите `"type": "module"`, либо переименуйте файл в `index.cjs`.

---

#### Сводка

| Что запускаете | Откуда берётся команда |
|---|---|
| `npm start` | `scripts.start` |
| `npm test` | `scripts.test` |
| `npm run greet` | `scripts.greet` |
| `node index.js` при `"type": "module"` | Модуль ECMAScript, `require` не определён |
| `node index.js` без `"type"` | CommonJS |

В обычной работе формат `.js` задают полем `type` один раз на пакет, а ежедневный запуск кладут в `scripts` и вызывают через `npm`.

#### Граница инструмента

`package.json` читают и Node, и `npm`. Node смотрит на `type`, чтобы выбрать формат файла. `npm` смотрит на `scripts` и сам `node` не подменяет: строка скрипта — обычная команда shell.

#### Чем закрыть тему

Добавьте `scripts.start` с `node index.js` и проверьте, что `npm start` печатает строку из файла. Поставьте `"type": "module"`, оставьте в файле `require` и проверьте `ReferenceError`. Замените `require` на `import` и проверьте, что `npm start` снова доходит до печати.

Следующая нераскрытая тема: этот уровень, п. 11. path.join and path.resolve.

/**
 * Задача
 *
 * Данные пришли как unknown — так выглядит JSON.parse или ответ чужого API.
 * Это не Log[]. Часть элементов — мусор.
 *
 * Реализуй isLog, parseLogs и summarize. Без class / this / new.
 *
 * isLog — type predicate: `value is Log`. В runtime проверяет форму
 * и сужает тип для TypeScript. Не используй `as Log`.
 * Недостаточно посмотреть type: у click должны быть конечные числа x и y,
 * у nav — строка path, у error — строка message.
 * Лишние поля допустимы, если обязательные на месте и правильного типа.
 *
 * parseLogs:
 * - если input не массив — верни []
 * - иначе верни только валидные логи, остальное отбрось
 *
 * summarize считает количество по type.
 * Разбор union сделай исчерпывающим: в default присвой never,
 * чтобы новый вариант Log ломал компиляцию.
 */

type ClickLog = { type: "click"; x: number; y: number } // лог клика: литерал type и две координаты-числа
type NavLog = { type: "nav"; path: string } // лог навигации: литерал type и путь-строка
type ErrorLog = { type: "error"; message: string } // лог ошибки: литерал type и текст ошибки
type Log = ClickLog | NavLog | ErrorLog // дискриминантный union по полю type

const raw: unknown = [ // вход как unknown: компилятор не верит, что это Log[]
  { type: "click", x: 10, y: 20 }, // валидный click
  { type: "nav", path: "/home" }, // валидный nav
  { type: "click", x: "10", y: 20 }, // мусор: x строка, не число
  { type: "error", message: "boom" }, // валидный error
  { type: "nav" }, // мусор: нет path
  null, // мусор: не объект
  "click", // мусор: примитив
  { type: "debug", message: "x" }, // мусор: неизвестный type
  { type: "error", message: 1 }, // мусор: message не строка
  { type: "click", x: 1, y: 2, extra: true }, // валидный click: лишнее поле extra можно
  { type: "click", x: Number.NaN, y: 0 }, // мусор: NaN не конечное число
] // конец тестовых данных

function isFiniteNumber(value: unknown): value is number { // узкий guard: unknown → конечное number
  return typeof value === "number" && Number.isFinite(value) // отсекает строки, NaN, Infinity, не-числа
} // конец isFiniteNumber

function isLog(value: unknown): value is Log { // type predicate: если вернули true, дальше value это Log
  if (typeof value !== "object" || value === null) { // typeof null === "object", поэтому null отсекаем отдельно
    return false // примитивы и null — не логи
  } // конец проверки «это объект»

  if (!("type" in value) || typeof value.type !== "string") { // без строкового дискриминанта ветку union не выбрать
    return false // нет type или type не строка
  } // конец проверки type

  if (value.type === "click") { // претендент на ClickLog
    if (!("x" in value) || !("y" in value)) { // оба поля должны существовать
      return false // не хватает координаты
    } // конец проверки наличия x/y
    return isFiniteNumber(value.x) && isFiniteNumber(value.y) // x и y — конечные числа, не "10" и не NaN
  } // конец ветки click

  if (value.type === "nav") { // претендент на NavLog
    return "path" in value && typeof value.path === "string" // path есть и это строка; пустая строка допустима
  } // конец ветки nav

  if (value.type === "error") { // претендент на ErrorLog
    return "message" in value && typeof value.message === "string" // message есть и это строка, не число
  } // конец ветки error

  return false // любой другой type (debug и т.д.) — не Log
} // конец isLog

function parseLogs(input: unknown): Log[] { // граница unknown → Log[]: мусор выкидываем
  if (!Array.isArray(input)) { // JSON мог принести объект, null, строку — это не список логов
    return [] // по условию не-массив даёт пустой результат
  } // конец проверки массива

  const logs: Log[] = [] // сюда кладём только прошедшие isLog

  for (const item of input) { // идём по элементам; после JSON.parse элемент всё ещё unknown
    if (isLog(item)) { // runtime-проверка + сужение: внутри ветки item это Log, без as Log
      logs.push(item) // оставляем валидный лог
    } // конец if isLog
  } // конец цикла

  return logs // только ClickLog | NavLog | ErrorLog
} // конец parseLogs

function summarize(logs: Log[]): { click: number; nav: number; error: number } { // считаем, сколько логов каждого type
  const counts = { click: 0, nav: 0, error: 0 } // стартовые нули по трём вариантам union

  for (const log of logs) { // каждый лог уже валидный, ветвимся по дискриминанту
    switch (log.type) { // type — литералы "click" | "nav" | "error"
      case "click": // ветка ClickLog
        counts.click += 1 // плюс один клик
        break // выходим из switch
      case "nav": // ветка NavLog
        counts.nav += 1 // плюс один переход
        break // выходим из switch
      case "error": // ветка ErrorLog
        counts.error += 1 // плюс одна ошибка
        break // выходим из switch
      default: { // если в Log добавят новый вариант, эта ветка перестанет быть never
        const exhaustive: never = log // некуда положить новый вариант — компилятор красный
        return exhaustive // сюда в рантайме не дойдём, если union закрыт
      } // конец default
    } // конец switch
  } // конец цикла по логам

  return counts // { click, nav, error }
} // конец summarize

export default summarize(parseLogs(raw)) // прогоняем unknown → Log[] → счётчики
// ожидаем { click: 2, nav: 1, error: 1 }

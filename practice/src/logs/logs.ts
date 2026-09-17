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

type ClickLog = { type: "click"; x: number; y: number }
type NavLog = { type: "nav"; path: string }
type ErrorLog = { type: "error"; message: string }
type Log = ClickLog | NavLog | ErrorLog

const raw: unknown = [
  { type: "click", x: 10, y: 20 },
  { type: "nav", path: "/home" },
  { type: "click", x: "10", y: 20 },
  { type: "error", message: "boom" },
  { type: "nav" },
  null,
  "click",
  { type: "debug", message: "x" },
  { type: "error", message: 1 },
  { type: "click", x: 1, y: 2, extra: true },
  { type: "click", x: Number.NaN, y: 0 },
]

function isLog(value: unknown): value is Log {
  throw new Error("implement isLog")
}

function parseLogs(input: unknown): Log[] {
  throw new Error("implement parseLogs")
}

function summarize(logs: Log[]): { click: number; nav: number; error: number } {
  throw new Error("implement summarize")
}

export default summarize(parseLogs(raw))
// ожидаем { click: 2, nav: 1, error: 1 }

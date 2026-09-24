/**
 * Задача
 *
 * Реализуй where, gte, sort, skip, limit и query так, чтобы код ниже заработал.
 *
 * query принимает операции и возвращает функцию, которую вызывают
 * на массиве данных. Операции применяются по порядку.
 *
 * where — фильтр по совпадению переданных полей.
 * gte — оставить элементы, у которых поле >= значения.
 * sort — сортировка по имени поля по возрастанию.
 * skip — отбросить первые n элементов.
 * limit — оставить только первые n элементов.
 *
 * Filter и sort напиши сам — не используй Array.prototype.filter
 * и Array.prototype.sort.
 */

type Person = { id: number; name: string; surname: string; age: number }

const data: Person[] = [
  { id: 1, name: "John", surname: "Doe", age: 34 },
  { id: 2, name: "John", surname: "Doe", age: 33 },
  { id: 3, name: "John", surname: "Doe", age: 35 },
  { id: 4, name: "Mike", surname: "Doe", age: 35 },
]

const ids = query<Person>(
  where<Person>({ name: "John" }),
  where<Person>({ surname: "Doe" }),
  sort<Person>("age"),
)(data).map((u) => u.id)

export default ids
// ожидаем [1, 3]

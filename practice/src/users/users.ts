/**
 * Задача
 *
 * Реализуй where, sort и query так, чтобы код ниже заработал.
 *
 * query принимает операции и возвращает функцию, которую вызывают
 * на массиве данных.
 * where фильтрует по совпадению переданных полей.
 * sort сортирует по имени поля.
 */


// type Person = { id: number; name: string; surname: string; age: number }

// const data: Person[] = [
//   { id: 1, name: "John", surname: "Doe", age: 34 },
//   { id: 2, name: "John", surname: "Doe", age: 33 },
//   { id: 3, name: "John", surname: "Doe", age: 35 },
//   { id: 4, name: "Mike", surname: "Doe", age: 35 },
// ]

// const ids = query(
//   where<Person>({ name: "John" }),
//   where<Person>({ surname: "Doe" }),
//   sort<Person>("age"),
// )(data).map((u) => u.id)

 export default 1
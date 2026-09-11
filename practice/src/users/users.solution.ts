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

type Person = { id: number; name: string; surname: string; age: number };
type QueryFn<T> = (elems: T[]) => T[]

const data: Person[] = [
  { id: 1, name: "John", surname: "Doe", age: 34 },
  { id: 2, name: "John", surname: "Doe", age: 33 },
  { id: 3, name: "John", surname: "Doe", age: 35 },
  { id: 4, name: "Mike", surname: "Doe", age: 35 },
];

function where<T extends object>(match: Partial<T>): QueryFn<T> {
  return (data) => {
    const accepted: T[] = []

    for(const el of data) {
      let ok = true

      for(const key of Object.keys(match) as (keyof T)[]) {
        if(el[key] !== match[key]) {
          ok = false
          break
        }
      }

      if(ok === true) {
        accepted.push(el)
      }
    }

    return accepted
  }
}

function compareValues(left: unknown, right: unknown): number {
  if(typeof left === "number" && typeof right === "number") {
    return left - right
  }

  if(typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right)
  }

  if(typeof left === "bigint" && typeof right === "bigint") {
    return left < right ? -1 : 0
  }

  return String(left).localeCompare(String(right))
}

function sort<T>(key: keyof T): QueryFn<T> {
  return (data) => data.slice().sort((left, right) => compareValues(left[key], right[key]))
  
}

function query<T>(...ops: QueryFn<T>[]): (data: T[]) => T[] {
  return (data) => ops.reduce((acc, op) => op(acc), data.slice())
}

const ids = query(
  where<Person>({ name: "John" }),
  where<Person>({ surname: "Doe" }),
  sort<Person>("age"),
)(data).map((u) => u.id);

export default ids
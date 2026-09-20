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
type QueryFn<T> = (data: T[]) => T[]

const data: Person[] = [
  { id: 1, name: "John", surname: "Doe", age: 34 },
  { id: 2, name: "John", surname: "Doe", age: 33 },
  { id: 3, name: "John", surname: "Doe", age: 35 },
  { id: 4, name: "Mike", surname: "Doe", age: 35 },
]

function query<T>(...ops: QueryFn<T>[]): (data: T[]) => T[] {
    return (data) => ops.reduce((curr, op) => op(curr), data.slice())
}

function where<T>(parameters: Partial<T>): QueryFn<T> {
    return (data) => {
        const accepted: T[] = []

        for(const dataEl of data) {
            let pass = true

            for(const parameter of Object.keys(parameters) as (keyof T)[]) {
                if(dataEl[parameter] !== parameters[parameter]) {
                    pass = false
                    break
                }
            }
            
            if(pass) {
                accepted.push(dataEl)
            }
        }

        return accepted
    }
}

function gte<T, K extends keyof T>(key: K, value: T[K]): QueryFn<T> {
    return (data) => {
        const accepted: T[] = []

        for (const item of data) {
            if (item[key] >= value) {
                accepted.push(item)
            }
        }

        return accepted
    }
}

function compareValues(left: unknown, right: unknown): number {
    if(typeof left === "number" && typeof right === "number") return left - right
    if(typeof left === "string" && typeof right === "string") return left.localeCompare(right)

    return String(left).localeCompare(String(right))
}

function merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
    const result: T[] = []
    let i = 0
    let j = 0

    while (i < left.length && j < right.length) {
        const a = left[i]!
        const b = right[j]!

        if (compare(a, b) <= 0) {
            result.push(a)
            i++
        } else {
            result.push(b)
            j++
        }
    }

    while (i < left.length) {
        result.push(left[i++]!)
    }

    while (j < right.length) {
        result.push(right[j++]!)
    }

    return result
}

function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) {
        return arr.slice()
    }

    const mid = Math.floor(arr.length / 2)
    const left = mergeSort(arr.slice(0, mid), compare)
    const right = mergeSort(arr.slice(mid), compare)

    return merge(left, right, compare)
}

function sort<T>(param: keyof T): QueryFn<T> {
    return (data) => mergeSort(data, (left, right) => compareValues(left[param], right[param]))
}

function skip<T>(amount: number): QueryFn<T> {
    return (data) => data.slice(amount)
}

function limit<T>(amount: number): QueryFn<T> {
    return (data) => data.slice(0, amount)
}

const ids = query<Person>(
  where<Person>({ name: "John" }),
  where<Person>({ surname: "Doe" }),
  gte("age", 34),
  sort<Person>("age"),
  skip<Person>(0),
  limit<Person>(2),
)(data).map((u) => u.id)

export default ids
// ожидаем [1, 3]

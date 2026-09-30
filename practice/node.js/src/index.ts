// console.log("TSJS practice is ready")

// import queryRes from './users/users.js'

// console.log(queryRes)

/** 
 * Дан массив непересекающихся интервалов intervals, где intervals[i] = [start, end], отсортированный по возрастанию начала. 
 * Также дан новый интервал newInterval = [start, end].
Два интервала считаются пересекающимися, если у них есть хотя бы одна общая точка 
(то есть касание границами тоже считается пересечением).
Нужно вставить newInterval так, чтобы массив остался отсортированным по началу и по-прежнему не содержал пересечений, 
объединяя интервалы при необходимости. Вернуть получившийся массив.
Исходный массив менять не обязательно: можно вернуть новый.
Пример: intervals = [[1,3],[6,9]], newInterval = [2,5] → [[1,5],[6,9]].
 * 
 * 
 * 
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].
 * 
 */

// type Interval = [number, number]

// function interval(intervals: Interval[], newInterval: Interval): Interval[] {
//     const result: Interval[] = []
//     let i = 0
//     const n = intervals.length

//     while(i < n) {
//         const curr = intervals[i]
//         if(curr === undefined || curr[1] >= newInterval[0]) break
//         result.push(curr)
//         i++
//     }

//     while(i < n) {
//         const curr = intervals[i]
//         if(curr === undefined || curr[0] > newInterval[1]) break
//         newInterval[0] = Math.min(newInterval[0], curr[0])
//         newInterval[1] = Math.max(newInterval[1], curr[1])
//         i++
//     }

//     result.push(newInterval)

//     while(i <= n) {
//         const arr = intervals[i]
//         if(arr !== undefined) {
//             result.push(arr)
//         }
//         i++
//     }

//     return result
// }


function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    return function (this: any, ...args: any) {
        if(timeoutId) {
            clearTimeout(timeoutId)
        }
        const context = this
        timeoutId = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}

function logging(tmp: any) {
    console.log(tmp)
}

const temp = debounce(logging, 2000)
const temp2 = debounce(logging, 3000)

temp('12312')
temp2('12433333312')
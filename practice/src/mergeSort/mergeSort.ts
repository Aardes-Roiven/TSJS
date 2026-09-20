function merge(left: number[], right: number[]): number[] {
    const result: number[] = []
    let i = 0
    let j = 0

    while (i < left.length && j < right.length) {
        const a = left[i]!
        const b = right[j]!

        if (a <= b) {
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

export default function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) {
        return arr.slice()
    }

    const mid = Math.floor(arr.length / 2)
    const left = mergeSort(arr.slice(0, mid))
    const right = mergeSort(arr.slice(mid))

    return merge(left, right)
}

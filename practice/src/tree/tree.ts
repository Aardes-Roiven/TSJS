/**
 * Задача
 *
 * Есть плоский массив узлов. У каждого есть id, parentId и полезные поля.
 * parentId === null — корень. Остальные ссылаются на id родителя.
 *
 * Напиши toTree: сверни массив в одно дерево. Вложенность произвольная,
 * не один уровень. У каждого узла в результате должен быть children.
 * Если детей нет — пустой массив, не undefined.
 *
 * Порядок детей — как в исходном массиве.
 * Вход не мутируй.
 * Без class / this / new.
 *
 * В тестовых данных один корень. Если корней вдруг несколько —
 * возьми первый по порядку в массиве.
 */

type FlatNode = {
  id: number
  parentId: number | null
  name: string
}

type TreeNode = {
  id: number
  parentId: number | null
  name: string
  children: TreeNode[]
}

const data: FlatNode[] = [
  { id: 1, parentId: null, name: "Org" },
  { id: 2, parentId: 1, name: "Eng" },
  { id: 3, parentId: 2, name: "FE" },
  { id: 4, parentId: 2, name: "BE" },
  { id: 5, parentId: 1, name: "HR" },
  { id: 6, parentId: 5, name: "Recruiting" },
  { id: 7, parentId: 3, name: "React" },
]

function toTree(nodes: FlatNode[]): TreeNode {
  const store = new Map<number, TreeNode>()

  for(const elem of nodes) {
    store.set(elem.id, {
      ...elem,
      children: []
    })
  }

  const roots: TreeNode[] = []

  for(const elem of nodes) {
    const current = store.get(elem.id)

    if(!current) continue

    if(elem.parentId === null) {
      roots.push(current)
      continue
    }

    const parent = store.get(elem.parentId)

    if(!parent) {
      roots.push(current)
      continue
    }

    parent.children.push(current)
  }

  const root = roots[0]

  if(!root) throw new Error("aboba")

  return root
}

export default toTree(data)
// ожидаем:
// {
//   id: 1,
//   parentId: null,
//   name: "Org",
//   children: [
//     {
//       id: 2,
//       parentId: 1,
//       name: "Eng",
//       children: [
//         {
//           id: 3,
//           parentId: 2,
//           name: "FE",
//           children: [
//             { id: 7, parentId: 3, name: "React", children: [] },
//           ],
//         },
//         { id: 4, parentId: 2, name: "BE", children: [] },
//       ],
//     },
//     {
//       id: 5,
//       parentId: 1,
//       name: "HR",
//       children: [
//         { id: 6, parentId: 5, name: "Recruiting", children: [] },
//       ],
//     },
//   ],
// }

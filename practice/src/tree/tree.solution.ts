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
  // Два прохода по списку, O(n). Сначала копии узлов в Map, потом ссылки parent → child.
  // Копии нужны, чтобы не мутировать вход и сразу иметь children: [].
  const byId = new Map<number, TreeNode>() // id → узел дерева; get/set в среднем O(1)

  for (const node of nodes) { // первый проход: создать все узлы, пока без связей
    byId.set(node.id, { // кладём копию, исходный FlatNode не трогаем
      id: node.id, // тот же id
      parentId: node.parentId, // тот же родитель, пока только как поле
      name: node.name, // полезные данные
      children: [], // детей наберём во втором проходе; лист останется []
    }) // конец копии узла
  } // конец первого прохода

  const roots: TreeNode[] = [] // сюда узлы без родителя; по условию берём первый

  for (const node of nodes) { // второй проход: в том же порядке, чтобы дети шли как в массиве
    const current = byId.get(node.id) // берём уже созданную копию этого узла

    if (current === undefined) { // Map.get из-за noUncheckedIndexedAccess даёт T | undefined
      continue // в нормальных данных id всегда есть, ветка для типов
    } // конец защиты current

    if (node.parentId === null) { // это корень: родителя нет
      roots.push(current) // откладываем, не вешаем ни на кого
      continue // к следующему узлу
    } // конец ветки корня

    const parent = byId.get(node.parentId) // ищем родителя по parentId за O(1), не сканом массива

    if (parent === undefined) { // битая ссылка: родителя нет в списке
      roots.push(current) // считаем такой узел корнем, чтобы он не потерялся
      continue // к следующему узлу
    } // конец ветки «родитель не найден»

    parent.children.push(current) // вешаем current на родителя; вложенность сама вырастет из ссылок
  } // конец второго прохода

  const root = roots[0] // по условию один корень; если несколько — первый по порядку в массиве

  if (root === undefined) { // пустой вход или вообще нет узлов
    throw new Error("no root") // дерева собрать нельзя
  } // конец проверки корня

  return root // один объект-дерево произвольной глубины
}

export default toTree(data)

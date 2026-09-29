# Base: Zustand

1. A store lives outside the component tree
2. create
3. The creator receives set, get, and the store
4. The object returned by the creator is the initial state
5. set with a partial object merges own keys at the top level
6. set with a function receives the current state
7. replace: true writes the next value as the whole state
8. The hook returned by create
9. A selector
10. One hook call reads one field
11. The component rerenders when the selected value is not Object.is to the previous one
12. A hook call without a selector rerenders on every change
13. A selector that returns a new object, array, or function on every call
14. An action is a function stored next to the data
15. A partial update keeps the same action function
16. get reads the current state inside an action
17. getState
18. setState
19. A read in an event handler uses getState and does not subscribe
20. subscribe and the unsubscribe function it returns
21. Mutating the current state object does not notify
22. Replacing a nested object drops the fields that were not copied
23. set and get throw while the creator is still running
24. Each create call builds a separate store

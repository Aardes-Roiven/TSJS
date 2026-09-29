# Advanced: Zustand

1. useShallow
2. shallow
3. createWithEqualityFn and useStoreWithEqualityFn
4. An update written at the call site with setState
5. A slice creator receives set, get, and the store
6. One create spreads several slices into a single state
7. A slice action reaches another slice through get
8. A slice's StateCreator names the slice and the full store
9. Middleware is applied to the combined creator, not inside a slice
10. createStore builds a store without a hook
11. useStore binds a vanilla store to a component
12. A store created once and passed through context
13. A store created during render is a new store every time
14. subscribeWithSelector
15. The listener receives the selected slice and the previous slice
16. equalityFn on a subscribeWithSelector subscription
17. fireImmediately
18. persist stores the state under a name
19. createJSONStorage
20. partialize
21. version and migrate
22. onRehydrateStorage returns the function that runs when hydration finishes
23. skipHydration and rehydrate
24. hasHydrated
25. devtools
26. The third argument of set is the action name devtools records
27. immer
28. An immer recipe mutates the draft or returns the next state
29. combine
30. The redux middleware keeps a reducer and adds dispatch
31. devtools is placed outside immer and persist
32. create<T>()() when the store uses a middleware
33. After await, the action reads with get
34. Resetting the store with getInitialState
35. A Map or a Set has to be replaced to notify
36. A derived value is calculated in the selector
37. A subscription opened in an effect does not rerender the component
38. A test calls getState and setState and does not render

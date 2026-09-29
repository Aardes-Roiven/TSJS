# Expert: Zustand

1. Listeners run only when the value given to set is not Object.is to the current state
2. A partial object is a new reference, so listeners run even if those fields are unchanged
3. The hook skips render when the selector result is Object.is to the previous snapshot
4. A partial update builds the next root with Object.assign
5. When replace is omitted, a next state that is null or not an object replaces the root
6. replace: true drops every key the next value does not have
7. Listeners are called inside set, before set returns
8. Each set notifies its listeners, and React batches the renders from one event
9. A listener that calls set notifies again before the outer set returns
10. useStore passes the selector through useSyncExternalStore
11. The server snapshot is the selector of getInitialState
12. A client snapshot that differs from the server snapshot mismatches hydration
13. useShallow keeps the previous result when every own key passes Object.is
14. A nested object inside a useShallow result is compared by reference
15. A class without [immerable] is mutated in place, and Object.is then skips listeners
16. persist does not write storage at store creation
17. Synchronous storage hydrates during create; asynchronous storage hydrates afterward
18. The stored value is { state, version }
19. The default merge copies the stored object over the current state one level deep
20. An unequal stored version runs migrate, or is dropped when migrate is missing
21. A later rehydrate cancels one that has not finished
22. persist makes getInitialState return the creator result from before hydration
23. clearStorage removes the entry and invalidates an unfinished hydration
24. onFinishHydration receives the state, and the callback from onRehydrateStorage also receives the error
25. A middleware replaces setState, and an inner middleware does not see the outer wrapper
26. subscribeWithSelector calls the listener only after its equality check fails
27. v4 took an equality function on the hook; v5 compares the snapshot with Object.is
28. create requires React 18 and does not embed the useSyncExternalStore shim
29. destroy is gone, and unsubscribe removes a single listener
30. The default import of create was removed
31. get and set inside the creator run before state has been assigned
32. A duplicated store module runs create twice
33. persist writes its own tab and does not listen for storage events from other tabs

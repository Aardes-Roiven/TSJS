# Expert: MobX

1. A reaction subscribes to the computed it read, not to that computed's own dependencies
2. A possibly stale computed is recomputed before its observers run
3. Reactions flush when the outermost action ends
4. Reads inside an action are untracked
5. autoAction is a derivation or an action depending on the caller
6. Only the derivation that is executing subscribes
7. transaction batches without untracking, and action also untracks
8. An observable array dependency is one index, the length, or the iteration
9. Reading a missing key subscribes to that key appearing
10. toJS inside a reaction subscribes to every field it visits and returns a plain clone
11. intercept and observe fire on each mutation inside an action
12. spy is omitted from production builds
13. A computed remembers a thrown exception until a dependency changes
14. A reaction failure does not propagate to the action, unless disableErrorBoundaries is set
15. The enforceActions check warns in development and is absent from production
16. Two copies of MobX keep separate global state
17. enableStaticRendering still set when the client renders
18. observer's shallow prop check and React.memo around the same component
19. A MobX flush and a React render batch are different queues
20. Overwriting an action or a computed property on the instance
21. Legacy decorators are rejected
22. Namespaced annotations were replaced by named exports
23. Proxy is required, and useProxies and proxy: false are gone
24. override does not re-annotate a subclass field
25. A prototype chain cannot mix decorators and makeObservable
26. reactionScheduler replaces the end-of-action flush
27. Cancelling a flow leaves the yielded promise running
28. Strict Mode discards the observer reaction from the extra render
29. The order in which reactions run is not specified
30. useDefineForClassFields and field initializers versus makeAutoObservable
31. createAtom with reportObserved and reportChanged
32. Creating a reaction while a computed is evaluating

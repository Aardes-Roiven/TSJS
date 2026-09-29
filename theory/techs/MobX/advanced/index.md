# Advanced: MobX

1. reaction: the data function is tracked and the effect is not
2. when
3. await ends the action, and runInAction starts the next one
4. flow keeps every resumed step inside an action
5. Cancelling a flow
6. flowResult
7. A transpiled generator that makeAutoObservable does not recognize as flow
8. action wrapped around a function that is not a method
9. A debounced or otherwise wrapped function is no longer an action
10. An action called from a render or a computed adds no dependencies
11. delay on autorun and reaction
12. A reaction that writes an observable it also reads
13. An error from a reaction is reported through onReactionError, and the reaction stays alive
14. untracked
15. observable.map
16. observable.set
17. observable.box
18. observableRef stores the assigned value without converting it
19. observableShallow converts the collection and not its items
20. observableStruct skips notification when the new value is structurally equal
21. An equals comparer on a computed or a reaction, and computedStruct
22. slice, concat, map, and filter return a plain array
23. sort and reverse mutate the observable array
24. An observable() object, a property added later, and delete
25. A property added to a class instance after makeAutoObservable
26. extendObservable
27. Excluding a member with false
28. makeObservable, override, and a subclass
29. actionBound and autoBind
30. deep: false on makeAutoObservable
31. A computed setter
32. A computed that suspends when nothing observes it, and keepAlive
33. onBecomeObserved and onBecomeUnobserved
34. A cycle between computeds
35. toJS
36. keys, values, and entries
37. isObservable and isObservableProp
38. useLocalObservable
39. The factory passed to useLocalObservable runs on the first render only
40. Copying props into a local observable
41. Observer for a child render callback
42. An autorun or reaction created in useEffect, and disposing it on cleanup
43. A store in React context and a Provider value that stays the same
44. Plain data for a child that is not an observer
45. enableStaticRendering
46. observer and forwardRef
47. observer on a class component comes from mobx-react
48. A custom hook reads observables only while an observer is rendering
49. An observable read inside useEffect does not subscribe
50. useMemo that reads an observable and leaves it out of the dependency list
51. Assigning to an observable during render
52. Stage 3 decorators and the accessor keyword
53. enforceActions: observed, always, and never
54. computedRequiresReaction, reactionRequiresObservable, and observableRequiresReaction
55. getDependencyTree and getObserverTree

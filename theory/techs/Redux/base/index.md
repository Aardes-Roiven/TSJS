# Base: Redux

1. One store holds the state tree
2. An action is a plain object whose type is a string
3. A reducer returns the next state for one action
4. State changes only when an action is dispatched
5. configureStore
6. The key in the reducer map is the field in the root state
7. createSlice
8. initialState is the slice state before any action
9. A case reducer either writes the draft or returns the next state
10. A field the case reducer did not touch keeps its reference
11. An action creator from the slice puts the argument in payload
12. The generated type is the slice name, a slash, and the reducer name
13. A slice name that differs from its key in the reducer map
14. Dispatch the result of the action creator, not the creator itself
15. getState
16. dispatch
17. subscribe runs after the root reducer returns
18. A slice that does not handle the action keeps its previous state
19. Provider
20. useDispatch
21. useSelector
22. useSelector skips the render when the selected value passes ===
23. A selector that allocates a new object or array on every run
24. useDispatch and useSelector throw when no Provider is above the component
25. Actions and state hold plain values
26. A reducer does not call fetch, dispatch, or Date.now

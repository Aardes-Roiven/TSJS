# Advanced: Redux

1. createAsyncThunk
2. pending, fulfilled, and rejected
3. extraReducers
4. addCase
5. addAsyncThunk on the builder
6. dispatch and getState inside the payload creator
7. extraArgument
8. rejectWithValue, and error on a rejection that did not use it
9. unwrap
10. condition
11. The signal aborts the in-flight request when the thunk is cancelled
12. A dispatched function runs as a thunk
13. createAction
14. createSelector recomputes when an input reference changes
15. An input selector that returns a new object or array
16. Selectors declared on the slice
17. getSelectors when the slice is not mounted under its name
18. shallowEqual
19. createEntityAdapter
20. setAll, addOne, upsertOne, updateOne, and removeOne
21. sortComparer
22. getSelectors reads the adapter state from its place in the root state
23. An item stored in two slices changes only in the slice that handled the action
24. createApi
25. fetchBaseQuery
26. The api reducer and the api middleware are both required
27. A query hook runs the request when the component mounts
28. A mutation hook runs the request when its trigger is called
29. isLoading is true only while the first request has no data; isFetching is true on every request
30. skip
31. providesTags and invalidatesTags
32. Invalidating a tag id does not refresh a query that provided only the tag type
33. refetch
34. transformResponse
35. fetchBaseQuery error has status and data; a thrown error is serialized separately
36. useLazyQuery
37. pollingInterval keeps refetching while the query is subscribed
38. useInfiniteQuery collects pages, and getNextPageParam ends the list by returning undefined
39. selectFromResult limits the fields that rerender the component
40. queryFn replaces fetchBaseQuery for one endpoint
41. updateQueryData returns a patch, and undo reverts that patch
42. getDefaultMiddleware
43. concat and prepend
44. The serializable check rejects a function, a class, a symbol, or a promise in an action or in state
45. The immutable check reports a mutation outside a case reducer
46. prepare sets payload and meta before the action is dispatched
47. startListening runs an effect when an action matches
48. addMatcher
49. match
50. preloadedState is the state before the first render
51. Returning the slice initial state replaces that slice
52. One action handled by two slices
53. useStore reads the store without subscribing the component
54. DevTools shows the action and the state after it

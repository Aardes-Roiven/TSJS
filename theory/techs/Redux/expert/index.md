# Expert: Redux

1. The first reducer call may receive preloadedState, and every later call receives what that reducer returned
2. combineReducers warns on an unknown preloaded key and throws when a reducer returns undefined
3. A returned undefined inside a case reducer means the draft is the result
4. current returns a plain snapshot of the draft, and original returns undefined for a value created in this reducer
5. A nested object copied out of the draft is not the draft
6. The immutable check freezes and tracks state only in development
7. Immer auto-freezes the value a case reducer returns, including in production
8. Arrays and plain objects are drafted; Map and Set require enableMapSet, and a class instance is never a draft
9. Middleware runs on the way in, then the reducer, then the way out
10. next continues the chain; dispatch restarts at the first middleware
11. In development the immutable check runs before thunk and the serializable check runs after it
12. The action-creator check warns in development when a creator is dispatched without being called
13. An array returned from the middleware callback replaces the defaults
14. An enhancers callback that omits getDefaultEnhancers drops the middleware enhancer
15. dispatch throws when the value is not a plain object or when type is not a string
16. type and match on an action creator; toString still returns the type string
17. subscribe is told nothing about the action, only that state may have changed
18. A subscribe callback that dispatches re-enters before the outer dispatch returns
19. autoBatchEnhancer notifies subscribers once for a burst of low-priority actions
20. createStore still creates a store; configureStore is the setup that adds the defaults
21. combineSlices.inject adds a slice reducer without replacing the store
22. createDynamicMiddleware adds middleware after startup
23. The object map form of extraReducers and createReducer no longer exists
24. weakMapMemoize keys its cache by argument reference and does not take a custom equality function
25. lruMemoize with the default cache size remembers one argument list
26. A selector created once on the slice shares one cache across every component
27. createSelector warns in development when an input selector returns a new reference for the same arguments
28. stabilityCheck runs a selector twice in development and warns when the results are not equal
29. identityFunctionCheck warns when the selector returns the root state
30. updateOne ignores a missing id; upsertOne inserts it
31. A selectId that changes for the same item stores it under two ids
32. A fulfilled action from an older requestId still reduces unless the reducer compares the id
33. condition skips the payload creator; dispatchConditionRejection also dispatches rejected
34. meta.aborted, meta.rejectedWithValue, and meta.condition mark three different rejections
35. isRejected matches every rejection; isRejectedWithValue matches only rejectWithValue
36. A thunk declared with the slice reducers callback still emits pending, fulfilled, and rejected
37. The cache key is the serialized query argument, and serializeQueryArgs replaces that serialization
38. The last unsubscribe starts keepUnusedDataFor, and the entry is removed when it ends
39. invalidationBehavior delayed coalesces tag invalidations
40. A query that provides no tags is not refetched by invalidation
41. A patch from updateQueryData and a refetch started by invalidation are separate writes
42. fixedCacheKey keeps one mutation result for every caller that passes it
43. refetchOnFocus does nothing until setupListeners is called
44. prefetch adds no subscription
45. initiate records the cache entry and drops it when the request settles if nothing subscribed
46. prepare runs while the action is created, so a replayed action keeps the original payload
47. A value listed in ignoredPaths is invisible to the serializable check and to time travel
48. useSelector compares selected values with ===; connect shallow-compares the fields returned from mapState
49. Hooks built for a custom context do not see the default Provider
50. Two copies of react-redux put the Provider and the hooks on different contexts
51. The server keeps a separate store per request; the browser keeps one
52. A listener effect starts after its action has reduced, and cancelActiveListeners aborts the previous effect

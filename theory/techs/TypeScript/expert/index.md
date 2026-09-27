# Expert: TypeScript

1. Assignability among any, unknown, never, and the empty object type
2. object, Object, and the empty object type
3. A void return compared with a return of undefined
4. Where excess property checks apply and where they stop
5. Weak types whose members are all optional
6. Contextual typing
7. What an annotation, as, as const, and satisfies each keep
8. strictFunctionTypes and contravariant callback parameters
9. Bivariant methods and covariant arrays
10. Variance annotations in and out
11. A shorter parameter list assigned to a longer one
12. Order of inference from a call, a constraint, and a default
13. Distributive conditional types and a type parameter wrapped in a tuple
14. infer in a covariant position and in a contravariant position
15. any inside a conditional type takes both branches
16. Homomorphic mapped types and modifier remapping
17. A remapped key of never dropped from the result
18. A mapped Readonly that stops at a function
19. Instantiation depth and a recursive conditional type
20. Reduction of unions and intersections
21. Subtype reduction inside a union
22. Interface extends reports a conflict where an intersection becomes never
23. Call-signature intersections read as overloads
24. The implementation signature of an overload is hidden
25. A constraint that is not the inferred type argument
26. Narrowing that an alias or a closure invalidates
27. A type predicate the checker does not verify
28. A discriminant that does not narrow
29. A definite assignment assertion the checker trusts
30. private, protected, and #private as nominal holes in structural typing
31. unique symbol
32. Numeric enum reverse mapping and assignability to number
33. A heterogeneous enum and a computed member
34. const enum erasure, isolatedModules, and preserveConstEnums
35. Declaration merging of interfaces
36. Merging a class, a function, and a namespace
37. Module augmentation and a member that conflicts
38. A file treated as a script when it has no import or export
39. Template literal patterns
40. Uppercase, Lowercase, Capitalize, and Uncapitalize
41. A circular type alias and an interface cycle
42. polymorphic this
43. ThisType and this inside an object literal
44. A named property checked against an index signature
45. Optional elements in the middle of a tuple and the length the checker tracks
46. A missing property and a property whose value is undefined
47. An assertion that is legal because the types overlap
48. Exceptions are not part of a function type
49. A type parameter cannot stand for another type constructor
50. paths rewritten for types and left unchanged in the emit
51. package.json exports and the types condition
52. customConditions and a condition the resolver never tries
53. moduleResolution bundler compared with nodenext
54. resolution-mode on an import
55. typeRoots and automatic inclusion of @types
56. typesVersions
57. Project references and an output the checker did not rebuild
58. useDefineForClassFields and the emit of instance fields
59. Parameter properties in the emit
60. The this parameter is erased in the emit
61. A type-only import erased from the emit
62. experimentalDecorators, emitDecoratorMetadata, and standard decorators
63. using lowered to a helper
64. Downlevel emit, importHelpers, and tslib
65. Syntax isolatedModules rejects
66. isolatedDeclarations and a type the emitter will not infer
67. How JSX looks up an intrinsic and a value-based element
68. skipLibCheck hiding a break in dependency types
69. @ts-expect-error, @ts-ignore, and a suppression that matches nothing

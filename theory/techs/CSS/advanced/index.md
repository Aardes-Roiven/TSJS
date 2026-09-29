# Advanced: CSS

1. Cascade layers beat specificity, an unlayered rule beats a layer, and !important reverses layer order
2. Custom properties inherit, and var() uses its fallback when the property is missing
3. var() substitutes a whole token
4. inherit, initial, unset, and revert
5. :is, :where, and :not: a forgiving list and specificity
6. An attribute selector has the specificity of a class
7. :nth-child, :nth-of-type, :first-child, and :empty
8. The adjacent sibling combinator and the general sibling combinator
9. :has()
10. :focus-visible and :focus-within
11. ::before, ::after, and content
12. ::placeholder, ::marker, and ::selection
13. Native nesting and the & selector
14. @scope
15. :host, ::part, and selectors that do not enter a shadow tree
16. A presentation attribute loses to an author declaration
17. The main axis and the cross axis swap in a column flex container
18. The flex shorthand, flex-basis: auto, and flex-basis: 0
19. The automatic minimum size of a flex item
20. align-self, and margin: auto on a flex or grid item
21. order
22. align-content has no effect on a single-line flex container
23. Margins between flex and grid items do not collapse
24. grid-template-columns, grid-template-rows, and grid-template-areas
25. fr, minmax, and auto
26. 1fr does not shrink below min-content
27. auto-fill keeps empty tracks, and auto-fit drops them
28. grid-column, grid-row, and span
29. Auto-placement and dense packing
30. Implicit grid tracks
31. justify-items, align-items, justify-content, and align-content on a grid
32. subgrid
33. position: sticky and the nearest scrollport
34. opacity below 1, transform, and filter each trap descendant z-index
35. A float is contained only by a block formatting context
36. Multi-column layout
37. Baseline alignment and the gap under an inline image
38. A newline between inline-blocks becomes a space
39. display: table, table-cell, and border-collapse
40. object-fit and object-position
41. aspect-ratio
42. Multiple backgrounds, background-origin, and background-clip
43. linear-gradient, radial-gradient, and conic-gradient
44. The body background paints the canvas when the html background is transparent
45. box-shadow and text-shadow
46. color-mix, oklch, light-dark, and relative colors
47. clip-path and mask
48. filter and backdrop-filter
49. mix-blend-mode and isolation
50. A transition interpolates one property toward the new value
51. @keyframes, animation, and animation-fill-mode
52. transform and transform-origin leave the box in flow
53. @starting-style and transition-behavior: allow-discrete
54. A same-document view transition
55. calc, min, max, and clamp
56. svh, lvh, dvh, and ch
57. width, hover, pointer, prefers-color-scheme, and prefers-reduced-motion
58. Container size queries, query units, and a container that does not match itself
59. Container style queries
60. Logical properties follow the writing mode
61. @font-face and font-display
62. overflow-wrap, word-break, hyphens, and text-overflow
63. line-clamp
64. currentColor
65. scroll-snap-type and scroll-snap-align
66. scroll-margin, scroll-padding, and scroll-behavior
67. overscroll-behavior
68. A visible overflow computes to auto if the other axis is not visible
69. pointer-events and user-select
70. :checked, :disabled, :required, :invalid, and :placeholder-shown
71. appearance
72. accent-color and color-scheme
73. forced-colors
74. Print styles and break-inside
75. counter-reset and counter-increment
76. @import is ignored after a style rule
77. content-visibility and contain-intrinsic-size
78. position-anchor and anchor()
79. gap does not collapse

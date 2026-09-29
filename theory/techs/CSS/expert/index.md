# Expert: CSS

1. Specified, computed, used, and actual values
2. Inheritance copies the computed value
3. An em in font-size resolves against the parent's computed font-size
4. Cascade sort: origin and importance, context, the style attribute, layers, specificity, scope proximity, then order
5. Transitions outrank author !important, and animations sit between author normal and author !important
6. The before-change style comes from @starting-style
7. For normal declarations the outer shadow wins, and for important declarations the inner shadow wins
8. Scope proximity is used only when specificity is equal
9. unset, revert, and revert-layer roll back to different places
10. all does not reset custom properties
11. A registered custom property uses its initial value when the syntax fails; an unregistered one invalidates the declaration
12. A custom property interpolates only if it is registered
13. A cycle in custom properties becomes the guaranteed-invalid value
14. Nested rules keep each parent selector's specificity
15. Restrictions on properties set from :visited
16. transform, filter, perspective, contain, and will-change become the containing block
17. z-index: auto does not create a stacking context, and z-index: 0 does
18. Paint order inside a stacking context
19. z-index on a flex or grid item creates a stacking context
20. The top layer and ::backdrop
21. overflow: clip does not scroll, and overflow: hidden does
22. border-radius clips descendant ink
23. Which margins adjoin, and clearance that prevents the collapse
24. The inline formatting context: the strut and the line box
25. White-space processing and soft wrap opportunities
26. Definite and indefinite sizes
27. min-content, max-content, and fit-content
28. The intrinsic contribution of a replaced element
29. Float, absolute, and fixed blockify the computed display
30. Flex base size, hypothetical main size, and freezing
31. Free space distributed by fr after base sizes and gaps
32. A percentage cycle between a grid item and its tracks
33. A subgrid does not size its own tracks
34. Anonymous table boxes and table-layout: fixed
35. Font matching, weight, stretch, and unicode-range
36. Properties allowed on :first-line and :first-letter
37. Highlight inheritance and ::selection
38. Properties that apply to a marker box
39. counter-reset creates a scope on the same element
40. Fragmentation, monoliths, orphans, and widows
41. @page and its margin boxes
42. A CSS pixel is not a device pixel
43. zoom changes the CSS pixel, and transform: scale does not
44. Device-pixel rounding of borders and offsets
45. getComputedStyle returns the used value of a length
46. ::slotted and extra specificity after ::part
47. contain: size, layout, paint, and style
48. Size containment and a container query that would depend on descendants
49. position-try when the anchor cannot be placed
50. Scroll and view timelines, and timeline-scope
51. The view-transition pseudo-element tree
52. order changes box order only, and reading-flow changes sequential navigation
53. direction and unicode-bidi beside the HTML dir attribute

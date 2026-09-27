# Expert: HTTP

1. How a cache computes freshness lifetime
2. Heuristic freshness
3. Revalidation and a 304 with no body
4. Weak and strong ETags
5. Order of If-Match, If-None-Match, If-Modified-Since, and If-Unmodified-Since
6. If-Range
7. Authorization responses in a shared cache
8. What no-cache requires the cache to do
9. Vary and the stored variant
10. Cache invalidation by an unsafe method
11. Request cache directives against response cache directives
12. Content-Length, chunked, and close as framing
13. Both Content-Length and Transfer-Encoding on one message
14. Request smuggling on an HTTP/2 to HTTP/1.1 downgrade
15. Chunk-size parsing and chunk extensions
16. Header fields forbidden in a trailer
17. Obsolete line folding and CRLF in a field value
18. Request-target parsing that differs between hops
19. :authority disagreeing with Host
20. No reason phrase and no Transfer-Encoding on HTTP/2 and HTTP/3
21. Connection-specific fields on HTTP/2 and HTTP/3
22. HPACK static table and dynamic table
23. CONTINUATION and an oversized header block
24. HTTP/2 flow-control windows
25. Rapid reset
26. GOAWAY and streams still in flight
27. ALPN, prior knowledge, and h2c
28. TCP head-of-line blocking under HTTP/2
29. HTTP/3 streams on QUIC
30. QPACK and a blocked stream
31. 0-RTT and 425 Too Early
32. Alt-Svc
33. Coalescing connections that share a certificate
34. 421 Misdirected Request
35. Server push deprecated in HTTP/2 and omitted from HTTP/3
36. Extensible priorities
37. q-values in proactive content negotiation
38. 300 Multiple Choices
39. multipart/byteranges
40. Validators and content coding
41. Last-Modified sent with one-second precision
42. Apparent age
43. stale-if-error
44. Cache poisoning through a header that is not part of the key
45. Origin-form, absolute-form, authority-form, and asterisk-form
46. What is forwarded inside a CONNECT tunnel
47. Max-Forwards
48. 1xx responses dropped by an intermediary
49. A server that does not answer Expect: 100-continue
50. 301 and 302 followed as GET
51. A retried POST that ran twice
52. GET and DELETE bodies removed by an intermediary
53. Structured Field Values
54. Via and changes made by an intermediary
55. HTTP message signatures
56. Origin compared by scheme, host, and port
57. Host-only cookies, Domain, and the public suffix list
58. Strict-Transport-Security and the request that precedes it
59. Decoding the request target twice
60. HTTP/1.1 pipelining
61. SETTINGS and the settings acknowledgment
62. filename and filename* in Content-Disposition
63. Non-ASCII bytes in a header field value

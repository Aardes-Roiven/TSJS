# Expert: WebSocket

1. Masking of every client frame
2. A new masking key on each frame
3. FIN, opcode, mask bit, and payload length
4. The 7-bit, 16-bit, and 64-bit length forms
5. A non-minimal payload length
6. Continuation frames of one data message
7. No second data message until the current one ends
8. Control frames between fragments of a data message
9. Control frames unfragmented and at most 125 bytes
10. Text, binary, close, ping, and pong opcodes
11. UTF-8 validation and close code 1007
12. The close frame body
13. A reason longer than 123 bytes
14. 1005, 1006, and 1015 never on the wire
15. Protocol close codes and application close codes
16. The close handshake and a peer that stays silent
17. Data after a close frame has been sent
18. A half-closed TCP connection
19. Sec-WebSocket-Key and Sec-WebSocket-Accept
20. Sec-WebSocket-Version 13
21. A rejected handshake left as an ordinary HTTP response
22. Upgrade as a hop-by-hop header
23. An intermediary that does not complete the handshake
24. RSV bits and the extension that was negotiated
25. permessage-deflate context takeover
26. A secret compressed together with attacker-controlled bytes
27. Message boundaries versus TCP packets
28. Head-of-line blocking on one connection
29. Bytes held until the final fragment
30. bufferedAmount and the kernel send buffer
31. A peer TCP window of zero
32. A connection that occupies a file descriptor for its whole life
33. An idle timeout that drops the TCP connection
34. Ping that fails and a close frame that never comes
35. Dropping a connection that never drains
36. A load balancer without support for Upgrade
37. A socket pinned to the process that accepted it
38. The Node.js cluster and a long-lived connection
39. Cross-site hijacking through the handshake cookie
40. Origin does not authenticate the caller
41. Cleartext on the hop behind TLS termination
42. WebSocket over HTTP/2 extended CONNECT
43. WebSocket over HTTP/3
44. MessageEvent, a raw buffer, and ping events
45. The HTTP upgrade listener consumed once
46. Two parsers disagreeing on where the handshake ends
47. A client frame that is not masked
48. A server frame that is masked
49. A fragmented control frame
50. An extension or subprotocol the peer did not accept
51. WebSocketStream and backpressure on send
52. Nagle coalescing small messages
53. Sockets retained after a missed close
54. skipUTF8Validation
55. What is still HTTP after status 101

# Expert: Node.js

1. Event loop phases and which queue runs next
2. The nextTick queue and microtask checkpoints between phases
3. Starvation from recursive nextTick or a busy poll
4. The libuv threadpool and UV_THREADPOOL_SIZE
5. dns.lookup on the threadpool versus dns.resolve
6. Threadpool filesystem work versus a call that blocks the isolate
7. highWaterMark counted in bytes or in objects
8. Flowing mode, paused mode, and a missed data event
9. Errors dropped by pipe and forwarded by pipeline
10. ERR_STREAM_PREMATURE_CLOSE
11. Readable and writable sides of a duplex failing independently
12. allowHalfOpen and a half-closed TCP connection
13. A socket stalled because the request body was left unread
14. Content-Length, chunked encoding, and a header the parser rejects
15. A keep-alive socket reused after the peer closed it
16. maxSockets and requests queued inside an agent
17. The fetch dispatcher pool and http.Agent
18. Destroying the request, the response, or the socket
19. HTTP/2 flow-control windows and stream errors versus session errors
20. How the cluster primary distributes a connection
21. Structured clone and transfer lists in postMessage
22. SharedArrayBuffer and Atomics between workers
23. An uncaught exception inside a worker
24. worker.terminate and a finally block that does not run
25. Parent and child blocked on full stdio pipes
26. Shell metacharacters when exec runs a command string
27. Detached children, process groups, and signals that stop at the parent
28. Exit codes and a fatal signal reported as 128 plus the signal number
29. beforeExit, the exit event, and process.exit
30. Identity in require.cache and in the ESM module map
31. The dual package hazard
32. An export condition the active loader does not select
33. ERR_REQUIRE_ESM and the default interop for a CommonJS module
34. A CommonJS cycle exporting unfinished values and an ESM cycle with live bindings
35. Module format of a file outside any package.json type
36. resolve and load hooks in module customization
37. TypeScript syntax that type stripping refuses
38. allocUnsafe, the buffer pool, and uninitialized bytes
39. A multibyte sequence split across chunks
40. rss, heapUsed, external, and arrayBuffers
41. Retained memory from a socket, a closure, or a buffer
42. A vm context is not a sandbox
43. What the permission model does not prevent
44. AsyncLocalStorage lost across an event or a non-promise thenable
45. The async resource async_hooks follows
46. Continuing after uncaughtException
47. autoSelectFamily when one address family fails
48. TIME_WAIT and ephemeral port exhaustion
49. EMFILE and ENFILE
50. rename on the same filesystem and EXDEV across devices
51. A torn file after a crash in writeFile
52. The wx flag and exclusive create
53. fsync of a file and of its directory
54. The V8 heap limit and resident set size
55. N-API and NODE_MODULE_VERSION
56. Files and state a single executable does not include
57. Objects a startup snapshot does not restore
58. Sending a handle to another process
59. Serialization on the fork IPC channel
60. Which CA certificates TLS verification uses
61. A TLS handshake error and an HTTP error
62. Certificate selection with SNI
63. server.close and idle keep-alive connections
64. fs.watch notifications the operating system may skip or repeat
65. url.parse and the WHATWG URL parser
66. Event loop utilization while synchronous work runs
67. Synchronous node:sqlite blocking the isolate
68. An operation started after its AbortSignal has already aborted
69. Two physical copies of one package in the tree
70. A compile cache entry rejected on another Node version or architecture
71. Diagnostic report files on fatal errors
72. Peak memory if a stream is concatenated into one buffer

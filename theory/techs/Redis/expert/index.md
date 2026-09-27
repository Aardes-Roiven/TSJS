# Expert: Redis

1. Command execution stays on the main thread while I/O threads read and write
2. A blocking command parks one client and the event loop continues
3. Fork copy-on-write during BGSAVE and BGREWRITEAOF
4. Transparent huge pages and a slow fork
5. Incremental rehashing of the main dictionary
6. embstr and raw string encodings
7. Listpack and quicklist, and the threshold that converts them
8. An intset that becomes a hashtable
9. A sorted set stored as a listpack or as a skiplist plus a hashtable
10. used_memory, used_memory_rss, and mem_fragmentation_ratio
11. Active defragmentation
12. Resident memory that stays allocated after keys are deleted
13. lazyfree-lazy-eviction, lazyfree-lazy-expire, and lazyfree-lazy-user-del
14. What maxmemory counts
15. Approximate LRU and the sample size
16. The LFU counter, its logarithmic increment, and decay
17. Eviction removes keys one at a time while the server stays over maxmemory
18. replica-ignore-maxmemory and a replica that evicts a key on its own
19. The active expire cycle and its effort limit
20. A replica deletes an expired key only when the primary propagates the delete
21. A backward clock step and a TTL
22. Startup loads the AOF when appendonly is on, and the RDB otherwise
23. A multi-part AOF base file and an incremental file
24. A truncated AOF and a startup that stops
25. appendfsync always finishes the fsync before the reply
26. The replication ID and the replication offset
27. A backlog that is too small turns a partial resync into a full resync
28. Diskless replication
29. replica-serve-stale-data while the replica is disconnected
30. A writable replica that accepts writes and then diverges
31. WAIT counts replicas that received the write; WAITAOF counts replicas that fsynced it
32. Sentinel epoch, quorum, and the majority required to elect a leader
33. A partition that leaves two nodes accepting writes
34. TILT mode
35. A client that continues to use the address from before failover
36. CRC16 of the hash tag and 16384 slots
37. MOVED and ASK
38. A slot in MIGRATING and IMPORTING state
39. The cluster bus port and cluster-node-timeout
40. Replica election inside a cluster
41. Keys a script must name so a cluster node can check the slot
42. Cluster Pub/Sub is delivered on every node; sharded Pub/Sub stays on the slot's node
43. An acknowledged cluster write is not linearizable
44. Commands queued by MULTI are not applied until EXEC
45. EXEC aborts on a queueing error and does not roll back a runtime error
46. WATCH is a dirty flag checked at EXEC, not a lock and not a compare of the value
47. Effects of a script are what the replica runs
48. A non-deterministic call inside a script
49. SCRIPT KILL cannot stop a script that has already written
50. A function is stored in the dataset; an EVAL script is not
51. RESP3 maps, sets, doubles, bools, and push replies
52. A client that never reads a push reply and fills the output buffer
53. client-output-buffer-limit on normal, replica, and pubsub clients
54. A bulk-string length that desynchronizes the connection
55. CLIENT TRACKING in default mode and in BCAST mode
56. An invalidation that arrives after the client has cached a newer value
57. ACL selectors for keys, commands, and channels
58. An ACL written before a command category grew new commands
59. One hot key serialized on the main thread
60. The latency of a single O(N) command on a large value
61. SLOWLOG duration excludes time spent waiting in the event loop
62. A keyspace notification runs inside the publishing command and can be missed by a subscriber
63. Stream entries live in a radix tree of macro nodes, so XDEL may not return that memory
64. The last-delivered ID and the pending entries list are different cursors
65. XAUTOCLAIM delivers the same entry to a second consumer
66. A consumer group does not provide exactly-once processing
67. A JSON value is a binary tree, and a path update does not rewrite the whole document
68. A JSONPath that matches more than one value
69. The search index is updated as part of the write
70. A hash or JSON field that does not match the search schema
71. Query dialect, stopwords, and a text match that returns nothing
72. Index memory separate from the document memory
73. Bloom filter capacity, error rate, and a positive that cannot be confirmed
74. A Cuckoo filter that fails an insert when it is full
75. Count-min sketch reports a count that is too high
76. t-digest error is larger at the tails
77. VSIM recall is approximate HNSW search
78. A vector set and a vector field on a search index
79. A time series duplicate policy and an out-of-order timestamp
80. A compaction rule and a bucket that has not closed
81. ARLEN is one past the highest index; ARCOUNT is the number of stored elements
82. ARRING overwrites by modulo and drops the previous value at that index
83. GEOADD stores a geohash score in a sorted set
84. A bitmap is a string, and an offset past the current length grows it
85. HyperLogLog representation switches from sparse to dense
86. The maximum size of one string value
87. SELECT is refused in cluster mode
88. SELECT applies to every later command on that connection
89. A hash tag with no braces, or braces that cover only part of the key
90. Atomic multi-key commands exist only for keys in the same slot
91. A pipeline response that contains a MOVED among ordinary replies
92. proto-max-bulk-len and the client query buffer limit
93. CLIENT PAUSE during failover
94. A full sync replaces the replica dataset
95. A restarted primary has a new replication ID
96. replica-priority and a replica Sentinel will not promote
97. READONLY stays on the connection until READWRITE
98. Memory of the dictionary entry and the expiry dominates a small string
99. INFO commandstats and a slow command identified by its own duration
100. Latency monitor events for fork, command, and aof-fsync
101. Ziplist encodings removed in favor of listpack
102. A hash-field TTL and the key TTL are independent clocks
103. Redis 8 ACL categories cover JSON, time series, probabilistic, and vector commands
104. A module command that runs on the main thread and a module command that blocks one client

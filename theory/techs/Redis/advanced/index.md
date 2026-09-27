# Advanced: Redis

1. GETDEL, GETEX, and SET with GET and KEEPTTL
2. APPEND, STRLEN, GETRANGE, and SETRANGE
3. INCRBYFLOAT
4. RENAME, RENAMENX, and COPY
5. SCAN, MATCH, COUNT, and the cursor
6. KEYS on a large keyspace
7. UNLINK
8. A key that remains after its TTL until it is accessed
9. SET replaces the key and clears the previous TTL
10. EXPIRE on a key that does not exist
11. BLPOP, BRPOP, and the timeout
12. LMOVE and BLMOVE
13. LTRIM
14. LINSERT and LPOS
15. HINCRBY and HINCRBYFLOAT
16. HMGET and a multi-field HSET
17. HSCAN and HRANDFIELD
18. HEXPIRE and a TTL on one hash field
19. SINTER, SUNION, SDIFF, and the STORE variants
20. SPOP, SRANDMEMBER, and SMOVE
21. SSCAN and SMISMEMBER
22. ZRANGE by score and by lexicographical order
23. ZINCRBY and ZCOUNT
24. ZREMRANGEBYSCORE and ZREMRANGEBYRANK
25. ZPOPMIN, ZPOPMAX, and BZPOPMIN
26. ZUNION and ZINTER with WEIGHTS and AGGREGATE
27. A sorted-set score stored as a double
28. A cache key filled on a miss and expired with a TTL
29. A counter with INCR and a TTL
30. A lock with SET NX and EX
31. Releasing a lock only when the stored token matches
32. A sliding-window limit stored in a sorted set
33. SETBIT, GETBIT, BITCOUNT, and BITOP
34. BITFIELD overflow SAT, WRAP, and FAIL
35. GEOADD, GEODIST, and GEOSEARCH
36. PFADD, PFCOUNT, and PFMERGE
37. ARSET, ARGET, ARLEN, and ARCOUNT
38. ARINSERT, ARSEEK, and ARRING
39. JSON.SET, JSON.GET, and JSONPath
40. JSON.NUMINCRBY, JSON.ARRAPPEND, and JSON.DEL
41. XADD, stream entry IDs, XRANGE, and XLEN
42. XTRIM and MAXLEN
43. XREAD BLOCK
44. XGROUP, XREADGROUP, and XACK
45. XPENDING, XCLAIM, and XAUTOCLAIM
46. PUBLISH, SUBSCRIBE, and PSUBSCRIBE
47. A Pub/Sub message is dropped when nobody is subscribed
48. SSUBSCRIBE and sharded Pub/Sub
49. Ordinary commands are rejected on a subscribed connection
50. MULTI, EXEC, and DISCARD
51. EXEC does not roll back a command that fails at runtime
52. WATCH and an EXEC that returns nil
53. A pipeline of commands and one round trip of replies
54. EVAL, KEYS, ARGV, and EVALSHA
55. FUNCTION LOAD and FCALL
56. BGSAVE and an RDB snapshot
57. appendfsync always, everysec, and no
58. BGREWRITEAOF
59. The second of writes everysec can lose
60. replicaof and replica-read-only
61. A full resynchronization and a partial resynchronization
62. WAIT and a read of a lagging replica
63. min-replicas-to-write and min-replicas-max-lag
64. Sentinel quorum, down-after-milliseconds, and failover
65. The address Sentinel reports for the current primary
66. Hash slots and a hash tag in braces
67. A client that follows MOVED
68. A multi-key command whose keys are in different slots
69. READONLY on a cluster replica
70. maxmemory and the eviction policies
71. A write that returns an out-of-memory error under noeviction
72. Eviction of a key and deletion of an expired key
73. MEMORY USAGE, INFO memory, and redis-cli --bigkeys
74. ACL SETUSER with command categories and key patterns
75. The default user and a password that replaces requirepass
76. CONFIG GET and CONFIG SET
77. SLOWLOG and LATENCY LATEST
78. MONITOR
79. CLIENT LIST, CLIENT SETNAME, and maxclients
80. notify-keyspace-events
81. FT.CREATE on HASH and on JSON
82. FT.SEARCH
83. FT.AGGREGATE
84. A text, tag, numeric, and geo schema field
85. TS.ADD, TS.RANGE, and RETENTION
86. TS.MRANGE, labels, and a compaction rule
87. BF.ADD, BF.EXISTS, and a false positive
88. CF.ADD and CF.DEL
89. CMS.INCRBY and an approximate frequency
90. TOPK.ADD and TOPK.LIST
91. TDIGEST.ADD and TDIGEST.QUANTILE
92. VADD and VSIM
93. A filter on a vector similarity query
94. OBJECT ENCODING
95. DUMP and RESTORE
96. A blocked client does not stop commands from other connections

# Expert: PostgreSQL

1. xmin, xmax, and ctid on a heap tuple
2. Hint bits written by a reader
3. A new snapshot for each statement under read committed
4. EvalPlanQual and a row another transaction has changed
5. Row locks stored on the tuple
6. AccessShareLock held until commit by a plain SELECT
7. A stronger lock waiting behind a weaker lock
8. MultiXact ids from shared row locks
9. Savepoints and EXCEPTION as subtransactions
10. Many subtransactions and the overflow of the subxid cache
11. An open snapshot and the xmin horizon
12. Freezing and a shutdown that prevents transaction-id wraparound
13. An anti-wraparound autovacuum that is not canceled to take a lock
14. Dead line pointers and a VACUUM that does not return the file to the operating system
15. VACUUM FULL rewrites the relation and takes AccessExclusiveLock
16. A HOT update that leaves indexes unchanged
17. fillfactor and free space left for HOT
18. The visibility map and an index-only scan that still reads the heap
19. When a TOAST value is fetched
20. TOAST strategies and a row that cannot fit in one page
21. WAL records and full-page writes
22. Checkpoints and recovery after a crash
23. synchronous_commit and a reported commit that a crash can lose
24. Data checksums chosen for the cluster
25. Unlogged relations emptied in crash recovery
26. Temporary tables and the absence of WAL
27. A prepared transaction that survives a crash and holds xmin
28. Planner cost as a unit rather than a duration
29. Most common values, a histogram, and the null fraction
30. Independent columns and extended statistics
31. A nested loop scaled by the wrong row count
32. work_mem charged per node and per worker
33. Hash aggregate and group aggregate
34. Parallel plans and a function that is not parallel safe
35. JIT on a query where compilation dominates
36. A generic plan kept on a reused connection
37. Plan invalidation after DDL and after ANALYZE
38. effective_cache_size does not allocate memory
39. shared_buffers and the operating-system page cache
40. The checkpointer, the background writer, and a dirty page written by a backend
41. Inlining of a function written in SQL
42. The default row estimate of a set-returning function
43. A function declared IMMUTABLE whose result changes for the same arguments
44. An index expression that is not IMMUTABLE
45. CTE inlining and MATERIALIZED
46. Partition pruning while planning and while executing
47. A unique constraint on a partitioned table must include the partition key
48. ATTACH PARTITION and the validation scan
49. A foreign key that references a partitioned table
50. An operator class and a clause that cannot use the index
51. A lossy bitmap scan and the recheck
52. The GIN pending list and fastupdate
53. A BRIN summary and a row inserted out of physical order
54. Phases of CREATE INDEX CONCURRENTLY and an index left invalid
55. An ALTER TABLE that only changes the catalog and one that rewrites the heap
56. A collation version change and an index that no longer matches equality
57. NaN greater than every number and equal to NaN
58. NULLS NOT DISTINCT
59. Uniqueness checked on each row, and DEFERRABLE INITIALLY IMMEDIATE
60. A deferrable constraint cannot arbitrate ON CONFLICT
61. An exclusion constraint cannot arbitrate ON CONFLICT DO UPDATE
62. MERGE and two transactions inserting the same key
63. The key-share lock a foreign key takes on the referenced row
64. Deferred foreign-key checks at COMMIT
65. A BEFORE row trigger that returns NULL and skips the row
66. Triggers of the same kind fired in name order
67. A rule that rewrites the query and a trigger that runs per row
68. session_replication_role and triggers that do not fire on apply
69. An event trigger and DDL that rolls back
70. A leaky function and a row-level security policy
71. A security-barrier view and a condition pushed into it
72. The table owner, FORCE ROW LEVEL SECURITY, and BYPASSRLS
73. The search_path used inside a SECURITY DEFINER call and after it returns
74. LEAKPROOF
75. WITH CHECK OPTION LOCAL and CASCADED
76. timestamptz stored as an instant and AT TIME ZONE yielding timestamp without time zone
77. timestamp without time zone displayed in the session TimeZone
78. Serializable snapshot isolation and a read-write dependency
79. Predicate locks taken by a sequential scan
80. A read only deferrable serializable transaction
81. FOR UPDATE on the nullable side of an outer join
82. Advisory-lock key format and a session lock that outlives the transaction
83. NOTIFY delivered at commit
84. ctid after the row is updated
85. Index correlation and a bitmap scan of a poorly clustered table
86. wal_level minimal, replica, and logical
87. A replication slot that retains WAL
88. A hot-standby query canceled by VACUUM cleanup
89. hot_standby_feedback holding back VACUUM on the primary
90. synchronous_standby_names and a commit waiting on a standby that is gone
91. A new timeline after promotion
92. recovery_target_time, recovery_target_lsn, and recovery_target_inclusive
93. Physical replication ships WAL and logical replication ships row changes
94. DDL that a publication does not send
95. A sequence on the subscriber that row replication does not advance
96. Replica identity and an update the subscriber cannot find
97. Publication options for insert, update, delete, and truncate
98. publish_via_partition_root
99. publish_generated_columns
100. copy_data and rows committed during the initial table sync
101. An apply error that stops the subscription
102. The origin of a replicated change and a loop between two publishers
103. A logical slot that exists only on the primary and is missing after promotion
104. A pg_dump snapshot and DDL committed after the dump starts
105. Large objects stored in pg_largeobject
106. Session settings left on a backend that the next client reuses
107. Which setting wins: file, ALTER SYSTEM, database, role, and a backend that already started
108. Two sessions inserting overlapping values under an exclusion constraint

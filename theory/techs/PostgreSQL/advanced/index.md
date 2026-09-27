# Advanced: PostgreSQL

1. Scalar subqueries
2. EXISTS and a subquery in IN
3. Correlated subqueries
4. NOT IN and a NULL from the subquery
5. A condition in ON versus a condition in WHERE on a LEFT JOIN
6. RIGHT JOIN and FULL OUTER JOIN
7. UNION, UNION ALL, INTERSECT, and EXCEPT
8. DISTINCT ON
9. WITH
10. WITH RECURSIVE
11. Data-modifying statements in WITH
12. LATERAL
13. UPDATE FROM and DELETE USING
14. Window functions
15. Window frames
16. FILTER on an aggregate
17. GROUPING SETS, ROLLUP, and CUBE
18. INSERT ON CONFLICT
19. MERGE
20. TRUNCATE
21. SAVEPOINT and ROLLBACK TO SAVEPOINT
22. Read committed, repeatable read, and serializable
23. SELECT FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, and FOR KEY SHARE
24. SKIP LOCKED and NOWAIT
25. Deadlocks
26. An open transaction and the locks it still holds
27. EXPLAIN and EXPLAIN ANALYZE
28. Sequential scan, index scan, index-only scan, and bitmap scan
29. Nested loop, hash join, and merge join
30. ANALYZE and statistics left behind by a bulk load
31. B-tree indexes
32. Multicolumn B-tree indexes
33. Unique indexes
34. Partial indexes
35. Expression indexes
36. INCLUDE columns
37. A predicate the index cannot serve
38. CREATE INDEX CONCURRENTLY
39. Hash indexes and the searches they do not do
40. GIN indexes
41. GiST indexes
42. BRIN indexes
43. Keyset pagination
44. Views
45. Updatable views
46. WITH CHECK OPTION
47. Materialized views and REFRESH MATERIALIZED VIEW
48. Functions written in SQL
49. PL/pgSQL functions
50. IMMUTABLE, STABLE, and VOLATILE
51. Procedures and CALL
52. A CHECK that cannot look at other rows
53. BEFORE and AFTER row triggers
54. NEW, OLD, and the trigger function
55. Statement-level triggers and transition tables
56. jsonb operators and containment
57. json and jsonb
58. Arrays and unnest
59. Enum types
60. Range types and multiranges
61. Exclusion constraints
62. uuid and gen_random_uuid
63. Stored generated columns
64. A serial column and the sequence it owns
65. GENERATED ALWAYS, OVERRIDING SYSTEM VALUE, and gaps
66. DEFERRABLE constraints and SET CONSTRAINTS
67. AT TIME ZONE and TimeZone
68. interval arithmetic
69. Database, column, and expression collations
70. Qualified names and search_path
71. Privileges on a schema, a sequence, and a function
72. ALTER DEFAULT PRIVILEGES for the role that will create the object
73. Granting one role to another
74. Row-level security
75. SECURITY DEFINER and SET search_path
76. pg_hba.conf
77. COPY and \copy
78. Prepared statements
79. Parameters on a session, a database, and the cluster
80. Reload and restart
81. pg_stat_activity and pg_locks
82. pg_stat_statements
83. log_min_duration_statement
84. Dead tuples and VACUUM
85. Autovacuum
86. ALTER TABLE locks and a session that blocks them
87. max_connections and superuser_reserved_connections
88. statement_timeout, lock_timeout, and idle_in_transaction_session_timeout
89. Declarative partitioning
90. Partition pruning
91. An extension installed in one database
92. pg_catalog and information_schema
93. pg_dump and pg_restore
94. pg_basebackup
95. A streaming replica and hot standby
96. Publications and subscriptions
97. LISTEN and NOTIFY
98. Unlogged tables
99. tsvector and tsquery
100. Advisory locks

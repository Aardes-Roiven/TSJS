# Base: Redis

1. Redis as a server of in-memory data structures
2. redis-server, redis-cli, host, and port 6379
3. PING and a live connection
4. A command, its arguments, and the reply
5. Nil for a missing key and an empty string for a stored value
6. Binary-safe keys and values
7. One type per key and the TYPE command
8. SET, GET, and overwrite
9. DEL and EXISTS
10. SET NX and SET XX
11. A TTL with EX, PX, EXPIRE, TTL, and PERSIST
12. INCR, DECR, and INCRBY
13. MGET and MSET
14. LPUSH, RPUSH, LPOP, RPOP, and LRANGE
15. LLEN and LINDEX
16. HSET, HGET, HDEL, HEXISTS, HLEN, and HGETALL
17. SADD, SREM, SISMEMBER, SCARD, and SMEMBERS
18. ZADD, ZRANGE, ZREVRANGE, ZSCORE, ZRANK, and ZREM
19. WRONGTYPE
20. One command finishes before the next command starts
21. The dataset lives in RAM
22. A restart drops keys when persistence is disabled
23. SELECT and logical databases
24. FLUSHDB and FLUSHALL
25. AUTH
26. Key names grouped by a colon prefix
27. An error reply does not close the connection

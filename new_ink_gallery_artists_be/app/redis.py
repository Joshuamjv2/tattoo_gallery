import redis.asyncio as aioredis

REDIS_HOST = "redis-14365.c246.us-east-1-4.ec2.cloud.redislabs.com"
REDIS_PORT = 14365
REDIS_PASSWORD = "HtluV4rFGaHZdLobbRa4NPAEfoqNDMij"

token_blocklist = aioredis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD
)


async def add_jti_to_blocklist(jti: str) -> None:
    await token_blocklist.set(
        name=jti,
        value="",
        ex=3600
    )


async def token_in_blocklist(jti: str) -> bool:
    jti = await token_blocklist.get(jti)
    return jti is not None

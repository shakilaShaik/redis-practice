import { createClient } from "redis";
const redisClinet = createClient()
redisClinet.on('error', () => {
    console.log('Redis client Error', error)
}
)
await redisClinet.connect()
export default redisClinet;
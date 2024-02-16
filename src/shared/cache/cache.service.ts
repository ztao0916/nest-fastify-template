/*
 * @Author: ztao
 * @Date: 2024-02-16 09:27:33
 * @LastEditTime: 2024-02-16 09:51:09
 * @Description: redis缓存服务
 */
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  //定义redis客户端,属性前面加上private，表示这个属性只能在类的内部访问，外部不能访问
  private readonly redis: Redis;
  constructor(private readonly configService: ConfigService) {
    console.log('redis连接中', this.configService);
    //创建redis链接,这里的配置可以写在环境变量中
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'), // Redis 服务器的主机名
      port: this.configService.get('REDIS_PORT'), // Redis 服务器的端口
      username: this.configService.get('REDIS_USER'), // needs Redis >= 6
      password: this.configService.get('REDIS_PASSWORD'), // Redis 服务器的密码
      db: this.configService.get('REDIS_DB'), // 使用的数据库索引
    });
    console.log('redis连接成功');
  }

  /**
   * @description: 设置缓存
   * @param {string} key 缓存key
   * @param {string} value 缓存value
   * @param {number} seconds 缓存时间-秒
   * @return {*} 返回值
   */
  async set(key: string, value: string, seconds?: number) {
    if (!seconds) {
      return await this.redis.set(key, value);
    } else {
      const result = await this.redis.set(key, value, 'EX', seconds);
      return result;
    }
  }

  /**
   * @description: 获取缓存
   * @param {string} key 缓存key
   * @return {*} 返回值
   */
  get(key: string) {
    return this.redis.get(key);
  }

  /**
   * @description: 删除缓存
   * @param {string} key 缓存key
   * @return {*} 返回值
   */
  del(key: string) {
    return this.redis.del(key);
  }

  //清除所有缓存
  flushAll() {
    return this.redis.flushall();
  }
}

/*
 * @Author: ztao
 * @Date: 2024-02-08 12:41:08
 * @LastEditTime: 2024-02-08 12:47:39
 * @Description:
 */
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // winston.format.simple(), //生成简单的日志输出,返回格式 = info : 信息 {"timestamp":"2024-01-23 17:23:20"}
  winston.format.prettyPrint(), //生成格式化的,易于阅读的日志输出,返回格式 = { level: 'info', message: '信息', timestamp: '2024-01-23 17:24:14' },这个更方便查看
);

//开发环境只需要控制台输出,生产环境需要控制台和文件同时输出
//对每个日志级别创建一个日志记录器
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.prettyPrint(),
    ),
  }), //控制台输出
  new DailyRotateFile({
    dirname: 'logs/info', //日志文件夹
    filename: '%DATE%.info.log', //基于日期模式滚动日志文件名
    datePattern: 'YYYY-MM-DD', //每天创建一个新的日志文件
    zippedArchive: true, //是否压缩,是
    maxSize: '10m', //单个文件最大10M
    maxFiles: '7d', // 保存7天
    level: 'info',
  }),
  new DailyRotateFile({
    dirname: 'logs/error', //日志文件夹
    filename: '%DATE%.error.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '7d',
    level: 'error',
  }),
  //如果需要,为其他日志级别添加类似的传输,比如warn,debug
];

const logger = winston.createLogger({
  format: logFormat,
  transports,
});

@Injectable()
export class LoggerService {
  info(message: string) {
    logger.info('info', message);
  }

  error(message: string) {
    logger.error(message);
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }
}

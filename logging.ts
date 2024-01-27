import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  // defaultMeta: { service: 'discord-bot' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

if (process.env.BUN_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.align(),
      winston.format.printf(info => `[${info.level}]${info.message}`),
    )
  }));
}

export default logger;



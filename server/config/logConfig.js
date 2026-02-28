var logDir = "Book-Collection-Server-Logs";
import winston from "winston";
const { createLogger, format, transports } = winston;
import "winston-daily-rotate-file";
const env = process.env.NODE_ENV || "development";

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%.log`,
  datePattern: "DD-MM-YYYY"
});

// Handle errors from the file transport (required for winston-daily-rotate-file v5+)
dailyRotateFileTransport.on('error', error => {
  console.error('Error in log file rotation:', error);
});

export const logger = createLogger({
  // change level if in dev environment versus production
  level: env === "development" ? "verbose" : "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
});

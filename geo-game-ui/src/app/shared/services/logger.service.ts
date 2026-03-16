import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  error(...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }

  warn(...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }

  info(...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.info(...args);
  }

  debug(...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}

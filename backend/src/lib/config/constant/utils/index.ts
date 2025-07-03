import { generateTime } from '../../../utils';

/**
 * Utility for accessing time units in milliseconds
 */
export const TIME_IN = {
  /** Time in `minutes` expressed in `milliseconds` (1 to 59) */
  minutes: generateTime(59, 60 * 1000), // 1 minute = 60,000 ms
  /** Time in `hours` expressed in `milliseconds` (1 to 24) */
  hours: generateTime(24, 60 * 60 * 1000), // 1 hour = 3,600,000 ms
  /** Time in `days` expressed in `milliseconds` (1 to 7) */
  days: generateTime(7, 24 * 60 * 60 * 1000), // 1 day = 86,400,000 ms
};

export const MESSAGE = 'message';

export const ROLES = 'roles';

export const NOTIFICATIONS = 'notifications';

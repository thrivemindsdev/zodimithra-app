export function getMillisecondsUntilTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now);

  tomorrow.setHours(24, 0, 0, 0);

  return tomorrow.getTime() - now.getTime();
}
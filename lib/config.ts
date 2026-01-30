// august 8, 2004 at 1:37:20 AM CET
export const BIRTH_TIMESTAMP_UTC = Date.UTC(2004, 7, 8, 0, 37, 20);

export const LOCATION = "Dresden, Germany";

export function calculateAge() {
  const now = Date.now();
  const diff = now - BIRTH_TIMESTAMP_UTC;

  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const msPerDay = 1000 * 60 * 60 * 24;

  const years = Math.floor(diff / msPerYear);
  const remainingAfterYears = diff - years * msPerYear;
  const days = Math.floor(remainingAfterYears / msPerDay);
  const remainingAfterDays = remainingAfterYears - days * msPerDay;
  const seconds = Math.floor(remainingAfterDays / 1000);

  return { years, days, seconds };
}

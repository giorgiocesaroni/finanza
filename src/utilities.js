export function monthDay(userDate) {
  const date = new Date(userDate);
  const formatted = `${date.getMonth() + 1}/${date.getDate()}`;
  return formatted;
}

export default function monthDay(userDate) {
  const date = new Date(userDate);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
 
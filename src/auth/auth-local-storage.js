export function getAuthFromLocalStorage() {
  const authObjectJson = localStorage.getItem("auth");
  if (!authObjectJson) return null;
  return JSON.parse(authObjectJson);
}

export function setAuthToLocalStorage(authObject) {
  const authObjectJson = JSON.stringify(authObject);
  return localStorage.setItem("auth", authObjectJson);
}

export function removeAuthFromLocalStorage() {
  return localStorage.removeItem("auth");
}
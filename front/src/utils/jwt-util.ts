export function jwtUtil() {
    const auth = sessionStorage.getItem("auth");
    const payload = auth?.split(".")[1];
    const claims = atob(payload || "");
    const parsedId = JSON.parse(claims);

    return parsedId.id;
}

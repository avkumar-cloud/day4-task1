export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // ✅ Access token still valid
  if (res.status !== 401) {
    return res;
  }

  // 🔁 Access token expired → try refresh
  const refreshRes = await fetch("/api/auth/refresh", {
    method: "POST",
  });

  if (!refreshRes.ok) {
    // Refresh failed → logout
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await refreshRes.json();
  localStorage.setItem("accessToken", data.accessToken);

  // 🔁 Retry original request with new token
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${data.accessToken}`,
    },
  });
}

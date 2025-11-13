const BASE = process.env.BASE_URL || "http://localhost:4000";

// 1) Obtener el token (simulando login)
const getToken = async () => {
  const resp = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Puedes enviar email/userId reales si lo deseas
    body: JSON.stringify({ email: "user@example.com", userId: "123" })
  });
  if (!resp.ok) throw new Error(`Login fallo: ${resp.status}`);
  const json = await resp.json();
  return json.access_token;
};

// 2) Usar el token para consumir /secure/data
const callSecure = async (token) => {
  const resp = await fetch(`${BASE}/secure/data`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await resp.json();
  console.log("Respuesta segura:", data);
};

(async () => {
  try {
    const token = await getToken();
    await callSecure(token);
  } catch (e) {
    console.error(e);
  }
})();

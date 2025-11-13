import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ⚠️ Guarda tu clave en .env (JWT_SECRET="super-secreto-largo-y-unico")
const JWT_SECRET = process.env.JWT_SECRET || "cambia-esto-en-produccion";
const JWT_EXPIRES_IN = "15m"; // ajusta el tiempo de vida del token

// Middleware para verificar el token en Authorization: Bearer <token>
function auth(req, res, next) {
  const authHeader = req.header("Authorization") || "";
  const [, token] = authHeader.split(" ");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload firmado (ej: { sub, email, roles, ... })
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// Endpoint de login: emite un JWT (simulado, sin contraseña real)
app.post("/login", (req, res) => {
  const { email = "user@example.com", userId = "123" } = req.body || {};
  // Payload mínimo recomendado: sub (subject) = userId
  const payload = { sub: userId, email, roles: ["reader"] };

  const token = jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES_IN,
    issuer: "demo-api",
    audience: "demo-client",
  });

  res.json({ access_token: token, token_type: "Bearer", expires_in: JWT_EXPIRES_IN });
});

// Endpoint protegido: requiere Authorization: Bearer <token>
app.get("/secure/data", auth, (req, res) => {
  res.json({
    message: "Acceso concedido",
    user: req.user, // lo que venía en el JWT
    data: { secreto: "bandera_ctf_o_datos_confidenciales_de_ejemplo" },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});

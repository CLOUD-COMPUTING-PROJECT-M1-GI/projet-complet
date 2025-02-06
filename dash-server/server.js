import express from 'express';
import path from 'path';
import mime from "mime";
import cors from 'cors';

import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Activer CORS pour toutes les routes
app.use(cors());

// Middleware pour définir le type MIME
app.use((req, res, next) => {
  const type = mime.getType(req.path);
  if (type) res.type(type);
  next();
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques (vidéos, manifest, etc.)
app.use(express.static(path.join(__dirname, "LocalFiles/videos")));

// Route principale
app.get("/", (req, res) => {
  res.send(`
    <video controls autoplay>
      <source src="/manifest.mpd" type="application/dash+xml">
      Votre navigateur ne supporte pas le streaming DASH.
    </video>
  `);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

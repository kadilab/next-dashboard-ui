import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import formidable from "formidable";
import { Readable } from "stream";

// Configurer l'API pour désactiver le body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Convertir une requête `Request` en flux lisible pour Node.js
async function requestToStream(req: Request): Promise<Readable> {
  const reader = req.body?.getReader();
  if (!reader) {
    throw new Error("Request body is missing or not readable.");
  }

  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
}

// Gestion de la méthode HTTP POST
export async function POST(req: Request) {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Créer le dossier public/uploads si nécessaire
    await fs.mkdir(uploadDir, { recursive: true });

    // Convertir `Request` en un flux compatible Node.js
    const nodeStream = await requestToStream(req);

    // Configurer formidable pour gérer le fichier
    const form = formidable({
      uploadDir,
      keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
      form.parse(nodeStream, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing files:", err);
          return resolve(
            NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
          );
        }

        const file = files.profileImage;
        const filePath = path.join(uploadDir, file.originalFilename);

        // Vérifiez si un fichier avec le même nom existe déjà
        const fileExists = await fs
          .access(filePath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          return resolve(
            NextResponse.json({ fileName: file.originalFilename }, { status: 200 })
          );
        }

        // Renommer le fichier pour le déplacer dans le dossier d'uploads
        await fs.rename(file.filepath, filePath);

        return resolve(
          NextResponse.json({ fileName: file.originalFilename }, { status: 200 })
        );
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

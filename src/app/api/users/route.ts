import { NextRequest, NextResponse } from "next/server";
// import { createConnection } from "@/lib/db";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
        host: "localhost", // Adresse de votre serveur MySQL
        user: "root", // Nom d'utilisateur MySQL
        password: "quick", // Mot de passe MySQL
        database: "root", // Nom de la base de données
      });
    // const [rows] = await connection.query("SELECT * FROM `users`");
    // await connection.end();

    // return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Error in GET /api/users:", error.message);
    return NextResponse.json({ success: true, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const connection = await createConnection();
    await connection.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    await connection.end();

    return NextResponse.json({ success: true, message: "User added successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/users:", error.message);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

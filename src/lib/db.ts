import mysql from "mysql2/promise";

export const createConnection = async () => {
  return mysql.createConnection({
    host: "localhost", // Adresse de votre serveur MySQL
    user: "root", // Nom d'utilisateur MySQL
    password: "quick", // Mot de passe MySQL
    database: "", // Nom de la base de données
  });
};

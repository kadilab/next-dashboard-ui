import mysql from "mysql2/promise";

export const createConnection = async () => {
  return mysql.createConnection({
    host: "192.168.61.22", // Adresse de votre serveur MySQL
    user: "root", // Nom d'utilisateur MySQL
    password: "", // Mot de passe MySQL
    database: "quick", // Nom de la base de données
  });
}; 

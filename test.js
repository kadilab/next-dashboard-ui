const fetch = require("node-fetch"); // Assurez-vous d'avoir installé node-fetch
const fs = require("fs");
const path = require("path");

async function fetchDeviceRouteReport(deviceId, from, to) {
    const baseUrl = "http://195.200.15.231:8082/api/reports/route"; // Remplacez par l'URL de votre serveur
    const params = new URLSearchParams({
        deviceId: deviceId,
        from: from,
        to: to
    });

    try {
        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + Buffer.from("kadilabrdc@gmail.com:1936Cl@rk").toString("base64"), // Remplacez vos identifiants
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("Rapport des positions (JSON) :", data);
                return data;
            } else if (contentType && contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                const buffer = await response.buffer();
                const filePath = path.join(__dirname, "route_report.xlsx");
                fs.writeFileSync(filePath, buffer);
                console.log(`Fichier téléchargé : ${filePath}`);
                return null; // Pas de données JSON
            } else {
                console.error("Type de contenu non supporté :", contentType);
            }
        } else {
            console.error("Erreur lors de la requête :", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

// Exemple d'utilisation
const deviceId = 1; // ID de l'appareil
const from = "2024-11-19T00:00:00Z"; // Date de début
const to = "2024-11-19T23:59:59Z"; // Date de fin

fetchDeviceRouteReport(deviceId, from, to);

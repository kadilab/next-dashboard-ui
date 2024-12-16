"use client";

import React, { useState, useEffect } from "react";

const OrderForm = () => {
  const [tarifs, setTarifs] = useState({});
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [id_user, setIdUser] = useState(null);

  const [order, setOrder] = useState({
    user_id: null,
    car_type: "",
    service_type: "",
    hours: 1,
    price: 0,
    fuel_included: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tariffResponse, userResponse] = await Promise.all([
          fetch("http://localhost/api/api.php/records/tariffs"),
          fetch("http://localhost/api/api.php/records/users"),
        ]);

        if (!tariffResponse.ok || !userResponse.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const tariffs = await tariffResponse.json();
        const users = await userResponse.json();

        const formattedTariffs = {};
        tariffs.records.forEach((item: { car_type: string | number; location: any; aeroport: any; katebi: any; lubumbashi: any; kamoa_kcc: any; fuel: any; wansela: any; }) => {
          formattedTariffs[item.car_type] = {
            location: item.location,
            "Aeroport - Inside Kolwezi": item.aeroport,
            Katebi: item.katebi,
            Lubumbashi: item.lubumbashi,
            "Kamoa - KCC": { cost: item.kamoa_kcc, fuel: item.fuel },
            Wansela: { cost: item.wansela, fuel: item.fuel },
          };
        });

        setTarifs(formattedTariffs);
        setUsers(users.records || []);
        setFilteredUsers(users.records || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: { target: { value: string; }; }) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => {
        const name = user.firstname ? user.firstname.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        return name.includes(query) || email.includes(query);
      })
    );
  };

  const handleUserSelect = (user: never) => {
    setIdUser(user.id_user);
    setSearchQuery(`${user.firstname.toUpperCase()} ${user.lastname.toUpperCase()}`);
    setFilteredUsers([]);
  };

  const handleCarChange = (e: { target: { value: any; }; }) => {
    const selectedCar = e.target.value;
    setOrder((prev) => ({
      ...prev,
      car_type: selectedCar,
      service_type: "",
      price: 0,
      fuel_included: false,
    }));
  };

  const handleServiceChange = (e: { target: { value: any; }; }) => {
    const selectedService = e.target.value;
    const selectedTarif = tarifs[order.car_type][selectedService];

    if (typeof selectedTarif === "object") {
      setOrder((prev) => ({
        ...prev,
        service_type: selectedService,
        fuel_included: selectedTarif.fuel || false,
        price: selectedTarif.cost,
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        service_type: selectedService,
        fuel_included: false,
        price: selectedTarif,
      }));
    }
  };

  const handleHoursChange = (e: { target: { value: string; }; }) => {
    const hours = parseInt(e.target.value, 10);
    setOrder((prev) => ({
      ...prev,
      hours,
      price: prev.service_type === "location" ? tarifs[prev.car_type].location * hours : prev.price,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const payload = {
      user_id: id_user,
      car_type: order.car_type,
      service_type: order.service_type,
      hours: order.service_type === "location" ? order.hours : null,
      price: order.price,
      fuel_included: order.fuel_included,
      status: "pending",
    };

    try {
      const response = await fetch("http://localhost/api/api.php/records/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande.");
      }

      setSuccess("Commande créée avec succès !");
      setOrder({
        user_id: null,
        car_type: "",
        service_type: "",
        hours: 1,
        price: 0,
        fuel_included: false,
      });
      setSearchQuery("");
      setIdUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="w-full mx-auto bg-white rounded-lg shadow-md">
        <div className=" p-6 rounded-t-lg mb-6">
          <h2 className="text-3xl font-bold text-[#06113c]">Réservez maintenant</h2>
        </div>
        <div className="p-6">
          {success && <div className="mb-4 text-green-600">{success}</div>}
          {error && <div className="mb-4 text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Recherche et suggestions */}
            <div>
              <label htmlFor="customer" className="block text-gray-700 font-medium mb-2">
                Customer
              </label>
              <input
                type="text"
                name="customer"
                id="customer"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Rechercher un utilisateur..."
              />
              {searchQuery && filteredUsers.length > 0 && (
                <ul className="border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto mt-2">
                  {filteredUsers.map((user) => (
                    <li
                      key={user.id_user}
                      onClick={() => handleUserSelect(user)}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {user.firstname.toUpperCase()} {user.lastname.toUpperCase()} - {user.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Choisir une voiture */}
            <div>
              <label htmlFor="car" className="block text-gray-700 font-medium mb-2">
                Choisir une voiture
              </label>
              <select
                id="car"
                name="car"
                value={order.car_type}
                onChange={handleCarChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Sélectionnez une voiture</option>
                {Object.keys(tarifs).map((car) => (
                  <option key={car} value={car}>
                    {car}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Service */}
            {order.car_type && (
              <div>
                <label htmlFor="service" className="block text-gray-700 font-medium mb-2">
                  Choisir un service
                </label>
                <select
                  id="service"
                  name="service"
                  value={order.service_type}
                  onChange={handleServiceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Sélectionnez un service</option>
                  {Object.keys(tarifs[order.car_type]).map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nombre d'heures pour "location" */}
            {order.service_type === "location" && (
              <div>
                <label htmlFor="hours" className="block text-gray-700 font-medium mb-2">
                  Nombre d'heures
                </label>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  value={order.hours}
                  onChange={handleHoursChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            )}

            {/* Prix Total */}
            {order.price > 0 && (
              <div className="text-lg font-semibold text-gray-800">
                Prix Total : ${order.price}{" "}
                {order.fuel_included && <span className="text-sm text-gray-600">+ Carburant</span>}
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={!order.car_type || !order.service_type || !id_user}
                className="px-6 py-2 w-full bg-[#06113c] text-white rounded-md hover:bg-[#182454] focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;

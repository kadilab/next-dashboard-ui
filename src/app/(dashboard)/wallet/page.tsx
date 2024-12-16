"use client";

import React, { useEffect, useState } from "react";
import { FaWallet, FaFilter, FaCalendarAlt, FaUser } from "react-icons/fa";

function Wallet() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [drivers, setDrivers] = useState([]); // Liste des drivers
  const [totals, setTotals] = useState({});
  const [filter, setFilter] = useState({
    day: "",
    month: "",
    year: "",
    driver: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ORDERS_URL = "http://localhost/api/api.php/records/orders";
  const API_USERS_URL = "http://localhost/api/api.php/records/users";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les commandes
        const ordersResponse = await fetch(API_ORDERS_URL);
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.records || []);
        setFilteredOrders(ordersData.records || []);

        // Récupérer les chauffeurs (drivers)
        const usersResponse = await fetch(API_USERS_URL);
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await usersResponse.json();
        const driversList = usersData.records.filter((user) => user.user_role === "driver");
        setDrivers(driversList);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, orders]);

  const applyFilters = () => {
    let filtered = orders.filter((order) => order.status === "confirmed"); // Filtrer par statut "confirmed"

    // Filtrer par jour
    if (filter.day) {
      const selectedDate = new Date(filter.day).toISOString().split("T")[0];
      filtered = filtered.filter(
        (order) => new Date(order.created_at).toISOString().split("T")[0] === selectedDate
      );
    }

    // Filtrer par mois
    if (filter.month) {
      const selectedMonth = new Date(filter.month).getMonth();
      filtered = filtered.filter(
        (order) => new Date(order.created_at).getMonth() === selectedMonth
      );
    }

    // Filtrer par année
    if (filter.year) {
      const selectedYear = parseInt(filter.year, 10);
      filtered = filtered.filter(
        (order) => new Date(order.created_at).getFullYear() === selectedYear
      );
    }

    // Filtrer par chauffeur
    if (filter.driver) {
      filtered = filtered.filter((order) => order.driver && order.driver.toString() === filter.driver);
    }

    setFilteredOrders(filtered);
    calculateTotals(filtered);
  };

  const calculateTotals = (orders) => {
    const paymentTotals = {};

    orders.forEach((order) => {
      const method = order.paiement_method || "Unknown";
      if (!paymentTotals[method]) {
        paymentTotals[method] = 0;
      }
      paymentTotals[method] += parseFloat(order.price || 0);
    });

    setTotals(paymentTotals);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">Wallet Management</h2>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <input
            type="date"
            name="day"
            value={filter.day}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <input
            type="month"
            name="month"
            value={filter.month}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={filter.year}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaUser className="text-blue-500" />
          <select
            name="driver"
            value={filter.driver}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
          >
            <option value="">All Drivers</option>
            {drivers.map((driver) => (
              <option key={driver.id_user} value={driver.id_user}>
                {driver.firstname} {driver.lastname}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setFilter({ day: "", month: "", year: "", driver: "" })}
          className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 focus:ring focus:ring-gray-400"
        >
          Clear Filters
        </button>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Object.keys(totals).map((method) => (
          <div
            key={method}
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800 capitalize">{method}</h3>
              <p className="text-2xl font-bold text-blue-600">${totals[method].toFixed(2)}</p>
            </div>
            <FaWallet className="text-4xl text-blue-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wallet;

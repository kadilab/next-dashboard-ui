"use client";

import Loading from "@/components/Loading";
import React, { useState, useEffect } from "react";

const OrderTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCache, setUserCache] = useState({}); // Stocker les noms des utilisateurs
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      try {
        setLoading(true);

        // Récupérer les commandes
        const ordersResponse = await fetch("http://localhost/api/api.php/records/orders");
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.records || []);

        // Récupérer tous les utilisateurs
        const usersResponse = await fetch("http://localhost/api/api.php/records/users");
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await usersResponse.json();

        // Construire un cache des noms d'utilisateurs
        const userCache = {};
        usersData.records.forEach((user) => {
          userCache[user.id_user] = `${user.firstname} ${user.lastname}`;
        });
        setUserCache(userCache);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrdersAndUsers();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost/api/api.php/records/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Mettre à jour localement
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredOrders.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto m-3 rounded-2xl shadow-sm bg-white min-h-screen">
      <div className="flex bg-[#ffffff] p-3 items-center justify-between pb-4">
        <h2 className="text-2xl font-semibold text-blue-950">Booking History</h2>

        {/* Barre de recherche */}
        <div className="pt-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="p-3">
        {/* Table */}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
            <tr>
              <th className="px-6 py-3 text-left">Order Date</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Driver</th>
              <th className="px-6 py-3 text-left">Car Type</th>
              <th className="px-6 py-3 text-left">Service Type</th>
              <th className="px-6 py-3 text-left">Hours</th>
              <th className="px-6 py-3 text-left">Total Price</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Payment Method</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {currentRecords.length > 0 ? (
              currentRecords.map((order, index) => (
                <tr
                  key={order.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-3">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-6 py-3">{userCache[order.user_id] || "Unknown"}</td>
                  <td className="px-6 py-3">{userCache[order.driver] || "Unknown"}</td>
                  <td className="px-6 py-3">{order.car_type}</td>
                  <td className="px-6 py-3">{order.service_type}</td>
                  <td className="px-6 py-3">{order.hours || "N/A"}</td>
                  <td className="px-6 py-3">${order.price}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xl font-semibold text-blue-800">
                    {order.paiement_method}
                  </td>
                  <td>
                    <button
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      disabled={order.status !== "pending"}
                      className="px-6 py-2 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-3 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;

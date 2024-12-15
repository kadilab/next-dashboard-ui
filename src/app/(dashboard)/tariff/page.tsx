"use client";

import Loading from "@/components/Loading";
import React, { useState, useEffect } from "react";

function Tariff() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null); // Tarif en cours de modification
  const [newTariff, setNewTariff] = useState({
    car_type: "",
    location: "",
    aeroport: "",
    katebi: "",
    lubumbashi: "",
    kamoa_kcc: "",
    wansela: "",
    fuel: false,
  });

  const fetchTariffs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost/api/api.php/records/tariffs");
      if (!response.ok) {
        throw new Error("Failed to fetch tariffs");
      }
      const data = await response.json();
      setTariffs(data.records || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTariff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTariff
      ? `http://localhost/api/api.php/records/tariffs/${editingTariff.id}`
      : "http://localhost/api/api.php/records/tariffs";

    try {
      const response = await fetch(url, {
        method: editingTariff ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTariff),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingTariff ? "update" : "add"} tariff`);
      }

      await fetchTariffs(); // Recharger la liste après ajout ou modification
      setShowModal(false);
      setEditingTariff(null);
      setNewTariff({
        car_type: "",
        location: "",
        aeroport: "",
        katebi: "",
        lubumbashi: "",
        kamoa_kcc: "",
        wansela: "",
        fuel: false,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost/api/api.php/records/tariffs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tariff");
      }

      await fetchTariffs(); // Recharger la liste après suppression
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (tariff: React.SetStateAction<null> | React.SetStateAction<{ car_type: string; location: string; aeroport: string; katebi: string; lubumbashi: string; kamoa_kcc: string; wansela: string; fuel: boolean; }>) => {
    setEditingTariff(tariff);
    setNewTariff({ ...tariff });
    setShowModal(true);
  };

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="w-full mx-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 bg-[#0a2033] text-white rounded-t-lg">
          <h2 className="text-2xl font-semibold">Tariff List</h2>
          <button
            onClick={() => {
              setEditingTariff(null);
              setNewTariff({
                car_type: "",
                location: "",
                aeroport: "",
                katebi: "",
                lubumbashi: "",
                kamoa_kcc: "",
                wansela: "",
                fuel: false,
              });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add New Tariff
          </button>
        </div>

        <div className="p-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Car Type</th>
                <th className="px-6 py-3 text-left">Location ($/hour)</th>
                <th className="px-6 py-3 text-left">Aeroport</th>
                <th className="px-6 py-3 text-left">Katebi</th>
                <th className="px-6 py-3 text-left">Lubumbashi</th>
                <th className="px-6 py-3 text-left">Kamoa-KCC</th>
                <th className="px-6 py-3 text-left">Wansela</th>
                <th className="px-6 py-3 text-left">Fuel</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {tariffs.map((tariff, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="px-6 py-3">{tariff.car_type}</td>
                  <td className="px-6 py-3">${tariff.location}</td>
                  <td className="px-6 py-3">${tariff.aeroport}</td>
                  <td className="px-6 py-3">${tariff.katebi}</td>
                  <td className="px-6 py-3">${tariff.lubumbashi}</td>
                  <td className="px-6 py-3">${tariff.kamoa_kcc}</td>
                  <td className="px-6 py-3">${tariff.wansela}</td>
                  <td className="px-6 py-3">{tariff.fuel ? "Yes" : "No"}</td>
                  <td className="px-6 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(tariff)}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tariff.id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingTariff ? "Edit Tariff" : "Add New Tariff"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Type</label>
                <input
                  type="text"
                  name="car_type"
                  value={newTariff.car_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location ($/hour)</label>
                <input
                  type="number"
                  name="location"
                  value={newTariff.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              {["aeroport", "katebi", "lubumbashi", "kamoa_kcc", "wansela"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={newTariff[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="fuel"
                    checked={newTariff.fuel}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Includes Fuel
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Tariff;

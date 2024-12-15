"use client";

import React, { useState, useEffect } from "react";

const BookingTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingss, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost/api/api.php/records/booking_history");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        console.log(data);
        setBookings(data.records || []); // Adapter au format renvoyé par l'API
        setLoading(false);
      } catch (err) {
        // setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const bookings = [
    { reference: "SRHLYC", date: "6 Dec 2024 16:16", type: "Comfort", status: "NEW", otp: "false", cost: "$33.76", cancellable: true },
    { reference: "WDAKRD", date: "5 Dec 2024 10:25", type: "Economy", status: "CANCELLED", otp: "false", cost: "$395.13", cancellable: false },
    { reference: "STGYTY", date: "5 Dec 2024 10:25", type: "Economy", status: "CANCELLED", otp: "false", cost: "$395.13", cancellable: false },
    { reference: "XCLRHM", date: "4 Dec 2024 11:17", type: "Economy", status: "CANCELLED", otp: "false", cost: "$204.93", cancellable: false },
    { reference: "YYMIJP", date: "3 Dec 2024 14:56", type: "Comfort", status: "CANCELLED", otp: "false", cost: "$135.54", cancellable: false },
  ];
  

  // Filtrer les données en fonction du terme de recherche
  const filteredBookings = bookings.filter((booking) =>
    Object.values(booking).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="overflow-x-auto m-3 p-3 rounded-lg shadow-sm bg-white min-h-screen ">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mb-4  text-gray-800">My Bookings</h2>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>




      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3 text-left">Booking Reference</th>
            <th className="px-6 py-3 text-left">Booking Date</th>
            <th className="px-6 py-3 text-left">Vehicle Type</th>
            <th className="px-6 py-3 text-left">Booking Status</th>
            <th className="px-6 py-3 text-left">OTP</th>
            <th className="px-6 py-3 text-left">Trip Cost</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
              >
                <td className="px-6 py-3">{booking.reference}</td>
                <td className="px-6 py-3">{booking.date}</td>
                <td className="px-6 py-3">{booking.type}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === "NEW"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-3">{booking.otp}</td>
                <td className="px-6 py-3">{booking.cost}</td>
                <td className="px-6 py-3">
                  <button
                    className={`px-4 py-2 text-xs rounded-full font-medium ${booking.cancellable
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    disabled={!booking.cancellable}
                  >
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td  className="text-center w-max py-3 text-gray-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;

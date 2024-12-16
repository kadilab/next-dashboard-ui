"use client";

import { useEffect, useState } from "react";
import DashCard2 from "@/components/Dashcard2";
import Loading from "@/components/Loading";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, ArcElement,LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import GoogleMapWithMarkers from "@/components/GoogleMaps";
import { useTranslation } from "react-i18next";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const AdminPage = () => {
  const [data, setData] = useState({
    driver: 0,
    customer: 0,
    active: 0,
    today: 0,
    month: 0,
    total: 0,
  });
  const [monthlyEarnings, setMonthlyEarnings] = useState({
    confirmed: Array(12).fill(0), // Initialisation des gains confirmés
    canceled: Array(12).fill(0), // Initialisation des gains annulés
    pending: Array(12).fill(0), // Initialisation des gains en attente
  });
  const { t, i18n } = useTranslation();

  const [driversMarkers, setDriversMarkers] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const user_response = await fetch("http://localhost/api/api.php/records/users");
      const booking_response = await fetch("http://localhost/api/api.php/records/booking_history");
      const driversLocationResponse = await fetch("http://localhost/api/api.php/records/driver_location");
      const order_reponse = await fetch("http://localhost/api/api.php/records/orders");

      if (!user_response.ok || !booking_response.ok) {
        throw new Error(`HTTP Error: ${user_response.status}, ${booking_response.status}`);
      }

      const users = await user_response.json();
      const driversLocation = await driversLocationResponse.json();
      const orders = await order_reponse.json();




      const customers = users.records.filter((user: { user_role: string; }) => user.user_role === "customer");
      const drivers = users.records.filter((user: { user_role: string; }) => user.user_role === "driver");
      const actives = users.records.filter(
        (user: { user_role: string; driver_active_status: boolean; }) => user.user_role === "driver" && user.driver_active_status === true
      );

      const today = new Date();
      const todayDate = today.toISOString().split("T")[0];
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // const todayTrips = booking_history.records.filter((booking: { booking_date: string; }) =>
      //   booking.booking_date.startsWith(todayDate)
      // );

      const todaysorders = orders.records.filter(
        (order: { created_at: string; status: string }) =>
          order.created_at.startsWith(todayDate) && order.status === "confirmed" // Filtrer par date et statut "confirmed"
      );

      const monthorders = orders.records.filter(
        (order: { created_at: string | number | Date; status: string }) => {
          const orderDate = new Date(order.created_at);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear &&
            order.status === "confirmed" // Filtrer par statut "confirmed"
          );
        }
      );


      const todayprice = todaysorders.reduce((total: any, trip: { price: any; }) => total + trip.price, 0);
      const monthprice = monthorders.reduce((total: any, trip: { price: any }) => total + trip.price, 0);

      const totalCost = orders.records.reduce(
        (total: number, trip: { price: number; status: string }) =>
          trip.status === "confirmed" ? total + trip.price : total,
        0 // Initialisation du total à 0
      );


      setData({
        driver: drivers.length,
        customer: customers.length,
        active: actives.length,
        today: todayprice,
        month: monthprice,
        total: totalCost,
      });

      const markers = driversLocation.records.map((location: { driver_id: any; latitude: string; longitude: string; status: any; }) => ({
        id: location.driver_id,
        position: {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude),
        },
        status: location.status,
      }));
      setDriversMarkers(markers);

      // Group orders by month and calculate earnings
      // const earningsByMonth = Array(12).fill(0); // Array to hold earnings for each month
      

      // orders.records.forEach((order) => {
      //   const orderDate = new Date(order.created_at);
      //   const monthIndex = orderDate.getMonth(); // 0 = January, 11 = December
      //   earningsByMonth[monthIndex] += order.price; // Sum earnings for the respective month
      // });
      const earningsByMonth = {
        confirmed: Array(12).fill(0), // Gains pour les commandes confirmées
        canceled: Array(12).fill(0), // Gains pour les commandes annulées
        pending: Array(12).fill(0), // Gains pour les commandes en attente
      };

      // Itération sur les commandes pour répartir les gains selon le statut
      orders.records.forEach((order: { created_at: string | number | Date; status: string; price: any; }) => {
        const orderDate = new Date(order.created_at);
        const monthIndex = orderDate.getMonth(); // 0 = January, 11 = December

        if (order.status === "confirmed") {
          earningsByMonth.confirmed[monthIndex] += order.price;
        } else if (order.status === "cancelled") {
          earningsByMonth.canceled[monthIndex] += order.price;
        } else if (order.status === "pending") {
          earningsByMonth.pending[monthIndex] += order.price;
        }
      });

      setMonthlyEarnings(earningsByMonth);


      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Chart data configuration
  const chartData = {
    labels: t("labels.months", { returnObjects: true }),
    datasets: [
      {
        label: "Confirmed($)",
        data: monthlyEarnings.confirmed,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 7,
        pointHoverRadius: 10,

      },
      {
        label: "Canceled ($)",
        data: monthlyEarnings.canceled,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 7,
        pointHoverRadius: 10,

      },
      {
        label: "Pending ($)",
        data: monthlyEarnings.pending,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 7,
        pointHoverRadius: 10,

      }

    ],
  };

  const chartData2 = {
    labels: ["Confirmed", "Canceled", "Pending"], // Légendes
    datasets: [
      {
        label: "Orders Status",
        data: [
          monthlyEarnings.confirmed.reduce((a, b) => a + b, 0), // Total des commandes "Confirmed"
          monthlyEarnings.canceled.reduce((a, b) => a + b, 0), // Total des commandes "Canceled"
          monthlyEarnings.pending.reduce((a, b) => a + b, 0), // Total des commandes "Pending"
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)", // Couleur pour "Confirmed"
          "rgba(255, 99, 132, 0.7)", // Couleur pour "Canceled"
          "rgba(255, 206, 86, 0.7)", // Couleur pour "Pending"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Bordure pour "Confirmed"
          "rgba(255, 99, 132, 1)", // Bordure pour "Canceled"
          "rgba(255, 206, 86, 1)", // Bordure pour "Pending"
        ],
        borderWidth: 1, // Épaisseur des bordures
      },
    ],
  };
  

  const chartOptions2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position de la légende ("top", "left", "right", "bottom")
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: { raw: any; }) => {
            const value = tooltipItem.raw;
            return ` ${value} orders`; // Texte affiché dans l'infobulle
          },
        },
      },
    },
  };
  
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Earnings by Month",
      },
    },
  }

  return (
    <div className="gap-4 flex-col lg:flex-row">
      <div className="w-full mt-5 lg:w-3/3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ps-3 pe-3">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-pink-700 text-white rounded-full p-4">
              <img src="/bank_50px.png" alt="Today" className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Today</h3>
              <p className="text-2xl font-bold text-gray-800">${data.today}</p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-purple-700 text-white rounded-full p-4">
              <img src="/bank_500px.png" alt="Month" className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">This Month</h3>
              <p className="text-2xl font-bold text-gray-800">${data.month}</p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-green-600 text-white rounded-full p-4">
              <img src="/geo.svg" alt="Total" className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Earnings</h3>
              <p className="text-2xl font-bold text-gray-800">${data.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full p-3  gap-2">
        <div className="me-3 card hidden lg:block lg:w-[80%] border bg-white mt-4 rounded-2xl shadow-md">
          <h3 className="font-bold text-black bg-white rounded-t-2xl text-2xl p-3">Drivers Realtime</h3>
          <div>
            <GoogleMapWithMarkers markers={driversMarkers} />
          </div>
        </div>

        <div className="pt-4 lg:w-[20%] w-full flex flex-col items-end justify-between gap-2">
          <DashCard2 type="No. of Customer" bg="bg-pink-700" value={`${data.customer}`} />
          <DashCard2 type="No. of Driver" bg="bg-violet-700" value={`${data.driver}`} />
          <DashCard2 type="Active Driver" bg="bg-green-600" value={`${data.active}`} />
        </div>
      </div>

      <div className="w-full p-3">
        <div className="me-3 card hidden lg:block lg:w-[100%] border bg-white mt-0 rounded-2xl shadow-md">
          <h3 className="font-bold bg-white rounded-t-2xl text-center text-black text-2xl p-4">Earnings Overview</h3>
          <div className="flex justify-between px-32  py-3" style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
            <Doughnut data={chartData2} options={chartOptions2} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

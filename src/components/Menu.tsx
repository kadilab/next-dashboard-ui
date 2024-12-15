"use client"; // Marque ce fichier comme un Client Component

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Remplacement de useRouter par usePathname

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/dashboard.png",
        label: "Dashboard",
        href: "/admin",
      },
      {
        icon: "/ticket_purchase_64px.png",
        label: "Booking history",
        href: "/bookinghistory",
      },
      {
        icon: "/new_ticket_60px.png",
        label: "Add Booking",
        href: "/add_book",
      },
      {
        icon: "/search_in_list_48px.png",
        label: "Tariffs",
        href: "/tariff",
      },
      {
        icon: "/staff_60px.png",
        label: "Users",
        href: "/users",
      },
      {
        icon: "/exit_24px.png",
        label: "Logout",
        href: "/logout",
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname(); // Récupère le chemin actuel

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2 " key={i.title}>
          <span className="hidden ms-3 lg:block text-white text-lg font-medium my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            const isActive = pathname === item.href; // Vérifie si le menu est actif
            return (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center justify-center lg:justify-start gap-4 text-white py-2 w-full p-2 ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-800"
                }`}
              >
                <Image src={item.icon} alt="" width={20} height={40}></Image>
                <span className="hidden lg:block text-lg">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;

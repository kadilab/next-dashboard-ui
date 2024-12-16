import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* right */}
      <div className="w-[14%] z-50 shadow-md  md:w[8%] lg:w-[16%] xl:w-[14%] bg-[#06113c]">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 p-3">
          <Image src="/logo white.png" alt="logo" width={150} height={100}></Image>
        </Link>
        <Menu/>
      </div>
      {/* Left */}
      <div className="w-[86%]  md:w[98%] lg:w-[84%] xl:w-[86%] bg-[#f2f1f1] overflow-scroll">
         <Navbar/>
         <div className="mt-20">{children}</div>
         {/* {children} */}
      </div>
    </div>
  );
}

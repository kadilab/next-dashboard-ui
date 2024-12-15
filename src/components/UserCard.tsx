import Image from "next/image";

interface UserCardProps {
  type: string;
  value: string;
  icon : string;
}

const UserCard = ({ type, value,icon }: UserCardProps) => {
  return (
    <div className="rounded-2xl odd:bg-green-100 shadow-lg even:bg-orange-100 p-4 flex-1  flex gap-4 items-center justify-between min-w-[130px]">
      <div className="flex items-center gap-1">
        <div className="bg-black w-11">
        <Image
          className="p-2 odd:bg-green-700 even:bg-orange-700 rounded-full"
          src={icon}
          alt=""
          width={60}
          height={60}
        />
        </div>
        
        <h2 className="text-green-700 text-sm hidden lg:block font-semibold">{type}</h2>
      </div>
      <h1 className="text-green-700 font-bold text-2xl">{value}</h1>
    </div>
  );
};
export default UserCard;

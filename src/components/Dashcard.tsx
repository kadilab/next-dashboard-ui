import Image from "next/image";

interface UserCardProps {
  type: string;
  value: string;
  icon : string;
  bg : string;
}

const DashCard = ({ type, value,icon ,bg}: UserCardProps) => {
  return (
    <div
  className={`rounded-2xl  shadow-2xl h-28 flex-1 flex  items-center min-w-[150px]`}
  style={{ border: "1px solid #ccc" }}
>
  <div className="w-[30%] ps-5">
  <Image
          className="p-2  rounded-full"
          src={icon}
          alt=""
          width={80}
          height={80}
        />
  </div>
  <div className={` ${bg}  ps-4 pt-5  text-white w-[70%] h-full rounded-2xl shadow-md   flex-row   items-center`}>
    <h1 className="text-lg font-bold">{type}</h1>
    <h2 className="text-lg font-semibold"><span>$</span>0</h2>
  </div>
</div>
  );
};
export default DashCard;

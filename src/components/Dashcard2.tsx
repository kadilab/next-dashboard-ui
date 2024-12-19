import Image from "next/image";

interface UserCardProps {
  type: string;
  value: string;
 
  bg : string;
}

const DashCard2 = ({ type, value ,bg}: UserCardProps) => {
  return (
    <div
  className={`rounded-xl  shadow-2xl max-h-32 flex-1 flex  items-center w-full min-w-[130px]`}
  style={{ border: "1px solid #ccc" }}
>
  <div className={` ${bg}  ps-4 pt-4 pb-4  text-white w-[100%] h-full rounded-xl shadow-md   flex-row   items-center`}>
    <h1 className="text-xl font-bold">{type}</h1>
    <h2 className="text-3xl font-semibold"><span></span>{value}</h2>
  </div>
</div>

  

  );
};
export default DashCard2;

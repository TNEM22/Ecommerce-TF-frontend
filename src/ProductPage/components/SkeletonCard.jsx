import { FaImage } from "react-icons/fa6";

const SkeletonCard = () => {
  return (
    <div className="w-full md:max-h-[350px] border-slate-100 md:border-transparent hover:border-slate-300 border-2 flex md:flex-col hover:shadow-md items-center animate-pulse duration-75 z-0">
      <div className="md:w-full md:h-[170px] p-4 h-full border-b-slate-100 md:border-b-2 border-r-2 md:border-r-0 basis-full flex items-center justify-center">
        <FaImage className="w-full md:w-4/5 h-full object-contain cursor-pointer aspect-square text-gray-500 dark:text-gray-300" />
      </div>
      <div className="flex flex-col w-full h-full p-3 md:p-0">
        <div className="px-2 pt-2 flex flex-col flex-1 h-full w-full cursor-pointer">
          <h3 className="font-bold line-clamp-2 w-full h-4 bg-gray-500 dark:bg-gray-300"></h3>
          <div>
            {/* Stars */}
            <div className="flex items-center my-1 h-4 bg-gray-500 dark:bg-gray-300"></div>
            <div className="flex items-center justify-between h-4 bg-gray-500 dark:bg-gray-300"></div>
          </div>
        </div>
        <button className="text-lg px-4 w-full text-center rounded-full h-10 bg-gray-500 dark:bg-gray-300"></button>
      </div>
    </div>
  );
};

export default SkeletonCard;

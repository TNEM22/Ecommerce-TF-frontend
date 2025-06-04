import { FaImage } from "react-icons/fa6";

const Card = ({ product }) => {
  const imgSrc = product.imageCover;
  const title = product.name;
  const currPrice = product.currPrice;
  const count = product.count;

  return (
    <div className="flex-1 min-w-[200px] min-h-[115px] hover:border-slate-300 border-2 flex hover:shadow-md items-center">
      <div className="h-full border-b-slate-100 border-r-2 basis-full flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title.toLowerCase()}
            title={title}
            className="w-full h-full object-contain cursor-pointer aspect-square"
          />
        ) : (
          <FaImage className="w-full md:w-4/5 h-full object-contain cursor-pointer aspect-square text-gray-500 dark:text-gray-300" />
        )}
      </div>
      <div className="flex flex-col w-full h-full px-2 pt-2">
        <h3 className="font-bold line-clamp-2 w-full">
          {title ? (
            title
          ) : (
            <div className="grid gap-2">
              <span className="w-full h-[10px] bg-gray-300 block animate-pulse z-0"></span>
              <span className="w-full h-[10px] bg-gray-300 block animate-pulse z-0"></span>
            </div>
          )}
        </h3>
        <div className="flex items-center justify-between">
          <span className="" id="price">
            ₹{currPrice}
          </span>
        </div>
        <div>Quantity: {count}</div>
      </div>
    </div>
  );
};

export default Card;

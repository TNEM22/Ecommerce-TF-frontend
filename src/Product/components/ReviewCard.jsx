import React, { useEffect, useState } from "react";

import { FaUserAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoMdStar, IoIosStarOutline } from "react-icons/io";

const ReviewCard = ({ productId }) => {
  // console.log(productId);
  const base_url = import.meta.env.VITE_SERVER_URL;
  const [reviews, setReviews] = useState([]);

  function getReviews() {
    const url = `${base_url}/api/v1/products/${productId}/review`;
    const data = fetch(url);
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        setReviews(dd.data);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    getReviews();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center mb-20">
      <div className="font-bold text-2xl my-4 underline underline-offset-4">
        Reviews
      </div>
      <div className="flex flex-col gap-4 w-4/5 md:w-1/2">
        {reviews.length ? (
          reviews.map(
            ({ _id, subject, desc, createdAt, userId, images, rating }) => (
              <Card
                key={_id}
                username={
                  (userId?.firstname || "Deleted") +
                  " " +
                  (userId?.lastname || "Account")
                }
                subject={subject}
                date={formatDate(createdAt)}
                desc={desc}
                images={images}
                rating={rating}
              />
            )
          )
        ) : (
          <div className="flex w-full justify-center font-bold [text-shadow:_0_4px_4px_rgb(99_102_241_/_0.8)] text-xl">
            No Reviews Yet
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ username, subject, date, desc, images, rating }) => {
  const stars = [];

  for (let i = 0; i < rating; i++) {
    stars.push(<IoMdStar key={i} />);
  }
  for (let i = 5; i > rating; i--) {
    stars.push(<IoIosStarOutline key={i} />);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center p-2">
        <FaUserAlt className="basis-1/5 max-w-[30px] h-auto bg-slate-500 rounded-full p-1 text-white" />
        <div className="flex-1 ml-2 text-sm md:text-base">{username}</div>
      </div>
      {/* Stars and Subject */}
      <div className="flex flex-col md:flex-row">
        <span className="flex text-base px-2 items-center" id="stars">
          {stars.map((e) => e)}
        </span>
        <span className="px-2 mt-1 md:mt-0 font-extrabold text-lg">
          {subject}
        </span>
      </div>
      <div className="px-2 text-sm dark:text-slate-200">Reviewed on {date}</div>
      {/* Description */}
      <div>
        <input type="checkbox" id="read-more" className="peer hidden" />
        <div className="px-2 font-sans line-clamp-3 peer-checked:line-clamp-none">
          {desc}
        </div>
        {(desc.length > 200 && window.innerWidth > 500) ||
        (desc.length > 98 && window.innerWidth < 500) ? (
          <>
            <label
              htmlFor="read-more"
              className="text-blue-500 w-fit cursor-pointer hover:underline mt-2 flex items-center peer-checked:hidden"
            >
              <IoIosArrowDown />
              &nbsp;Show More
            </label>
            <label
              htmlFor="read-more"
              className="text-blue-500 w-fit cursor-pointer hover:underline mt-2 hidden items-center peer-checked:flex"
            >
              <IoIosArrowUp />
              &nbsp;Show Less
            </label>
          </>
        ) : (
          ""
        )}
      </div>
      {/* Review Images */}
      <div className="flex px-2 items-center flex-nowrap overflow-x-auto w-full gap-2 py-2">
        {images.map((imgUrl) => (
          <div
            key={imgUrl}
            className="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] relative bg-white rounded-lg"
          >
            <img
              src={imgUrl}
              alt="reviewImage"
              className="w-[100px] h-[100px] rounded-lg object-contain"
            />
          </div>
        ))}
      </div>
      <div className="px-2 text-sm dark:text-slate-200 mt-3">
        100 people found this helpful
      </div>
      <button className="rounded-3xl border-2 border-slate-400 hover:border-slate-300 active:bg-slate-700 w-fit px-3 py-2 mt-2">
        Helpful
      </button>
    </div>
  );
};

export default ReviewCard;

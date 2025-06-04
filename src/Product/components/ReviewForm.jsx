import { useEffect, useState } from "react";
import { RiStarLine, RiStarFill } from "react-icons/ri";
import { TbCloudUpload } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { changeAuthState } from "../../features/modal/authModalSlice";

const ReviewForm = ({ reviewRef, productId }) => {
  const base_url = import.meta.env.VITE_SERVER_URL;

  const dispatch = useDispatch();

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [star1, setStar1] = useState(<RiStarLine />);
  const [star2, setStar2] = useState(<RiStarLine />);
  const [star3, setStar3] = useState(<RiStarLine />);
  const [star4, setStar4] = useState(<RiStarLine />);
  const [star5, setStar5] = useState(<RiStarLine />);
  const [reviewRating, setReviewRating] = useState(0);

  function handleStarHoverStart(event) {
    let e;
    if (event.target.parentNode.parentNode.tagName == "SPAN") {
      e = event.target.parentNode.parentNode;
    } else if (event.target.parentNode.tagName == "SPAN") {
      e = event.target.parentNode;
    } else if (event.target.tagName == "SPAN") {
      e = event.target;
    }
    if (e) {
      switch (e.id) {
        case "star-1":
          setStar1(<RiStarFill />);
          break;
        case "star-2":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          break;
        case "star-3":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          setStar3(<RiStarFill />);
          break;
        case "star-4":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          setStar3(<RiStarFill />);
          setStar4(<RiStarFill />);
          break;
        case "star-5":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          setStar3(<RiStarFill />);
          setStar4(<RiStarFill />);
          setStar5(<RiStarFill />);
          break;
      }
    }
  }

  function handleStarHoverEnd(event) {
    let e;
    if (event.target.parentNode.parentNode.tagName == "SPAN") {
      e = event.target.parentNode.parentNode;
    } else if (event.target.parentNode.tagName == "SPAN") {
      e = event.target.parentNode;
    } else if (event.target.tagName == "SPAN") {
      e = event.target;
    }
    if (e && reviewRating == 0) {
      switch (e.id) {
        case "star-1":
          setStar1(<RiStarLine />);
          break;
        case "star-2":
          setStar1(<RiStarLine />);
          setStar2(<RiStarLine />);
          break;
        case "star-3":
          setStar1(<RiStarLine />);
          setStar2(<RiStarLine />);
          setStar3(<RiStarLine />);
          break;
        case "star-4":
          setStar1(<RiStarLine />);
          setStar2(<RiStarLine />);
          setStar3(<RiStarLine />);
          setStar4(<RiStarLine />);
          break;
        case "star-5":
          setStar1(<RiStarLine />);
          setStar2(<RiStarLine />);
          setStar3(<RiStarLine />);
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
      }
    } else {
      switch (e.id) {
        case "star-2":
          2 > reviewRating && setStar2(<RiStarLine />);
          break;
        case "star-3":
          3 > reviewRating && setStar3(<RiStarLine />);
          break;
        case "star-4":
          4 > reviewRating && setStar4(<RiStarLine />);
          break;
        case "star-5":
          5 > reviewRating && setStar5(<RiStarLine />);
          break;
      }
    }
  }

  function handleStarMouseLeave(event) {
    if (reviewRating == 0) {
      setStar1(<RiStarLine />);
      setStar2(<RiStarLine />);
      setStar3(<RiStarLine />);
      setStar4(<RiStarLine />);
      setStar5(<RiStarLine />);
    } else {
      switch (reviewRating) {
        case 1:
          setStar2(<RiStarLine />);
          setStar3(<RiStarLine />);
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
        case 2:
          setStar3(<RiStarLine />);
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
        case 3:
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
        case 4:
          setStar5(<RiStarLine />);
          break;
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isUploading) return;
    const token = localStorage.token;
    if (!token) {
      dispatch(changeAuthState("login"));
      return;
    }
    setIsSubmitting(true);
    const title = reviewTitle.trim();
    const desc = reviewDesc.trim();
    if (title && desc) {
      // console.log("Form Submitted!!");
      const url = `${base_url}/api/v1/products/${productId}/review`;
      const images = Object.values(uploadedFiles).map((file) => file.url);

      const data = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          subject: title,
          desc: desc,
          rating: reviewRating === 0 ? 1 : reviewRating,
          images,
        }),
      });
      data
        .then((dd) => dd.json())
        .then((dd) => {
          console.log(dd);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setTimeout(() => {
            setReviewTitle("");
            setReviewDesc("");
            setUploadedFiles({});
            handleStarClear(event);
            setIsSubmitting(false);
          }, 500);
        });
    }
  }

  function handleStarClear(event) {
    setReviewRating(0);
    setStar1(<RiStarLine />);
    setStar2(<RiStarLine />);
    setStar3(<RiStarLine />);
    setStar4(<RiStarLine />);
    setStar5(<RiStarLine />);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (!files) return;
    uploadFiles(files);
  }

  function handleFileInput(event) {
    const files = event.target.files;
    if (!files) return;
    uploadFiles(files);
  }

  async function uploadFiles(files) {
    setIsUploading(true);
    const cloud_name = "dgcedlhpl";
    const uploadPreset = "tfelectronics_frontend";

    const uploadPromises = Object.keys(files).map((file, idx) => {
      const fileId = files[file].name + "-" + Date.now() + idx;
      // const newUploadFiles = { ...uploadedFiles };
      // newUploadFiles[fileId] = {
      //   url: URL.createObjectURL(files[file]),
      //   public_id: Date.now() + idx,
      //   uploading: true,
      // };
      // console.log(newUploadFiles);
      // setUploadedFiles(newUploadFiles);
      setUploadedFiles((prevFiles) => {
        const updatedFiles = {
          ...prevFiles,
          [fileId]: {
            url: URL.createObjectURL(files[file]),
            public_id: String(Date.now()) + idx,
            uploading: true,
          },
        };
        return updatedFiles;
      });

      const data = new FormData();
      data.append("file", files[file]);
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloud_name);

      return fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      )
        .then((dd) => dd.json())
        .then((res) => {
          // console.log(res);
          // console.log(`${fileId} image uploaded.`);
          setUploadedFiles((prevFiles) => {
            const updatedFiles = {
              ...prevFiles,
              [fileId]: {
                url: res.url,
                public_id: res.public_id,
                uploading: false,
              },
            };
            return updatedFiles;
          });
          // Object.keys(uploadedFiles).map((file) => console.log(file));
        })
        .catch((err) => console.log(err));
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  }

  function deleteImage(public_id, fileId) {
    if (isUploading) return;
    // console.log(uploadedFiles);
    setIsUploading(true);
    const newUploadedFiles = { ...uploadedFiles };
    newUploadedFiles[fileId].uploading = true;
    setUploadedFiles(newUploadedFiles);
    const url = `${base_url}/api/v1/products/deleteimage`;
    const data = fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_id,
      }),
    });
    data
      .then((dd) => dd.json())
      .then((res) => {
        // console.log(res);
        const newUploadedFiles = { ...uploadedFiles };
        delete newUploadedFiles[fileId];
        setUploadedFiles(newUploadedFiles);
        setIsUploading(false);
      })
      .catch((err) => console.log(err));
  }

  function handleStarClick(event) {
    let e;
    if (event.target.parentNode.parentNode.tagName == "SPAN") {
      e = event.target.parentNode.parentNode;
    } else if (event.target.parentNode.tagName == "SPAN") {
      e = event.target.parentNode;
    } else if (event.target.tagName == "SPAN") {
      e = event.target;
    }
    if (e) {
      setReviewRating(Number(e.id.split("-")[1]));
      switch (e.id) {
        case "star-1":
          setStar1(<RiStarFill />);
          break;
        case "star-2":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          break;
        case "star-3":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          setStar3(<RiStarFill />);
          break;
        case "star-4":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          setStar3(<RiStarFill />);
          setStar4(<RiStarFill />);
          break;
        case "star-5":
          setStar1(<RiStarFill />);
          setStar2(<RiStarFill />);
          setStar3(<RiStarFill />);
          setStar4(<RiStarFill />);
          setStar5(<RiStarFill />);
          break;
      }
      switch (e.id) {
        case "star-1":
          setStar2(<RiStarLine />);
          setStar3(<RiStarLine />);
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
        case "star-2":
          setStar3(<RiStarLine />);
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
        case "star-3":
          setStar4(<RiStarLine />);
          setStar5(<RiStarLine />);
          break;
        case "star-4":
          setStar5(<RiStarLine />);
          break;
      }
    }
  }

  // useEffect(() => {
  //   console.log(uploadedFiles);
  // }, [uploadedFiles]);

  return (
    <div className="flex flex-col items-center">
      <div className="font-bold text-2xl my-4 underline underline-offset-4">
        Write your review
      </div>
      <form
        ref={reviewRef}
        onSubmit={handleSubmit}
        className={
          !isSubmitting
            ? "flex flex-col sm:w-1/2"
            : "flex flex-col sm:w-1/2 animate-pulse"
        }
      >
        {/* Star Rating */}
        <div className="flex text-3xl md:text-5xl mt-2">
          <div
            className="flex cursor-pointer w-fit text-yellow-500"
            onMouseOverCapture={handleStarHoverStart}
            onMouseOutCapture={handleStarHoverEnd}
            onMouseLeave={handleStarMouseLeave}
            onClick={handleStarClick}
          >
            <span id="star-1">{star1}</span>
            <span id="star-2">{star2}</span>
            <span id="star-3">{star3}</span>
            <span id="star-4">{star4}</span>
            <span id="star-5">{star5}</span>
          </div>
          {reviewRating != 0 && (
            <div
              onClick={handleStarClear}
              className="text-blue-500 hover:text-blue-700 hover:underline underline-offset-8 active:underline-offset-1 cursor-pointer text-2xl ml-2 h-fit"
            >
              Clear
            </div>
          )}
        </div>
        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="desc" className="text-lg font-bold mt-4">
            Review Description
            <span className="font-normal"> (required)</span>
          </label>
          <textarea
            type="text"
            id="desc"
            name="desc"
            value={reviewDesc}
            onChange={(e) => setReviewDesc(e.target.value)}
            placeholder="Enter review description"
            className="border-2 border-slate-400 rounded active:border-slate-800 focus:border-slate-800 px-2 py-1 text-lg dark:text-slate-800"
            rows={4}
            required
          />
        </div>
        {/* DropZone */}
        {!Object.keys(uploadedFiles).length ? (
          <div className="flex items-center w-full mt-3">
            <label
              onDragEnter={() => setIsDragging(true)}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => handleDrop(e)}
              htmlFor="dropzone-file"
              className={
                !isDragging
                  ? "flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  : "flex flex-col items-center justify-center w-full border-2 border-blue-500 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-600"
              }
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <TbCloudUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400 text-lg" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF
                </p>
              </div>
              <input
                onChange={(e) => handleFileInput(e)}
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        ) : (
          <div className="flex items-center flex-nowrap overflow-x-auto w-full mt-3 gap-2 py-2">
            {Object.keys(uploadedFiles).map((file) => (
              <div
                key={uploadedFiles[file].public_id}
                className="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] relative bg-white rounded-lg"
              >
                {/* {console.log(uploadedFiles[file].uploading)} */}
                <div
                  onClick={() => {
                    deleteImage(uploadedFiles[file].public_id, file);
                  }}
                  className="text-lg w-fit h-fit absolute right-0 bg-gray-200 z-10 text-black hover:bg-gray-400 active:bg-gray-300 select-none opacity-80 font-bold cursor-pointer px-2 rounded-full"
                >
                  X
                </div>
                <img
                  src={uploadedFiles[file].url}
                  alt="uploadImage"
                  className={
                    !uploadedFiles[file].uploading
                      ? "w-[100px] h-[100px] rounded-lg object-contain"
                      : "w-[100px] h-[100px] rounded-lg object-contain animate-pulse z-0"
                  }
                />
              </div>
            ))}
            <div className="min-w-[100px] min-h-[100px] w-[100px] h-[100px] max-w-[100px] max-h-[100px]">
              <label
                onDragEnter={() => setIsDragging(true)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => handleDrop(e)}
                htmlFor="dropzone-file"
                className={
                  !isDragging
                    ? "flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    : "flex flex-col items-center justify-center w-full h-full border-2 border-blue-500 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-600"
                }
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <TbCloudUpload className="w-8 h-8 text-gray-500 dark:text-gray-400 text-lg" />
                </div>
                <input
                  onChange={(e) => handleFileInput(e)}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        )}
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg font-bold mt-4">
            Review Title
            <span className="font-normal"> (required)</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Enter review title"
            className="border-2 border-slate-400 rounded active:border-slate-800 focus:border-slate-800 px-2 py-1 text-lg dark:text-slate-800"
            required
          />
        </div>
        <button
          type="submit"
          className={
            !isUploading
              ? "mt-4 p-2 flex items-center bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-500 dark:font-bold text-xl rounded-lg w-fit self-end"
              : "mt-4 p-2 flex items-center bg-gray-500 dark:bg-gray-600 dark:font-bold text-xl rounded-lg w-fit self-end cursor-not-allowed animate-pulse"
          }
          disabled={isUploading}
        >
          {isSubmitting && (
            <svg
              className="animate-spin mr-1 h-5 w-5 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

function Pagination({ currPage, totalProducts, changePage }) {
  const pages = [];

  if (totalProducts <= 5) {
    for (let i = 1; i <= totalProducts; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1); // Always include first page

    if (currPage > 3) pages.push("....");

    const startPage = Math.max(2, currPage - 1);
    const endPage = Math.min(totalProducts - 1, currPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currPage < totalProducts - 2) pages.push("....");

    pages.push(totalProducts); // Always include last page
  }

  return (
    <div
      onClick={(e) => changePage(e)}
      className="w-full flex justify-end p-2 gap-2 select-none text-white"
    >
      {pages.map((page, idx) => (
        <span
          key={idx}
          className={
            page != "...."
              ? `cursor-pointer text-lg px-2 rounded-md border-2 ${
                  currPage === page
                    ? "bg-blue-600 border-blue-800 underline underline-offset-2"
                    : "bg-blue-600 border-blue-800 hover:bg-blue-800 active:bg-blue-700"
                }`
              : "text-lg"
          }
        >
          {page}
        </span>
      ))}
    </div>
  );
}

export default Pagination;

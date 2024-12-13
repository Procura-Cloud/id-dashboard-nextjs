import { useState } from "react";

function usePagination(totalPages, initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    nextPage,
    prevPage,
    goToPage,
  };
}

export default usePagination;

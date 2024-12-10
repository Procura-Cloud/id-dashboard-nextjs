import { useState } from "react";

const usePagination = (initialPage: number, totalPages: number) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    currentPage,
    goToPreviousPage,
    goToNextPage,
    setPage,
  };
};

export default usePagination;

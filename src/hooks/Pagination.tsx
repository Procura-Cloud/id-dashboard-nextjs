import { useState } from "react";

export const usePagination = ({ initialPage = 1, limit = 10 }) => {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<any>(null);

  const getPaginationParams = () => {
    return {
      page,
      limit,
    };
  };

  const handleResponse = (data) => {
    setData(data);
    setPage(data.page);
  };

  return {
    page,
    limit,
    results: data?.results,
    totalCount: data?.totalCount,
    totalPages: data?.totalPages,
    hasNext: data?.hasNext,
    hasData: data != null,
    handleResponse,
    setPage,
    getPaginationParams,
  };
};

export interface PaginationProps {
  page: number;
  limit: number;
  results: any[];
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasData: boolean;
  handleResponse: (data: any) => void;
  setPage: (page: number) => void;
  getPaginationParams: () => { page: number; limit: number };
}

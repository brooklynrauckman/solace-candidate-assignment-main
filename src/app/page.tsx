"use client";

import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { Advocate } from "./types";
import SearchSection from "./components/SearchSection";
import ResultsInfo from "./components/ResultsInfo";
import AdvocatesTable from "./components/AdvocateTable";
import PaginationControls from "./components/PaginationControls";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Show 10 advocates per page
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const toggleSpecialties = (advocateId: number) => {
    setExpandedSpecialties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(advocateId)) {
        newSet.delete(advocateId); // Remove from expanded list
      } else {
        newSet.add(advocateId); // Add to expanded list
      }
      return newSet;
    });
  };

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch advocates with search and pagination
  const fetchAdvocates = useCallback(
    async (search: string, page: number) => {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      if (search.trim()) {
        params.append("search", search);
      }

      try {
        const response = await fetch(`/api/advocates?${params}`);
        const jsonResponse = await response.json();

        if (jsonResponse.error) {
          console.error("API Error:", jsonResponse.error);
          return;
        }

        setAdvocates(jsonResponse.data);
        setTotalCount(jsonResponse.pagination.totalCount);
        setTotalPages(jsonResponse.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  // Fetch data when search term or page changes
  useEffect(() => {
    fetchAdvocates(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage, fetchAdvocates]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const onResetSearch = useCallback(() => {
    // clear search and reset to first page
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Solace Advocates
      </h1>

      <SearchSection
        searchTerm={searchTerm}
        onSearch={onSearch}
        onResetSearch={onResetSearch}
      />

      <ResultsInfo
        startIndex={(currentPage - 1) * pageSize}
        pageSize={pageSize}
        totalResults={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
      />

      <AdvocatesTable
        advocates={advocates}
        expandedSpecialties={expandedSpecialties}
        onToggleSpecialties={toggleSpecialties}
        isLoading={isLoading}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </main>
  );
}

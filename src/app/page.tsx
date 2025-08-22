"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtering - only recalculates when advocates or search term changes
  const filteredAdvocates = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return advocates;

    const searchTerms = debouncedSearchTerm
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    return advocates.filter((advocate) => {
      // Check if ALL search terms match ANY field
      return searchTerms.every((searchTerm) => {
        return (
          advocate.firstName.toLowerCase().includes(searchTerm) ||
          advocate.lastName.toLowerCase().includes(searchTerm) ||
          advocate.city.toLowerCase().includes(searchTerm) ||
          advocate.degree.toLowerCase().includes(searchTerm) ||
          advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchTerm)
          ) ||
          advocate.yearsOfExperience.toString().includes(searchTerm) ||
          (advocate.phoneNumber
            .toString()
            .replace(/\D/g, "")
            .includes(searchTerm.replace(/\D/g, "")) &&
            searchTerm.replace(/\D/g, "").length > 0)
        );
      });
    });
  }, [advocates, debouncedSearchTerm]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/advocates")
      .then((response) => {
        response.json().then((jsonResponse) => {
          setAdvocates(jsonResponse.data);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error fetching advocates:", error);
        setIsLoading(false);
      });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(filteredAdvocates.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAdvocates = filteredAdvocates.slice(
    startIndex,
    startIndex + pageSize
  );

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
        startIndex={startIndex}
        pageSize={pageSize}
        totalResults={filteredAdvocates.length}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
      />

      <AdvocatesTable
        advocates={paginatedAdvocates}
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

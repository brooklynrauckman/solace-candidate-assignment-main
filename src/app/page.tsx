"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { formatPhoneNumber } from "./utils";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

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

      {/* Search Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Search Advocates
        </h3>
        <div className="flex gap-3 items-center">
          <input
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={onSearch}
            placeholder="Search by name, city, specialty, degree..."
          />
          <button onClick={onResetSearch} title="Clear search">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Results Info */}
      <div className="flex justify-between items-center mb-5 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-gray-700">
          {isLoading ? (
            "Loading..."
          ) : filteredAdvocates.length === 0 ? (
            "No advocates found"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold">
                {startIndex + 1}-
                {Math.min(startIndex + pageSize, filteredAdvocates.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{filteredAdvocates.length}</span>{" "}
              advocates
            </>
          )}
        </p>
        <p>
          {filteredAdvocates.length > 0 && !isLoading && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredAdvocates.length > 0 && !isLoading && (
        <div className="overflow-auto border border-gray-200 rounded-lg mb-6">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-4 text-left border-b-2 border-gray-200 text-gray-700 font-semibold">
                  Name
                </th>
                <th className="px-4 py-4 text-left border-b-2 border-gray-200 text-gray-700 font-semibold">
                  Location
                </th>
                <th className="px-4 py-4 text-left border-b-2 border-gray-200 text-gray-700 font-semibold">
                  Credentials
                </th>
                <th className="px-4 py-4 text-left border-b-2 border-gray-200 text-gray-700 font-semibold">
                  Specialties
                </th>
                <th className="px-4 py-4 text-left border-b-2 border-gray-200 text-gray-700 font-semibold">
                  Experience
                </th>
                <th className="px-4 py-4 text-left border-b-2 border-gray-200 text-gray-700 font-semibold">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdvocates.map((advocate: Advocate) => (
                <tr
                  key={advocate.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-800">
                      {advocate.firstName} {advocate.lastName}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{advocate.city}</td>
                  <td className="px-4 py-4 text-gray-600">{advocate.degree}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {advocate.specialties
                        .slice(
                          0,
                          expandedSpecialties.has(advocate.id)
                            ? advocate.specialties.length
                            : 3
                        )
                        .map((s: string) => (
                          <span
                            key={s}
                            className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs whitespace-nowrap"
                          >
                            {s}
                          </span>
                        ))}
                      {!expandedSpecialties.has(advocate.id) &&
                        advocate.specialties.length > 3 && (
                          <span
                            onClick={() => toggleSpecialties(advocate.id)}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200 transition-colors"
                          >
                            +{advocate.specialties.length - 3} more
                          </span>
                        )}
                      {expandedSpecialties.has(advocate.id) &&
                        advocate.specialties.length > 3 && (
                          <span
                            onClick={() => toggleSpecialties(advocate.id)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-300 transition-colors"
                          >
                            Show less
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {advocate.yearsOfExperience} years
                  </td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                    {formatPhoneNumber(advocate.phoneNumber)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            className={`p-2 border border-gray-300 rounded-md transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
            title="Previous page"
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {[...Array(totalPages)]
            .map((_, i) => i + 1)
            .map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[44px] transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            className={`p-2 border border-gray-300 rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
            title="Next page"
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </main>
  );
}

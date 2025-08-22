"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDebounce } from "./hooks/useDebounce";

type Advocate = {
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
          advocate.phoneNumber.toString().includes(searchTerm)
        );
      });
    });
  }, [advocates, debouncedSearchTerm]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onSearch}
          placeholder="Search advocates..."
        />
        <button onClick={onResetSearch}>Reset Search</button>
      </div>
      <br />
      <div>
        <p>
          Showing {startIndex + 1}-
          {Math.min(startIndex + pageSize, filteredAdvocates.length)} of{" "}
          {filteredAdvocates.length} advocates
        </p>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAdvocates.map((advocate: Advocate) => (
            <tr key={advocate.phoneNumber}>
              <td>{advocate.firstName}</td>
              <td>{advocate.lastName}</td>
              <td>{advocate.city}</td>
              <td>{advocate.degree}</td>
              <td>
                {advocate.specialties.map((s: string) => (
                  <div key={s}>{s}</div>
                ))}
              </td>
              <td>{advocate.yearsOfExperience}</td>
              <td>{advocate.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ margin: "0 5px" }}
          >
            Previous
          </button>

          {[...Array(totalPages)]
            .map((_, i) => i + 1)
            .map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: currentPage === page ? "#007bff" : "#f8f9fa",
                  color: currentPage === page ? "white" : "black",
                  border: "1px solid #dee2e6",
                }}
              >
                {page}
              </button>
            ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ margin: "0 5px" }}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

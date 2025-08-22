interface ResultsInfoProps {
  startIndex: number;
  pageSize: number;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
}

export default function ResultsInfo({
  startIndex,
  pageSize,
  totalResults,
  currentPage,
  totalPages,
  isLoading,
}: ResultsInfoProps) {
  return (
    <div className="flex justify-between items-center mb-5 p-4 bg-blue-50 rounded-md border border-blue-200">
      <p className="text-gray-700">
        {isLoading ? (
          "Loading..."
        ) : totalResults === 0 ? (
          "No advocates found"
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold">
              {startIndex + 1}-{Math.min(startIndex + pageSize, totalResults)}
            </span>{" "}
            of <span className="font-semibold">{totalResults}</span> advocates
          </>
        )}
      </p>
      {totalResults > 0 && !isLoading && (
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
}

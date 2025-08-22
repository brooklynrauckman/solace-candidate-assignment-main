import { XMarkIcon } from "@heroicons/react/24/outline";

interface SearchSectionProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetSearch: () => void;
}

export default function SearchSection({
  searchTerm,
  onSearch,
  onResetSearch,
}: SearchSectionProps) {
  return (
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
  );
}

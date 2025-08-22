import AdvocateRow from "./AdvocateRow";
import { Advocate } from "../types";

interface AdvocatesTableProps {
  advocates: Advocate[];
  expandedSpecialties: Set<number>;
  onToggleSpecialties: (advocateId: number) => void;
  isLoading: boolean;
}

const TableHeader = () => (
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
);

export default function AdvocatesTable({
  advocates,
  expandedSpecialties,
  onToggleSpecialties,
  isLoading,
}: AdvocatesTableProps) {
  return (
    <div className="overflow-auto border border-gray-200 rounded-lg mb-6">
      <table className="w-full bg-white">
        <TableHeader />
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-4 py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </td>
            </tr>
          ) : (
            advocates.map((advocate: Advocate) => (
              <AdvocateRow
                key={advocate.id}
                advocate={advocate}
                isExpanded={expandedSpecialties.has(advocate.id)}
                onToggleSpecialties={() => onToggleSpecialties(advocate.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import { formatPhoneNumber } from "../utils";
import SpecialtiesDisplay from "./SpecialtiesDisplay";
import { Advocate } from "../types";

interface AdvocateRowProps {
  advocate: Advocate;
  isExpanded: boolean;
  onToggleSpecialties: () => void;
}

export default function AdvocateRow({
  advocate,
  isExpanded,
  onToggleSpecialties,
}: AdvocateRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-semibold text-gray-800">
          {advocate.firstName} {advocate.lastName}
        </div>
      </td>
      <td className="px-4 py-4 text-gray-600">{advocate.city}</td>
      <td className="px-4 py-4 text-gray-600">{advocate.degree}</td>
      <td className="px-4 py-4">
        <SpecialtiesDisplay
          specialties={advocate.specialties}
          isExpanded={isExpanded}
          onToggle={onToggleSpecialties}
        />
      </td>
      <td className="px-4 py-4 text-gray-600">
        {advocate.yearsOfExperience} years
      </td>
      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
        {formatPhoneNumber(advocate.phoneNumber)}
      </td>
    </tr>
  );
}

interface SpecialtiesDisplayProps {
  specialties: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SpecialtiesDisplay({
  specialties,
  isExpanded,
  onToggle,
}: SpecialtiesDisplayProps) {
  const displayedSpecialties = isExpanded
    ? specialties
    : specialties.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-1">
      {displayedSpecialties.map((specialty: string) => (
        <span
          key={specialty}
          className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs whitespace-nowrap"
        >
          {specialty}
        </span>
      ))}
      {!isExpanded && specialties.length > 3 && (
        <span
          onClick={onToggle}
          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200 transition-colors"
        >
          +{specialties.length - 3} more
        </span>
      )}
      {isExpanded && specialties.length > 3 && (
        <span
          onClick={onToggle}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-300 transition-colors"
        >
          Show less
        </span>
      )}
    </div>
  );
}

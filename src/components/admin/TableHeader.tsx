import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort: (key: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
}) => {
  const isActive = currentSort.key === sortKey;

  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="flex flex-col">
          <ArrowUp
            className={`h-3 w-3 ${
              isActive && currentSort.direction === 'asc'
                ? 'text-primary-600'
                : 'text-gray-400'
            }`}
          />
          <ArrowDown
            className={`h-3 w-3 -mt-1 ${
              isActive && currentSort.direction === 'desc'
                ? 'text-primary-600'
                : 'text-gray-400'
            }`}
          />
        </span>
      </div>
    </th>
  );
};

export default TableHeader;
import { Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({ value, onChange, className, placeholder = "Search projects..." }: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center w-full max-w-md", className)} id="search-bar-container">
      <Search className="absolute left-3 w-4 h-4 text-neutral-500" id="search-icon" />
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
      />
    </div>
  );
}

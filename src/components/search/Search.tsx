'use client';

import { RiSearchLine } from 'react-icons/ri';

interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
  return (
    <div className="col-start-2 col-end-6 relative flex items-center mb-6 p-2">
      <RiSearchLine className="absolute ml-2 pointer-events-none text-zinc-400" />
      <input
        placeholder="search"
        autoComplete="off"
        type="text"
        className="px-3 py-2 pl-8 rounded-sm border-none ring-1 ring-zinc-400 bg-transparent w-full"
      />
    </div>
  );
};

export { Search };

import React from 'react';

const SearchBar = ({ query, setQuery, onSearch }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="flex justify-center my-6"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="w-2/3 p-2 rounded-l-md border border-gray-600 bg-gray-800 text-white focus:outline-none"
      />
      <button
        type="submit"
        className="bg-red-600 px-4 rounded-r-md hover:bg-red-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

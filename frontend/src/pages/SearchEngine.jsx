import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaTachometerAlt, FaMoneyCheckAlt, FaUserAlt, FaCog } from "react-icons/fa"; // Import icons

const SearchEngine = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Define your pages here
  const links = [
    { label: "Dashboard", link: "/overview", icon: <FaTachometerAlt /> },
    { label: "Transactions", link: "/transactions", icon: <FaMoneyCheckAlt /> },
    { label: "Accounts", link: "/accounts", icon: <FaUserAlt /> },
    { label: "Settings", link: "/settings", icon: <FaCog /> },
    { label: "Profile", link: "/manageprofile", icon: <FaUserAlt /> } // Path should be lowercase for consistency
  ];

  // Handle input changes for the search box
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    // Filter the suggestions based on input
    if (value.trim()) {
      const filteredSuggestions = links.filter((page) =>
        page.label.toLowerCase().includes(value)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Reset suggestions if the input is cleared
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (path) => {
    navigate(path);
    setQuery(""); // Reset the search box after navigation
    setSuggestions([]); // Clear the suggestions
  };

  // Handle the search when user presses enter or clicks the button
  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a search term."); // Handle empty query case
      return;
    }

    const page = links.find((p) => p.label.toLowerCase() === query.toLowerCase());
    if (page) {
      navigate(page.link);
    } else {
      alert("Page not found");
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for pages..."
          className="w-full py-3 pl-5 pr-12 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 transition-all duration-300 ease-in-out"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          <AiOutlineSearch size={18} />
        </button>
      </div>

      {/* Display search suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white shadow-lg rounded-md">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.link)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              {suggestion.icon}
              <span className="ml-2 text-gray-700">{suggestion.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchEngine;

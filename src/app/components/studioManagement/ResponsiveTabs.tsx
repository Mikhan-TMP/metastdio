import { useState } from "react";
import { Plus, Edit, Grid, ChevronDown } from "lucide-react";

const ResponsiveTabs = ({ currentView, setCurrentView }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white shadow-sm p-4 rounded-[12px]">
      {/* Dropdown for small screens */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-4 py-2 flex items-center justify-between w-full border-b-2 border-[#9b25A7] text-[#9b25A7]"
        >
          {currentView === "new"
            ? "New AI Studio"
            : currentView === "modify"
            ? "Modify"
            : "Gallery"}
          <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
            <button
              onClick={() => {
                setCurrentView("new");
                setDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              New AI Studio
            </button>
            <button
              onClick={() => {
                setCurrentView("modify");
                setDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Modify
            </button>
            <button
              onClick={() => {
                setCurrentView("gallery");
                setDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Gallery
            </button>
          </div>
        )}
      </div>

      {/* Button group for larger screens */}
      <div className="hidden sm:flex flex-wrap justify-center space-x-2 sm:space-x-4 md:space-x-8">
        <button
          onClick={() => setCurrentView("new")}
          className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-all duration-200 ${
            currentView === "new"
              ? "border-[#9b25A7] text-[#9b25A7]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New AI Studio</span>
        </button>
        <button
          onClick={() => setCurrentView("modify")}
          className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-all duration-200 ${
            currentView === "modify"
              ? "border-[#9b25A7] text-[#9b25A7]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Edit size={16} />
          <span className="hidden sm:inline">Modify</span>
        </button>
        <button
          onClick={() => setCurrentView("gallery")}
          className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-all duration-200 ${
            currentView === "gallery"
              ? "border-[#9b25A7] text-[#9b25A7]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Grid size={16} />
          <span className="hidden sm:inline">Gallery</span>
        </button>
      </div>
    </div>
  );
};

export default ResponsiveTabs;

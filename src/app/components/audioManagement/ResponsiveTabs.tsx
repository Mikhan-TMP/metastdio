import { useState } from "react";
import { FileText, ChevronDown, Volume2, Mic } from "lucide-react";

export default function ResponsiveTabs({ currentView, setCurrentView }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex justify-center px-4">
      <div className="bg-white p-4 rounded-[12px] w-full max-w-[900px] sm:w-[90%] md:w-[80%] lg:w-[70%] h-auto">
        {/* Dropdown for small screens */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 flex items-center justify-between w-full border-b-2 border-[#9B25A7] text-[#9B25A7]"
          >
            {currentView === "script"
              ? "New AI Script"
              : currentView === "manager"
              ? "Audio Manager"
              : "AI Voice Generator"}
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
              <button
                onClick={() => {
                  setCurrentView("script");
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                New AI Script
              </button>
              <button
                onClick={() => {
                  setCurrentView("manager");
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Audio Manager
              </button>
              <button
                onClick={() => {
                  setCurrentView("voice");
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                AI Voice Generator
              </button>
            </div>
          )}
        </div>

        {/* Button group for larger screens */}
        <div className="hidden sm:flex flex-row space-x-8">
          <button
            onClick={() => setCurrentView("script")}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 ${
              currentView === "script"
                ? "border-[#9B25A7] text-[#9B25A7]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText size={16} />
            New AI Script
          </button>
          <button
            onClick={() => setCurrentView("manager")}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 ${
              currentView === "manager"
                ? "border-[#9B25A7] text-[#9B25A7]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Volume2 size={16} />
            Audio Manager
          </button>
          <button
            onClick={() => setCurrentView("voice")}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 ${
              currentView === "voice"
                ? "border-[#9B25A7] text-[#9B25A7]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Mic size={16} />
            AI Voice Generator
          </button>
        </div>
      </div>
    </div>
  );
}

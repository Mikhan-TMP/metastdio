import React, { useState, useEffect } from "react";
import { Search, RefreshCw, ChevronDown, Pencil, Save, Trash2, Plus } from "lucide-react";
import axios from "axios";

const StudioGallery = () => {
  const [galleryStudioList, setGalleryStudioList] = useState([]);
  const [styleFilter, setStyleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(null); // State for selected studio
  const [editName, setEditName] = useState(""); // Editable name
  const [editType, setEditType] = useState(""); // Editable type
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const email = localStorage.getItem("userEmail");

  const studioTypes = ["News", "Podcast", "Meeting", "Education"];

  const fetchStudios = async () => {
    try {
      setIsLoading(true);
      const email = localStorage.getItem("userEmail") || "test@example.com";

      // Build params object with all filters
      const params = {
        email,
        ...(styleFilter && styleFilter !== "All" ? { studioType: styleFilter } : {}),
        ...(nameFilter ? { name: nameFilter } : {}),
      };

      const response = await axios.get(`http://192.168.1.141:3001/studio/getStudios`, { params });
      console.log("API Response:", response.data);

      const fetchedStudios = response.data.map((studio, index) => ({
        id: studio._id || index,
        imgSrc: `data:image/png;base64,${studio.imgSrc}`,
        name: studio.name || `Studio ${index + 1}`,
        studioType: studio.studioType,
      }));

      setGalleryStudioList(fetchedStudios);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("The requested resource was not found. Please check the API endpoint.");
      } else {
        console.error("Error fetching studios:", error);
        alert("Failed to fetch studios. Please try again later.");
      }
      setGalleryStudioList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudio = async () => {
    if (!selectedStudio) return;

    try {
      const email = localStorage.getItem("userEmail") || "test@example.com";
      const response = await axios.delete(
        `http://192.168.1.141:3001/studio/deleteStudio?email=${email}&id=${selectedStudio.id}`
      );

      if (response.data.status === "success") {
        alert(response.data.message);
        setGalleryStudioList((prev) =>
          prev.filter((studio) => studio.id !== selectedStudio.id)
        );
        setSelectedStudio(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("The requested resource was not found. Please check the API endpoint.");
      } else {
        console.error("Error deleting studio:", error);
        alert("Failed to delete the studio. Please try again.");
      }
    }
  };

  const updateStudio = async () => {
    if (!selectedStudio || !editName || !editType) {
      alert("Please provide valid name and type for the studio.");
      return;
    }

    try {
      const email = localStorage.getItem("userEmail") || "test@example.com";
      const response = await axios.put(
        `http://192.168.1.141:3001/studio/updateStudio?email=${email}&name=${editName}&id=${selectedStudio.id}&type=${editType}`
      );

      if (response.data.status === "success" || response.data.status === "info") {
        alert(response.data.message);
        setGalleryStudioList((prev) =>
          prev.map((studio) =>
            studio.id === selectedStudio.id
              ? { ...studio, name: editName, studioType: editType }
              : studio
          )
        );
        setSelectedStudio((prev) => ({ ...prev, name: editName, studioType: editType }));
        setIsEditing(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("The requested resource was not found. Please check the API endpoint.");
      } else {
        console.error("Error updating studio:", error);
        alert("Failed to update the studio. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleStyleChange = (selectedStyle) => {
    setStyleFilter(selectedStyle);
    setDropdownOpen(false);
  };

  const convertBase64ToImageUrl = (base64String) => {
    return base64String;
  };

  return (
    <div className="flex h-full bg-gray-50 rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8 mx-4 overflow-hidden">
      {/* Left Section: Filters and Gallery */}
      <div className="w-2/3 max-w-8xl mx-auto rounded-lg h-full flex flex-col">
        <div className="p-4 sm:p-6">
          {/* Settings Section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl mb-3 sm:mb-4">
              Studio Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Studio Type
                </label>
                <div className="relative">
                  <button
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>{styleFilter || "All Types"}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <div
                        className="p-2 sm:p-3 hover:bg-[#E3C5F0] text-sm cursor-pointer"
                        onClick={() => handleStyleChange("")}
                      >
                        All Types
                      </div>
                      {studioTypes.map((option) => (
                        <div
                          key={option}
                          className="p-2 sm:p-3 hover:bg-[#E3C5F0] text-sm cursor-pointer"
                          onClick={() => handleStyleChange(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search gallery..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full p-2 sm:p-3 pl-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="w-full flex items-end">
                <button
                  className="w-full bg-[#9B25A7] text-white text-sm py-2 px-4 rounded-md flex items-center justify-center gap-1 hover:bg-[#7A1C86] transition-colors"
                  onClick={fetchStudios}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Studio Gallery */}
          <div className="flex-1 flex flex-col min-h-fit">
            <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl mb-4">
              Available Studios
            </h3>
            
            <div className="max-h-[600px] overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                </div>
              ) : galleryStudioList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {galleryStudioList.map((studio) => (
                    <div
                      key={studio.id}
                      className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer"
                      onClick={() => {
                        setSelectedStudio(studio);
                        setEditName(studio.name);
                        setEditType(studio.studioType);
                      }}
                    >
                      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={convertBase64ToImageUrl(studio.imgSrc)}
                          alt={studio.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium truncate">{studio.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {studio.studioType || "Unknown Type"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-gray-300" />
                  </div>
                  <p className="text-lg font-medium mb-2">No Studios Found</p>
                  <p className="text-sm text-center max-w-md">
                    {styleFilter
                      ? `No studios found in ${styleFilter} category. Try selecting a different type or clear your filters.`
                      : "No studios exist in the gallery. Try adjusting your search criteria."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Full Image View */}
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 flex flex-col h-fit">
        <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl mb-4 sm:mb-6">
          Studio Preview
        </h3>
        <div className="flex-1 flex items-center justify-center bg-white rounded-lg overflow-auto">
          {selectedStudio ? (
            <div className="flex flex-col items-center bg-white rounded-lg overflow-auto p-4 w-[550px]">
              <div className="relative mb-4 flex justify-center w-[200px] h-[355px]">
                <img
                  src={convertBase64ToImageUrl(selectedStudio.imgSrc)}
                  alt={selectedStudio.name}
                  className="rounded-lg w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2 mb-4 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="flex items-center border rounded-lg p-2 w-full">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-grow outline-none px-2"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-grow">{selectedStudio.name}</span>
                  )}
                  {!isEditing && (
                    <Pencil
                      size={20}
                      className="text-gray-500 cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID
                  </label>
                  <div className="bg-gray-100 rounded-lg p-2 w-full">
                    {selectedStudio.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <div className="bg-gray-100 rounded-lg p-2 w-full">
                    {selectedStudio.studioType || "N/A"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 w-full">
                {isEditing ? (
                  <>
                    <button
                      className="w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition"
                      onClick={updateStudio}
                    >
                      <Save size={16} /> Save Changes
                    </button>
                    <button
                      className="w-full bg-gray-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil size={16} /> Edit Studio
                    </button>
                    <button
                      className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
                      onClick={deleteStudio}
                    >
                      <Trash2 size={16} /> Delete Studio
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                <Plus size={32} className="text-gray-300" />
              </div>
              <p className="text-base sm:text-lg">No Studio Selected</p>
              <p className="text-sm mt-2 max-w-md mx-auto">
                {galleryStudioList.length === 0
                  ? styleFilter
                    ? `No studios available in ${styleFilter} type. Try selecting a different type or create a new studio.`
                    : "No studios exist in your collection. Start by creating your first studio!"
                  : "Choose a studio from the list or create a new one"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioGallery;
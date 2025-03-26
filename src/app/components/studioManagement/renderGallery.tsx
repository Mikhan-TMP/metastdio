import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

const RenderGallery = ({ email }) => {
  const [galleryStudioList, setGalleryStudioList] = useState([]);
  const [styleFilter, setStyleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safe localStorage access
  const safeLocalStorage = {
    getItem: (key) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key, value) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    }
  };

  const fetchStudios = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      setIsLoading(true);

      // Retrieve email from props or fallback
      const userEmail = email || safeLocalStorage.getItem("userEmail") || "test@example.com";

      // Build params object with all filters
      const params = {
        email: userEmail,
        ...(styleFilter && styleFilter !== "All" ? { style: styleFilter.toLowerCase() } : {}),
        ...(nameFilter ? { name: nameFilter } : {}),
      };

      const response = await fetch(`http://192.168.1.141:3001/studio/getStudios?${new URLSearchParams(params).toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Ensure data is an array
      const studioList = Array.isArray(data) ? data : [];
      setGalleryStudioList(studioList);
    } catch (error) {
      console.error("Error fetching studios:", error);
      setError(error.message);
      setGalleryStudioList([]);
    } finally {
      setIsLoading(false);
    }
  }, [email, styleFilter, nameFilter]);

  // Client-side only useEffects
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Restore filters from localStorage
      const savedStyleFilter = safeLocalStorage.getItem("styleFilter");
      const savedNameFilter = safeLocalStorage.getItem("nameFilter");
      
      if (savedStyleFilter) setStyleFilter(savedStyleFilter);
      if (savedNameFilter) setNameFilter(savedNameFilter);

      // Fetch studios
      fetchStudios();
    }
  }, [fetchStudios]);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Save filters to localStorage
      safeLocalStorage.setItem("styleFilter", styleFilter);
      safeLocalStorage.setItem("nameFilter", nameFilter);
    }
  }, [styleFilter, nameFilter]);

  // Convert base64 to image URL
  const convertBase64ToImageUrl = (base64String) => {
    if (!base64String || base64String.trim() === '') {
      return '/placeholder-image.png';
    }

    const prefix = base64String.startsWith('data:') 
      ? '' 
      : 'data:image/png;base64,';

    return prefix + base64String;
  };

  // Client-side only render
  if (typeof window === 'undefined') {
    return null;
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading studios...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="font-medium text-lg">Studio Gallery</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-0">
          <select
            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="News">News</option>
            <option value="Podcast">Podcast</option>
            <option value="Meeting">Meeting</option>
            <option value="Education">Education</option>
          </select>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search gallery..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={fetchStudios}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {galleryStudioList.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No studios found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryStudioList.map((studio) => (
            <div
              key={studio.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={convertBase64ToImageUrl(studio.imgSrc)}
                  alt={studio.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{studio.name}</h3>
                <p className="text-sm text-gray-500">{studio.studioType}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderGallery;
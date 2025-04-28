import React, { useState, useEffect } from "react";
import { Upload, RefreshCw, ChevronDown, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RenderNewStudio = () => {
  const [promptText, setPromptText] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [style, setStyle] = useState("");

  // Cleanup previous object URLs
  useEffect(() => {
    if (typeof window !== "undefined" && referenceImage) {
      const objectUrl = URL.createObjectURL(referenceImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup
    }
  }, [referenceImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setReferenceImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReferenceImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!promptText.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const toastId = toast.loading("Generating your studio...");

    try {
      const formData = new FormData();
      formData.append("prompt", promptText);
      if (referenceImage) {
        formData.append("reference_image", referenceImage);
      }

      const response = await fetch("http://192.168.1.71:8083/studio_gen", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Fetch response body for debugging
        console.error(
          "API Error:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setGeneratedImageUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl); // Cleanup previous URL
        return imageUrl;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("lastGeneratedImage", imageUrl); // Example usage of localStorage
      }

      toast.update(toastId, {
        render: "Studio generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.update(toastId, {
        render: `Failed to generate: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement("a");
      link.href = generatedImageUrl;
      link.download = `studio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!promptText.trim() || !style.trim()) {
      toast.error("Both name and type are required.");
      return;
    }

    if (!generatedImageUrl) {
      toast.error("No generated image to save.");
      return;
    }

    setError("");
    setIsLoading(true);

    const toastId = toast.loading("Saving to library...");

    try {
      // Convert the image to base64
      const responseBlob = await fetch(generatedImageUrl);
      const blob = await responseBlob.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1]; // Extract base64 string

        const response = await fetch(
          "http://192.168.1.141:3001/studio/addStudio",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: promptText,
              email: "forehead614@gmail.com",
              image: base64Image,
              type: style,
            }),
          }
        );

        if (!response.ok) {
          console.error("API Error:", response.status, response.statusText);
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Studio saved successfully:", result);
        toast.update(toastId, {
          render: "Studio saved successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      };

      reader.readAsDataURL(blob); // Read the blob as a base64 string
    } catch (err) {
      console.error("Save Error:", err);
      toast.update(toastId, {
        render: `Failed to save: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TypesOption = ["News", "Podcast", "Educational", "Meeting"];

  return (
    <div className="flex flex-row flex-wrap justify-between items-center content-center gap-y-5 h-full w-full p-6">

      {/* Reference Image Upload & AI Generation Prompt */}
      <div className="flex flex-col md:flex-row items-start p-6 gap-6 w-full bg-white shadow-md rounded-2xl">
        {/* Reference Image Upload */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-2 gap-6">
          <h2 className="font-medium mb-4">Reference Image Upload</h2>
          <div
            className={`border-2 border-dashed ${
              referenceImage ? "border-[#9B25A7]" : "border-gray-300"
            } rounded-lg p-8 text-center`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {referenceImage.name}
                </p>
                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => setReferenceImage(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500 mb-2">
                  Drag & drop your reference image here
                </p>
                <p className="text-gray-400 text-sm mb-4">or</p>
                <label className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Reference image is optional
          </p>
        </div>

        {/* AI Generation Prompt */}
        <div className="w-full md:w-1/2 flex flex-col items-start p-2 gap-6">
          <h2 className="font-medium mb-4">AI Generation Prompt</h2>
          <textarea
            className="w-full h-32 md:h-40 border rounded-lg p-3 border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
            placeholder="Enter your studio generation prompt..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />

          <button
            className={`w-full px-4 py-3 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] flex items-center justify-center transition font-medium
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Studio"}
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between items-start p-6 gap-12 w-full h-[437px] bg-white shadow-md rounded-2xl">
        {/* Left Column - Image Preview */}
        <div className="w-full md:w-1/2 flex justify-center min-h-[400px] h-full">
          {generatedImageUrl ? (
            <div className="border-none rounded-lg p-3 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl min-h-[300px] h-full flex justify-center items-center shadow-md">
              <img
                src={generatedImageUrl}
                alt="Generated studio"
                className="w-full h-full object-cover rounded"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl min-h-[300px] h-full flex flex-col justify-center items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                <Plus size={32} className="text-gray-300" />
              </div>
              <p className="text-sm sm:text-base md:text-lg">
                No Image Generated
              </p>
              <p className="text-xs sm:text-sm md:text-base mt-2 max-w-md">
                Please generate an image first.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Inputs and Buttons */}
        <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
          <h3 className="font-medium">Generated Studio</h3>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full px-4 py-2 rounded-lg border p-3 border-gray-300 text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
          />

          <div className="relative">
            <button
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{style || "Select Style"}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {TypesOption.map((option) => (
                  <div
                    key={option}
                    className="p-3 hover:bg-[#E3C5F0] text-sm cursor-pointer"
                    onClick={() => {
                      setStyle(option);
                      setDropdownOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            className="w-full px-4 py-3 border-2 border-[#9B25A7] text-[#9B25A7] bg-transparent rounded-lg flex items-center justify-center transition font-medium hover:bg-[#F4E3F8] hover:text-[#9B25A7]"
            onClick={handleSaveToLibrary}
          >
            Save to Library
          </button>
          <button
            className="w-full px-4 py-3 bg-[#9B25A7] text-white rounded-lg hover:bg-[#7A1C86] flex items-center justify-center transition font-medium"
            onClick={handleDownload}
          >
            Download Image
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default RenderNewStudio;

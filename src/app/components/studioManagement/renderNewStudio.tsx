import React, { useState, useEffect } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Alert component
const Alert = ({ message, type, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
        >
          <div
            className={`relative max-w-sm w-full p-5 rounded-lg shadow-lg flex items-center gap-3 border ${
              type === "success"
                ? "bg-green-100 text-green-800 border-green-300"
                : type === "generating"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {type === "success" ? (
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : type === "generating" ? (
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
            <p className="font-semibold text-sm md:text-base">{message}</p>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-2 right-2 text-black-600 hover:text-black-900 transition-all"
            >
              &times;
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RenderNewStudio = () => {
  const [promptText, setPromptText] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");

  // Cleanup previous object URLs
  useEffect(() => {
    if (referenceImage) {
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
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError("");
    setNotification("Generating your studio...", "generating");
    setNotificationType("generating");

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
        console.error("API Error:", response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setGeneratedImageUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl); // Cleanup previous URL
        return imageUrl;
      });

      setNotification("Studio generated successfully!", "success");
      setNotificationType("success");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(`Failed to generate: ${err.message}`);
      setNotification(`Failed to generate: ${err.message}`, "error");
      setNotificationType("error");
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

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Reference Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow-sm w-full md:w-1/2">
        <h2 className="font-medium mb-4">Reference Image Upload</h2>
        <div
          className={`border-2 border-dashed ${
            referenceImage ? "border-blue-400" : "border-gray-300"
          } rounded-lg p-8 text-center`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previewUrl ? (
            <div className="mb-4">
              <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">{referenceImage.name}</p>
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
              <p className="text-gray-500 mb-2">Drag & drop your reference image here</p>
              <p className="text-gray-400 text-sm mb-4">or</p>
              <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
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
        <p className="text-sm text-gray-500 mt-2">Reference image is optional</p>
      </div>

      {/* AI Generation Prompt */}
      <div className="bg-white p-6 rounded-lg shadow-sm w-full md:w-1/2">
        <h2 className="font-medium mb-4">AI Generation Prompt</h2>
        <textarea
          className="w-full h-40 border rounded-lg p-3 mb-4"
          placeholder="Enter your studio generation prompt..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded ${
            isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Studio"}
        </button>

        {/* Generated Image Preview */}
        {generatedImageUrl && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Generated Studio</h3>
            <div className="border rounded-lg p-3 mb-2">
              <img src={generatedImageUrl} alt="Generated studio" className="w-full rounded" />
            </div>
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleDownload}
            >
              Download Image
            </button>
          </div>
        )}
      </div>

      {/* Alert Component */}
      <Alert
        message={notification}
        type={notificationType}
        onClose={() => setNotification("")}
      />
    </div>
  );
};

export default RenderNewStudio;
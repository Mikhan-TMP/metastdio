import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { FileText, Check, Copy, Volume2, RefreshCw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResponsiveTabs from "./ResponsiveTabs";
import AudioManagerUI from "./audio-manager-ui"; // Import the AudioManagerUI component
import VoiceGenerator from "./voice-generator"; // Import the VoiceGenerator component

const AudioScript = () => {
  const [currentView, setCurrentView] = useState("script");
  const [scriptTitle, setScriptTitle] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptPrompt, setScriptPrompt] = useState("");
  const [scriptType, setScriptType] = useState("");
  const [voiceType, setVoiceType] = useState("");
  const [numberOfScenes, setNumberOfScenes] = useState("");
  const [promptLength, setPromptLength] = useState("medium"); // New state for prompt length
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null); // New state for file
  const [fileError, setFileError] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState(""); // Define audioUrl state
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false); // Define isGeneratingAudio state
  const [isGeneratingScript, setIsGeneratingScript] = useState(false); // Define isGeneratingScript state
  const [abortController, setAbortController] = useState(null); // Define abortController state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Define dropdownOpen state
  const [style, setStyle] = useState(""); // Define style state

  // Show modal after 2 seconds if there's a generated script
  useEffect(() => {
    if (generatedScript) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [generatedScript]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const closeModal = () => {
    setShowModal(false);
  };

  // File validation
  const validateFile = (file) => {
    const allowedTypes = ["text/plain", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Please upload only .txt or .pdf files");
      return false;
    }
    setFileError("");
    return true;
  };

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setFile(file);
    }
  }, []);

  // Handle file upload via button
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setFile(file);
    }
  };

  const handleGenerateScript = async () => {
    if (
      !scriptTitle ||
      !numberOfPeople ||
      !scriptTopic ||
      !scriptPrompt ||
      !scriptType ||
      !voiceType ||
      !numberOfScenes
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", scriptTitle);
    formData.append("numberOfPeople", numberOfPeople);
    formData.append("topic", scriptTopic);
    formData.append("prompt", scriptPrompt);
    formData.append("scriptType", scriptType);
    formData.append("voiceType", voiceType);
    formData.append("numberOfScenes", numberOfScenes);
    formData.append("promptLength", promptLength);

    if (file) {
      formData.append("file", file, file.name);
    }

    const controller = new AbortController();
    setAbortController(controller);

    try {
      setIsGeneratingScript(true); // Set loading state to true
      setAudioUrl(""); // Clear previous audio URL
      const response = await axios.post(
        "http://192.168.1.71:8083/script_gen/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: controller.signal, // Pass the abort signal to the request
        }
      );
      setGeneratedScript(response.data.script);
      setSuccessMessage("Script generated successfully!");
      setErrorMessage("");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error("Error generating script:", error);
        setErrorMessage(
          "Failed to generate script. Please check the console for more details."
        );
        setSuccessMessage("");
      }
    } finally {
      setIsGeneratingScript(false); // Set loading state to false
      setAbortController(null); // Reset abortController
    }
  };

  const handleGenerateAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      setAudioUrl(""); // Clear previous audio URL
      const response = await axios.post(
        "http://192.168.1.71:8083/script_gen/generate-audio",
        {
          script: generatedScript,
          voiceType: voiceType,
        },
        {
          responseType: "blob", // Set response type to blob to handle audio file
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setSuccessMessage("Audio generated successfully!");
    } catch (error) {
      console.error("Error generating audio:", error);
      setErrorMessage("Failed to generate audio. Please try again.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

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
              {/* Icon */}
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

              {/* Message */}
              <p className="font-semibold text-sm md:text-base">{message}</p>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition-all"
              >
                &times;
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleCancelGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsGeneratingScript(false);
      setAbortController(null);
      setErrorMessage("Script generation canceled.");
    }
  };

  const formatGeneratedScript = (script) => {
    return script.split("\n").map((line, index) => (
      <p key={index} className="mb-2" style={{ color: "black" }}>
        {line}
      </p>
    ));
  };

  const renderNewScript = () => (
    <div className="px-4 min-h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Script Upload */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <textarea
            className="w-full h-32 md:h-40 border rounded-lg p-3 mb-4 border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
            placeholder="Enter your script Topic..."
            value={scriptTopic}
            onChange={(e) => setScriptTopic(e.target.value)}
            style={{ color: "black" }}
          />
          <h2 className="text-lg font-medium mb-4" style={{ color: "black" }}>
            Reference Script Upload
          </h2>
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${fileError ? "border-red-500" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
          >
            <FileText className="mx-auto mb-4 text-gray-400" size={36} />
            <p
              className="text-gray-500 mb-2 text-sm md:text-base"
              style={{ color: "black" }}
            >
              {isDragActive
                ? "Drop your file here"
                : "Upload your reference script or document"}
            </p>
            <p
              className="text-gray-400 text-xs md:text-sm mb-4"
              style={{ color: "black" }}
            >
              Supported formats: .txt, .pdf
            </p>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="inline-block px-4 py-2 bg-[#9B25A7] text-white text-sm rounded hover:bg-[#871f90] cursor-pointer"
            >
              Upload File
            </label>
            {fileError && (
              <p className="text-red-500 mt-2 text-xs md:text-sm">
                {fileError}
              </p>
            )}
          </div>

          {/* File Content Display */}
          {file && (
            <div className="mt-4 md:mt-6">
              <h3
                className="text-sm md:text-base font-medium mb-2"
                style={{ color: "black" }}
              >
                File Selected
              </h3>
              <div className="border rounded-lg p-3 md:p-4 max-h-48 md:max-h-64 overflow-y-auto">
                <pre
                  className="whitespace-pre-wrap text-xs md:text-sm"
                  style={{ color: "black" }}
                >
                  {file.name}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Prompt Input */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4" style={{ color: "black" }}>
            AI Script Generation Prompt
          </h2>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ color: "black" }}
              >
                Script Title
              </label>
              <input
                type="text"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="Enter the script title"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                style={{ color: "black" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ color: "black" }}
                >
                  Number of People
                </label>
                <input
                  type="number"
                 className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                  placeholder="Enter number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  style={{ color: "black" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ color: "black" }}
                >
                  Number of Scenes
                </label>
                <input
                  type="number"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                  placeholder="Enter scenes"
                  value={numberOfScenes}
                  onChange={(e) => setNumberOfScenes(e.target.value)}
                  style={{ color: "black" }}
                />
              </div>
            </div>

            <Dropdown
              options={ScriptTypeOption}
              selectedOption={scriptType}
              setSelectedOption={setScriptType}
            />

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ color: "black" }}
              >
                Voice Type
              </label>
              <Dropdown
                options={VoiceTypeOption}
                selectedOption={voiceType}
                setSelectedOption={setVoiceType}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ color: "black" }}
              >
                Propmt Length
              </label>
              <Dropdown
                options={PromptLengthOption}
                selectedOption={promptLength}
                setSelectedOption={setPromptLength}
              />
            </div>

            {/* <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ color: "black" }}
              >
                Prompt Length
              </label>
              <select
                className="w-full border rounded-lg p-2 md:p-3 bg-white text-gray-700 text-sm"
                value={promptLength}
                onChange={(e) => setPromptLength(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div> */}

            <textarea
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
              placeholder="Enter your script generation prompt..."
              value={scriptPrompt}
              onChange={(e) => setScriptPrompt(e.target.value)}
              style={{ color: "black" }}
            />

<button
  onClick={handleGenerateScript}
  className="w-full px-4 py-2 bg-[#9B25A7] text-white rounded hover:bg-[#871f90] text-sm md:text-base"
>
  Generate Script
</button>

          </div>

          {/* Success Message Modal */}
          <Alert
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage("")}
          />

          {/* Error Message Modal */}
          <Alert
            message={errorMessage}
            type="error"
            onClose={() => setErrorMessage("")}
          />
        </div>
      </div>
    </div>
  );

  const renderModify = () => (
    <div className="px-4 min-h-[calc(100vh-100px)]"></div>
  );

  const renderHistory = () => (
    <div className="px-4 min-h-[calc(100vh-100px)]"></div>
  );
  // CopyButton component
  const CopyButton = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
      try {
        // Try the modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        }

        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          textArea.remove();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
          textArea.remove();
          throw new Error("Copy failed");
        }
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    };

    return (
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
        disabled={copied}
      >
        {copied ? (
          <>
            <Check size={16} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy Script
          </>
        )}
      </button>
    );
  };


  const ScriptTypeOption = [
    "Informative Type – Knowledge Sharing",
    "Storytelling Type – Emotional Narrative",
    "Q&A Type – Questions & Answers",
    "Review Type – Product Review",
    "Challenge Type – Experiment & Challenge",
    "Comedy Type – Humorous Content",
    "ASMR Type – Sensory Content",
    "Motivational Type – Inspirational Message",
  ];

  
  const VoiceTypeOption = [
    "Energetic & Enthusiastic",
    "Calm & Soothing",
    "Dramatic & Intense",
    "Conversational & Friendly",
    "Serious & Authoritative",
    "Whispery & ASMR",
    "Inspirational & Motivational",
    "Humorous & Playful",
    "Fast-paced & Urgent",
    "Narrative & Storytelling",
  ];
  
  const PromptLengthOption = ["Short", "Medium", "Long"]; 

  const Dropdown = ({ options, selectedOption, setSelectedOption }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    return (
      <div className="relative">
        <button
          className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{selectedOption || "Select Option"}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {dropdownOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {options.map((option) => (
              <div
                key={option}
                className="p-3 hover:bg-purple-100 text-sm cursor-pointer"
                onClick={() => {
                  setSelectedOption(option);
                  setDropdownOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <div className="flex justify-center px-4">
        <div className="bg-white rounded-[12px] w-full max-w-[900px] sm:w-[90%] md:w-[80%] lg:w-[70%] h-auto">
          {/* Responsive Button Group */}
          <ResponsiveTabs
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {currentView === "script" && renderNewScript()}
        {currentView === "manager" && <AudioManagerUI />} 
        {currentView === "voice" && <VoiceGenerator />} 
      </div>
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
      {/* Modal Header */}
      <div className="p-4 sm:p-6 border-b">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Generated Script:
        </h3>
      </div>

      {/* Modal Content */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3 h-[40vh] sm:h-[50vh] overflow-y-auto p-3 border rounded-lg bg-gray-50">
          {formatGeneratedScript(generatedScript)}
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="mt-4 px-2">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="p-4 sm:p-6 border-t bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <CopyButton textToCopy={generatedScript} />
            <button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Volume2 size={16} />
              {isGeneratingAudio ? "Generating..." : "Generate Audio"}
            </button>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Loading Notice */}
      {isGeneratingScript && (
  <Alert
    message="Generating script, please wait..."
    type="generating"
    onClose={handleCancelGeneration}
  />
)}
    </div>
  );
};

export default AudioScript;
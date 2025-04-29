import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import {
  FileText,
  Check,
  Copy,
  Volume2,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResponsiveTabs from "./ResponsiveTabs";
import AudioManagerUI from "./audio-manager-ui"; // Import the AudioManagerUI component
import VoiceGenerator from "./voice-generator"; // Import the VoiceGenerator component
import JSZip from "jszip"; // Import JSZip for extracting zip files
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AudioScript = () => {
  const [currentView, setCurrentView] = useState("script");
  const [scriptTitle, setScriptTitle] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptPrompt, setScriptPrompt] = useState("");
  const [scriptType, setScriptType] = useState("");
  const [voiceType, setVoiceType] = useState("");
  const [numberOfScenes, setNumberOfScenes] = useState("");
  const [promptLength, setPromptLength] = useState("Select Propmt Length"); // New state for prompt length
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
  const [zipUrl, setZipUrl] = useState(""); // Define zipUrl state
  const [isModalMinimized, setIsModalMinimized] = useState(false); // New state for modal minimization

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
      toast.error("Please fill in all required fields.");
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
      toast.success("Script generated successfully!");
      setErrorMessage("");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error("Error generating script:", error);
        toast.error(
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
      setZipUrl(""); // Clear previous zip URL

      const response = await axios.post(
        "http://192.168.1.71:8083/script_gen/generate-audio",
        {
          script: generatedScript,
          voiceType: voiceType,
        },
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "multipart/mixed",
          },
        }
      );

      // Get the content type and boundary
      const contentType = response.headers["content-type"];
      const boundary = contentType.split("boundary=")[1];

      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(response.data);

      // Find the start and end of each part
      const findPartBoundaries = (array, boundaryStr) => {
        const parts = [];
        const boundaryBytes = new TextEncoder().encode(`--${boundaryStr}`);

        let start = 0;
        while (start < array.length) {
          // Find the next boundary
          const boundaryIndex = array.findIndex(
            (val, idx) =>
              idx >= start &&
              array
                .slice(idx, idx + boundaryBytes.length)
                .every((b, i) => b === boundaryBytes[i])
          );

          if (boundaryIndex === -1) break;

          // Find the next boundary or the end of the array
          const nextBoundaryIndex = array.findIndex(
            (val, idx) =>
              idx > boundaryIndex &&
              array
                .slice(idx, idx + boundaryBytes.length)
                .every((b, i) => b === boundaryBytes[i])
          );

          parts.push({
            start: boundaryIndex,
            end: nextBoundaryIndex !== -1 ? nextBoundaryIndex : array.length,
          });

          start = boundaryIndex + boundaryBytes.length;
        }

        return parts;
      };

      // Get part boundaries
      const parts = findPartBoundaries(uint8Array, boundary);

      // Extract files
      let audioBlob = null;
      let zipBlob = null;

      parts.forEach((part) => {
        // Extract the part content
        const partContent = uint8Array.slice(part.start, part.end);
        const partText = new TextDecoder().decode(partContent);

        if (partText.includes('filename="generated_script.wav"')) {
          // Find the start of binary data
          const headerEnd = partContent.findIndex(
            (byte, i) =>
              partContent[i] === 13 &&
              partContent[i + 1] === 10 &&
              partContent[i + 2] === 13 &&
              partContent[i + 3] === 10
          );

          if (headerEnd !== -1) {
            const audioData = partContent.slice(headerEnd + 4);
            audioBlob = new Blob([audioData], { type: "audio/wav" });
          }
        }

        if (partText.includes('filename="audio_temp.zip"')) {
          // Find the start of binary data
          const headerEnd = partContent.findIndex(
            (byte, i) =>
              partContent[i] === 13 &&
              partContent[i + 1] === 10 &&
              partContent[i + 2] === 13 &&
              partContent[i + 3] === 10
          );

          if (headerEnd !== -1) {
            const zipData = partContent.slice(headerEnd + 4);
            zipBlob = new Blob([zipData], { type: "application/zip" });
          }
        }
      });

      // Create object URLs
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        console.log("Audio Blob Size:", audioBlob.size); // Log blob size for debugging
      }

      if (zipBlob) {
        const zipUrl = URL.createObjectURL(zipBlob);
        setZipUrl(zipUrl);
        console.log("Zip Blob Size:", zipBlob.size); // Log blob size for debugging
      }

      toast.success("Audio and zip files generated successfully!");
    } catch (error) {
      console.error("Error generating audio and zip files:", error);
      toast.error(
        "Failed to generate audio and zip files. Please try again."
      );
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleSendAudioToAPI = async () => {
    if (!zipUrl) {
      toast.error("No zip file available to process.");
      return;
    }

    try {
      // Fetch the zip file
      const response = await fetch(zipUrl);
      const zipBlob = await response.blob();

      // Extract files from the zip
      const zip = await JSZip.loadAsync(zipBlob);
      const audioFiles = [];

      for (const fileName of Object.keys(zip.files)) {
        const file = zip.files[fileName];
        if (!file.dir) {
          const fileContent = await file.async("base64");
          audioFiles.push({
            name: fileName,
            audioSrc: fileContent,
            category: "Introduction",
            speaker: "Person 1",
            type: "Dialog",
            volume: "90",
            fadeIn: "1",
            fadeOut: "1",
            voiceEnhance: "false",
            noiseReduction: "false",
          });
        }
      }

      // Retrieve email from localStorage
      const email = localStorage.getItem("userEmail");
      if (!email) {
        toast.error("No email found in localStorage.");
        return;
      }

      // Prepare payload
      const folderTitle = scriptTitle || "Untitled"; // Use scriptTitle or fallback to "Untitled"
      const payload = {
        email: email,
        title: folderTitle,
        audio: audioFiles, //[]
      };

      console.log("Payload before sending:", JSON.stringify(payload, null, 2)); // Detailed payload logging

      // Send to API
      try {
        const apiResponse = await axios.post(
          "http://192.168.1.141:3001/audio/addAudio",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10-second timeout
          }
        );

        console.log("Full API Response:", apiResponse);

        if (apiResponse.status === 200 || apiResponse.status === 201) {
          toast.success("Audio files successfully sent to the API.");
        } else {
          toast.error(`API responded with status: ${apiResponse.status}`);
        }
      } catch (apiError) {
        console.error("API Error Details:", {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          headers: apiError.response?.headers,
        });

        if (apiError.response) {
          // The request was made and the server responded with a status code
          toast.error(
            `Error sending to API: ${
              apiError.response.status
            } - ${JSON.stringify(apiError.response.data)}`
          );
        } else if (apiError.request) {
          // The request was made but no response was received
          toast.error("No response received from the API. Check network connection.");
        } else {
          // Something happened in setting up the request
          toast.error(`Error setting up API request: ${apiError.message}`);
        }
      }
    } catch (error) {
      console.error("Zip Processing Error:", error);
      toast.error(`Error processing zip file: ${error.message}`);
    }
  };

  const handleCancelGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsGeneratingScript(false);
      setAbortController(null);
      toast.info("Script generation canceled.");
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
            className="w-full h-32 md:h-40 border rounded-lg p-3 mb-4 border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
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
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
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
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
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
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
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

            <textarea
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
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
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setDropdownOpen(false); // Close dropdown
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{selectedOption || "Select Option"}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
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
                  setDropdownOpen(false); // Close dropdown on selection
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
        <div
          className={`fixed inset-0 flex items-center justify-centerbg-black/50 backdrop-blur-sm bg-opacity-50 p-2 sm:p-4 z-50 ${
            isModalMinimized ? "hidden" : ""
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-300 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-[#9B25A7]">
                Generated Script:
              </h3>
              <button
                onClick={() => setIsModalMinimized(true)} // Minimize the modal
                className="text-gray-500 hover:text-gray-700"
              >
                Minimize
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3 h-[40vh] sm:h-[50vh] overflow-y-auto p-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent">
                {formatGeneratedScript(generatedScript)}
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="mt-4 px-2">
                  <div className="bg-[#F4E3F8] border border-[#9B25A7] rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-[#9B25A7] rounded-full flex items-center justify-center text-white">
                        <Volume2 size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#9B25A7]">
                          Generated Audio
                        </p>
                      </div>
                    </div>
                    <audio
                      controls
                      className="w-full custom-audio-player rounded-md"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "0.375rem",
                        height: "36px",
                      }}
                    >
                      <source src={audioUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>00:00</span>
                      <span>Script Audio</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                {audioUrl && (
                  <a
                    href={audioUrl}
                    download="generated_script.wav"
                    className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors"
                  >
                    Download Audio
                  </a>
                )}
                {zipUrl && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={zipUrl}
                      download="audio_temp.zip"
                      className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors"
                    >
                      Download Zip
                    </a>
                    <button
                      onClick={handleSendAudioToAPI}
                      className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors"
                    >
                      Send to API
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-300 bg-white">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <CopyButton textToCopy={generatedScript} />
                  <button
                    onClick={handleGenerateAudio}
                    disabled={isGeneratingAudio}
                    className="w-full sm:w-auto px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors flex items-center justify-center gap-2 disabled:bg-[#E3C5F0]"
                  >
                    <Volume2 size={16} />
                    {isGeneratingAudio ? "Generating..." : "Generate Audio"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Button */}
      {isModalMinimized && (
        <button
          onClick={() => setIsModalMinimized(false)} // Reopen the modal
          className="fixed bottom-4 right-4 px-4 py-2 bg-[#9B25A7] text-white rounded-lg shadow-lg hover:bg-[#7A1C86] z-50"
        >
          Reopen Modal
        </button>
      )}

      {/* Loading Notice */}
      {isGeneratingScript && (
        toast.info("Generating script, please wait...")
      )}
      <ToastContainer />
    </div>
  );
};

export default AudioScript;

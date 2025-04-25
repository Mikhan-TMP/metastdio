import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Play,
  Pause,
  Smile,
  Frown,
  Meh,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sliders,
  Heart,
  Search,
  Filter,
  Copy,
  Trash2,
  Music,
  Camera,
  Clipboard,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

const AvatarGestureEmotionUI = () => {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [recentEmotion, setRecentEmotion] = useState(null); // Track the most recent emotion
  const [recentGesture, setRecentGesture] = useState(null); // Track the most recent gesture
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState("gestures");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState({
    front: null,
    back: null,
    side: null,
    close: null,
  });
  const [isGestureProcessing, setIsGestureProcessing] = useState(false);
  const [isEmotionProcessing, setIsEmotionProcessing] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [regenerateViewType, setRegenerateViewType] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [gestures, setGestures] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [isSequenceModalOpen, setIsSequenceModalOpen] = useState(false);
  const [effectsData, setEffectsData] = useState([]);
  const [isLoadingEffects, setIsLoadingEffects] = useState(false);
  const [selectedSequenceItems, setSelectedSequenceItems] = useState([]);
  const [sequenceName, setSequenceName] = useState("");
  const [selectedViews, setSelectedViews] = useState({});
  const [sequences, setSequences] = useState([]);
  const [sequenceSearch, setSequenceSearch] = useState("");

  // Add this function to filter sequences
  const filteredSequences = sequences.filter((sequence) =>
    sequence.sequenceName.toLowerCase().includes(sequenceSearch.toLowerCase())
  );

  const getUserEmail = () => {
    if (typeof window !== "undefined" && localStorage.getItem("userEmail")) {
      return localStorage.getItem("userEmail");
    }
    return "default@example.com";
  };

  const emotionCategories = [
    "All",
    "Positive",
    "Negative",
    "Neutral",
    "Reaction",
  ];
  const gestureCategories = [
    "All",
    "Greeting",
    "Reaction",
    "Direction",
    "Contemplative",
    "Presentation",
    "Stance",
    "Action",
  ];

  useEffect(() => {
    const fetchGesturesAndEmotions = async () => {
      try {
        const gesturesData = [
          {
            _id: "67ecb062a3754ed719f5ceb7",
            name: "wave",
            description: "A greeting or goodbye hand wave",
            emoji: "👋",
          },
          {
            _id: "67ecb062a3754ed719f5ceb8",
            name: "point",
            description: "Pointing with the index finger",
            emoji: "☝️",
          },
          {
            _id: "67ecb062a3754ed719f5ceb9",
            name: "clap",
            description: "Applauding by clapping hands",
            emoji: "👏",
          },
          {
            _id: "67ecb063a3754ed719f5ceba",
            name: "thumbs up",
            description: "Approval or agreement",
            emoji: "👍",
          },
          {
            _id: "67ecb063a3754ed719f5cebb",
            name: "handshake",
            description: "Shaking hands as a greeting",
            emoji: "🤝",
          },
          {
            _id: "67ecb063a3754ed719f5cebc",
            name: "thinking",
            description: "A thoughtful gesture",
            emoji: "🤔",
          },
          {
            _id: "67ecb063a3754ed719f5cebd",
            name: "explain",
            description: "Hand movements to explain something",
            emoji: "🗣️",
          },
          {
            _id: "67ecb063a3754ed719f5cebe",
            name: "arms crossed",
            description: "Crossing arms in confidence or defiance",
            emoji: "🙅",
          },
          {
            _id: "67ecb063a3754ed719f5cebf",
            name: "check watch",
            description: "Looking at the wristwatch",
            emoji: "⌚",
          },
          {
            _id: "67ecb064a3754ed719f5cec0",
            name: "nodding",
            description: "Nodding in agreement",
            emoji: "🙆",
          },
          {
            _id: "67ecb064a3754ed719f5cec1",
            name: "shrug",
            description: "Indicating uncertainty or indifference",
            emoji: "🤷",
          },
          {
            _id: "67ecb064a3754ed719f5cec2",
            name: "head tilt",
            description: "Tilting head in curiosity or confusion",
            emoji: "🤨",
          },
        ];

        const emotionsData = [
          {
            _id: "67ecb0e7a3754ed719f5cec3",
            name: "Happy",
            description: "A feeling of joy and positivity",
            emoji: "😊",
          },
          {
            _id: "67ecb0e7a3754ed719f5cec4",
            name: "Sad",
            description: "A feeling of sorrow or unhappiness",
            emoji: "😢",
          },
          {
            _id: "67ecb0e7a3754ed719f5cec5",
            name: "Surprised",
            description: "A sudden reaction of amazement or shock",
            emoji: "😲",
          },
          {
            _id: "67ecb0e7a3754ed719f5cec6",
            name: "Angry",
            description: "A strong feeling of displeasure or rage",
            emoji: "😠",
          },
          {
            _id: "67ecb0e8a3754ed719f5cec7",
            name: "Neutral",
            description: "A calm and indifferent expression",
            emoji: "😐",
          },
          {
            _id: "67ecb0e8a3754ed719f5cec8",
            name: "Excited",
            description: "A high-energy feeling of enthusiasm",
            emoji: "😃",
          },
          {
            _id: "67ecb0e8a3754ed719f5cec9",
            name: "Confused",
            description: "Uncertainty or lack of understanding",
            emoji: "😕",
          },
          {
            _id: "67ecb0e8a3754ed719f5ceca",
            name: "Concerned",
            description: "A feeling of worry or care",
            emoji: "😟",
          },
          {
            _id: "67ecb0e8a3754ed719f5cecb",
            name: "Confident",
            description: "A strong belief in oneself",
            emoji: "😎",
          },
          {
            _id: "67ecb0e8a3754ed719f5cecc",
            name: "Thoughtful",
            description: "A pensive or reflective mood",
            emoji: "🤔",
          },
        ];

        setGestures(
          gesturesData.map((gesture, index) => ({
            id: index + 1,
            name: gesture.name,
            thumbnail: gesture.emoji,
            category: "General",
            duration: 2.0,
          }))
        );

        setEmotions(
          emotionsData.map((emotion, index) => ({
            id: index + 1,
            name: emotion.name,
            intensity: 50,
            icon: emotion.emoji,
            category: "General",
          }))
        );
      } catch (error) {
        console.error("Error fetching gestures or emotions:", error);
      }
    };

    fetchGesturesAndEmotions();
  }, []);

  useEffect(() => {
    const fetchCameraViews = async () => {
      if (!selectedAvatar) return;

      try {
        const email = getUserEmail();
        const response = await axios.get(
          `http://192.168.1.141:3001/avatarfx/getAvatarBaseCameraViews`,
          {
            params: {
              email,
              avatarID: selectedAvatar.id,
            },
          }
        );

        const { cameraViews } = response.data || {};
        setGeneratedImages({
          front: cameraViews?.front?.src
            ? `http://192.168.1.141:3001${cameraViews.front.src}`
            : null,
          side: cameraViews?.side?.src
            ? `http://192.168.1.141:3001${cameraViews.side.src}`
            : null,
          back: cameraViews?.back?.src
            ? `http://192.168.1.141:3001${cameraViews.back.src}`
            : null,
          close: cameraViews?.close_up?.src
            ? `http://192.168.1.141:3001${cameraViews.close_up.src}`
            : null,
        });
      } catch (error) {
        console.error("Error fetching camera views:", error);
      }
    };

    fetchCameraViews();
  }, [selectedAvatar]);

  useEffect(() => {
    // Reset selected emotion and gesture when the active tab changes
    setSelectedEmotion(null);
    setSelectedGesture(null);
  }, [activeTab]);

  const fetchExistingEffects = async (type, name) => {
    if (!selectedAvatar) return null;

    try {
      const email = getUserEmail();
      const response = await axios.get(
        `http://192.168.1.141:3001/avatar-effects/getAllEffects`,
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      const effects = response.data || [];
      return effects.find(
        (effect) => effect.type === type && effect.name === name
      );
    } catch (error) {
      console.error("Error fetching existing effects:", error);
      return null;
    }
  };
  const fetchExistingEmotion = async (emotionName) => {
    if (!selectedAvatar) return null;

    try {
      const email = getUserEmail();
      const response = await axios.get(
        `http://192.168.1.141:3001/avatar-effects/getAllEffects`,
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      const effects = response.data || [];
      // Find the emotion with the required name and all image properties
      const matchingEmotion = effects.find(
        (effect) =>
          effect.Emotions &&
          effect.Emotions.some(
            (e) =>
              e.name === emotionName &&
              e.front &&
              e.side &&
              e.back &&
              e.close_up
          )
      );

      return matchingEmotion || null;
    } catch (error) {
      console.error("Error fetching existing emotion:", error);
      return null;
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGestureSelect = async (gesture) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    if (isEmotionProcessing || isGestureProcessing) {
      toast.info("Please wait for the current generation to complete.");
      return;
    }

    setSelectedGesture(gesture);

    try {
      const email = getUserEmail();
      const response = await axios.get(
        `http://192.168.1.141:3001/avatar-effects/getAllEffects`,
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      const effects = response.data || [];
      const existingGesture = effects.find(
        (effect) =>
          effect.Gestures &&
          effect.Gestures.some((g) => g.name === gesture.name)
      );

      if (existingGesture) {
        const gestureData = existingGesture.Gestures.find(
          (g) =>
            g.name === gesture.name && g.front && g.side && g.back && g.close_up
        );

        if (gestureData) {
          setGeneratedImages({
            front: `http://192.168.1.141:3001${gestureData.front}`,
            back: `http://192.168.1.141:3001${gestureData.back}`,
            side: `http://192.168.1.141:3001${gestureData.side}`,
            close: `http://192.168.1.141:3001${gestureData.close_up}`,
          });
          toast.info(`Gesture "${gesture.name}" is displayed.`);
          return;
        }
      }

      // If gesture is not found or double-clicked, generate it
      await generateGestureView(gesture);
    } catch (error) {
      console.error("Error fetching or generating gesture:", error);
      toast.error("Failed to process gesture. Please try again.");
    }
  };

  const handleEmotionSelect = async (emotion) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    if (isEmotionProcessing || isGestureProcessing) {
      toast.info("Please wait for the current generation to complete.");
      return;
    }

    setSelectedEmotion(emotion);

    try {
      const existingEmotion = await fetchExistingEmotion(emotion.name);

      if (existingEmotion) {
        const emotionData = existingEmotion.Emotions.find(
          (e) =>
            e.name === emotion.name && e.front && e.side && e.back && e.close_up
        );

        if (emotionData) {
          setGeneratedImages({
            front: `http://192.168.1.141:3001${emotionData.front}`,
            back: `http://192.168.1.141:3001${emotionData.back}`,
            side: `http://192.168.1.141:3001${emotionData.side}`,
            close: `http://192.168.1.141:3001${emotionData.close_up}`,
          });
          toast.info(`Emotion "${emotion.name}" is displayed.`);
          return;
        }
      }

      // If emotion is not found, generate it
      toast.info(`Emotion "${emotion.name}" not found. Generating now...`);
      await generateEmotionView(emotion);
    } catch (error) {
      console.error("Error fetching or generating emotion:", error);
      toast.error("Failed to process emotion. Please try again.");
    }
  };

  const fetchAvatars = async (selectedStyle = "", searchName = "") => {
    try {
      const email = getUserEmail();

      // Build params object with all filters
      const params = {
        email,
        ...(selectedStyle && selectedStyle !== "All"
          ? { style: selectedStyle.toLowerCase() }
          : {}),
        ...(searchName ? { name: searchName } : {}),
      };

      const response = await axios.get(
        `http://192.168.1.141:3001/avatar/getAvatars`,
        { params }
      );
      console.log("API Response:", response.data);

      const fetchedAvatars = response.data.map((avatar, index) => ({
        id: avatar.id || index,
        // Option 1: Store image URL directly if available
        imgSrc: `http://192.168.1.141:3001${avatar.imgSrc}`.replace(
          /([^:]\/)\/+/g,
          "$1"
        ),
        name: avatar.name || `Avatar ${index + 1}`,
        style: avatar.style,
      }));

      return fetchedAvatars;
    } catch (error) {
      console.error("Error fetching avatars:", error);
      return [];
    }
  };

  const generateAvatarView = async () => {
    if (!selectedAvatar) {
      toast.error(`Please select an avatar before proceeding.`);
      return;
    }

    // Close the modal
    setIsModalOpen(false);

    // Set generating state to true to disable the button
    setIsGenerating(true);

    // Show loading alert
    toast.info("Generating your avatar. This may take a few seconds...");

    try {
      const email = getUserEmail();

      // Fetch current views from the API to ensure all views are included
      let currentViews = { front: null, side: null, back: null, close: null };
      try {
        const response = await axios.get(
          "http://192.168.1.141:3001/avatarfx/getAvatarViews",
          {
            params: {
              email,
              avatarID: selectedAvatar.id,
            },
          }
        );

        const views = response.data?.cameraViews || {};
        currentViews = {
          front: views.front?.base64 || null,
          side: views.side?.base64 || null,
          back: views.back?.base64 || null,
          close: views.close_up?.base64 || null,
        };
      } catch (err) {
        console.warn("No existing views found or error fetching them:", err);
      }

      // Regenerate all views to ensure consistency
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { views } = response.data;
      const updatedViews = {
        front: views.front || currentViews.front,
        back: views.back || currentViews.back,
        side: views.side || currentViews.side,
        close: views.close || currentViews.close,
      };

      // Prepare payload for API
      const payload = {
        email,
        avatarID: selectedAvatar.id,
        cameraViews: {
          front: { base64: updatedViews.front },
          side: { base64: updatedViews.side },
          back: { base64: updatedViews.back },
          close_up: { base64: updatedViews.close },
        },
      };

      // Log payload for debugging
      console.log(
        "Payload being sent to API:",
        JSON.stringify(payload, null, 2)
      );

      // Send payload to API
      await axios.post(
        "http://192.168.1.141:3001/avatarfx/initializeAvatarFx",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update state with the generated images
      setGeneratedImages(updatedViews);

      toast.success(`Emotion generation completed successfully!`);
    } catch (error) {
      console.error("Error generating emotion:", error);
      toast.error(`Failed to generate avatar view. Please try again.`);
    } finally {
      // Re-enable the button regardless of success or failure
      setIsGenerating(false);
    }
  };

  const generateEmotionView = async (emotion) => {
    if (!selectedAvatar || isEmotionProcessing) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    setIsEmotionProcessing(true);

    toast.info(
      <div className="flex items-center">
        <RefreshCw className="animate-spin mr-2" />
        Applying {emotion.name} emotion to the avatar...
      </div>
    );

    try {
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("emotion", emotion.name);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/emotions",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { views } = response.data;

      // Process images before sending to the API
      const processedImages = {};
      for (const view of ["front", "back", "side", "close"]) {
        const base64 = views[view];
        if (base64) {
          const blob = base64ToBlob(base64);
          processedImages[view] = blob;
        }
      }

      // Save to API (database)
      const apiForm = new FormData();
      apiForm.append("email", getUserEmail());
      apiForm.append("name", selectedAvatar.name || "");
      apiForm.append("avatarId", selectedAvatar.id || "");
      apiForm.append("gestures", JSON.stringify([]));
      apiForm.append("emotions", JSON.stringify([{ name: emotion.name }]));
      for (const [view, blob] of Object.entries(processedImages)) {
        apiForm.append(
          `emotions_${emotion.name}_${view === "close" ? "close_up" : view}`,
          blob,
          `${view}.jpg`
        );
      }

      await axios.post("http://192.168.1.141:3001/avatar-effects", apiForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGeneratedImages({
        front: views.front || null,
        back: views.back || null,
        side: views.side || null,
        close: views.close || null,
      });

      toast.success(`${emotion.name} emotion applied and saved!`);
    } catch (error) {
      console.error("Error applying emotion:", error);
      toast.error(`Failed to apply ${emotion.name} emotion. Please try again.`);
    } finally {
      setIsEmotionProcessing(false);
    }
  };

  const generateGestureView = async (gesture) => {
    if (!selectedAvatar || isGestureProcessing) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    setIsGestureProcessing(true);

    toast.info(
      <div className="flex items-center">
        <RefreshCw className="animate-spin mr-2" />
        Applying {gesture.name} gesture to the avatar...
      </div>
    );

    try {
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("gesture", gesture.name);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/gesture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { views } = response.data;
      setGeneratedImages({
        front: views.front || null,
        back: views.back || null,
        side: views.side || null,
        close: views.close || null,
      });

      // Save to API (database)
      const apiForm = new FormData();
      apiForm.append("email", getUserEmail());
      apiForm.append("name", selectedAvatar.name || "");
      apiForm.append("avatarId", selectedAvatar.id || "");
      apiForm.append("gestures", JSON.stringify([{ name: gesture.name }]));
      apiForm.append("emotions", JSON.stringify([]));
      ["front", "back", "side", "close"].forEach((view) => {
        const base64 = views[view];
        if (base64) {
          const blob = base64ToBlob(base64);
          apiForm.append(
            `gestures_${gesture.name}_${view === "close" ? "close_up" : view}`,
            blob,
            `${view}.jpg`
          );
        }
      });

      await axios.post("http://192.168.1.141:3001/avatar-effects", apiForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${gesture.name} gesture applied and saved!`);
    } catch (error) {
      console.error("Error applying gesture:", error);
      toast.error(`Failed to apply ${gesture.name} gesture. Please try again.`);
    } finally {
      setIsGestureProcessing(false);
    }
  };

  const fetchImageAsBase64 = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error fetching image as Base64:", error);
      return null;
    }
  };

  const base64ToBlob = (base64, mime = "image/jpeg") => {
    if (!base64 || !base64.includes(",")) {
      console.error("Invalid Base64 string:", base64);
      return null;
    }

    try {
      const byteString = atob(base64.split(",")[1]); // Extract Base64 data after the comma
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mime });
    } catch (error) {
      console.error("Error decoding Base64 string:", error);
      return null;
    }
  };

  const convertToBase64 = async (imageUrl) => {
    if (!imageUrl) return null;

    // If already base64, return as is
    if (imageUrl.startsWith("data:image")) {
      return imageUrl;
    }

    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error("Error converting to base64:", error);
      return null;
    }
  };

  const regenerateAvatarView = async (view) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    if (isRegenerating) {
      toast.error("Another regeneration is already in progress.");
      return;
    }

    setIsRegenerating(true);
    setGeneratedImages((prev) => ({ ...prev, [view]: "loading" }));

    const email = getUserEmail();
    const avatarID = selectedAvatar.id;

    try {
      // Step 1: First fetch the current views from the API
      let currentViews;
      try {
        const response = await axios.get(
          "http://192.168.1.141:3001/avatarfx/getAvatarViews",
          {
            params: { email, avatarID },
          }
        );

        // Extract existing views, ensuring we preserve the base64 data
        currentViews = {
          front: response.data?.cameraViews?.front?.base64 || null,
          side: response.data?.cameraViews?.side?.base64 || null,
          back: response.data?.cameraViews?.back?.base64 || null,
          close_up: response.data?.cameraViews?.close_up?.base64 || null,
        };

        // Convert any non-base64 images to base64
        currentViews = {
          front: await convertToBase64(currentViews.front),
          side: await convertToBase64(currentViews.side),
          back: await convertToBase64(currentViews.back),
          close_up: await convertToBase64(currentViews.close_up),
        };
      } catch (err) {
        console.warn("Error fetching current views:", err);
        // If we can't fetch current views, use what's in the state and convert to base64
        currentViews = {
          front: await convertToBase64(generatedImages.front),
          side: await convertToBase64(generatedImages.side),
          back: await convertToBase64(generatedImages.back),
          close_up: await convertToBase64(generatedImages.close),
        };
      }

      // Step 2: Generate new image for the selected view
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("views", JSON.stringify([view]));

      const regenerateResponse = await axios.post(
        "http://192.168.1.71:8083/emotions_gen",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newGeneratedImage = regenerateResponse.data?.views?.[view];
      if (!newGeneratedImage) {
        throw new Error(`Failed to generate new image for ${view} view`);
      }

      // Convert new generated image to base64 if needed
      const newGeneratedBase64 = await convertToBase64(newGeneratedImage);

      // Step 3: Create updated views object with the new image
      const updatedViews = {
        ...currentViews,
        [view === "close" ? "close_up" : view]: newGeneratedBase64,
      };

      // Step 4: Send all views back to the API
      const payload = {
        email,
        avatarID,
        cameraViews: {
          front: { base64: updatedViews.front },
          side: { base64: updatedViews.side },
          back: { base64: updatedViews.back },
          close_up: { base64: updatedViews.close_up },
        },
      };

      // Send the complete payload to the API
      await axios.post(
        "http://192.168.1.141:3001/avatarfx/initializeAvatarFx",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Step 5: Update local state with new images
      setGeneratedImages({
        front: updatedViews.front,
        side: updatedViews.side,
        back: updatedViews.back,
        close: updatedViews.close_up, // Note: we map close_up to close in the state
      });

      toast.success(`${view} view regenerated and saved successfully!`);
    } catch (err) {
      console.error("Regeneration failed:", err);
      toast.error(`Error regenerating ${view}: ${err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const regenerateEmotion = async (view, emotionName) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    if (isRegenerating) {
      toast.error("Another regeneration is already in progress.");
      return;
    }

    setIsRegenerating(true);
    setGeneratedImages((prev) => ({
      ...prev,
      [view]: "loading",
    }));

    toast.info(`Regenerating ${view} view with emotion "${emotionName}"...`);

    try {
      const email = getUserEmail();
      const avatarID = selectedAvatar.id;

      // Step 1: Fetch the current views
      let currentViews = {
        front: generatedImages.front,
        side: generatedImages.side,
        back: generatedImages.back,
        close_up: generatedImages.close,
      };

      // Convert URLs to Base64 if needed
      for (const key of Object.keys(currentViews)) {
        if (currentViews[key] && !currentViews[key].startsWith("data:image")) {
          currentViews[key] = await fetchImageAsBase64(currentViews[key]);
        }
      }

      // Step 2: Regenerate the selected view
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("views", JSON.stringify([view]));
      formData.append("emotion", emotionName);

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/emotions",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newGeneratedImage = response.data?.views?.[view];
      if (!newGeneratedImage) {
        throw new Error(`Failed to generate new image for ${view} view`);
      }

      // Step 3: Update the views object with the newly regenerated image
      const updatedViews = {
        ...currentViews,
        [view === "close" ? "close_up" : view]: newGeneratedImage,
      };

      // Step 4: Send all views back to the API
      const apiForm = new FormData();
      apiForm.append("email", email);
      apiForm.append("name", selectedAvatar.name || "");
      apiForm.append("avatarId", avatarID);
      apiForm.append("gestures", JSON.stringify([]));
      apiForm.append("emotions", JSON.stringify([{ name: emotionName }]));

      for (const [key, value] of Object.entries(updatedViews)) {
        if (value) {
          const blob = base64ToBlob(value);
          if (blob) {
            apiForm.append(
              `emotions_${emotionName}_${
                key === "close_up" ? "close_up" : key
              }`,
              blob,
              `${key}.jpg`
            );
          }
        }
      }

      await axios.post("http://192.168.1.141:3001/avatar-effects", apiForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Step 5: Update the local state with the new images
      setGeneratedImages({
        front: updatedViews.front,
        side: updatedViews.side,
        back: updatedViews.back,
        close: updatedViews.close_up,
      });

      toast.success(
        `${view} view regenerated with emotion "${emotionName}" and saved successfully!`
      );
    } catch (error) {
      console.error(`Error regenerating ${view} view with emotion:`, error);
      toast.error(
        `Failed to regenerate ${view} view with emotion "${emotionName}". Please try again.`
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const regenerateGesture = async (view, gestureName) => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      return;
    }

    if (isRegenerating) {
      toast.error("Another regeneration is already in progress.");
      return;
    }

    setIsRegenerating(true);
    setGeneratedImages((prev) => ({
      ...prev,
      [view]: "loading",
    }));

    toast.info(`Regenerating ${view} view with gesture "${gestureName}"...`);

    try {
      const email = getUserEmail();
      const avatarID = selectedAvatar.id;

      // Step 1: Fetch the current views
      let currentViews = {
        front: generatedImages.front,
        side: generatedImages.side,
        back: generatedImages.back,
        close_up: generatedImages.close,
      };

      // Convert URLs to Base64 if needed
      for (const key of Object.keys(currentViews)) {
        if (currentViews[key] && !currentViews[key].startsWith("data:image")) {
          currentViews[key] = await fetchImageAsBase64(currentViews[key]);
        }
      }

      // Step 2: Regenerate the selected view
      const formData = new FormData();
      formData.append("file_path", selectedAvatar.imgSrc);
      formData.append("views", JSON.stringify([view]));
      formData.append("gesture", gestureName);

      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen/gesture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newGeneratedImage = response.data?.views?.[view];
      if (!newGeneratedImage) {
        throw new Error(`Failed to generate new image for ${view} view`);
      }

      // Step 3: Update the views object with the newly regenerated image
      const updatedViews = {
        ...currentViews,
        [view === "close" ? "close_up" : view]: newGeneratedImage,
      };

      // Step 4: Send all views back to the API
      const apiForm = new FormData();
      apiForm.append("email", email);
      apiForm.append("name", selectedAvatar.name || "");
      apiForm.append("avatarId", avatarID);
      apiForm.append("gestures", JSON.stringify([{ name: gestureName }]));
      apiForm.append("emotions", JSON.stringify([]));

      for (const [key, value] of Object.entries(updatedViews)) {
        if (value) {
          const blob = base64ToBlob(value);
          if (blob) {
            apiForm.append(
              `gestures_${gestureName}_${
                key === "close_up" ? "close_up" : key
              }`,
              blob,
              `${key}.jpg`
            );
          }
        }
      }

      await axios.post("http://192.168.1.141:3001/avatar-effects", apiForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Step 5: Update the local state with the new images
      setGeneratedImages({
        front: updatedViews.front,
        side: updatedViews.side,
        back: updatedViews.back,
        close: updatedViews.close_up,
      });

      toast.success(
        `${view} view regenerated with gesture "${gestureName}" and saved successfully!`
      );
    } catch (error) {
      console.error(`Error regenerating ${view} view with gesture:`, error);
      toast.error(
        `Failed to regenerate ${view} view with gesture "${gestureName}". Please try again.`
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const debugAvatarStorage = async () => {
    if (!selectedAvatar?.id) return;

    try {
      const email = getUserEmail();

      // Check what's currently stored in the API
      const response = await axios.get(
        `http://192.168.1.141:3001/avatarfx/getAvatarViews`,
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      console.log("Currently stored avatar views:", response.data);

      // Check what's in your current state
      console.log("Current state images:", generatedImages);
    } catch (error) {
      console.error("Debug error:", error);
    }
  };

  useEffect(() => {
    const loadInitialViews = async () => {
      if (!selectedAvatar?.id) return;

      try {
        const email = getUserEmail();

        const response = await axios.get(
          `http://192.168.1.141:3001/avatarfx/getAvatarViews`,
          {
            params: {
              email,
              avatarID: selectedAvatar.id,
            },
          }
        );

        if (response.data?.cameraViews) {
          const views = {
            front: response.data.cameraViews.front?.base64 || null,
            side: response.data.cameraViews.side?.base64 || null,
            back: response.data.cameraViews.back?.base64 || null,
            close: response.data.cameraViews.close_up?.base64 || null,
          };

          setGeneratedImages(views);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.warn("No initial views found for this avatar.");
        } else {
          console.error("Error loading initial views:", error);
        }
      }
    };

    loadInitialViews();
  }, [selectedAvatar?.id]);

  const handleRegenerateClick = (view) => {
    setRegenerateViewType(view);
    setIsRegenerateModalOpen(true);
  };

  const handleRegenerateOption = async (type) => {
    setIsRegenerateModalOpen(false);

    if (!regenerateViewType) {
      toast.error("Please select a camera view to regenerate.");
      return;
    }

    if (type === "camera") {
      await regenerateAvatarView(regenerateViewType); // Regenerate the selected camera view
    } else if (type === "gesture") {
      // Use the currently selected gesture for regeneration
      if (selectedGesture) {
        await regenerateGesture(regenerateViewType, selectedGesture.name);
      } else {
        toast.error("Please select a gesture to regenerate.");
      }
    } else if (type === "emotion") {
      // Use the currently selected emotion for regeneration
      if (selectedEmotion) {
        await regenerateEmotion(regenerateViewType, selectedEmotion.name);
      } else {
        toast.error("Please select an emotion to regenerate.");
      }
    }
  };

  const fetchGeneratedImages = async () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before proceeding.");
      console.error("No avatar selected");
      return;
    }

    try {
      // Convert base64 image to a Blob
      const base64Image = selectedAvatar.imgSrc.split("base64,")[1];
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Create FormData and append the file and views
      const formData = new FormData();
      formData.append("file", blob, `${selectedAvatar.name || "avatar"}.png`);
      formData.append(
        "views",
        JSON.stringify(["front", "side", "close", "back"])
      );

      // Send the file and views to the API
      const response = await axios.post(
        "http://192.168.1.71:8083/emotions_gen",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Emotion generation response:", response.data);

      // Update state with the generated images
      const { generated_image: base64Img } = response.data;
      if (base64Img) {
        setGeneratedImages({
          front: `${base64Img}`, // Assuming the API returns one image for simplicity
          back: `${base64Img}`,
          side: `${base64Img}`,
          close: `${base64Img}`,
        });
      } else {
        toast.error("No image generated. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching generated images:", error);
      toast.error("Failed to fetch generated images. Please try again.");
    }
  };

  // Reset selected gesture and emotion when the active tab changes
  useEffect(() => {
    setSelectedGesture(null);
    setSelectedEmotion(null);
  }, [activeTab]);

  // Reset selected gesture and emotion when the reset button is clicked
  const resetToDefaultViews = async () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar to reset.");
      return;
    }

    try {
      const email = getUserEmail();

      // Fetch the default camera views for the active avatar
      const response = await axios.get(
        "http://192.168.1.141:3001/avatarfx/getAvatarBaseCameraViews",
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      const { cameraViews } = response.data || {};

      // Update the state with the default camera views
      setGeneratedImages({
        front: cameraViews?.front?.src
          ? `http://192.168.1.141:3001${cameraViews.front.src}`
          : null,
        side: cameraViews?.side?.src
          ? `http://192.168.1.141:3001${cameraViews.side.src}`
          : null,
        back: cameraViews?.back?.src
          ? `http://192.168.1.141:3001${cameraViews.back.src}`
          : null,
        close: cameraViews?.close_up?.src
          ? `http://192.168.1.141:3001${cameraViews.close_up.src}`
          : null,
      });

      // Reset gesture and emotion
      setSelectedGesture(null);
      setSelectedEmotion(null);

      toast.success("Avatar views have been reset to the default state.");
    } catch (error) {
      console.error("Error resetting avatar views:", error);
      toast.error("Failed to reset avatar views. Please try again.");
    }
  };

  const filteredGestures =
    currentCategory === "all"
      ? gestures
      : gestures.filter((g) => g.category === currentCategory);

  const filteredEmotions =
    currentCategory === "all"
      ? emotions
      : emotions.filter((e) => e.category === currentCategory);

  const renderEmotion = (emotion) => (
    <div
      key={emotion.id}
      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
        selectedEmotion?.id === emotion.id
          ? "border-[#9B25A7] bg-[#F4E3F8]"
          : "border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50"
      }`}
      onClick={() => handleEmotionSelect(emotion)}
    >
      <div className="text-2xl text-center mb-2">
        {typeof emotion.icon === "string" ? emotion.icon : emotion.icon}
      </div>
      <div className="text-xs font-medium text-center truncate">
        {emotion.name}
      </div>
      <div
        className={`text-xs text-center mt-1 ${
          selectedEmotion?.id === emotion.id
            ? "text-[#9B25A7]"
            : "text-gray-500"
        }`}
      >
        Intensity: {emotion.intensity}%
      </div>
      {isEmotionProcessing && selectedEmotion?.id === emotion.id && (
        <div className="flex justify-center mt-2">
          <RefreshCw className="animate-spin text-[#9B25A7]" size={16} />
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        setIsLoading(true);
        const fetchedAvatars = await fetchAvatars(selectedStyle, searchName);
        setAvatars(fetchedAvatars);
      } catch (error) {
        console.error("Error loading avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatars();
  }, [selectedStyle, searchName]);

  const fetchEffects = async () => {
    if (!selectedAvatar) {
      console.error("No avatar selected. Cannot fetch effects.");
      return;
    }

    setIsLoadingEffects(true);
    try {
      const email = getUserEmail();
      const response = await axios.get(
        `http://192.168.1.141:3001/avatar-effects/getAllEffects`,
        {
          params: { email, avatarID: selectedAvatar.id },
        }
      );
      setEffectsData(response.data || []);
    } catch (error) {
      console.error("Error fetching effects:", error);
    } finally {
      setIsLoadingEffects(false);
    }
  };

  const openSequenceModal = () => {
    if (!selectedAvatar) {
      alert("Please select an avatar before proceeding.");
      return;
    }
    fetchEffects();
    setIsSequenceModalOpen(true);
  };

  const closeSequenceModal = () => {
    setIsSequenceModalOpen(false);
  };

  // Add these functions inside your component
  const isItemSelected = (id) => {
    return selectedSequenceItems.some((item) => item.id === id);
  };

  const handleItemSelection = (item, type) => {
    if (isItemSelected(item._id)) {
      // Remove item if already selected
      setSelectedSequenceItems((prev) => prev.filter((i) => i.id !== item._id));
      // Remove view selection for this item
      setSelectedViews((prev) => {
        const newViews = { ...prev };
        delete newViews[item._id];
        return newViews;
      });
    } else if (selectedSequenceItems.length < 3) {
      // Add item if limit not reached
      setSelectedSequenceItems((prev) => [
        ...prev,
        {
          id: item._id,
          actionName: item.name,
          type: type,
        },
      ]);
    }
  };

  const handleViewSelection = (itemId, view) => {
    setSelectedViews((prev) => ({
      ...prev,
      [itemId]: view,
    }));
  };

  const removeFromSequence = (itemId) => {
    setSelectedSequenceItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
    setSelectedViews((prev) => {
      const newViews = { ...prev };
      delete newViews[itemId];
      return newViews;
    });
  };

  const handleSaveSequence = async () => {
    if (!selectedAvatar || !sequenceName || selectedSequenceItems.length < 2) {
      toast.error(
        "Please select an avatar, enter a sequence name, and select at least 2 items"
      );
      return;
    }

    try {
      const payload = {
        email: getUserEmail(),
        avatarID: selectedAvatar.id,
        sequenceName: sequenceName,
        actions: selectedSequenceItems.map((item) => ({
          id: item.id,
          actionName: item.actionName,
          view: selectedViews[item.id] || "front",
        })),
      };

      await axios.post(
        "http://192.168.1.141:3001/sequences/addSequence",
        payload
      );

      toast.success("Sequence saved successfully!");
      setSequenceName("");
      setSelectedSequenceItems([]);
      setSelectedViews({});
      closeSequenceModal();

      // Refresh sequences after saving
      fetchSequences();
    } catch (error) {
      console.error("Error saving sequence:", error);
      toast.error("Failed to save sequence. Please try again.");
    }
  };

  const fetchSequences = async () => {
    if (!selectedAvatar) {
      return;
    }

    try {
      const email = getUserEmail();
      const response = await axios.get(
        `http://192.168.1.141:3001/sequences/getAllSequences`,
        {
          params: {
            email,
            avatarID: selectedAvatar.id,
          },
        }
      );

      // Combine all sequences from different objects
      const allSequences = response.data.reduce((acc, item) => {
        if (item.avatarSequence && Array.isArray(item.avatarSequence)) {
          return [...acc, ...item.avatarSequence];
        }
        return acc;
      }, []);

      setSequences(allSequences);
    } catch (error) {
      console.error("Error fetching sequences:", error);
      toast.error("Failed to load sequences");
    }
  };
  useEffect(() => {
    if (selectedAvatar) {
      fetchSequences();
    }
  }, [selectedAvatar]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Alert */}
      <ToastContainer
        postion="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Top Toolbar - Updated to match modal style */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <button className="p-2 border rounded-md hover:bg-gray-50 mr-2">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-semibold text-[#9B25A7]">
            Avatar Gesture & Emotion Editor
          </h1>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <Save size={16} />
          </button>
          <button className="p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors">
            Apply to Timeline
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 p-4">
        {/* Left Panel - Library - Updated to match modal style */}
        <div className="w-72 bg-white shadow rounded-lg mr-4 flex flex-col">
          {/* Library Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 ${
                activeTab === "gestures"
                  ? "bg-[#F4E3F8] text-[#9B25A7] font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("gestures")}
            >
              Gestures
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "emotions"
                  ? "bg-[#F4E3F8] text-[#9B25A7] font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("emotions")}
            >
              Emotions
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-3 border-b">
            <div className="flex mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white p-2 pl-8 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
                />
                <Search
                  size={16}
                  className="absolute left-2.5 top-2.5 text-gray-400"
                />
              </div>
              <button className="bg-gray-200 px-3 rounded-r-md border border-gray-300 border-l-0">
                <Filter size={16} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {(activeTab === "gestures"
                ? gestureCategories
                : emotionCategories
              ).map((category) => (
                <button
                  key={category}
                  className={`px-2 py-0.5 text-xs rounded-md ${
                    currentCategory === category
                      ? "bg-[#9B25A7] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentCategory(category)}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Library Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "gestures" && (
              <div className="grid grid-cols-2 gap-3">
                {filteredGestures.map((gesture) => (
                  <div
                    key={gesture.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedGesture?.id === gesture.id
                        ? "border-[#9B25A7] bg-[#F4E3F8]"
                        : "border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50"
                    }`}
                    onClick={() => handleGestureSelect(gesture)}
                  >
                    <div className="text-2xl text-center mb-2">
                      {gesture.thumbnail}
                    </div>
                    {!isGestureProcessing ||
                    selectedGesture?.id !== gesture.id ? (
                      <>
                        <div className="text-xs font-medium text-center truncate">
                          {gesture.name}
                        </div>
                        <div
                          className={`text-xs text-center flex items-center justify-center mt-1 ${
                            selectedGesture?.id === gesture.id
                              ? "text-[#9B25A7]"
                              : "text-gray-500"
                          }`}
                        >
                          <Clock size={10} className="mr-0.5" />{" "}
                          {gesture.duration}s
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center mt-2">
                        <RefreshCw
                          className="animate-spin text-[#9B25A7]"
                          size={16}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "emotions" && (
              <div className="grid grid-cols-2 gap-3">
                {filteredEmotions.map((emotion) => renderEmotion(emotion))}
              </div>
            )}
          </div>

          {/* Create New - Updated to match modal style */}
          <div className="p-3 border-t">
            <button className="w-full flex items-center justify-center p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors">
              <Plus size={16} className="mr-1" />
              {activeTab === "gestures"
                ? "New Gesture"
                : activeTab === "emotions"
                ? "New Emotion"
                : ""}
            </button>
          </div>
        </div>

        {/* Center - Preview and Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Area - Updated to match modal style */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex flex-1">
              {/* Combined Avatar Preview and Camera Views */}
              <div className="me-4 flex-1 bg-white shadow rounded-lg p-6 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-[#9B25A7] text-lg">
                    Avatar Preview & Camera Views
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors disabled:bg-[#E3C5F0]"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Avatar Preview
                    </button>
                    <button
                      className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center"
                      onClick={generateAvatarView}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw size={16} className="animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="mr-2" />
                          Generate Avatar View
                        </>
                      )}
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                      onClick={resetToDefaultViews}
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex space-x-6">
                  {/* Avatar Preview */}
                  <div className="w-1/3 bg-gray-100 rounded-lg flex items-center justify-center">
                    {selectedAvatar ? (
                      <img
                        src={selectedAvatar.imgSrc}
                        alt="Selected Avatar"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-500 text-center">
                        <p>No Avatar Selected</p>
                      </div>
                    )}
                  </div>

                  {/* Camera Views */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {["front", "side", "close", "back"].map((view) => (
                      <div
                        key={view}
                        className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center relative"
                      >
                        {generatedImages[view] === "loading" ? (
                          <div className="loader border-t-2 border-[#9B25A7] rounded-full w-6 h-6 animate-spin"></div>
                        ) : generatedImages[view] ? (
                          <>
                            <img
                              src={generatedImages[view]}
                              alt={`${view} View`}
                              className="w-5/6 h-5/6 object-contain rounded-lg mb-2"
                            />
                            <button
                              className="mt-2 px-3 py-1 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] text-sm"
                              onClick={() => handleRegenerateClick(view)}
                              disabled={isRegenerating}
                            >
                              Regenerate
                            </button>
                          </>
                        ) : (
                          <p className="text-gray-500">
                            {view.charAt(0).toUpperCase() + view.slice(1)} View
                          </p>
                        )}

                        {/* Modal confined to this div */}
                        {isRegenerateModalOpen &&
                          regenerateViewType === view && (
                            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                              <div className="bg-white rounded-lg shadow-lg p-4 w-64">
                                <h3 className="text-lg font-medium text-center mb-4">
                                  Choose Regenerate Option
                                </h3>
                                <div className="flex flex-col space-y-3">
                                  <button
                                    className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                                    onClick={() =>
                                      handleRegenerateOption("camera")
                                    }
                                  >
                                    Camera View
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                                    onClick={() =>
                                      handleRegenerateOption("gesture")
                                    }
                                  >
                                    Gestures
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                                    onClick={() =>
                                      handleRegenerateOption("emotion")
                                    }
                                  >
                                    Emotions
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    onClick={() =>
                                      setIsRegenerateModalOpen(false)
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Previews */}
              <div className="w-1/4 bg-white shadow rounded-lg p-6 flex flex-col">
                <h3 className="font-medium text-[#9B25A7] text-lg mb-4">
                  Video Previews
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[1].map((video, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-sm"
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">Video {index + 1}</p>
                      </div>
                      <button
                        className="mt-2 px-3 py-1 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] text-sm"
                        onClick={() => console.log(`Play Video ${index + 1}`)}
                      >
                        Play Video
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mt-4">
                  {/* Search bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search sequences..."
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9B25A7] focus:outline-none"
                      value={sequenceSearch}
                      onChange={(e) => setSequenceSearch(e.target.value)}
                    />
                    <Search
                      size={16}
                      className="absolute left-2.5 top-2.5 text-gray-400"
                    />
                  </div>

                  {/* Scrollable sequence list */}
                  <div className="max-h-[500px] overflow-y-auto pr-1 space-y-4">
                    {filteredSequences.map((sequence) => (
                      <div
                        key={sequence.id}
                        className="bg-white p-4 rounded-lg border border-gray-300 hover:border-[#9B25A7] hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium mb-2 flex items-center justify-between">
                          <span>{sequence.sequenceName}</span>
                          <div className="text-xs text-gray-500">
                            {sequence.actions.length} actions
                          </div>
                        </div>
                        <div className="flex mb-2 space-x-2 text-sm overflow-x-auto pb-2">
                          {sequence.actions.map((action, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 rounded-md text-xs whitespace-nowrap"
                            >
                              {action.actionName}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            onClick={() =>
                              console.log(
                                `Play sequence ${sequence.sequenceName}`
                              )
                            }
                          >
                            <Play size={16} />
                          </button>
                          <button
                            className="p-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86]"
                            onClick={() =>
                              console.log(
                                `Edit sequence ${sequence.sequenceName}`
                              )
                            }
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredSequences.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {sequences.length === 0 ? (
                          <>
                            <p>No sequences created yet</p>
                            <p className="text-sm mt-2">
                              Create a new sequence to get started
                            </p>
                          </>
                        ) : (
                          <p>No sequences match your search</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div>
                    {/* New Sequence Button */}
                    <button
                      className="w-full px-4 py-2 bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] transition-colors flex items-center justify-center"
                      onClick={openSequenceModal}
                    >
                      <Plus size={16} className="mr-2" />
                      New Sequence
                    </button>
                    {/* Sequence Modal */}

                    {isSequenceModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-6xl max-h-[90vh] overflow-hidden p-6 relative flex flex-col">
                          {/* Close Button */}
                          <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={closeSequenceModal}
                          >
                            ✕
                          </button>

                          {/* Modal Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[#9B25A7] font-bold text-xl">
                              Create New Sequence
                            </h3>
                            <div className="flex items-center space-x-4">
                              <input
                                type="text"
                                placeholder="Enter sequence name"
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9B25A7] focus:outline-none"
                                value={sequenceName}
                                onChange={(e) =>
                                  setSequenceName(e.target.value)
                                }
                              />
                              <button
                                className={`px-4 py-2 rounded-md ${
                                  selectedSequenceItems.length >= 2 &&
                                  sequenceName
                                    ? "bg-[#9B25A7] text-white hover:bg-[#7A1C86]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={handleSaveSequence}
                                disabled={
                                  selectedSequenceItems.length < 2 ||
                                  !sequenceName
                                }
                              >
                                Save Sequence
                              </button>
                            </div>
                          </div>

                          {/* Selected Items Preview */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Selected Items ({selectedSequenceItems.length}/3)
                            </h4>
                            <div className="flex gap-4">
                              {selectedSequenceItems.map((item, index) => (
                                <div key={index} className="relative">
                                  <div className="border border-[#9B25A7] rounded-md p-2 bg-[#F4E3F8]">
                                    <div className="text-sm font-medium">
                                      {item.actionName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {item.type === "emotion" ? "😊" : "👋"}{" "}
                                      {item.type}
                                    </div>
                                    <div className="text-xs text-[#9B25A7] mt-1">
                                      Selected view:{" "}
                                      {selectedViews[item.id] || "None"}
                                    </div>
                                  </div>
                                  <button
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    onClick={() => removeFromSequence(item.id)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Search Bar */}
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Search emotions or gestures..."
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9B25A7] focus:outline-none"
                              onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                setEffectsData((prevEffects) =>
                                  prevEffects.filter(
                                    (effect) =>
                                      effect.Emotions.some((emotion) =>
                                        emotion.name
                                          .toLowerCase()
                                          .includes(searchTerm)
                                      ) ||
                                      effect.Gestures.some((gesture) =>
                                        gesture.name
                                          .toLowerCase()
                                          .includes(searchTerm)
                                      )
                                  )
                                );
                              }}
                            />
                          </div>

                          {/* Content Scroll Area */}
                          <div className="flex-1 overflow-y-auto pr-1">
                            {isLoadingEffects ? (
                              <div className="flex items-center justify-center h-full">
                                <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {effectsData.map((effect) => (
                                  <div
                                    key={effect._id}
                                    className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    {effect.Emotions.length > 0 && (
                                      <div className="mb-4">
                                        <h5 className="text-sm font-semibold text-[#9B25A7] mb-2">
                                          Emotions
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                          {effect.Emotions.map((emotion) => (
                                            <div
                                              key={emotion.name}
                                              className={`border rounded-md p-2 ${
                                                isItemSelected(emotion._id)
                                                  ? "border-[#9B25A7] bg-[#F4E3F8]"
                                                  : "border-gray-300 hover:border-[#9B25A7] bg-gray-50"
                                              }`}
                                            >
                                              <div className="flex justify-between items-center mb-2">
                                                <h6 className="text-sm font-medium">
                                                  {emotion.name}
                                                </h6>
                                                <button
                                                  className={`px-2 py-1 rounded-md text-xs ${
                                                    isItemSelected(emotion._id)
                                                      ? "bg-[#9B25A7] text-white"
                                                      : "bg-gray-200 hover:bg-gray-300"
                                                  }`}
                                                  onClick={() =>
                                                    handleItemSelection(
                                                      emotion,
                                                      "emotion"
                                                    )
                                                  }
                                                  disabled={
                                                    selectedSequenceItems.length >=
                                                      3 &&
                                                    !isItemSelected(emotion._id)
                                                  }
                                                >
                                                  {isItemSelected(emotion._id)
                                                    ? "Selected"
                                                    : "Select"}
                                                </button>
                                              </div>

                                              {/* Image Grid */}
                                              <div className="grid grid-cols-2 gap-2">
                                                {[
                                                  "front",
                                                  "side",
                                                  "back",
                                                  "close_up",
                                                ].map(
                                                  (view) =>
                                                    emotion[view] && (
                                                      <div
                                                        key={view}
                                                        className="relative"
                                                      >
                                                        <div className="aspect-square w-full overflow-hidden rounded-md">
                                                          <img
                                                            src={`http://192.168.1.141:3001${emotion[view]}`}
                                                            alt={`${emotion.name} ${view}`}
                                                            className="w-full h-full object-cover"
                                                          />
                                                        </div>
                                                        {isItemSelected(
                                                          emotion._id
                                                        ) && (
                                                          <button
                                                            className={`absolute top-2 right-2 p-1 rounded-full ${
                                                              selectedViews[
                                                                emotion._id
                                                              ] === view
                                                                ? "bg-[#9B25A7] text-white"
                                                                : "bg-gray-200 bg-opacity-75"
                                                            }`}
                                                            onClick={() =>
                                                              handleViewSelection(
                                                                emotion._id,
                                                                view
                                                              )
                                                            }
                                                          >
                                                            <div className="w-4 h-4 flex items-center justify-center">
                                                              {selectedViews[
                                                                emotion._id
                                                              ] === view
                                                                ? "✓"
                                                                : ""}
                                                            </div>
                                                          </button>
                                                        )}
                                                        <div className="text-[10px] text-center mt-1 text-gray-600">
                                                          {view.replace(
                                                            "_",
                                                            " "
                                                          )}
                                                        </div>
                                                      </div>
                                                    )
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {effect.Gestures.length > 0 && (
                                      <div>
                                        <h5 className="text-sm font-semibold text-[#9B25A7] mb-2">
                                          Gestures
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                          {effect.Gestures.map((gesture) => (
                                            <div
                                              key={gesture.name}
                                              className={`border rounded-md p-2 ${
                                                isItemSelected(gesture._id)
                                                  ? "border-[#9B25A7] bg-[#F4E3F8]"
                                                  : "border-gray-300 hover:border-[#9B25A7] bg-gray-50"
                                              }`}
                                            >
                                              <div className="flex justify-between items-center mb-2">
                                                <h6 className="text-sm font-medium">
                                                  {gesture.name}
                                                </h6>
                                                <button
                                                  className={`px-2 py-1 rounded-md text-xs ${
                                                    isItemSelected(gesture._id)
                                                      ? "bg-[#9B25A7] text-white"
                                                      : "bg-gray-200 hover:bg-gray-300"
                                                  }`}
                                                  onClick={() =>
                                                    handleItemSelection(
                                                      gesture,
                                                      "gesture"
                                                    )
                                                  }
                                                  disabled={
                                                    selectedSequenceItems.length >=
                                                      3 &&
                                                    !isItemSelected(gesture._id)
                                                  }
                                                >
                                                  {isItemSelected(gesture._id)
                                                    ? "Selected"
                                                    : "Select"}
                                                </button>
                                              </div>

                                              {/* Image Grid */}
                                              <div className="grid grid-cols-2 gap-2">
                                                {[
                                                  "front",
                                                  "side",
                                                  "back",
                                                  "close_up",
                                                ].map(
                                                  (view) =>
                                                    gesture[view] && (
                                                      <div
                                                        key={view}
                                                        className="relative"
                                                      >
                                                        <div className="aspect-square w-full overflow-hidden rounded-md">
                                                          <img
                                                            src={`http://192.168.1.141:3001${gesture[view]}`}
                                                            alt={`${gesture.name} ${view}`}
                                                            className="w-full h-full object-cover"
                                                          />
                                                        </div>
                                                        {isItemSelected(
                                                          gesture._id
                                                        ) && (
                                                          <button
                                                            className={`absolute top-2 right-2 p-1 rounded-full ${
                                                              selectedViews[
                                                                gesture._id
                                                              ] === view
                                                                ? "bg-[#9B25A7] text-white"
                                                                : "bg-gray-200 bg-opacity-75"
                                                            }`}
                                                            onClick={() =>
                                                              handleViewSelection(
                                                                gesture._id,
                                                                view
                                                              )
                                                            }
                                                          >
                                                            <div className="w-4 h-4 flex items-center justify-center">
                                                              {selectedViews[
                                                                gesture._id
                                                              ] === view
                                                                ? "✓"
                                                                : ""}
                                                            </div>
                                                          </button>
                                                        )}
                                                        <div className="text-[10px] text-center mt-1 text-gray-600">
                                                          {view.replace(
                                                            "_",
                                                            " "
                                                          )}
                                                        </div>
                                                      </div>
                                                    )
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Original style kept for reference */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <div className="md:col-span-7 md:border-b-0 p-4 sm:p-6 flex flex-col h-full">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                  Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar Name
                    </label>
                    <input
                      type="text"
                      placeholder="Search Avatar Name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent focus:outline-none"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar Style
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#9B25A7] focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="Realistic">Realistic</option>
                      <option value="Cartoon">Cartoon</option>
                      <option value="Anime">Anime</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Surrealism">Surrealism</option>
                      <option value="Steampunk">Steampunk</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col min-h-fit">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h3 className="text-[#9B25A7] font-bold text-lg sm:text-xl">
                    My Avatars
                  </h3>
                </div>

                <div className="max-h-[600px] overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <RefreshCw className="w-8 h-8 text-[#9B25A7] animate-spin" />
                    </div>
                  ) : avatars.length > 0 ? (
                    <div className="h-[calc(100vh - 400px)] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {avatars.map((avatar) => (
                        <div
                          key={avatar.id}
                          className={`border ${
                            selectedAvatar?.id === avatar.id
                              ? "border-[#9B25A7] bg-[#F4E3F8]"
                              : "border-gray-300"
                          } rounded-lg p-3 cursor-pointer transition-all hover:shadow-md`}
                          onClick={() => setSelectedAvatar(avatar)}
                        >
                          <div className="flex justify-center items-center overflow-hidden rounded-lg mb-2">
                            <div className="w-auto max-w-[80px] md:max-w-[96px] lg:max-w-[112px] aspect-[9/16]">
                              <img
                                src={avatar.imgSrc}
                                alt={avatar.name}
                                className="w-full h-full object-contain rounded-lg"
                                onError={(e) => {
                                  console.error("Image load error:", {
                                    id: avatar.id,
                                    style: avatar.style,
                                    imgSrcStart:
                                      avatar.imgSrc?.substring(0, 50) + "...",
                                  });
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-avatar.png";
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-center text-sm font-medium truncate">
                            {avatar.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                        <Plus size={32} className="text-gray-300" />
                      </div>
                      <p className="text-lg font-medium mb-2">
                        No Avatars Available
                      </p>
                      <p className="text-sm text-center max-w-md">
                        {selectedStyle !== ""
                          ? `No avatars found in ${selectedStyle} style category. Try selecting a different style or create a new avatar.`
                          : "No avatars exist in your collection. Try generating one or import from your device."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGestureEmotionUI;

import React, { useState } from "react";
import {
  Plus,
  Edit,
  Save,
  Play,
  Download,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
// import SceneManagerSidePanel from "./SceneManagerSidePanel";

const Button = ({ children, variant = "primary", onClick }) => {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  const styles =
    variant === "outline"
      ? "border border-gray-300 hover:bg-gray-50"
      : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button className={`${baseStyles} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
};

const ProjectEditor = () => {
  const [selectedGeneration, setSelectedGeneration] = useState("ai");

  return (
    <div className="flex flex-col h-screen bg-transparent p-4 gap-4">
      {/* Top bar */}
      <div className="w-full h-[80px] bg-white rounded-lg shadow-md flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded hover:bg-gray-100">
            <Home size={20} color="#9B25A7" />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <ArrowLeft size={20} color="#9B25A7" />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <ArrowRight size={20} color="#9B25A7" />
          </button>
        </div>
        <h1 className="text-lg font-semibold"> Project Name</h1>

        <button className="bg-[#9B25A7] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Download size={20} color="white" />
          Export
        </button>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Side panel with Scene Manager */}
        <div className="w-1/4 bg-white rounded-[15px] shadow-md shrink-0 overflow-hidden">
          <SceneManagerSidePanel />
        </div>
    
        {/* Right content */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Main content */}
          <div className="flex-1 bg-white rounded-[15px] shadow-md overflow-auto p-4">
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Preview area - Select a scene to view details</p>
            </div>
          </div>

          {/* Bottom content */}
          <div className="h-[25%] bg-white rounded-[15px] shadow-md shrink-0 p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Timeline</h3>
              <div className="flex space-x-2">
                <button className="p-1 border rounded hover:bg-gray-50">
                  <Play size={16} />
                </button>
                <button className="p-1 border rounded hover:bg-gray-50">
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded h-4/5 flex items-center justify-center">
              <p className="text-sm text-gray-400">Timeline content will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// In actual implementation, this would be imported
// But for the demo, we're defining it in the same file
const SceneManagerSidePanel = () => {
  const [selectedScenes, setSelectedScenes] = useState([1]);
  const [expandedScenes, setExpandedScenes] = useState([0]);
  
  // Mock data
  const scenes = [
    { 
      id: 0, 
      name: "Opening", 
      duration: "00:15", 
      thumbnail: "🏙️",
      background: { image: "City.jpg", video: "CityTimelapseLoop.mp4" },
      avatar: { name: "Presenter", gesture: "Standing", emotion: "Professional" },
      audio: { 
        dialogues: ["Welcome to our presentation"],
        music: "Corporate-Intro.mp3",
        sfx: []
      },
      effects: ["Fade In", "Zoom Slow"]
    },
    { 
      id: 1, 
      name: "Introduction", 
      duration: "00:25", 
      thumbnail: "👋",
      background: { image: "OfficeSpace.jpg", video: "" },
      avatar: { name: "Presenter", gesture: "Wave", emotion: "Friendly" },
      audio: { 
        dialogues: ["Hello everyone", "Today we'll discuss..."],
        music: "Ambient-Loop.mp3",
        sfx: ["Notification"]
      },
      effects: ["Text Overlay", "Lower Third"]
    },
    { 
      id: 3, 
      name: "Interview", 
      duration: "00:35", 
      thumbnail: "🎤",
      background: { image: "InterviewSet.jpg", video: "" },
      avatar: { 
        name: ["Presenter", "Guest"], 
        gesture: ["Gesturing", "Nodding"], 
        emotion: ["Curious", "Excited"] 
      },
      audio: { 
        dialogues: ["Tell us about your experience", "Thank you for having me..."],
        music: "Soft-Background.mp3",
        sfx: ["Applause"]
      },
      effects: ["Split Screen", "Name Tag"]
    },
    { 
      id: 4, 
      name: "Main Point 2", 
      duration: "00:30", 
      thumbnail: "📊",
      background: { image: "Chart.jpg", video: "DataAnimation.mp4" },
      avatar: { name: "Presenter", gesture: "Explaining", emotion: "Enthusiastic" },
      audio: { 
        dialogues: ["Looking at these results", "We can conclude that..."],
        music: "Ambient-Loop.mp3",
        sfx: []
      },
      effects: ["Data Highlight", "Zoom In"]
    },
  ];
  
  const toggleSceneExpand = (id) => {
    if (expandedScenes.includes(id)) {
      setExpandedScenes(expandedScenes.filter(sceneId => sceneId !== id));
    } else {
      setExpandedScenes([...expandedScenes, id]);
    }
  };
  
  const toggleSceneSelect = (id) => {
    if (selectedScenes.includes(id)) {
      setSelectedScenes(selectedScenes.filter(sceneId => sceneId !== id));
    } else {
      setSelectedScenes([...selectedScenes, id]);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-sm font-semibold">Scene Manager</h2>
        <div className="flex space-x-1">
          <button className="p-1 border rounded hover:bg-gray-50">
            <Plus size={12} />
          </button>
          <button className="p-1 border rounded hover:bg-gray-50">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {/* Scene List */}
      <div className="flex-1 overflow-auto max-h-max-[700px]"> {/* Fixed height with scroll */}
        <div className="divide-y">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="border-b">
              {/* Scene Header Row */}
              <div
                className={`p-2 flex items-center ${
                  selectedScenes.includes(scene.id) ? "bg-blue-50" : ""
                } hover:bg-gray-50`}
                onClick={() => toggleSceneSelect(scene.id)}
              >
                <div className="w-6 text-center text-gray-500 text-xs">
                  {index + 1}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSceneExpand(scene.id);
                  }}
                  className="w-6 text-center text-gray-500"
                >
                  {expandedScenes.includes(scene.id) ? "▼" : "►"}
                </button>
                <div className="w-6 h-6 mr-2 flex items-center justify-center bg-gray-100 border rounded">
                  {scene.thumbnail}
                </div>
                <div className="flex-1 text-sm truncate">{scene.name}</div>
                <div className="text-xs text-gray-500 mr-2 flex items-center">
                  <Play size={10} className="mr-1" />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedScenes.includes(scene.id) && (
                <div className="bg-gray-50 p-2 text-xs">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Background */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1 flex items-center">
                        <div className="flex justify-between w-full">
                          <span>Background</span>
                          <span className="text-gray-500">{scene.duration}</span>
                        </div>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {scene.background.image && (
                          <div className="flex items-center bg-gray-50 border p-1 rounded">
                            <span className="text-blue-500 mr-1">🖼️</span>
                            <span className="truncate">{scene.background.image}</span>
                          </div>
                        )}
                        {scene.background.video && (
                          <div className="flex items-center bg-gray-50 border p-1 rounded">
                            <span className="text-red-500 mr-1">🎬</span>
                            <span className="truncate">{scene.background.video}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1">Avatar</h4>
                      <div className="bg-gray-50 border p-1 rounded">
                        <div className="flex justify-between">
                          <span>{scene.avatar.name}</span>
                          <span className="text-gray-500">{scene.avatar.emotion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Audio */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1">Audio</h4>
                      <div className="space-y-1">
                        {scene.audio.dialogues.map((dialogue, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border p-1 rounded truncate"
                          >
                            {dialogue}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1">Audio</h4>
                      <div className="space-y-1">
                        {scene.effects.map((effect, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border p-1 rounded truncate"
                          >
                            {effect}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-2 border-t mt-auto">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">2 Scenes • 00:40</span>
          <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
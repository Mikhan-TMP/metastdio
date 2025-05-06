import React, { useState } from "react";
import {
  Plus,
  File,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Settings,
  Edit,
  ChevronRight,
  Play,
  Check,
  X,
  Film,
  Image,
  Music,
  Volume,
  Type,
  Smile,
  Move,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface SceneManagerSidePanelProps {
  onSceneSelect: (scene: any) => void; // Update to pass full scene data
  activeSceneId: number | null;
}

const SceneManagerSidePanel = ({ onSceneSelect, activeSceneId }: SceneManagerSidePanelProps) => {
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
      avatar: {
        name: "Presenter",
        gesture: "Standing",
        emotion: "Professional",
      },
      audio: {
        dialogues: ["Welcome to our presentationnnnnnnnnnnnnnnnnnnnnn"],
        music: "Corporate-Intro.mp3",
        sfx: [],
      },
      effects: ["Fade In", "Zoom Slow"],
    },
  ];

  const toggleSceneExpand = (id) => {
    if (expandedScenes.includes(id)) {
      setExpandedScenes(expandedScenes.filter((sceneId) => sceneId !== id));
    } else {
      setExpandedScenes([...expandedScenes, id]);
    }
  };

  const toggleSceneSelect = (id) => {
    const selectedScene = scenes.find(scene => scene.id === id);
    if (selectedScene) {
      setSelectedScenes([id]);
      onSceneSelect(selectedScene);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-transparent flex items-center gap-48">
        <h2 className="text-lg font-semibold whitespace-nowrap">
          Scene Manager
        </h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white h-8 border border-gray-300 rounded px-2 py-1 pl-6 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#9B25A7]"
          />
          <Search size={12} className="absolute left-2 top-2.5 text-gray-500" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex space-x-1">
          <button className="px-2 py-1 w-32 bg-[#9B25A7] text-white rounded text-[14px] hover:bg-[#7A1C86] flex items-center justify-center">
            <Plus size={14} className="mr-1" /> New
          </button>
          <button className="px-2 py-1 w-32 bg-transparent text-[#9B25A7] hover:text-white border border-[#9b25A7] rounded text-[14px] hover:bg-[#9b25A7] flex items-center justify-center">
            <File size={12} className="mr-1" /> Template
          </button>
        </div>

        <div className="flex space-x-1">
          <button className="p-1 border rounded hover:bg-gray-50">
            <Copy size={12} />
          </button>
          <button className="p-1 border rounded hover:bg-gray-50">
            <Trash2 size={12} />
          </button>
          <button className="p-1 border rounded hover:bg-gray-50">
            <ArrowUp size={12} />
          </button>
          <button className="p-1 border rounded hover:bg-gray-50">
            <ArrowDown size={12} />
          </button>
        </div>
      </div>

      {/* Scene List */}
      <div className="flex flex-col h-full bg-white overflow-auto text-sm shadow-xs">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-medium text-lg">Scene Timeline</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#9B25A7] text-white text-xs font-medium rounded-md hover:bg-[#7A1C86] transition">
              <Plus size={14} className="inline mr-1" />
              Add Scene
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition">
              Reorder
            </button>
          </div>
        </div>

        <div className="divide-y p-4 space-y-3">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              {/* Scene Header Row */}
              <div
                className={`p-3 flex items-center rounded-t-xl ${
                  selectedScenes.includes(scene.id)
                    ? "bg-[#F8F2FF] border-l-4 border-l-[#9B25A7]"
                    : "border-l-4 border-l-transparent"
                } hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => toggleSceneSelect(scene.id)}
              >
                <div className="w-6 text-center text-gray-500 font-medium">
                  {index + 1}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSceneExpand(scene.id);
                  }}
                  className="w-6 text-center text-gray-400 hover:text-[#9B25A7]"
                >
                  {expandedScenes.includes(scene.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                <div className="w-8 h-8 mr-2 flex items-center justify-center bg-gray-100 border rounded overflow-hidden">
                  {scene.thumbnail}
                </div>
                <div className="flex-1 font-medium truncate">{scene.name}</div>
                <div className="text-xs text-gray-500 mr-3 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {scene.duration}
                </div>
                <div className="flex space-x-2">
                  <button className="p-1.5 bg-gray-50 border rounded-md hover:bg-gray-100 transition-colors">
                    <Play size={12} className="text-[#9B25A7]" />
                  </button>
                  <button className="p-1.5 bg-gray-50 border rounded-md hover:bg-gray-100 transition-colors">
                    <Edit size={12} className="text-[#9B25A7]" />
                  </button>
                  <button className="p-1.5 bg-gray-50 border rounded-md hover:bg-gray-100 transition-colors">
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedScenes.includes(scene.id) && (
                <div className="bg-[#F8F2FF] p-4 text-xs rounded-b-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Background Card */}
                    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium mb-3 flex items-center text-[#9B25A7]">
                        <Image size={14} className="mr-1.5" />
                        Background
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 mb-3 text-center">
                        {scene.background.image ? (
                          <div className="flex items-center">
                            <Image size={12} className="mr-2 text-[#9B25A7]" />
                            <span className="truncate text-gray-700">
                              {scene.background.image}
                            </span>
                            <button className="ml-auto text-red-500 text-xs">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload
                              className="mx-auto mb-2 text-gray-400"
                              size={24}
                            />
                            <p className="text-gray-500 text-xs">
                              Drag & drop background image here
                            </p>
                            <label className="px-3 py-1 mt-2 inline-block bg-[#9B25A7] text-white rounded-md hover:bg-[#7A1C86] text-xs cursor-pointer">
                              Browse Files
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                              />
                            </label>
                          </>
                        )}
                      </div>

                      {scene.background.video && (
                        <div className="flex items-center bg-gray-50 border border-gray-300 p-2 rounded-md justify-between">
                          <div className="flex items-center">
                            <Film size={12} className="mr-2 text-[#9B25A7]" />
                            <span className="truncate text-gray-700">
                              {scene.background.video}
                            </span>
                          </div>
                          <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                            <Play size={10} className="text-[#9B25A7]" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Avatar Card */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium mb-3 flex items-center text-[#9B25A7]">
                        <Smile size={14} className="mr-1.5" />
                        Avatar
                      </h4>
                      <div className="bg-gray-50 border border-gray-300 p-3 rounded-lg">
                        <div className="font-medium text-gray-700">
                          {scene.avatar.name}
                        </div>
                        <div className="mt-3 text-gray-600 text-xs flex flex-wrap gap-2">
                          <span className="bg-white px-3 py-1 rounded-full border">
                            Gesture: {scene.avatar.gesture}
                          </span>
                          <span className="bg-white px-3 py-1 rounded-full border">
                            Emotion: {scene.avatar.emotion}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="w-full px-3 py-1.5 border border-[#9B25A7] text-[#9B25A7] rounded-md hover:bg-[#F8F2FF] text-xs transition-colors">
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    {/* Audio Card */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium mb-3 flex items-center text-[#9B25A7]">
                        <Volume size={14} className="mr-1.5" />
                        Audio
                      </h4>

                      <div className="space-y-2">
                        {scene.audio.dialogues.map((dialogue, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border border-gray-300 p-2 rounded-md flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <Volume
                                size={12}
                                className="mr-2 text-[#9B25A7]"
                              />
                              <span className="text-gray-700 truncate max-w-[140px] overflow-hidden whitespace-nowrap">
                                {dialogue}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                                <Play size={10} className="text-[#9B25A7]" />
                              </button>
                              <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                                <Edit size={10} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="bg-gray-50 border border-gray-300 p-2 rounded-md flex justify-between items-center">
                          <div className="flex items-center">
                            <Music size={12} className="mr-2 text-[#9B25A7]" />
                            <span className="truncate max-w-full text-gray-700">
                              {scene.audio.music}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                              <Play size={10} className="text-[#9B25A7]" />
                            </button>
                            <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                              <Edit size={10} className="text-gray-500" />
                            </button>
                          </div>
                        </div>

                        {scene.audio.sfx.map((sfx, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border p-2 rounded-md flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <Volume
                                size={12}
                                className="mr-2 text-[#9B25A7]"
                              />
                              <span className="truncate max-w-full text-gray-700">
                                {sfx}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                                <Play size={10} className="text-[#9B25A7]" />
                              </button>
                              <button className="p-1 bg-white border rounded-md hover:bg-gray-50">
                                <Edit size={10} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className="w-full mt-3 px-3 py-1.5 border border-[#9B25A7] text-[#9B25A7] rounded-md hover:bg-[#F8F2FF] text-xs transition-colors">
                        <Plus size={12} className="inline mr-1" />
                        Add Audio
                      </button>
                    </div>

                    {/* Effects Card */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium mb-3 flex items-center text-[#9B25A7]">
                        <Type size={14} className="mr-1.5" />
                        Effects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scene.effects.map((effect, idx) => (
                          <div
                            key={idx}
                            className="bg-[#F8F2FF] text-[#9B25A7] border px-3 py-1 rounded-md flex items-center"
                          >
                            {effect}
                            <button className="ml-2 text-gray-400 hover:text-red-500">
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button className="w-full mt-3 px-3 py-1.5 border border-[#9B25A7] text-[#9B25A7] rounded-md hover:bg-[#F8F2FF] text-xs transition-colors">
                        <Plus size={12} className="inline mr-1" />
                        Add Effect
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

     
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Total: 2 Scenes • 00:40</span>
          <button className="px-2 py-1 bg-[#9b25a7] text-white rounded text-xs hover:bg-blue-600">
            <Play size={10} className="mr-1 inline" /> Play All
          </button>
        </div>

        {selectedScenes.length === 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="flex items-center mb-1">
              <div className="w-5 h-5 flex items-center justify-center bg-gray-100 border rounded mr-1">
                {scenes.find((s) => s.id === selectedScenes[0])?.thumbnail}
              </div>
              <div className="text-xs font-medium">
                {scenes.find((s) => s.id === selectedScenes[0])?.name}
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">
                {scenes.find((s) => s.id === selectedScenes[0])?.duration}
              </span>
              <button className="text-blue-600 hover:underline">
                Edit in Timeline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneManagerSidePanel;

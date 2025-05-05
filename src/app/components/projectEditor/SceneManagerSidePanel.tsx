import React, { useState } from 'react';
import { 
  Plus, File, Trash2, Copy, ArrowUp, ArrowDown, Settings, Edit,
  ChevronRight, Play, Check, X, Film, Image, Music, Volume, Type,
  Smile, Move, Clock, Search, Filter
} from 'lucide-react';

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
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white border rounded px-2 py-1 pl-6 text-xs w-24"
            />
            <Search size={12} className="absolute left-2 top-1.5 text-gray-500" />
          </div>
          <button className="p-1 border rounded hover:bg-gray-50">
            <Filter size={12} />
          </button>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-white p-2 border-b flex justify-between items-center">
        <div className="flex space-x-1">
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center">
            <Plus size={12} className="mr-1" /> New
          </button>
          <button className="px-2 py-1 border rounded text-xs hover:bg-gray-50">
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
      <div className="flex-1 overflow-auto">
        <div className="divide-y">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="border-b">
              {/* Scene Header Row */}
              <div 
                className={`p-2 flex items-center ${selectedScenes.includes(scene.id) ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                onClick={() => toggleSceneSelect(scene.id)}
              >
                <div className="w-6 text-center text-gray-500 text-xs">{index + 1}</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSceneExpand(scene.id);
                  }}
                  className="w-6 text-center text-gray-500"
                >
                  {expandedScenes.includes(scene.id) ? '▼' : '►'}
                </button>
                <div className="w-6 h-6 mr-2 flex items-center justify-center bg-gray-100 border rounded">
                  {scene.thumbnail}
                </div>
                <div className="flex-1 text-sm truncate">{scene.name}</div>
                <div className="text-xs text-gray-500 mr-2 flex items-center">
                  <Clock size={10} className="mr-1" />
                  {scene.duration}
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 border rounded hover:bg-gray-50">
                    <Play size={10} />
                  </button>
                  <button className="p-1 border rounded hover:bg-gray-50">
                    <Edit size={10} />
                  </button>
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedScenes.includes(scene.id) && (
                <div className="bg-gray-50 p-2 text-xs">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Background */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1 flex items-center">
                        <Image size={10} className="mr-1 text-blue-500" />
                        Background
                      </h4>
                      <div className="grid grid-cols-2 gap-1">
                        {scene.background.image && (
                          <div className="flex items-center bg-gray-50 border p-1 rounded">
                            <Image size={10} className="mr-1 text-blue-500" />
                            <span className="truncate">{scene.background.image}</span>
                          </div>
                        )}
                        {scene.background.video && (
                          <div className="flex items-center bg-gray-50 border p-1 rounded">
                            <Film size={10} className="mr-1 text-red-500" />
                            <span className="truncate">{scene.background.video}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Avatar */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1 flex items-center">
                        <Smile size={10} className="mr-1 text-green-500" />
                        Avatar
                      </h4>
                      <div className="bg-gray-50 border p-1 rounded">
                        <div className="font-medium">{scene.avatar.name}</div>
                        <div className="mt-1 text-gray-500 text-xs flex flex-wrap gap-2">
                          <span>Gesture: {scene.avatar.gesture}</span>
                          <span>Emotion: {scene.avatar.emotion}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Audio */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1 flex items-center">
                        <Volume size={10} className="mr-1 text-purple-500" />
                        Audio
                      </h4>
                      {scene.audio.dialogues.map((dialogue, idx) => (
                        <div key={idx} className="bg-gray-50 border p-1 rounded mb-1 flex justify-between">
                          <div className="flex items-center">
                            <Volume size={10} className="mr-1 text-green-500" />
                            <span className="truncate max-w-full">{dialogue}</span>
                          </div>
                          <button className="p-0.5 border rounded hover:bg-gray-100">
                            <Play size={8} />
                          </button>
                        </div>
                      ))}
                      
                      <div className="bg-gray-50 border p-1 rounded mb-1 flex justify-between">
                        <div className="flex items-center">
                          <Music size={10} className="mr-1 text-purple-500" />
                          <span className="truncate max-w-full">{scene.audio.music}</span>
                        </div>
                        <button className="p-0.5 border rounded hover:bg-gray-100">
                          <Play size={8} />
                        </button>
                      </div>
                      
                      {scene.audio.sfx.map((sfx, idx) => (
                        <div key={idx} className="bg-gray-50 border p-1 rounded flex justify-between">
                          <div className="flex items-center">
                            <Volume size={10} className="mr-1 text-yellow-500" />
                            <span className="truncate max-w-full">{sfx}</span>
                          </div>
                          <button className="p-0.5 border rounded hover:bg-gray-100">
                            <Play size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Effects */}
                    <div className="bg-white border rounded p-2">
                      <h4 className="font-medium mb-1 flex items-center">
                        <Type size={10} className="mr-1 text-red-500" />
                        Effects
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {scene.effects.map((effect, idx) => (
                          <div key={idx} className="bg-gray-50 border px-2 py-0.5 rounded">
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Total: 2 Scenes • 00:40</span>
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
            <Play size={10} className="mr-1 inline" /> Play All
          </button>
        </div>
        
        {selectedScenes.length === 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="flex items-center mb-1">
              <div className="w-5 h-5 flex items-center justify-center bg-gray-100 border rounded mr-1">
                {scenes.find(s => s.id === selectedScenes[0])?.thumbnail}
              </div>
              <div className="text-xs font-medium">
                {scenes.find(s => s.id === selectedScenes[0])?.name}
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{scenes.find(s => s.id === selectedScenes[0])?.duration}</span>
              <button className="text-blue-600 hover:underline">Edit in Timeline</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneManagerSidePanel;
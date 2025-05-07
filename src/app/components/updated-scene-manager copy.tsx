import React, { useState } from 'react';
import { 
  Plus, File, Trash2, Copy, ArrowUp, ArrowDown, Settings, Edit,
  ChevronRight, Play, Check, X, Film, Image, Music, Volume, Type,
  Smile, Move, Clock, Search, Filter
} from 'lucide-react';

const SceneManagerUI = () => {
  const [selectedScenes, setSelectedScenes] = useState([1]);
  const [expandedScenes, setExpandedScenes] = useState([0, 1]);
  
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
      id: 2, 
      name: "Main Point 1", 
      duration: "00:40", 
      thumbnail: "🔍",
      background: { image: "DataBackground.jpg", video: "" },
      avatar: { name: "Presenter", gesture: "Pointing", emotion: "Confident" },
      audio: { 
        dialogues: ["Let's look at the first point", "As you can see..."],
        music: "Ambient-Loop.mp3",
        sfx: []
      },
      effects: ["Chart Animation", "Highlight"]
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
    { 
      id: 5, 
      name: "Conclusion", 
      duration: "00:20", 
      thumbnail: "✨",
      background: { image: "Summary.jpg", video: "" },
      avatar: { name: "Presenter", gesture: "Open Arms", emotion: "Satisfied" },
      audio: { 
        dialogues: ["In conclusion", "Thank you for watching"],
        music: "Corporate-Outro.mp3",
        sfx: ["Chime"]
      },
      effects: ["Fade Out", "Text Animation"]
    }
  ];
  
  // const toggleSceneExpand = (id) => {
  //   if (expandedScenes.includes(id)) {
  //     setExpandedScenes(expandedScenes.filter(sceneId => sceneId !== id));
  //   } else {
  //     setExpandedScenes([...expandedScenes, id]);
  //   }
  // };
  
  // const toggleSceneSelect = (id) => {
  //   if (selectedScenes.includes(id)) {
  //     setSelectedScenes(selectedScenes.filter(sceneId => sceneId !== id));
  //   } else {
  //     setSelectedScenes([...selectedScenes, id]);
  //   }
  // };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-white shadow-sm p-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Scene Manager</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search scenes..." 
              className="bg-white border rounded px-3 py-1 pl-8 text-sm"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
          </div>
          <button className="p-1 border rounded hover:bg-gray-50">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-4">
        {/* Scene List */}
        <div className="w-3/4 bg-white shadow rounded mr-4 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white p-2 border-b flex justify-between items-center">
            <div className="flex space-x-1">
              <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
                <Plus size={16} className="mr-1" /> New Scene
              </button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50 flex items-center">
                <File size={16} className="mr-1" /> Template
              </button>
            </div>
            
            <div className="flex space-x-1">
              <button className="px-2 py-1 border rounded hover:bg-gray-50 flex items-center">
                <Copy size={16} className="mr-1" /> Duplicate
              </button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50 flex items-center">
                <Trash2 size={16} className="mr-1" /> Delete
              </button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50">
                <ArrowUp size={16} />
              </button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50">
                <ArrowDown size={16} />
              </button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50">
                <Settings size={16} />
              </button>
            </div>
          </div>
          
          {/* Scene List Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2 w-10">
                    <input type="checkbox" className="rounded border" />
                  </th>
                  <th className="px-3 py-2 w-10">#</th>
                  <th className="px-3 py-2 w-10"></th>
                  <th className="px-3 py-2">Scene Name</th>
                  <th className="px-3 py-2 w-24">Duration</th>
                  <th className="px-3 py-2 w-48">Background</th>
                  <th className="px-3 py-2 w-32">Avatar</th>
                  <th className="px-3 py-2 w-32">Audio</th>
                  <th className="px-3 py-2 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scenes.map((scene, index) => (
                  <React.Fragment key={scene.id}>
                    <tr className={`border-b ${selectedScenes.includes(scene.id) ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                      <td className="px-3 py-2">
                        <input 
                          type="checkbox" 
                          className="rounded border" 
                          checked={selectedScenes.includes(scene.id)} 
                          onChange={() => toggleSceneSelect(scene.id)}
                        />
                      </td>
                      <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                      <td className="px-3 py-2">
                        <button 
                          onClick={() => toggleSceneExpand(scene.id)}
                          className="text-lg text-gray-500"
                        >
                          {expandedScenes.includes(scene.id) ? '▼' : '►'}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2 flex items-center justify-center bg-gray-100 border rounded">
                            {scene.thumbnail}
                          </div>
                          <div>{scene.name}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1 text-gray-500" />
                          {scene.duration}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          {scene.background.image && (
                            <div className="flex items-center mr-2 bg-gray-100 border px-1.5 py-0.5 rounded text-xs">
                              <Image size={12} className="mr-1 text-blue-500" />
                              {scene.background.image}
                            </div>
                          )}
                          {scene.background.video && (
                            <div className="flex items-center bg-gray-100 border px-1.5 py-0.5 rounded text-xs">
                              <Film size={12} className="mr-1 text-red-500" />
                              {scene.background.video}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center bg-gray-100 border px-1.5 py-0.5 rounded text-xs">
                          <Smile size={12} className="mr-1 text-green-500" />
                          {typeof scene.avatar.name === 'string' ? scene.avatar.name : `${scene.avatar.name.length} Avatars`}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="bg-gray-100 border w-6 h-6 rounded flex items-center justify-center text-xs">
                            <Volume size={12} className="text-green-500" />
                          </div>
                          <div className="bg-gray-100 border w-6 h-6 rounded flex items-center justify-center text-xs">
                            <Music size={12} className="text-purple-500" />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex space-x-1">
                          <button className="p-1 border rounded hover:bg-gray-50">
                            <Play size={14} />
                          </button>
                          <button className="p-1 border rounded hover:bg-gray-50">
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    {expandedScenes.includes(scene.id) && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={9} className="px-3 py-3">
                          <div className="ml-10 grid grid-cols-3 gap-4">
                            {/* Background Details */}
                            <div className="bg-white shadow-sm rounded p-3">
                              <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Image size={14} className="mr-1.5 text-blue-500" />
                                Background Assets
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-gray-100 border p-2 rounded">
                                  <div className="flex items-center">
                                    <Image size={14} className="mr-1.5 text-blue-500" />
                                    <span className="text-sm">{scene.background.image || "No image"}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center bg-gray-100 border p-2 rounded">
                                  <div className="flex items-center">
                                    <Film size={14} className="mr-1.5 text-red-500" />
                                    <span className="text-sm">{scene.background.video || "No video"}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Avatar Details */}
                            <div className="bg-white shadow-sm rounded p-3">
                              <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Smile size={14} className="mr-1.5 text-green-500" />
                                Avatar Configuration
                              </h3>
                              
                              {typeof scene.avatar.name === 'string' ? (
                                <div className="flex justify-between items-start bg-gray-100 border p-2 rounded">
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <span className="text-sm font-medium">{scene.avatar.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Gesture: {scene.avatar.gesture}<br />
                                      Emotion: {scene.avatar.emotion}
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {scene.avatar.name.map((name, idx) => (
                                    <div key={idx} className="flex justify-between items-start bg-gray-100 border p-2 rounded">
                                      <div>
                                        <div className="flex items-center mb-1">
                                          <span className="text-sm font-medium">{name}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Gesture: {scene.avatar.gesture[idx]}<br />
                                          Emotion: {scene.avatar.emotion[idx]}
                                        </div>
                                      </div>
                                      <div className="flex space-x-1">
                                        <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                          <Edit size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Audio Details */}
                            <div className="bg-white shadow-sm rounded p-3">
                              <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Volume size={14} className="mr-1.5 text-purple-500" />
                                Audio Elements
                              </h3>
                              
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Dialogues</div>
                                  {scene.audio.dialogues.map((dialogue, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-gray-100 border p-2 rounded mb-1">
                                      <div className="flex items-center">
                                        <Volume size={14} className="mr-1.5 text-green-500" />
                                        <span className="text-sm truncate max-w-xs">{dialogue}</span>
                                      </div>
                                      <div className="flex space-x-1">
                                        <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                          <Play size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Music</div>
                                  <div className="flex justify-between items-center bg-gray-100 border p-2 rounded">
                                    <div className="flex items-center">
                                      <Music size={14} className="mr-1.5 text-purple-500" />
                                      <span className="text-sm">{scene.audio.music}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                        <Play size={12} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                {scene.audio.sfx.length > 0 && (
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">Sound Effects</div>
                                    {scene.audio.sfx.map((sfx, idx) => (
                                      <div key={idx} className="flex justify-between items-center bg-gray-100 border p-2 rounded">
                                        <div className="flex items-center">
                                          <Volume size={14} className="mr-1.5 text-yellow-500" />
                                          <span className="text-sm">{sfx}</span>
                                        </div>
                                        <div className="flex space-x-1">
                                          <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                            <Play size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Effects and Text Overlays */}
                            <div className="bg-white shadow-sm rounded p-3">
                              <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Type size={14} className="mr-1.5 text-red-500" />
                                Effects & Text
                              </h3>
                              
                              <div className="space-y-1">
                                {scene.effects.map((effect, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-gray-100 border p-2 rounded">
                                    <div className="flex items-center">
                                      <span className="text-sm">{effect}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button className="p-1 border rounded hover:bg-gray-50 text-xs">
                                        <Edit size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="w-1/4 bg-white shadow rounded flex flex-col">
          <div className="p-3 border-b font-medium">
            Scene Preview
          </div>
          
          <div className="flex-1 p-3 flex flex-col">
            <div className="bg-gray-800 aspect-video rounded mb-3 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl mb-2">📹</div>
                <div className="text-sm text-gray-400">Select a scene to preview</div>
              </div>
            </div>
            
            <div className="border rounded p-3 flex-1">
              <h3 className="text-sm font-medium mb-2">Scene Details</h3>
              
              {selectedScenes.length === 1 ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 flex items-center justify-center bg-gray-100 border rounded">
                      {scenes.find(s => s.id === selectedScenes[0])?.thumbnail}
                    </div>
                    <div className="text-lg font-medium">
                      {scenes.find(s => s.id === selectedScenes[0])?.name}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-100 border p-2 rounded">
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {scenes.find(s => s.id === selectedScenes[0])?.duration}
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 border p-2 rounded">
                      <div className="text-xs text-gray-500">Assets</div>
                      <div className="flex space-x-1">
                        <div className="flex items-center">
                          <Image size={14} className="mr-1 text-blue-500" />
                          <span className="text-sm">1</span>
                        </div>
                        <div className="flex items-center">
                          <Film size={14} className="mr-1 text-red-500" />
                          <span className="text-sm">1</span>
                        </div>
                        <div className="flex items-center">
                          <Volume size={14} className="mr-1 text-green-500" />
                          <span className="text-sm">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
                    <Play size={16} className="mr-2" /> Play Scene
                  </button>
                  
                  <button className="w-full border p-2 rounded hover:bg-gray-50 flex items-center justify-center">
                    <Edit size={16} className="mr-2" /> Edit in Timeline
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {selectedScenes.length === 0 
                    ? "No scene selected" 
                    : `${selectedScenes.length} scenes selected`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Toolbar */}
      <div className="bg-white shadow-sm border-t p-2 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          6 Scenes • Total Duration: 02:45
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 flex items-center">
            <X size={16} className="mr-1" /> Cancel
          </button>
          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center">
            <Check size={16} className="mr-1" /> Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneManagerUI;

import React, { useState } from 'react';
import { 
  Play, Pause, Smile, Frown, Meh, 
  ChevronRight, ChevronDown, Plus, Minus,
  Save, ArrowLeft, ArrowRight, Clock, Sliders,
  Heart, Search, Filter, Copy, Trash2, Music,
  Camera, Clipboard, Upload, Download, RefreshCw
} from 'lucide-react';

const AvatarGestureEmotionUI = () => {
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState('gestures');
  const [currentCategory, setCurrentCategory] = useState('all');
  
  // Mock data
  const gestures = [
    { id: 1, name: "Wave", thumbnail: "👋", category: "Greeting", duration: 2.5 },
    { id: 2, name: "Point", thumbnail: "👉", category: "Direction", duration: 1.8 },
    { id: 3, name: "Clap", thumbnail: "👏", category: "Reaction", duration: 2.0 },
    { id: 4, name: "Thumbs Up", thumbnail: "👍", category: "Reaction", duration: 1.5 },
    { id: 5, name: "Handshake", thumbnail: "🤝", category: "Greeting", duration: 3.0 },
    { id: 6, name: "Thinking", thumbnail: "🤔", category: "Contemplative", duration: 2.2 },
    { id: 7, name: "Explain", thumbnail: "🙌", category: "Presentation", duration: 2.8 },
    { id: 8, name: "Arms Crossed", thumbnail: "🧍", category: "Stance", duration: 1.5 },
    { id: 9, name: "Check Watch", thumbnail: "⌚", category: "Action", duration: 1.7 },
    { id: 10, name: "Nodding", thumbnail: "🙂", category: "Reaction", duration: 1.2 },
    { id: 11, name: "Shrug", thumbnail: "🤷", category: "Reaction", duration: 1.5 },
    { id: 12, name: "Head Tilt", thumbnail: "😌", category: "Contemplative", duration: 1.3 }
  ];
  
  const emotions = [
    { id: 1, name: "Happy", intensity: 80, icon: <Smile size={20} />, category: "Positive" },
    { id: 2, name: "Sad", intensity: 60, icon: <Frown size={20} />, category: "Negative" },
    { id: 3, name: "Surprised", intensity: 70, icon: "😮", category: "Reaction" },
    { id: 4, name: "Angry", intensity: 90, icon: "😠", category: "Negative" },
    { id: 5, name: "Neutral", intensity: 50, icon: <Meh size={20} />, category: "Neutral" },
    { id: 6, name: "Excited", intensity: 85, icon: "😃", category: "Positive" },
    { id: 7, name: "Confused", intensity: 65, icon: "😕", category: "Reaction" },
    { id: 8, name: "Concerned", intensity: 75, icon: "😟", category: "Negative" },
    { id: 9, name: "Confident", intensity: 90, icon: "😎", category: "Positive" },
    { id: 10, name: "Thoughtful", intensity: 60, icon: "🤔", category: "Neutral" },
  ];
  
  const avatars = [
    { id: 1, name: "Business Man", thumbnail: "👨‍💼" },
    { id: 2, name: "Business Woman", thumbnail: "👩‍💼" },
    { id: 3, name: "Casual Man", thumbnail: "🧑" },
    { id: 4, name: "Casual Woman", thumbnail: "👩" },
    { id: 5, name: "Doctor", thumbnail: "👨‍⚕️" },
    { id: 6, name: "Teacher", thumbnail: "👩‍🏫" }
  ];
  
  const emotionCategories = ["all", "Positive", "Negative", "Neutral", "Reaction"];
  const gestureCategories = ["all", "Greeting", "Reaction", "Direction", "Contemplative", "Presentation", "Stance", "Action"];
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleGestureSelect = (gesture) => {
    setSelectedGesture(gesture);
  };
  
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };
  
  const filteredGestures = currentCategory === 'all' 
    ? gestures 
    : gestures.filter(g => g.category === currentCategory);
    
  const filteredEmotions = currentCategory === 'all' 
    ? emotions 
    : emotions.filter(e => e.category === currentCategory);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Toolbar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <button className="p-2 border rounded hover:bg-gray-50 mr-2">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-semibold">Avatar Gesture & Emotion Editor</h1>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 border rounded hover:bg-gray-50">
            <Save size={16} />
          </button>
          <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Apply to Timeline
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-4">
        {/* Left Panel - Library */}
        <div className="w-72 bg-white shadow rounded mr-4 flex flex-col">
          {/* Library Tabs */}
          <div className="flex border-b">
            <button 
              className={`flex-1 py-2 ${activeTab === 'gestures' ? 'bg-gray-100 text-blue-500 font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('gestures')}
            >
              Gestures
            </button>
            <button 
              className={`flex-1 py-2 ${activeTab === 'emotions' ? 'bg-gray-100 text-blue-500 font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('emotions')}
            >
              Emotions
            </button>
            <button 
              className={`flex-1 py-2 ${activeTab === 'sequences' ? 'bg-gray-100 text-blue-500 font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('sequences')}
            >
              Sequences
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="p-2 border-b">
            <div className="flex mb-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-white p-1.5 pl-8 rounded-l border"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              <button className="bg-gray-200 px-2 rounded-r border">
                <Filter size={16} />
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {(activeTab === 'gestures' ? gestureCategories : emotionCategories).map(category => (
                <button 
                  key={category}
                  className={`px-2 py-0.5 text-xs rounded ${currentCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => setCurrentCategory(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Library Content */}
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'gestures' && (
              <div className="grid grid-cols-2 gap-2">
                {filteredGestures.map(gesture => (
                  <div 
                    key={gesture.id}
                    className={`p-2 rounded cursor-pointer transition-colors border ${selectedGesture?.id === gesture.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                    onClick={() => handleGestureSelect(gesture)}
                  >
                    <div className="text-2xl text-center mb-1">{gesture.thumbnail}</div>
                    <div className="text-xs text-center truncate">{gesture.name}</div>
                    <div className={`text-xs text-center flex items-center justify-center ${selectedGesture?.id === gesture.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      <Clock size={10} className="mr-0.5" /> {gesture.duration}s
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'emotions' && (
              <div className="grid grid-cols-2 gap-2">
                {filteredEmotions.map(emotion => (
                  <div 
                    key={emotion.id}
                    className={`p-2 rounded cursor-pointer transition-colors border ${selectedEmotion?.id === emotion.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                    onClick={() => handleEmotionSelect(emotion)}
                  >
                    <div className="text-2xl text-center mb-1">
                      {typeof emotion.icon === 'string' ? emotion.icon : emotion.icon}
                    </div>
                    <div className="text-xs text-center truncate">{emotion.name}</div>
                    <div className={`text-xs text-center ${selectedEmotion?.id === emotion.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      Intensity: {emotion.intensity}%
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'sequences' && (
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>Greeting Sequence</span>
                    <div className="text-xs text-gray-500">4.5s</div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex space-x-1 text-sm">
                      <span>👋</span>
                      <span>→</span>
                      <span>😃</span>
                      <span>→</span>
                      <span>🤝</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-2 rounded border">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>Presentation Start</span>
                    <div className="text-xs text-gray-500">6.2s</div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex space-x-1 text-sm">
                      <span>🙌</span>
                      <span>→</span>
                      <span>😎</span>
                      <span>→</span>
                      <span>👉</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-2 rounded border">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>Active Listening</span>
                    <div className="text-xs text-gray-500">3.8s</div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex space-x-1 text-sm">
                      <span>🙂</span>
                      <span>→</span>
                      <span>🤔</span>
                      <span>→</span>
                      <span>😌</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Play size={12} />
                    </button>
                    <button className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Create New */}
          <div className="p-2 border-t">
            <button className="w-full flex items-center justify-center p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
              <Plus size={16} className="mr-1" /> 
              {activeTab === 'gestures' ? 'New Gesture' : 
               activeTab === 'emotions' ? 'New Emotion' : 'New Sequence'}
            </button>
          </div>
        </div>
        
        {/* Center - Preview and Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Avatar Selection */}
          <div className="p-3 bg-white shadow rounded mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium mr-3">Avatar:</span>
              <select className="bg-white border rounded p-1.5">
                {avatars.map(avatar => (
                  <option key={avatar.id} value={avatar.id}>
                    {avatar.thumbnail} {avatar.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1.5 border rounded hover:bg-gray-50 flex items-center">
                <Camera size={16} className="mr-1" /> Capture
              </button>
              <button className="p-1.5 border rounded hover:bg-gray-50 flex items-center">
                <RefreshCw size={16} className="mr-1" /> Reset
              </button>
            </div>
          </div>
          
          {/* Preview Area */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 flex">
              {/* 3D Avatar Preview */}
              <div className="w-2/3 bg-white shadow rounded-l flex items-center justify-center mr-4">
                <div className="relative">
                  {/* Avatar placeholder */}
                  <div className="w-48 h-72 bg-gray-100 rounded-lg relative flex items-center justify-center">
                    <div className="text-6xl mb-10">
                      <img src= "https://neuroflash.com/wp-content/uploads/2022/12/feature-image-ai-avatar-maker.png" alt="Jini" className="w-100 h-100 mx-auto mb-2" />
                      
                    </div>
                    
                    {/* Gesture/Emotion indicators */}
                    {selectedGesture && (
                      <div className="absolute left-0 right-0 bottom-0 bg-blue-500 text-white text-center py-1 text-sm rounded-b-lg">
                        {selectedGesture.name}
                      </div>
                    )}
                    
                    {selectedEmotion && (
                      <div className="absolute left-0 right-0 top-4 text-center">
                        <div className="text-3xl">
                          {typeof selectedEmotion.icon === 'string' ? selectedEmotion.icon : selectedEmotion.icon}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Camera Views */}
              <div className="w-1/3 p-3 bg-white shadow rounded flex flex-col">
                <h3 className="font-medium mb-3">Camera Views</h3>
                <div className="grid grid-cols-2 gap-2 mb-auto">
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Front View
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Side View
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Face Close-up
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs">
                    Full Body
                  </div>
                </div>
                
                {/* Playback Controls */}
                <div className="mt-3 p-2 bg-gray-100 rounded">
                  <div className="flex justify-center space-x-3 mb-2">
                    <button className="p-1.5 border rounded hover:bg-gray-50">
                      <ArrowLeft size={16} />
                    </button>
                    <button 
                      className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600" 
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-1.5 border rounded hover:bg-gray-50">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="text-center text-sm">
                    00:00:02.500 / 00:00:05.000
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="h-40 mt-4 bg-white shadow rounded flex flex-col">
              <div className="p-2 flex justify-between items-center border-b">
                <div className="font-medium">Animation Timeline</div>
                <div className="flex space-x-2">
                  <button className="p-1 border rounded hover:bg-gray-50">
                    <Copy size={14} />
                  </button>
                  <button className="p-1 border rounded hover:bg-gray-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative">
                {/* Time markers */}
                <div className="h-6 flex">
                  <div className="w-24 bg-gray-100 border-r flex items-center justify-center text-xs text-gray-500">
                    Properties
                  </div>
                  <div className="flex-1 relative">
                    {[0, 1, 2, 3, 4, 5].map((second) => (
                      <div 
                        key={second}
                        className="absolute top-0 bottom-0 flex flex-col items-center"
                        style={{ left: `${second * 20}%` }}
                      >
                        <div className="h-2 w-px bg-gray-300"></div>
                        <div className="text-xs text-gray-500">{second}s</div>
                      </div>
                    ))}
                    
                    {/* Playhead */}
                    <div 
                      className="absolute top-0 bottom-0 w-px bg-red-500 z-10" 
                      style={{ left: '50%' }}
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5"></div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline tracks */}
                <div className="flex-1 overflow-y-auto">
                  {/* Gesture Track */}
                  <div className="flex h-10 border-b">
                    <div className="w-24 bg-gray-100 flex items-center px-2 text-xs">
                      Gesture
                    </div>
                    <div className="flex-1 bg-gray-50 relative">
                      {selectedGesture && (
                        <div className="absolute top-1 left-[10%] h-8 w-32 bg-yellow-100 border border-yellow-400 rounded flex items-center justify-center text-xs">
                          {selectedGesture.thumbnail} {selectedGesture.name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Emotion Track */}
                  <div className="flex h-10 border-b">
                    <div className="w-24 bg-gray-100 flex items-center px-2 text-xs">
                      Emotion
                    </div>
                    <div className="flex-1 bg-gray-50 relative">
                      {/* Emotion keyframes */}
                      <svg className="absolute inset-0 w-full h-full">
                        <path 
                          d="M0,20 C50,5 100,25 150,10 C200,15 250,5 300,20" 
                          stroke="#8B5CF6" 
                          fill="none" 
                          strokeWidth="2"
                        />
                      </svg>
                      
                      <div className="absolute top-3 left-[0%] w-4 h-4 bg-purple-500 rounded-full -ml-2"></div>
                      <div className="absolute top-3 left-[25%] w-4 h-4 bg-purple-500 rounded-full -ml-2"></div>
                      <div className="absolute top-3 left-[50%] w-4 h-4 bg-purple-500 rounded-full -ml-2"></div>
                      <div className="absolute top-3 left-[75%] w-4 h-4 bg-purple-500 rounded-full -ml-2"></div>
                    </div>
                  </div>
                  
                  {/* Lip Sync Track */}
                  <div className="flex h-10 border-b">
                    <div className="w-24 bg-gray-100 flex items-center px-2 text-xs">
                      Lip Sync
                    </div>
                    <div className="flex-1 bg-gray-50 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                        <Music size={12} className="mr-1" /> No audio selected
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera Track */}
                  <div className="flex h-10 border-b">
                    <div className="w-24 bg-gray-100 flex items-center px-2 text-xs">
                      Camera
                    </div>
                    <div className="flex-1 bg-gray-50 relative">
                      <div className="absolute top-1 left-[5%] h-8 w-24 bg-blue-100 border border-blue-400 rounded flex items-center justify-center text-xs">
                        Front View
                      </div>
                      <div className="absolute top-1 left-[50%] h-8 w-24 bg-blue-100 border border-blue-400 rounded flex items-center justify-center text-xs">
                        Close-up
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Properties */}
        <div className="w-72 bg-white shadow rounded ml-4 flex flex-col">
          <div className="p-3 border-b font-semibold">
            Properties
          </div>
          
          {/* Gesture Properties (if gesture selected) */}
          {selectedGesture && (
            <div className="p-3 border-b">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Gesture: {selectedGesture.name}</h3>
                <span className="text-2xl">{selectedGesture.thumbnail}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Duration</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      className="flex-1 mr-2" 
                      min="0.5" 
                      max="5" 
                      step="0.1" 
                      defaultValue={selectedGesture.duration}
                    />
                    <span className="text-sm w-10 text-right">{selectedGesture.duration}s</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Intensity</label>
                  <input 
                    type="range" 
                    className="w-full" 
                    min="0" 
                    max="100" 
                    step="5" 
                    defaultValue="75" 
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Subtle</span>
                    <span>Medium</span>
                    <span>Strong</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Speed</label>
                  <div className="flex bg-gray-100 rounded border">
                    <button className="flex-1 p-1 text-center text-xs rounded-l hover:bg-gray-200">
                      Slow
                    </button>
                    <button className="flex-1 p-1 text-center text-xs bg-blue-500 text-white hover:bg-blue-600">
                      Normal
                    </button>
                    <button className="flex-1 p-1 text-center text-xs rounded-r hover:bg-gray-200">
                      Fast
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Loop</label>
                  <select className="w-full bg-white p-1.5 rounded border text-sm">
                    <option>No loop</option>
                    <option>Loop twice</option>
                    <option>Loop 3 times</option>
                    <option>Continuous loop</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                  <input 
                    type="text" 
                    className="w-full bg-white p-1.5 rounded border text-sm"
                    value="00:00:01.500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Emotion Properties (if emotion selected) */}
          {selectedEmotion && (
            <div className="p-3 border-b">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Emotion: {selectedEmotion.name}</h3>
                <span className="text-2xl">
                  {typeof selectedEmotion.icon === 'string' ? selectedEmotion.icon : selectedEmotion.icon}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Intensity</label>
                  <input 
                    type="range" 
                    className="w-full" 
                    min="0" 
                    max="100" 
                    step="5" 
                    defaultValue={selectedEmotion.intensity} 
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Subtle</span>
                    <span>Medium</span>
                    <span>Strong</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Eyes</label>
                    <input 
                      type="range" 
                      className="w-full" 
                      min="-100" 
                      max="100" 
                      step="10" 
                      defaultValue="0" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Brows</label>
                    <input 
                      type="range" 
                      className="w-full" 
                      min="-100" 
                      max="100" 
                      step="10" 
                      defaultValue="30" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mouth</label>
                    <input 
                      type="range" 
                      className="w-full" 
                      min="-100" 
                      max="100" 
                      step="10" 
                      defaultValue="50" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Jaw</label>
                    <input 
                      type="range" 
                      className="w-full" 
                      min="-100" 
                      max="100" 
                      step="10" 
                      defaultValue="0" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Blend Method</label>
                  <select className="w-full bg-white p-1.5 rounded border text-sm">
                    <option>Linear</option>
                    <option>Ease In</option>
                    <option>Ease Out</option>
                    <option>Ease In-Out</option>
                    <option>Step</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Transition</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      className="bg-white p-1.5 rounded border text-sm"
                      value="0.5s"
                      readOnly
                    />
                    <select className="bg-white p-1.5 rounded border text-sm">
                      <option>Smooth</option>
                      <option>Sharp</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Save as Template */}
          <div className="p-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Templates</h3>
              <button className="p-1 border rounded hover:bg-gray-50">
                <Clipboard size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button className="w-full p-1.5 border rounded hover:bg-gray-50 flex items-center justify-center">
                <Save size={14} className="mr-1.5" /> Save as Template
              </button>
              
              <div className="flex space-x-2">
                <button className="flex-1 p-1.5 border rounded hover:bg-gray-50 flex items-center justify-center">
                  <Upload size={14} className="mr-1.5" /> Export
                </button>
                <button className="flex-1 p-1.5 border rounded hover:bg-gray-50 flex items-center justify-center">
                  <Download size={14} className="mr-1.5" /> Import
                </button>
              </div>
            </div>
          </div>
          
          {/* Apply to Avatar */}
          <div className="p-3 mt-auto border-t">
            <button className="w-full bg-blue-500 text-white p-2 rounded font-medium hover:bg-blue-600 mb-2">
              Apply to Avatar
            </button>
            <button className="w-full border p-2 rounded hover:bg-gray-50">
              Save to Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarGestureEmotionUI;

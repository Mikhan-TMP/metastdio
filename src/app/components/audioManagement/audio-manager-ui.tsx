import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mic, Music, Volume2, Play, Pause, SkipBack, SkipForward, 
  Search, Filter, Plus, Trash2, Edit, Save, Upload, Download,
  Folder, List, Grid, Copy, Star, Scissors, ChevronLeft, 
  Volume, VolumeX, RotateCcw, Clock, Headphones, StopCircle,
  Layers, Moon, Check, X, Menu, Maximize, Settings, WifiOff,
  Repeat
} from 'lucide-react';

const AudioManagerUI = () => {
  // State Variables
  const [activeTab, setActiveTab] = useState('dialogue');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(20);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [folders, setFolders] = useState([]);
  const [audios, setAudios] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState({
    folders: false,
    audios: false,
  });
  const [error, setError] = useState({
    folders: null,
    audios: null,
  });
  const email = localStorage.getItem("userEmail");
  const audioRef = React.useRef(new Audio());

  const playAudio = (audio) => {
    if (audioRef.current.src !== audio.path) {
      audioRef.current.src = audio.path;
    }
    if (isPlaying && selectedAudio?.id === audio.id) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
    setSelectedAudio(audio);
  };

  const toggleFavorite = (audioId) => {
    setAudios((prevAudios) =>
      prevAudios.map((audio) =>
        audio.id === audioId ? { ...audio, favorite: !audio.favorite } : audio
      )
    );
  };
  // Mock Data Fallback
  const mockFolders = [
    { id: 1, name: "Highway Subway" },
    { id: 2, name: "Title Test" },
    { id: 3, name: "Last Test" },
  ];

  const mockDialogueAudio = [
    { id: 1, name: "Introduction", duration: "0:15", type: "dialogue", speaker: "Main Presenter", category: "Opening", path: "intro.mp3" },
    { id: 2, name: "Main Point 1", duration: "0:22", type: "dialogue", speaker: "Main Presenter", category: "Content", path: "point1.mp3" },
  ];

  // Fetch Folders with corrected response handling
  const fetchFolders = async () => {
    setLoading((prev) => ({ ...prev, folders: true }));
    setError((prev) => ({ ...prev, folders: null }));
  
    try {
      console.log('Fetching folders with email:', email);
  
      const response = await axios.get(`http://192.168.1.141:3001/audio/getAllScript`, {
        params: { email },
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // Log the entire raw response
      console.log('Raw API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
  
      // Detailed validation checks
      if (!response.data) {
        throw new Error('No data received from server');
      }
  
      // Check the exact structure of the response
      console.log('Response Type:', typeof response.data);
      console.log('Response Keys:', Object.keys(response.data));
  
      // More flexible validation
      if (response.data.status !== 'success') {
        throw new Error(`Server returned non-success status: ${response.data.status}`);
      }
  
      if (!response.data.titles) {
        throw new Error('No titles found in the response');
      }
  
      if (!Array.isArray(response.data.titles)) {
        throw new Error(`Unexpected titles format: ${typeof response.data.titles}`);
      }
  
      // Map titles to folder objects
      const formattedFolders = response.data.titles.map((titleObj, index) => ({
        id: titleObj.id || `folder-${index}`,
        name: titleObj.title || `Unnamed Folder ${index}`
      }));
  
      console.log('Formatted Folders:', formattedFolders);
  
      setFolders(formattedFolders);
  
    } catch (error) {
      // Ultra-detailed error logging
      console.error('COMPREHENSIVE FETCH ERROR:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        requestConfig: error.config
      });
  
      // Construct a detailed error message
      let errorMessage = 'Failed to load folders';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = `Server Error (${error.response.status}): ${
          error.response.data?.message || 'Unexpected server response'
        }`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Check network connection.';
      } else {
        // Error in setting up the request
        errorMessage = `Request Error: ${error.message}`;
      }
  
      // Set the error state
      setError((prev) => ({
        ...prev,
        folders: errorMessage
      }));
  
    } finally {
      // Ensure loading state is set to false
      setLoading((prev) => ({ ...prev, folders: false }));
    }
  };
  // Fetch Audios for Selected Folder with corrected response handling
  const fetchAudios = async (folderId) => {
    setLoading((prev) => ({ ...prev, audios: true }));
    setError((prev) => ({ ...prev, audios: null }));

    try {
      const response = await axios.get(`http://192.168.1.141:3001/audio/getScript`, {
        params: { 
          email,
          titleId: folderId
        }
      });

      console.log('Full Audios API Response:', response.data);

      // Check for successful status and valid audios array
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.audios)) {
        const formattedAudios = response.data.audios.map(audio => ({
          id: audio.id || Math.random().toString(36).substr(2, 9),
          name: audio.name || 'Unnamed Audio',
          category: audio.category || 'Uncategorized',
          speaker: audio.speaker || 'Unknown Speaker',
          type: audio.type ? audio.type.toLowerCase() : 'dialogue',
          duration: '0:30', // Default duration
          path: audio.audioSrc || '',
          volume: audio.volume,
          fadeIn: audio.fadeIn,
          fadeOut: audio.fadeOut,
          voiceEnhance: audio.voiceEnhance,
          noiseReduction: audio.noiseReduction
        }));

        setAudios(formattedAudios);
      } else {
        throw new Error('Invalid audios response format');
      }
    } catch (error) {
      console.error('Audios Fetch Error:', error);

      let errorMessage = 'Failed to load audios';
      if (error.response) {
        errorMessage = `Server Error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Check network connection.';
      } else {
        errorMessage = `Request Error: ${error.message}`;
      }

      setError((prev) => ({
        ...prev,
        audios: errorMessage
      }));
    } finally {
      setLoading((prev) => ({ ...prev, audios: false }));
    }
  };

  // Initial Folders Fetch
  useEffect(() => {
    fetchFolders();
  }, [email]);

  // Folder Click Handler
  const handleFolderClick = (folder, index) => {
    setSelectedFolder(index);
    fetchAudios(folder.id); // Pass folder.id instead of folder.name
  };

  // Get the appropriate audio data based on active tab
  const getAudioData = () => {
    switch (activeTab) {
      case 'dialogue': return mockDialogueAudio;
      default: return mockDialogueAudio;
    }
  };

  // Get categories for the active tab
  const getCategories = () => {
    const audioData = getAudioData();
    let categories = ["all"];
    
    // Extract unique categories
    audioData.forEach(audio => {
      if (audio.category && !categories.includes(audio.category)) {
        categories.push(audio.category);
      }
    });
    
    return categories;
  };

  // Filter audio by category
  const filteredAudio = currentCategory === 'all'
    ? getAudioData()
    : getAudioData().filter(audio => audio.category === currentCategory);

  const handleSelectAudio = (audio) => {
    setSelectedAudio(audio);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Error Display */}
      {(error.folders || error.audios) && (
        <div className="bg-yellow-100 p-3 text-yellow-800">
          {error.folders && <p>Folders Error: {error.folders}</p>}
          {error.audios && <p>Audios Error: {error.audios}</p>}
        </div>
      )}

      {/* Top Toolbar */}
      <div className="flex justify-between items-center p-2 bg-white border-b">
        <div className="flex items-center">
          <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 mr-2">
            <ChevronLeft size={16} />
          </button>
          <h1 className="text-lg font-medium">Audio Manager</h1>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
            <Save size={16} />
          </button>
          <button className="p-2 bg-[#9B25A7] text-white rounded hover:bg-[#9B25A7]">
            Apply to Timeline
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Browser */}
        <div className="w-3/4 bg-white flex flex-col">
          {/* Folder View */}
          <div className="bg-white p-2 border-b">
            <h2 className="text-lg font-medium mb-2">Folders</h2>
            {loading.folders ? (
              <p className="text-gray-500">Loading folders...</p>
            ) : error.folders ? (
              <p className="text-red-500">{error.folders}</p>
            ) : (
              <div className="flex flex-wrap">
                {folders.map((folder, index) => (
                  <button
                    key={folder.id}
                    className={`flex items-center px-3 py-1 text-sm rounded mr-2 mb-1 ${selectedFolder === index ? 'bg-[#9B25A7] text-white' : 'border hover:bg-gray-50'}`}
                    onClick={() => handleFolderClick(folder, index)}
                  >
                    <Folder size={14} className="mr-2" />
                    {folder.name}
                  </button>
                ))}
                <button className="flex items-center px-3 py-1 text-sm rounded mr-2 mb-1 border hover:bg-gray-50">
                  <Plus size={14} className="mr-2" />
                  New Folder
                </button>
              </div>
            )}
          </div>
            {/* Audio List */}
            <div className="flex-1 overflow-auto">
              {loading.audios ? (
                <p className="text-gray-500 p-4">Loading audios...</p>
              ) : error.audios ? (
                <p className="text-red-500 p-4">{error.audios}</p>
              ) : audios.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Speaker</th>
                      <th className="py-2 px-3">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audios.map((audio, index) => (
                      <tr
                        key={index}
                        className={`border-b text-sm hover:bg-gray-50 cursor-pointer ${
                          selectedAudio?.id === audio.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => playAudio(audio)} // Allow clicking to preview and play audio
                      >
                        <td className="py-2 px-3">{audio.name}</td>
                        <td className="py-2 px-3">{audio.category}</td>
                        <td className="py-2 px-3">{audio.speaker}</td>
                        <td className="py-2 px-3">{audio.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 p-4">Select a folder to view its audio files.</p>
              )}
            </div>
          </div>

          {/* Right Panel - Preview & Properties */}
          <div className="w-1/4 bg-white border-l flex flex-col">
            {/* Preview */}
            <div className="p-3 border-b font-medium">
              Preview & Properties
            </div>

            <div className="flex-1 flex flex-col overflow-auto">
              {selectedAudio ? (
                <>
                  {/* Audio Preview Player */}
                  <div className="p-3 border-b">
                    <h3 className="font-medium mb-2">{selectedAudio.name}</h3>
                    <div className="mb-3 flex items-center text-sm text-gray-500">
                      <div className="mr-3">
                        {selectedAudio.type === 'dialogue' ? (
                          <Mic size={14} className="mr-1 inline-block" />
                        ) : selectedAudio.type === 'music' ? (
                          <Music size={14} className="mr-1 inline-block" />
                        ) : (
                          <Volume2 size={14} className="mr-1 inline-block" />
                        )}
                        {selectedAudio.type === 'dialogue' ? 'Dialogue' : 
                         selectedAudio.type === 'music' ? 'Music' : 'Sound Effect'}
                      </div>
                      <div>
                        <Clock size={14} className="mr-1 inline-block" />
                        {selectedAudio.duration}
                      </div>
                    </div>
                    
                    {/* Waveform Visualization */}
                    <div className="mb-3 h-16 bg-gray-100 rounded relative flex items-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-full w-1 mx-px ${
                              i < currentProgress / 100 * 60 
                                ? selectedAudio.type === 'dialogue'
                                  ? 'bg-green-500'
                                  : selectedAudio.type === 'music'
                                    ? 'bg-purple-500'
                                    : 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                            style={{ 
                              height: `${40 + Math.sin(i / 3) * 30 + Math.random() * 20}%`,
                              opacity: i > 40 ? 0.7 : 1
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Playhead */}
                      <div 
                        className="absolute top-0 bottom-0 w-px bg-gray-700 z-10" 
                        style={{ left: `${currentProgress}%` }}
                      ></div>
                    </div>
                    
                    {/* Player Controls */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">00:00</span>
                        <span className="text-xs">{selectedAudio.duration}</span>
                      </div>
                      <input 
                        type="range" 
                        className="w-full mb-2" 
                        min="0" 
                        max="100" 
                        value={currentProgress} 
                        onChange={(e) => setCurrentProgress(parseInt(e.target.value))}
                      />
                      <div className="flex justify-center space-x-3">
                        <button className="p-1.5 border rounded-full hover:bg-gray-100">
                          <SkipBack size={16} />
                        </button>
                        <button 
                          className="p-2 bg-[#9B25A7] text-white rounded-full hover:bg-[#9B25A7]"
                          onClick={togglePlay}
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button className="p-1.5 border rounded-full hover:bg-gray-100">
                          <SkipForward size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 border rounded hover:bg-gray-100">
                        <Volume2 size={14} />
                      </button>
                      <input type="range" className="flex-1" min="0" max="100" defaultValue="80" />
                      <button className="p-1.5 border rounded hover:bg-gray-100">
                        <Headphones size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Properties */}
                  <div className="p-3 border-b">
                    <h3 className="font-medium mb-3">Audio Properties</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full bg-gray-100 p-1.5 rounded border text-sm"
                          value={selectedAudio.name}
                          readOnly
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Category</label>
                          <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                            <option>{selectedAudio.category}</option>
                            {getCategories().filter(c => c !== 'all' && c !== selectedAudio.category).map(category => (
                              <option key={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <input
                            type="text"
                            className="w-full bg-gray-100 p-1.5 rounded border text-sm"
                            value={selectedAudio.type === 'dialogue' ? 'Dialogue' : 
                                   selectedAudio.type === 'music' ? 'Music' : 'Sound Effect'}
                            readOnly
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">File Path</label>
                        <div className="flex">
                          <input
                            type="text"
                            className="flex-1 bg-gray-100 p-1.5 rounded-l border text-sm"
                            value={selectedAudio.path}
                            readOnly
                          />
                          <button className="bg-gray-200 px-2 rounded-r border">
                            <Folder size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {selectedAudio.type === 'dialogue' && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Speaker</label>
                          <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                            <option>{selectedAudio.speaker}</option>
                            <option>Guest</option>
                            <option>Narrator</option>
                            <option>Secondary Presenter</option>
                          </select>
                        </div>
                      )}
                      
                      {selectedAudio.type === 'music' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Mood</label>
                            <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                              <option>{selectedAudio.mood}</option>
                              <option>Energetic</option>
                              <option>Calm</option>
                              <option>Dramatic</option>
                              <option>Inspirational</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Tempo</label>
                            <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                              <option>{selectedAudio.tempo}</option>
                              <option>Slow</option>
                              <option>Medium</option>
                              <option>Fast</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {selectedAudio.type === 'dialogue' && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Transcript</label>
                          <textarea
                            className="w-full bg-gray-100 p-1.5 rounded border text-sm h-20"
                            value={selectedAudio.transcript}
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Adjustment Options */}
                  <div className="p-3 border-b">
                    <h3 className="font-medium mb-3">Audio Adjustments</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Volume</label>
                        <input type="range" className="w-full" min="0" max="100" defaultValue="80" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fade In</label>
                          <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                            <option>None</option>
                            <option>0.5s</option>
                            <option>1s</option>
                            <option>2s</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fade Out</label>
                          <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                            <option>None</option>
                            <option>0.5s</option>
                            <option>1s</option>
                            <option>2s</option>
                          </select>
                        </div>
                      </div>
                      
                      {selectedAudio.type === 'music' && (
                        <>
                          <div className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" id="loopAudio" />
                            <label htmlFor="loopAudio">Loop Audio</label>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">EQ Preset</label>
                            <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                              <option>Default</option>
                              <option>Background Music</option>
                              <option>Voice Boost</option>
                              <option>Bass Boost</option>
                              <option>Treble Boost</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      {selectedAudio.type === 'dialogue' && (
                        <>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Noise Reduction</label>
                            <input type="range" className="w-full" min="0" max="100" defaultValue="30" />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Voice Enhancement</label>
                            <select className="w-full bg-gray-100 p-1.5 rounded border text-sm">
                              <option>None</option>
                              <option>Clarity</option>
                              <option>Warmth</option>
                              <option>Brightness</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Timing</label>
                        <input
                          type="text"
                          className="w-full bg-gray-100 p-1.5 rounded border text-sm"
                          placeholder="Start: 00:00:00.000"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
                  <div className="mb-3 p-3 rounded-full bg-gray-100">
                    <Volume2 size={24} />
                  </div>
                  <p className="text-gray-500 mb-1">No audio selected</p>
                  <p className="text-xs text-gray-400">Select an audio file to view and edit its properties</p>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="p-3 border-t">
              <button 
                className="w-full bg-[#9B25A7] text-white p-2 rounded font-medium hover:bg-[#9B25A7] mb-2"
                disabled={!selectedAudio}
              >
                Apply to Timeline
              </button>
              <button 
                className="w-full bg-gray-100 p-2 rounded font-medium hover:bg-gray-200"
                disabled={!selectedAudio}
              >
                Preview in Scene
              </button>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default AudioManagerUI;
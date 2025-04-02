import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Smile, Download, Save, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
            className={`relative max-w-xs sm:max-w-sm w-full p-3 sm:p-5 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 border ${
              type === "success"
                ? "bg-green-100 text-green-800 border-green-300"
                : type === "generating" || type === "info"
                  ? "bg-blue-100 text-blue-800 border-blue-300"
                  : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {/* Icon */}
            {type === "success" ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0"
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
            ) : type === "generating" || type === "info" ? (
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0"
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
            <p className="font-semibold text-xs sm:text-sm md:text-base">{message}</p>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 text-gray-600 hover:text-gray-900 transition-all"
            >
              &times;
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const VoiceGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [voiceSelection, setVoiceSelection] = useState('Male');
  const [speakingRate, setSpeakingRate] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedGenerations, setSavedGenerations] = useState([]);
  const [currentDuration, setCurrentDuration] = useState('0:00');
  const [audioFormat, setAudioFormat] = useState('audio/wav');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const audioRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto-resize text area based on content
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${Math.min(300, textAreaRef.current.scrollHeight)}px`;
    }
  }, [textInput]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Monitor audio playback state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
      
      audioRef.current.onerror = (e) => {
        console.error("Audio error:", e);
        showNotification(`Playback error: ${audioRef.current.error?.message || 'Unknown error'}`, 'error');
      };
      
      // Update duration display
      audioRef.current.ontimeupdate = () => {
        const currentTime = audioRef.current.currentTime;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        setCurrentDuration(`${minutes}:${seconds}`);
      };
    }
  }, [audioUrl]);

  // Handle screen resize for responsive layout adjustments
  useEffect(() => {
    const handleResize = () => {
      // You could add more complex responsive logic here if needed
      setIsFullscreen(window.innerWidth <= 768); // Set fullscreen mode for mobile
    };

    // Initial check
    handleResize();

    // Add listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      savedGenerations.forEach(gen => {
        if (gen.url) {
          URL.revokeObjectURL(gen.url);
        }
      });
    };
  }, [savedGenerations]);

  const showNotification = (message, type = 'info') => {
    setNotification(message);
    setNotificationType(type);
  };

  const handleGenerateVoice = async () => {
    if (!textInput.trim()) {
      showNotification('Please enter text to convert to speech.', 'error');
      return;
    }

    setIsGenerating(true);
    showNotification('Generating audio, please wait...', 'generating');
    
    try {
      // Use the API endpoint
      const response = await fetch('http://192.168.1.71:8083/voice_gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textInput,
          voice: voiceSelection,
          rate: speakingRate,
          pitch: pitch,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Check the content type from the response
      const contentType = response.headers.get('content-type') || 'audio/wav';
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unexpected error');
      }
      
      setAudioFormat(contentType);
      
      const audioBlob = await response.blob();
      
      // Verify we have valid audio data
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio data from server');
      }
      
      // Create a properly typed blob to ensure browser compatibility
      const typedBlob = new Blob([audioBlob], { type: contentType });
      
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      const newAudioUrl = URL.createObjectURL(typedBlob);
      setAudioUrl(newAudioUrl);
      setAudioFormat(contentType);
      
      // Automatically play the new audio
      if (audioRef.current) {
        audioRef.current.src = newAudioUrl;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback error:", error);
            showNotification(`Playback error: ${error.message}`, 'error');
          });
        }
      }
      
      // Test if the audio format is supported
      const audio = new Audio();
      audio.src = newAudioUrl;
      
      // Create a promise to check if the audio can be played
      const canPlayPromise = new Promise((resolve, reject) => {
        audio.oncanplay = () => resolve(true);
        audio.onerror = () => reject(new Error(`Format ${contentType} not supported`));
        
        // Set a timeout in case neither event fires
        setTimeout(() => resolve(false), 2000);
      });
      
      const canPlay = await canPlayPromise;
      
      if (!canPlay) {
        console.warn("Audio format may not be fully supported, but attempting playback anyway");
      }
      
      // Create a new saved generation entry
      const newGeneration = {
        id: Date.now(),
        name: getGenerationName(),
        url: newAudioUrl,
        format: contentType,
        duration: '0:00'
      };
      
      setSavedGenerations(prev => [newGeneration, ...prev].slice(0, 5));
      showNotification('Audio generated successfully!', 'success');
      
    } catch (error) {
      console.error('Error generating voice:', error);
      showNotification(`Failed to generate audio: ${error.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const getGenerationName = () => {
    const words = textInput.trim().split(' ').slice(0, 3).join(' ');
    return words.length > 0 ? `${words}...` : 'New Generation';
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Handle playback errors more gracefully
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback error:", error);
            showNotification(`Playback error: ${error.message}`, 'error');
          });
        }
      }
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback error:", error);
        });
      }
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 5;
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const fileExtension = audioFormat.includes('wav') ? 'wav' : 
                           audioFormat.includes('mp3') ? 'mp3' : 
                           audioFormat.includes('ogg') ? 'ogg' : 'audio';
      
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${voiceSelection.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('Download started!', 'success');
    }
  };

  const handleSaveToLibrary = () => {
    if (audioUrl) {
      showNotification('Saved to your library!', 'success');
    }
  };

  const playSavedGeneration = (generation) => {
    if (audioRef.current) {
      // Clean up previous URL
      if (audioUrl && audioUrl !== generation.url) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(generation.url);
      setAudioFormat(generation.format || 'audio/wav');
      
      // The audio source will be updated through the effect when audioUrl changes
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Playback error:", error);
              showNotification(`Playback error: ${error.message}`, 'error');
            });
          }
        }
      }, 100);
    }
  };

  const getAudioElement = () => {
    return (
      <div>
        <audio 
          ref={audioRef} 
          controls
          className="w-full my-2 h-8 sm:h-10"
          onLoadedMetadata={(e) => {
            const duration = e.target.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
            setCurrentDuration(`${minutes}:${seconds}`);
          }}
        >
          <source src={audioUrl} type={audioFormat} />
          Your browser does not support the audio element.
        </audio>
        
        <div className="text-center mb-2 sm:mb-4">
          <div className="text-xs sm:text-sm text-black">{voiceSelection} | {currentDuration}</div>
        </div>
        
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-2 sm:mb-4">
          <button 
            className="p-1 sm:p-2 border rounded-full hover:bg-gray-100 transition-colors"
            onClick={handleSkipBackward}
          >
            <SkipBack size={16} className="sm:hidden" />
            <SkipBack size={20} className="hidden sm:block" />
          </button>
          <button 
            className="p-2 sm:p-3 border rounded-full hover:bg-gray-100 transition-colors bg-blue-50 text-blue-600"
            onClick={handlePlayPause}
          >
            {isPlaying ? 
              <>
                <Pause size={20} className="sm:hidden" />
                <Pause size={24} className="hidden sm:block" />
              </> : 
              <>
                <Play size={20} className="sm:hidden" />
                <Play size={24} className="hidden sm:block" />
              </>
            }
          </button>
          <button 
            className="p-1 sm:p-2 border rounded-full hover:bg-gray-100 transition-colors"
            onClick={handleSkipForward}
          >
            <SkipForward size={16} className="sm:hidden" />
            <SkipForward size={20} className="hidden sm:block" />
          </button>
        </div>
        
        <div className="text-center text-xs sm:text-sm text-black">
          Custom controls and native player available
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md max-w-full sm:max-w-5xl mx-auto overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">AI Voice Generator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
              Text Input <span className="text-red-500">*</span>
            </label>
            <textarea 
              ref={textAreaRef}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter the text to convert to speech..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ minHeight: '80px' }}
              required
            ></textarea>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-black">
                {textInput.length} characters
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
              Voice Selection <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              value={voiceSelection}
              onChange={(e) => setVoiceSelection(e.target.value)}
              required
            >
              <option>Male</option>
              <option>Female</option>
              {/* <option>Casual Male</option>
              <option>Casual Female</option>
              <option>Narrator</option>
              <option>Energetic</option>
              <option>Calm</option> */}
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                Speaking Rate: {speakingRate.toFixed(1)}x
              </label>
              <input 
                type="range" 
                className="w-full accent-[#9B25A7]" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={speakingRate}
                onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-xs text-black mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                Pitch: {pitch > 0 ? `+${pitch}` : pitch}
              </label>
              <input 
                type="range" 
                className="w-full accent-[#9B25A7]" 
                min="-10" 
                max="10" 
                step="1" 
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs text-black mt-1">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <button 
            className={`w-full px-4 py-2 sm:py-3 text-white rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base ${
              isGenerating 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-[#9B25A7] hover:bg-[#871f90] cursor-pointer'
            }`}
            onClick={handleGenerateVoice}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Voice'}
          </button>
          
          {/* Mobile Recent Generations (shown only on small screens) */}
          <div className="block lg:hidden">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 mt-4">
              <h4 className="font-medium mb-2 text-xs sm:text-sm text-black">Recent Generations</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {savedGenerations.length > 0 ? (
                  savedGenerations.map((gen) => (
                    <div 
                      key={gen.id}
                      className="p-2 border rounded-lg flex justify-between items-center bg-white hover:bg-blue-50 cursor-pointer"
                      onClick={() => playSavedGeneration(gen)}
                    >
                      <div className="flex items-center">
                        <Play size={12} className="mr-1 text-[#9B25A7]" />
                        <span className="text-xs truncate max-w-[100px] sm:max-w-[200px] text-black">{gen.name}</span>
                      </div>
                      <div className="text-xs text-black">{gen.duration}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-2 bg-gray-100 rounded-lg text-black text-xs">
                    No recent generations
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 bg-gray-50">
          <h3 className="font-semibold text-sm sm:text-lg mb-3 sm:mb-4 text-black">Voice Preview</h3>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm mb-4 sm:mb-6">
            {audioUrl ? (
              getAudioElement()
            ) : (
              <div className="text-center py-4 sm:py-8 text-black">
                <Smile size={32} className="mb-2 mx-auto text-gray-400 sm:hidden" />
                <Smile size={48} className="mb-3 mx-auto text-gray-400 hidden sm:block" />
                <p className="font-medium text-sm sm:text-base">No audio generated yet</p>
                <p className="text-xs sm:text-sm mt-1">Generate voice to hear a preview</p>
              </div>
            )}
          </div>
          
          {/* Desktop Recent Generations (hidden on small screens) */}
          <div className="hidden lg:block">
            <div>
              <h4 className="font-medium mb-3 text-black text-sm sm:text-base">Recent Generations</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {savedGenerations.length > 0 ? (
                  savedGenerations.map((gen) => (
                    <div 
                      key={gen.id}
                      className="p-2 border rounded-lg flex justify-between items-center bg-white hover:bg-blue-50 cursor-pointer"
                      onClick={() => playSavedGeneration(gen)}
                    >
                      <div className="flex items-center">
                        <Play size={14} className="mr-2 text-[#9B25A7]" />
                        <span className="text-sm truncate max-w-[150px] text-black">{gen.name}</span>
                      </div>
                      <div className="text-xs text-black">{gen.duration}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 bg-gray-100 rounded-lg text-black text-sm">
                    No recent generations
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 sm:space-x-3 mt-4">
            <button 
              className={`flex-1 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center justify-center ${
                audioUrl 
                  ? 'bg-blue-600 text-white hover:bg-[#9B25A7]' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleDownload}
              disabled={!audioUrl}
            >
              <Download size={14} className="mr-1 sm:hidden" />
              <Download size={16} className="mr-1 hidden sm:inline" /> 
              Download
            </button>
            <button 
              className={`flex-1 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm flex items-center justify-center ${
                audioUrl 
                  ? 'border border-[#9B25A7] text-[#9B25A7] hover:bg-blue-50' 
                  : 'border border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSaveToLibrary}
              disabled={!audioUrl}
            >
              <Save size={14} className="mr-1 sm:hidden" />
              <Save size={16} className="mr-1 hidden sm:inline" /> 
              Save to Library
            </button>
          </div>
        </div>
      </div>

      <Alert 
        message={notification} 
        type={notificationType} 
        onClose={() => setNotification('')} 
      />
    </div>
  );
};

export default VoiceGenerator;
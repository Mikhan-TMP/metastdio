import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit,
  Save,
  Play,
  Pause,
  Download,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Upload,
} from "lucide-react";
import SceneManagerSidePanel from "./SceneManagerSidePanel";

interface TimelineTrack {
  id: number;
  sceneId: number;
  type: 'voice' | 'background' | 'music' | 'effect';
  start: number;
  duration: number;
  content: string;
}

interface TimelineState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

interface TimelineItem {
  id: string;
  type: 'avatar' | 'audio' | 'background' | 'effect';
  start: number;
  duration: number;
  content: string;
  color: string;
}

interface TrackCategory {
  id: string;
  name: string;
  type: 'avatar' | 'audio' | 'background' | 'effect' | 'voice';
  color: string;
}

const TRACK_CATEGORIES: TrackCategory[] = [
  { id: 'avatar', name: 'Avatar', type: 'avatar', color: 'bg-green-500' },
  { id: 'voice', name: 'Voice', type: 'voice', color: 'bg-purple-500' },
  { id: 'background', name: 'Background', type: 'background', color: 'bg-blue-500' },
  { id: 'audio', name: 'Background Music', type: 'audio', color: 'bg-indigo-500' },
  { id: 'effect', name: 'Effects', type: 'effect', color: 'bg-yellow-500' },
];

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
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false
  });
  const [activeSceneId, setActiveSceneId] = useState<number | null>(null);
  const [tracks, setTracks] = useState<TimelineTrack[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleSceneSelect = (scene: any) => {
    setSelectedScene(scene);
    setActiveSceneId(scene.id);
    setTimeline({
      currentTime: 0,
      duration: parseInt(scene.duration.split(':')[0]) * 60 + 
                parseInt(scene.duration.split(':')[1]),
      isPlaying: false
    });
    updateTimelineTracks(scene.id);

    // Convert scene elements to timeline items
    const items: TimelineItem[] = [
      // Background
      {
        id: 'bg-1',
        type: 'background',
        start: 0,
        duration: parseFloat(scene.duration),
        content: scene.background.video || scene.background.image,
        color: 'bg-blue-500'
      },
      // Avatar
      {
        id: 'avatar-1',
        type: 'avatar',
        start: 0,
        duration: parseFloat(scene.duration),
        content: scene.avatar.name,
        color: 'bg-green-500'
      },
      // Audio tracks
      ...scene.audio.dialogues.map((dialogue, idx) => ({
        id: `dialogue-${idx}`,
        type: 'audio',
        start: idx * 2,
        duration: 5,
        content: dialogue,
        color: 'bg-purple-500'
      })),
      // Effects
      ...scene.effects.map((effect, idx) => ({
        id: `effect-${idx}`,
        type: 'effect',
        start: idx * 1.5,
        duration: 2,
        content: effect,
        color: 'bg-yellow-500'
      }))
    ];
    setTimelineItems(items);
  };

  const updateTimelineTracks = (sceneId: number) => {
    setTracks([
      {
        id: 1,
        sceneId: sceneId,
        type: 'voice',
        start: 0,
        duration: 5,
        content: 'Voice Track'
      },
      {
        id: 2,
        sceneId: sceneId,
        type: 'background',
        start: 2,
        duration: 8,
        content: 'Background'
      }
    ]);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const newTime = (x / bounds.width) * getTotalDuration();
    setCurrentTime(Math.max(0, Math.min(newTime, getTotalDuration())));
  };

  const getTotalDuration = () => {
    return Math.max(...timelineItems.map(item => item.start + item.duration), 30);
  };

  const handleItemDragStart = (itemId: string) => {
    setIsDragging(true);
    setDraggedItem(itemId);
  };

  const handleItemDrag = (e: React.MouseEvent, itemId: string) => {
    if (!isDragging || draggedItem !== itemId) return;
    
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect) return;

    const x = e.clientX - timelineRect.left;
    const newStart = (x / timelineRect.width) * getTotalDuration();
    
    setTimelineItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, start: Math.max(0, newStart) }
          : item
      )
    );
  };

  const togglePlayPause = () => {
    setTimeline(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    if (videoRef.current) {
      if (timeline.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-4 gap-4">
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
        <div className="w-1/3 bg-white rounded-[15px] shadow-md">
          <SceneManagerSidePanel onSceneSelect={handleSceneSelect} activeSceneId={activeSceneId} />
        </div>
    
        {/* Right content */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Main content - Video Preview */}
          <div className="flex-1 bg-white rounded-[15px] shadow-md overflow-auto p-4">
            {selectedScene ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-black rounded-lg relative">
                  {selectedScene.background.video ? (
                    <video
                      ref={videoRef}
                      src={selectedScene.background.video}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={selectedScene.background.image} 
                        alt={selectedScene.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex items-center gap-4">
                  <button 
                    className="p-2 rounded-full bg-purple-600 text-white"
                    onClick={togglePlayPause}
                  >
                    {timeline.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div 
                    ref={timelineRef}
                    className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
                    onClick={handleTimelineClick}
                  >
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ 
                        width: `${(timeline.currentTime / timeline.duration) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.floor(timeline.currentTime / 60)}:
                    {Math.floor(timeline.currentTime % 60).toString().padStart(2, '0')} / 
                    {selectedScene.duration}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Select a scene to preview</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="h-[25%] bg-white rounded-[15px] shadow-md shrink-0 p-3">
            <div className="flex flex-col h-full">
              {/* Timeline Header */}
              <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">Timeline</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
                      <Play size={14} />
                    </button>
                    <span className="text-xs text-gray-500">
                      {Math.floor(currentTime)}s / {getTotalDuration()}s
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700">
                    <Plus size={12} className="inline mr-1" />
                    Add Track
                  </button>
                  <button className="p-1.5 border rounded hover:bg-gray-50">
                    <Edit size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Timeline Content */}
              <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden flex">
                {/* Track Categories Sidebar */}
                <div className="w-32 flex-shrink-0 bg-gray-100 border-r border-gray-200">
                  <div className="h-6 bg-white border-b px-2 flex items-center">
                    <span className="text-[10px] font-medium text-gray-500">TRACKS</span>
                  </div>
                  <div className="overflow-y-auto" style={{ height: 'calc(100% - 24px)' }}>
                    {TRACK_CATEGORIES.map(category => (
                      <div key={category.id} 
                           className="px-2 h-10 flex items-center border-b border-gray-200
                                    hover:bg-gray-50 group">
                        <div className={`w-2 h-2 rounded-full mr-2 ${category.color}`} />
                        <span className="text-xs font-medium text-gray-700">{category.name}</span>
                        <button className="ml-auto opacity-0 group-hover:opacity-100 p-1 
                                         hover:bg-gray-200 rounded">
                          <Plus size={12} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Time Markers */}
                  <div className="h-6 bg-white border-b flex sticky top-0">
                    {[...Array(Math.ceil(getTotalDuration() / 5))].map((_, i) => (
                      <div key={i} 
                           className="flex-shrink-0 w-[100px] border-l border-gray-200 
                                    text-[10px] text-gray-400 pl-1">
                        {i * 5}s
                      </div>
                    ))}
                  </div>

                  {/* Tracks Container */}
                  <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <div className="relative" 
                         style={{ width: `${Math.ceil(getTotalDuration() / 5) * 100}px` }}>
                      {TRACK_CATEGORIES.map(category => (
                        <div key={category.id} 
                             className="h-10 border-b border-gray-200 relative group">
                          {/* Track items */}
                          {timelineItems
                            .filter(item => item.type === category.type)
                            .map(item => (
                              <div
                                key={item.id}
                                className={`absolute top-1 h-8 ${category.color} rounded 
                                          shadow-sm cursor-move group-hover:ring-2 
                                          ring-white transition-shadow`}
                                style={{
                                  left: `${(item.start / getTotalDuration()) * 100}%`,
                                  width: `${(item.duration / getTotalDuration()) * 100}%`,
                                  minWidth: '50px'
                                }}
                                onMouseDown={() => handleItemDragStart(item.id)}
                                onMouseMove={(e) => handleItemDrag(e, item.id)}
                                onMouseUp={() => setIsDragging(false)}
                              >
                                <div className="text-xs text-white p-1.5 truncate flex items-center">
                                  <span className="truncate">{item.content}</span>
                                  <div className="flex-shrink-0 ml-auto opacity-0 
                                              group-hover:opacity-100 flex gap-0.5">
                                    <button className="p-0.5 hover:bg-white/20 rounded">
                                      <Edit size={10} />
                                    </button>
                                    <button className="p-0.5 hover:bg-white/20 rounded">
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                </div>
                                {/* Resize handles */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 
                                            bg-black/20 cursor-col-resize hover:bg-black/40" />
                                <div className="absolute right-0 top-0 bottom-0 w-1 
                                            bg-black/20 cursor-col-resize hover:bg-black/40" />
                              </div>
                          ))}
                          
                          {/* Track drop zone */}
                          <div className="absolute inset-1 rounded border-2 
                                        border-dashed border-gray-200 opacity-0 
                                        group-hover:opacity-100 pointer-events-none" />
                        </div>
                      ))}

                      {/* Playhead */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                        style={{ left: `${(currentTime / getTotalDuration()) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
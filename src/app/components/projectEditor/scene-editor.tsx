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
import SceneManagerSidePanel from "./SceneManagerSidePanel";

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
          <SceneManagerSidePanel />
        </div>
    
        {/* Right content */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Main content - Video Preview */}
          <div className="flex-1 bg-white rounded-[15px] shadow-md overflow-auto p-4">
            <div className="h-full flex flex-col">
              {/* Video preview area */}
              <div className="flex-1 bg-black rounded-lg relative">
                {/* Placeholder for video preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={48} className="text-white opacity-50" />
                </div>
              </div>
              
              {/* Video controls */}
              <div className="mt-4 flex items-center gap-4">
                <button className="p-2 rounded-full bg-purple-600 text-white">
                  <Play size={20} />
                </button>
                {/* Progress bar */}
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-full bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">00:00 / 02:30</span>
              </div>
            </div>
          </div>

          {/* Bottom content - Timeline */}
          <div className="h-[25%] bg-white rounded-[15px] shadow-md shrink-0 p-3">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">Timeline</h3>
                  <div className="flex gap-1">
                    <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
                      <ArrowLeft size={14} />
                    </button>
                    <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
                      <Play size={14} />
                    </button>
                    <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full">
                    Add Track
                  </button>
                  <button className="p-1.5 border rounded hover:bg-gray-50">
                    <Edit size={14} />
                  </button>
                </div>
              </div>

              {/* Timeline tracks */}
              <div className="flex-1 bg-gray-50 rounded relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-6 border-b flex">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 border-l border-gray-200 text-[10px] text-gray-400 pl-1">
                      {i * 5}s
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-2 space-y-2">
                  <div className="h-8 bg-purple-100 rounded relative">
                    <div className="absolute left-[10%] w-[40%] h-full bg-purple-500 rounded">
                      <div className="text-xs text-white p-1">Voice Track</div>
                    </div>
                  </div>
                  <div className="h-8 bg-blue-100 rounded relative">
                    <div className="absolute left-[20%] w-[30%] h-full bg-blue-500 rounded">
                      <div className="text-xs text-white p-1">Background</div>
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
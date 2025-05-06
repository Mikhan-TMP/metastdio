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
          {/* Main content */}
          <div className="flex-1  bg-white rounded-[15px] shadow-md overflow-auto p-4">
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



export default ProjectEditor;
import React, { useState } from "react";
import { Plus, Edit, Save, Play, Download } from "lucide-react";

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
    <div className="relative h-[1000px] box-border">
      {/* Top bar (rectangle-50) */}
      <div className="absolute top-0 left-0 w-full h-[80px] bg-white rounded-[15px] shadow-md" />

      {/* Side panel (rectangle-52) */}
      <div className="absolute top-[99px] left-0 w-1/4 h-[900px] bg-white rounded-[15px] shadow-md" />

      {/* Main content (rectangle-49) */}
      <div className="absolute top-[100px] left-[437px] w-[1232px] h-[592px] bg-white rounded-[15px] shadow-md" />

      {/* Bottom content (rectangle-51) */}
      <div className="absolute top-[710px] left-[437px] w-[1230px] h-[290px] bg-white rounded-[15px] shadow-md" />
    </div>
  );
};

export default ProjectEditor;

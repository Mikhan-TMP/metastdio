'use client';

import React from 'react';
import AuthGuard from './Auth/AuthGuard';

import { useState } from "react";
import ProjectEditor from "../components/projectEditor/scene-editor";
import AvatarManagement from "../components/avatarManagement/avatar-management";
import StudioManagement from "../components/studioManagement/studio-management";
import ScriptVoiceManagement from "../components/audioManagement/script-voice-management";
import ContentEffectManagement from "../components/assetContentManagement/content-effect-management";
import SceneManagerUI from "../components/updated-scene-manager";
import AvatarGestureEmotionUI from "../components/avatarEmotion/updated-avatar-ui";
import ProfileManagement from "../components/profile/profile";
import LandingPage from "./landingpage/landingpage";
// import Auth from "../page";
import { Home, Video, Users, Tv, Mic, Music, LogIn, Menu, X , SmilePlus, Sparkles  } from "lucide-react";
// import { common } from '@mui/material/colors';

const navigationItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    component: <LandingPage />,
  },
  {
    id: "avatar",
    label: "Avatar Management",
    icon: Users,
    component: <AvatarManagement />,
  },
  {
    id: "emotion",
    label: "Avatar Fx",
    icon: Sparkles  ,
    component: <AvatarGestureEmotionUI />,
  },
  {
    id: "studio",
    label: "Studio Management",
    icon: Tv,
    component: <StudioManagement />,
  },
  {
    id: "voice",
    label: "Audio Management",
    icon: Mic,
    component: <ScriptVoiceManagement />,
  },
  {
    id: "effect",
    label: "Asset Management",
    icon: Music,
    component: <ContentEffectManagement />,
  },
  {
    id: "scene",
    label: "Scene Editor",
    icon: Video,
    component: <SceneManagerUI />,
  },
  {
    id: "project",
    label: "Project Editor",
    icon: Video,
    component: <ProjectEditor />,
  },
  {
    id: "user",
    label: (localStorage.getItem('userName')),
    icon: localStorage.getItem('userName') ? Users : LogIn,
    component: <ProfileManagement />
  },
];

    const Page = () => {
    const [currentView, setCurrentView] = useState("project");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-100">
                <style jsx global>{`body {color: black;}`}</style>
                    {/* Navigation */}
                    <nav className="bg-white shadow-sm p-2 sticky top-0 z-50 w-full flex justify-content-between">
                    <div className="max-w-1xl mx-auto px-4 flex p-4 items-center h-16">
                    {/* Logo */}
                    <img src="http://www.meta-town.io/Metacity/assets/Flexor/assets/img/metatown.png" alt="MetaTown Logo" className="h-8 w-auto pe-10"/>

                    {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-wrap gap-2">
                    {navigationItems.map(({ id, label, icon: Icon }) => (
                        <button
                        key={id}
                        onClick={() => setCurrentView(id)}
                        className={`flex items-center justify-center text-sm min-w-[130px] max-w-[180px] h-12 border-b-2 cursor-pointer transition-all whitespace-nowrap px-3 ${
                            currentView === id
                            ? "border-[#9B25A7] text-[#7A1C86]"
                            : "border-transparent text-gray-500 hover:text-[#9B25A7] hover:border-[#9B25A7]"
                        }`}
                        >
                        <Icon className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                        </button>
                    ))}
                </div>
                    {/* Mobile Menu Button */}
                    <button
                    className="lg:hidden p-2 ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6 text-gray-600" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-600" />
                    )}
                    </button>
            </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur backdrop-filter z-40"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}
          <div
            className={`lg:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 transition-transform transform z-50 ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex flex-col mt-10 space-y-4">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setCurrentView(id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-8xl mx-auto pt-4 px-2 pb-4 rounded-2xl w-full min-h-[120vh]">
          {navigationItems.find((item) => item.id === currentView)?.component}
        </main>
      </div>
    </AuthGuard>
  );
};

export default Page;


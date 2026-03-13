import { Component } from "solid-js";
import { MapPin } from "lucide-solid";

export const Header: Component<{ isActive: boolean }> = (props) => {
  return (
    <header class="w-full p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
      <div class="flex items-center gap-2">
        <MapPin class="w-6 h-6 text-blue-500" />
        <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Coordinate Checker</h1>
      </div>
      <div>
        {props.isActive ? (
          <span class="text-xs font-semibold px-2 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1.5 border border-green-500/30">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Active
          </span>
        ) : (
          <span class="text-xs font-semibold px-2 py-1 bg-slate-700 text-slate-300 rounded-full flex items-center gap-1.5 border border-slate-600">
            <span class="w-2 h-2 rounded-full bg-slate-500"></span>
            Inactive
          </span>
        )}
      </div>
    </header>
  );
};

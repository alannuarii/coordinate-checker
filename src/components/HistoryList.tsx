import { Component, For, Show } from "solid-js";
import { Trash2, Copy, Map, Check } from "lucide-solid";
import { Coordinate } from "../lib/db";
import { createSignal } from "solid-js";

export const HistoryList: Component<{
  history: Coordinate[];
  onDelete: (id: number) => void;
}> = (props) => {
  const [copiedId, setCopiedId] = createSignal<number | null>(null);

  const handleCopy = (coord: Coordinate) => {
    const text = `${coord.latitude}, ${coord.longitude}`;
    navigator.clipboard.writeText(text);
    if (coord.id) {
      setCopiedId(coord.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div class="flex-1 flex flex-col bg-slate-900 px-5 pb-28 pt-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] border-t border-slate-800">
      <div class="flex items-center justify-between mb-6 px-1">
        <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <div class="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Map class="w-4 h-4 text-indigo-400" />
          </div>
          Saved Locations
        </h2>
        <span class="text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full shadow-inner">
          {props.history.length} items
        </span>
      </div>
      
      <div class="flex flex-col gap-3">
        <Show when={props.history.length > 0} fallback={
          <div class="flex flex-col items-center justify-center py-16 text-slate-500 gap-4 border-2 border-slate-800/80 rounded-3xl border-dashed bg-slate-800/10 mt-2">
            <Map class="w-12 h-12 opacity-40 mb-2 text-slate-400" />
            <p class="font-medium tracking-wide">No locations saved yet</p>
            <p class="text-sm opacity-70 px-8 text-center">Tap the save button below to record your current coordinates.</p>
          </div>
        }>
          <For each={props.history}>
            {(item) => (
              <div class="relative group">
                <a href={`/location/${item.id}`} class="flex items-center gap-4 bg-slate-800/50 border border-slate-700/60 p-4 rounded-[1.25rem] transition-all hover:bg-slate-800 shadow-sm overflow-hidden block">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex-1 flex flex-col pl-1">
                    <span class="text-sm font-semibold text-slate-200 mb-1">{item.label}</span>
                    <span class="text-[13px] text-slate-400 font-mono tracking-wide">
                      {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                    </span>
                    <Show when={item.address}>
                      <span class="text-xs text-blue-300/80 mt-1 italic max-w-[220px] truncate" title={item.address}>
                        {item.address}
                      </span>
                    </Show>
                    <span class="text-[11px] font-medium text-slate-500 mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                      <span class="w-1 h-1 rounded-full bg-slate-600"></span> 
                      ±{Math.round(item.accuracy)}m
                    </span>
                  </div>
                </a>
                
                {/* Overlay Action Buttons (isolated from <a> clikc event) */}
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5 z-10">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleCopy(item); }}
                    class={`p-3 rounded-full transition-all active:scale-95 border ${
                      copiedId() === item.id 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                    }`}
                    aria-label="Copy coordinates"
                  >
                    {copiedId() === item.id ? <Check class="w-4 h-4" /> : <Copy class="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); item.id && props.onDelete(item.id); }}
                    class="p-3 bg-slate-900/80 text-red-400/80 border border-slate-700 rounded-full transition-all active:scale-95 hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/30"
                    aria-label="Delete location"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

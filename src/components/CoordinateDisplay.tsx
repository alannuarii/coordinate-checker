import { Component } from "solid-js";
import { Navigation, Loader2 } from "lucide-solid";

export const CoordinateDisplay: Component<{
  location: { latitude: number; longitude: number; accuracy: number } | null;
  error: string | null;
  loading: boolean;
  address?: string | null;
  isAddressLoading?: boolean;
}> = (props) => {
  return (
    <div class="flex flex-col items-center justify-center p-8 bg-slate-800/40 backdrop-blur-sm my-6 mx-4 rounded-[2rem] border border-slate-700/60 shadow-inner relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      {props.loading ? (
        <div class="flex flex-col items-center text-slate-400 gap-4 py-8">
          <Loader2 class="w-8 h-8 animate-spin text-blue-400" />
          <p class="animate-pulse tracking-wide text-sm font-medium">Acquiring GPS Signal...</p>
        </div>
      ) : props.error ? (
        <div class="flex flex-col items-center text-red-400 gap-3 py-6 text-center">
          <div class="bg-red-500/10 p-4 rounded-full mb-1 border border-red-500/20">
            <Navigation class="w-8 h-8 opacity-80" />
          </div>
          <p class="font-semibold tracking-wide">Location Error</p>
          <p class="text-sm opacity-80 max-w-[200px] leading-relaxed">{props.error}</p>
        </div>
      ) : props.location ? (
        <div class="flex flex-col items-center w-full gap-5 py-2">
          <div class="grid grid-cols-2 w-full gap-6 text-center mb-2">
            <div class="flex flex-col items-center">
              <span class="text-xs text-slate-400 font-semibold mb-2 tracking-[0.2em] uppercase">Latitude</span>
              <span class="text-3xl sm:text-4xl font-light tracking-tight text-slate-100">{props.location.latitude.toFixed(5)}</span>
            </div>
            <div class="flex flex-col items-center relative">
              {/* Divider */}
              <div class="absolute -left-3 top-2 bottom-2 w-px bg-slate-700/50"></div>
              <span class="text-xs text-slate-400 font-semibold mb-2 tracking-[0.2em] uppercase">Longitude</span>
              <span class="text-3xl sm:text-4xl font-light tracking-tight text-slate-100">{props.location.longitude.toFixed(5)}</span>
            </div>
          </div>
          
          {/* Real-time Address Section */}
          <div class="min-h-[2.5rem] flex items-center justify-center text-center px-4">
            {props.isAddressLoading ? (
               <div class="text-xs text-slate-400/80 flex items-center gap-2 animate-pulse italic">
                  <Loader2 class="w-3 h-3 animate-spin" /> Resolving area...
               </div>
            ) : props.address ? (
               <p class="text-sm text-blue-300 font-medium leading-snug drop-shadow-sm max-w-[250px]"><span class="text-slate-400 mr-1 text-xs">📍</span> {props.address}</p>
            ) : null}
          </div>

          <div class="flex items-center gap-2 mt-1 px-5 py-2 bg-slate-900/60 rounded-full border border-slate-700/80 shadow-sm backdrop-blur-md">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span class="text-sm text-slate-300 font-medium">
              Accuracy: <span class="text-blue-400 ml-1">{Math.round(props.location.accuracy)}m</span>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

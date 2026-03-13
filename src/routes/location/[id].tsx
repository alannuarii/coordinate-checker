import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { ArrowLeft, MapPin, Calendar, Compass, Target, Share2 } from "lucide-solid";
import { db, Coordinate } from "../../lib/db";

export default function LocationDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [item, setItem] = createSignal<Coordinate | null>(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      if (!params.id) {
        navigate("/", { replace: true });
        return;
      }
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        navigate("/", { replace: true });
        return;
      }
      
      const data = await db.coordinates.get(id);
      if (data) {
        setItem(data);
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Failed to load details:", err);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  });

  const handleShare = async (coord: Coordinate) => {
    const text = `Coordinate: ${coord.latitude}, ${coord.longitude}\nAddress: ${coord.address || 'Unknown'}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location',
          text: text,
          url: `https://maps.google.com/?q=${coord.latitude},${coord.longitude}`
        });
      } catch (err) {
        console.warn("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Coordinate data copied to clipboard!");
    }
  };

  return (
    <div class="flex flex-col h-full bg-slate-900 overflow-hidden relative font-sans text-slate-200">
      <header class="w-full p-4 flex items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={() => navigate("/")}
          class="p-2 -ml-2 mr-3 rounded-full hover:bg-slate-800 transition-colors active:scale-95 text-slate-300 hover:text-white"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-bold text-slate-100 flex-1 truncate">
          Location Details
        </h1>
      </header>
      
      <div class="flex-1 overflow-y-auto w-full p-4 pb-12">
        <Show when={!loading() && item()} fallback={
          <div class="animate-pulse space-y-6 pt-4">
            <div class="h-40 bg-slate-800 rounded-3xl w-full"></div>
            <div class="h-20 bg-slate-800/50 rounded-2xl w-full"></div>
            <div class="h-20 bg-slate-800/50 rounded-2xl w-full"></div>
          </div>
        }>
          {(coord) => {
            const data = coord();
            return (
              <div class="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
                
                {/* Hero / Map Placeholder styling */}
                <div class="bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border border-slate-700/60 rounded-[2rem] p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] text-center shadow-lg">
                  <div class="absolute inset-0 opacity-10" style={{
                    "background-image": "radial-gradient(#4f46e5 1px, transparent 1px)",
                    "background-size": "20px 20px"
                  }}></div>
                  <div class="bg-indigo-500/20 p-4 rounded-full mb-3 backdrop-blur-sm border border-indigo-400/20">
                    <MapPin class="w-10 h-10 text-indigo-400" />
                  </div>
                  <h2 class="text-2xl font-bold tracking-tight text-white">{data.label}</h2>
                </div>

                {/* Details Card */}
                <div class="bg-slate-800/40 border border-slate-700 rounded-3xl p-5 shadow-inner flex flex-col gap-4">
                  <div class="flex items-start gap-3">
                    <MapPin class="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs uppercase tracking-wider font-semibold text-slate-500">Address / Location</span>
                      <span class="text-[15px] text-slate-200 mt-1 leading-relaxed">
                        {data.address || "Area unknown or unmapped"}
                      </span>
                    </div>
                  </div>
                  
                  <div class="w-full h-px bg-slate-700/50"></div>
                  
                  <div class="flex items-start gap-3">
                    <Compass class="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col w-full">
                      <span class="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Coordinates</span>
                      
                      <div class="grid grid-cols-2 gap-3 w-full">
                        <div class="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                          <span class="block text-[10px] text-slate-400 mb-1">LATITUDE</span>
                          <span class="font-mono text-sm text-blue-300">{data.latitude.toFixed(6)}°</span>
                        </div>
                        <div class="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                          <span class="block text-[10px] text-slate-400 mb-1">LONGITUDE</span>
                          <span class="font-mono text-sm text-blue-300">{data.longitude.toFixed(6)}°</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="w-full h-px bg-slate-700/50"></div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-start gap-3">
                      <Target class="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                      <div class="flex flex-col">
                        <span class="text-xs uppercase tracking-wider font-semibold text-slate-500">Accuracy</span>
                        <span class="text-sm mt-0.5">± {Math.round(data.accuracy)} meters</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <Calendar class="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                      <div class="flex flex-col">
                        <span class="text-xs uppercase tracking-wider font-semibold text-slate-500">Recorded On</span>
                        <span class="text-sm mt-0.5">
                          {new Date(data.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'})} • {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div class="mt-4 flex gap-3">
                  <a 
                    href={`https://maps.google.com/?q=${data.latitude},${data.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    class="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-4 rounded-2xl font-semibold transition-colors active:scale-95"
                  >
                    <Compass class="w-5 h-5 text-blue-400" />
                    Open in Maps
                  </a>
                  
                  <button 
                    onClick={() => handleShare(data)}
                    class="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                  >
                    <Share2 class="w-5 h-5" />
                    Share
                  </button>
                </div>

              </div>
            );
          }}
        </Show>
      </div>
    </div>
  );
}

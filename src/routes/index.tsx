import { createSignal, onMount } from "solid-js";
import { Header } from "../components/Header";
import { CoordinateDisplay } from "../components/CoordinateDisplay";
import { HistoryList } from "../components/HistoryList";
import { useGeolocation } from "../lib/hooks/useGeolocation";
import { db, Coordinate } from "../lib/db";
import { Bookmark } from "lucide-solid";

export default function Home() {
  const { location, error, loading, address, isAddressLoading } = useGeolocation();
  const [history, setHistory] = createSignal<Coordinate[]>([]);
  const [saveSuccess, setSaveSuccess] = createSignal(false);

  const fetchHistory = async () => {
    try {
      const data = await db.coordinates.toArray();
      // Sort newest first
      setHistory(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  onMount(() => {
    fetchHistory();
  });

  const [isSaving, setIsSaving] = createSignal(false);

  const handleSave = async () => {
    const currentLoc = location();
    if (!currentLoc) return;

    setIsSaving(true);
    try {
      // Import here or at top of file
      const { getAddressFromCoordinates } = await import("../lib/geocoding");
      const address = await getAddressFromCoordinates(currentLoc.latitude, currentLoc.longitude);

      await db.coordinates.add({
        latitude: currentLoc.latitude,
        longitude: currentLoc.longitude,
        accuracy: currentLoc.accuracy,
        timestamp: new Date().toISOString(),
        label: `Point ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        address: address || undefined, // Store address if found
      });
      fetchHistory(); // Refresh list
      
      // Show success feedback
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      
    } catch (err) {
      console.error("Failed to save coordinate:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.coordinates.delete(id);
      fetchHistory(); // Refresh list
    } catch (err) {
      console.error("Failed to delete coordinate:", err);
    }
  };

  return (
    <div class="flex flex-col h-full bg-slate-900 overflow-hidden relative">
      <Header isActive={!loading() && !error() && !!location()} />
      
      <div class="flex-1 overflow-y-auto pb-6 flex flex-col relative w-full">
        <CoordinateDisplay location={location()} error={error()} loading={loading()} address={address()} isAddressLoading={isAddressLoading()} />
        
        {/* Action / Save Button Section */}
        <div class="flex flex-col items-center justify-center relative z-20 -mt-2 mb-6">
          {/* Success toast positioned absolutely relative to button container */}
          <div class={`absolute bottom-full mb-3 bg-green-500/90 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition-all transform pointer-events-none ${saveSuccess() ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}`}>
            Coordinate Saved!
          </div>
          
          <button
            onClick={handleSave}
            disabled={!location() || !!error() || isSaving()}
            class="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-80 text-white px-8 py-3.5 rounded-full shadow-[0_10px_30px_-5px_var(--color-blue-500)] font-semibold tracking-wide transition-all active:scale-95 border border-blue-400/50"
          >
            <Bookmark class={`w-5 h-5 ${isSaving() ? 'animate-bounce' : ''}`} />
            {isSaving() ? 'Getting Address...' : 'Save Position'}
          </button>
        </div>

        <HistoryList history={history()} onDelete={handleDelete} />
      </div>
    </div>
  );
}


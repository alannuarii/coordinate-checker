import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import "./app.css";

export default function App() {
  onMount(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Automatically register the service worker injected by vite-plugin-pwa
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .catch((error) => console.error("Service worker registration failed:", error));
    }
  });

  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Coordinate Checker</Title>
          <Meta name="theme-color" content="#0f172a" />
          <Meta name="description" content="Progressive Web App to view and save real-time GPS coordinates" />
          {/* iOS Support */}
          <Meta name="apple-mobile-web-app-capable" content="yes" />
          <Meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <Link rel="apple-touch-icon" href="/pwa-192x192.png" />
          {/* Standard Manifest */}
          <Link rel="manifest" href="/manifest.webmanifest" />
          <Suspense fallback={<div class="flex flex-col h-[100dvh] w-screen items-center justify-center text-slate-400">Loading...</div>}>
            <div class="min-h-[100dvh] bg-slate-900 text-slate-100 flex flex-col font-sans max-w-md mx-auto relative shadow-2xl shadow-slate-900 border-x border-slate-800">
              {props.children}
            </div>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

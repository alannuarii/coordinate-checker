import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Coordinate Checker</Title>
          <Meta name="theme-color" content="#0f172a" />
          <Meta name="description" content="Progressive Web App to view and save real-time GPS coordinates" />
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

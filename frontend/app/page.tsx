"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  version: string;
};

type ApiStatus = "loading" | "online" | "offline";

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [apiVersion, setApiVersion] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    async function checkBackend(): Promise<void> {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = (await response.json()) as HealthResponse;

        setApiStatus(data.status === "ok" ? "online" : "offline");
        setApiVersion(data.version);
      } catch {
        setApiStatus("offline");
        setApiVersion(null);
      }
    }

    void checkBackend();
  }, []);

  const statusLabel = {
    loading: "Checking...",
    online: "Online",
    offline: "Offline",
  }[apiStatus];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center">
        <div className="mb-8 inline-flex w-fit items-center rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
          Developer OS · v0.1.0-alpha
        </div>

        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
          Your personal operating system for software development.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Manage projects, knowledge, learning, career progress and development
          workflows from one modern workspace.
        </p>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Frontend
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xl font-medium">Online</span>
            </div>

            <p className="mt-3 text-sm text-zinc-400">
              Next.js application is running successfully.
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Backend API
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span
                className={[
                  "h-3 w-3 rounded-full",
                  apiStatus === "online"
                    ? "bg-emerald-500"
                    : apiStatus === "loading"
                      ? "bg-amber-400"
                      : "bg-red-500",
                ].join(" ")}
              />

              <span className="text-xl font-medium">{statusLabel}</span>
            </div>

            <p className="mt-3 text-sm text-zinc-400">
              {apiStatus === "online"
                ? `FastAPI version ${apiVersion ?? "unknown"} is available.`
                : apiStatus === "loading"
                  ? "Connecting to the backend service."
                  : "Backend is not running yet. It will be added in the next task."}
            </p>
          </article>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Projects", "Build and track development projects."],
            ["Knowledge", "Store notes, snippets and documentation."],
            ["Career", "Manage skills, goals and job applications."],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-xl border border-zinc-800 p-5"
            >
              <h2 className="font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
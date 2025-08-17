"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import {
  Alignment,
  Fit,
  MascotClient,
  MascotProvider,
  MascotRive,
  useMascotElevenlabs,
} from "@mascotbot-sdk/react";

function ElevenLabsAvatar() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const urlRefreshInterval = useRef<NodeJS.Timeout | null>(null);
  const connectionStartTime = useRef<number | null>(null);
  
  // Natural lip sync settings
  const [naturalLipSyncEnabled] = useState(true);
  const [lipSyncConfig] = useState({
    minVisemeInterval: 40,
    mergeWindow: 60,
    keyVisemePreference: 0.6,
    preserveSilence: true,
    similarityThreshold: 0.4,
    preserveCriticalVisemes: true,
    criticalVisemeMinDuration: 80,
  });

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    micMuted: isMuted,
    onConnect: () => {
      console.log("ElevenLabs Connected");
      setIsConnecting(false);

      // Calculate and log connection time
      if (connectionStartTime.current) {
        const timeElapsed = Date.now() - connectionStartTime.current;
        console.log(`Connection established in ${timeElapsed}ms`);
        connectionStartTime.current = null;
      }
    },
    onDisconnect: () => {
      console.log("ElevenLabs Disconnected");
      setIsConnecting(false);
    },
    onError: (error: any) => {
      console.error("ElevenLabs Error:", error);
      setIsConnecting(false);
    },
    onMessage: () => {
      // Empty handler to prevent errors
    },
    onDebug: () => {
      // Empty handler to prevent errors
    }
  });

  // Enable avatar with real-time lip sync
  const { isIntercepting, messageCount } = useMascotElevenlabs({
    conversation,
    gesture: true,
    naturalLipSync: naturalLipSyncEnabled,
    naturalLipSyncConfig: lipSyncConfig,
  });

  // Get signed URL for ElevenLabs
  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch(`/api/get-signed-url?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to get signed url: ${response.statusText}`);
    }
    const data = await response.json();
    return data.signedUrl;
  };

  // Fetch and cache signed URL
  const fetchAndCacheUrl = useCallback(async () => {
    try {
      console.log("Fetching signed URL...");
      const url = await getSignedUrl();
      setCachedUrl(url);
      console.log("Signed URL cached successfully");
    } catch (error) {
      console.error("Failed to fetch signed URL:", error);
      setCachedUrl(null);
    }
  }, []);

  // Set up URL pre-fetching and refresh
  useEffect(() => {
    // Fetch URL immediately on page load
    fetchAndCacheUrl();

    // Set up refresh interval (every 9 minutes)
    urlRefreshInterval.current = setInterval(
      () => {
        console.log("Refreshing cached URL...");
        fetchAndCacheUrl();
      },
      9 * 60 * 1000
    );

    // Cleanup on unmount
    return () => {
      if (urlRefreshInterval.current) {
        clearInterval(urlRefreshInterval.current);
        urlRefreshInterval.current = null;
      }
    };
  }, [fetchAndCacheUrl]);

  // Start conversation
  const startConversation = useCallback(async () => {
    try {
      console.log("Starting conversation...");
      setIsConnecting(true);
      connectionStartTime.current = Date.now();

      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use cached URL if available, otherwise fetch a new one
      let signedUrl = cachedUrl;
      if (!signedUrl) {
        console.log("No cached URL available, fetching new one...");
        signedUrl = await getSignedUrl();
      } else {
        console.log("Using cached URL for faster connection");
      }

      if (!signedUrl) {
        throw new Error("The signed URL is missing.");
      }
      await conversation.startSession({ signedUrl });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsConnecting(false);
      connectionStartTime.current = null;
    }
  }, [conversation, cachedUrl]);

  // Stop conversation
  const stopConversation = useCallback(async () => {
    console.log("Stopping conversation...");
    await conversation.endSession();
  }, [conversation]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    console.log(`Microphone ${newMuteState ? "muted" : "unmuted"}`);
  }, [isMuted]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: "#FFF8F0" }}>
      <div className="h-screen w-full flex items-center justify-center">
        {/* Mascot Display Area */}
        <div className="relative w-full h-full">
          {/* Background pattern SVG - now full width */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
            <img
              src="/bg_pattern.svg"
              alt=""
              className="object-cover object-center w-full h-full"
            />
          </div>

          {/* Mascot wrapper */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full">
              <MascotRive />
            </div>
          </div>

          {/* Bottom gradient overlay - now full width */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "25%",
              background: "linear-gradient(180deg, #FFF8F000 0%, #FFF8F0 90%)",
            }}
          />

          {/* Controls */}
          <div className="absolute bottom-7 left-0 right-0 flex justify-center z-20">
            <div className="flex items-center justify-center gap-4">
              {conversation.status === "connected" ? (
                <div className="flex gap-x-5">
                  <button
                    className="inline-flex items-center justify-center gap-x-2.5 h-16 w-fit p-5 text-lg font-mono rounded-[3px] truncate transition hover:opacity-90"
                    style={{
                      backgroundColor: "#FF4444",
                      color: "#FFFFFF",
                    }}
                    onClick={stopConversation}
                  >
                    End Call
                  </button>
                  <button
                    onClick={toggleMute}
                    className="inline-flex items-center justify-center gap-x-2.5 h-16 w-fit p-5 text-lg font-mono rounded-[3px] truncate transition hover:opacity-90 border"
                    style={{
                      backgroundColor: isMuted ? "rgba(255, 255, 255, 0.9)" : "#FFFFFF",
                      color: "rgba(91, 71, 55, 0.85)",
                      borderColor: "rgba(139, 108, 80, 0.2)",
                    }}
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={startConversation}
                  disabled={isConnecting}
                  className={`inline-flex items-center justify-center gap-x-2.5 h-16 w-fit p-5 text-lg font-mono rounded-[3px] truncate transition ${
                    isConnecting ? "pointer-events-none opacity-50" : "hover:opacity-90"
                  }`}
                  style={{
                    backgroundColor: "#FF8A3D",
                    color: "#FFFFFF",
                  }}
                >
                  {isConnecting ? "Connecting..." : "Start Voice Mode"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // Add your mascot .riv file to the public folder
  // Available with Mascot Bot SDK subscription
  const mascotUrl = "/mascot.riv";

  return (
    <MascotProvider>
      <main className="w-full h-screen">
        <MascotClient
          src={mascotUrl}
          artboard="Character"
          inputs={["is_speaking", "gesture"]}
          layout={{
            fit: Fit.Contain,
            alignment: Alignment.BottomCenter,
          }}
        >
          <ElevenLabsAvatar />
        </MascotClient>
      </main>
    </MascotProvider>
  );
}

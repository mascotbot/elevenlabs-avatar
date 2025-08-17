import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use Mascot Bot proxy endpoint for automatic viseme injection
    const response = await fetch("https://api.mascot.bot/v1/get-signed-url", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MASCOT_BOT_API_KEY}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      body: JSON.stringify({
        config: {
          api_key: `Bearer ${process.env.MASCOT_BOT_API_KEY}`,
          provider: "elevenlabs",
          provider_config: {
            agent_id: process.env.ELEVENLABS_AGENT_ID,
            api_key: process.env.ELEVENLABS_API_KEY,
          },
        },
      }),
      // Ensure fresh URL for WebSocket avatar connection
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to get signed URL:", errorText);
      throw new Error("Failed to get signed URL");
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic";
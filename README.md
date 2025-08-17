# ElevenLabs Avatar Integration Demo

Complete open-source example for integrating animated avatars with ElevenLabs conversational AI using Mascot Bot SDK. Real-time lip sync, WebSocket support, and production-ready React components.

![ElevenLabs Avatar Integration Demo](https://mascotbot-app.s3.amazonaws.com/rive-assets/og_assets/preview.png)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Mascot Bot SDK (provided as `.tgz` file after subscription)
- Mascot `.riv` file (provided with SDK subscription)
- ElevenLabs API key and Agent ID
- Mascot Bot API key

### Installation

1. Clone this repository:
```bash
git clone https://github.com/your-org/mascotbot-elevenlabs.git
cd mascotbot-elevenlabs
```

2. Copy the Mascot Bot SDK package to the project root:
```bash
cp /path/to/mascotbot-sdk-react-0.1.6.tgz ./
```

3. Copy your mascot .riv file to the public folder:
```bash
cp /path/to/mascot.riv ./public/
```

4. Install dependencies:
```bash
npm install
# or
pnpm install
```

5. Set up environment variables:
```bash
cp .env.example .env.local
```

6. Update `.env.local` with your credentials:
```env
MASCOT_BOT_API_KEY=your_mascot_bot_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
```

7. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo in action!

## 🎯 What This Demo Shows

This example demonstrates:

- **Real-time Lip Sync**: Perfect viseme synchronization with ElevenLabs audio streams
- **WebSocket Integration**: Automatic data extraction from ElevenLabs connections
- **Natural Mouth Movements**: Human-like lip sync processing that avoids robotic over-articulation
- **Production-Ready Components**: Complete implementation ready for deployment

## 📁 Project Structure

```
mascotbot-elevenlabs/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main demo page with ElevenLabs avatar
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── api/
│   │       └── get-signed-url/
│   │           └── route.ts  # API endpoint for ElevenLabs authentication
│   └── components/           # Additional components (if needed)
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── package.json             # Project dependencies
└── README.md               # This file
```

## 🔧 Key Features

### 1. Automatic Viseme Injection

The Mascot Bot proxy endpoint automatically injects viseme (mouth shape) data into the ElevenLabs WebSocket stream, enabling perfect lip synchronization without any modifications to ElevenLabs code.

### 2. Natural Lip Sync Processing

```typescript
// Human-like mouth movements with configurable parameters
// Important: Use useState to maintain stable object reference
const [lipSyncConfig] = useState({
  minVisemeInterval: 40,
  mergeWindow: 60,
  keyVisemePreference: 0.6,
  preserveSilence: true,
  similarityThreshold: 0.4,
  preserveCriticalVisemes: true,
  criticalVisemeMinDuration: 80,
});

useMascotElevenlabs({
  conversation,
  naturalLipSync: true,
  naturalLipSyncConfig: lipSyncConfig,
});
```

### 3. Pre-fetched URLs for Instant Connection

The demo pre-fetches signed URLs and refreshes them every 9 minutes, ensuring instant connection when users click "Start Conversation".


## 🛠️ Customization

### Using Your Own Avatar

The demo expects a mascot .riv file in the public folder. The file path is configured in `src/app/page.tsx`:

```typescript
const mascotUrl = "/mascot.riv"; // Place your .riv file in the public folder
```

You can also use a CDN URL:
```typescript
const mascotUrl = "https://your-cdn.com/your-mascot.riv";
```

Ensure your Rive file has the required inputs:
- `is_speaking` - Boolean input for lip sync
- `gesture` - Optional trigger for animated reactions

### Adjusting Lip Sync Settings

The demo includes full configuration for natural lip sync. Always use `useState` to maintain a stable object reference:

```typescript
const [lipSyncConfig] = useState({
  minVisemeInterval: 40,        // Minimum time between visemes (ms)
  mergeWindow: 60,              // Window for merging similar shapes
  keyVisemePreference: 0.6,     // Preference for distinctive shapes (0-1)
  preserveSilence: true,        // Keep silence visemes
  similarityThreshold: 0.4,     // Threshold for merging (0-1)
  preserveCriticalVisemes: true,// Never skip important shapes
  criticalVisemeMinDuration: 80,// Min duration for critical visemes (ms)
});
```

You can adjust these values based on your needs:
- **Higher `minVisemeInterval`**: Smoother, less articulated movements
- **Lower `minVisemeInterval`**: More precise articulation
- **Higher `keyVisemePreference`**: More emphasis on distinctive mouth shapes
- **Higher `similarityThreshold`**: More aggressive merging of similar visemes

### Styling

The demo uses Tailwind CSS for styling. Modify the classes in `src/app/page.tsx` to match your design requirements.

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Mascot Bot API Key (get from app.mascot.bot)
MASCOT_BOT_API_KEY=mascot_xxxxxxxxxxxxxx

# ElevenLabs Credentials
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxx
ELEVENLABS_AGENT_ID=agent_xxxxxxxxxxxxxx
```

## 🚨 Important Notes

### WebSocket Proxy Requirement

**Do NOT connect directly to ElevenLabs WebSocket URLs**. The avatar lip-sync requires viseme data that only the Mascot Bot proxy provides. Direct connections will result in no mouth movement.

### Browser Requirements

- Modern browser with WebGL2 support
- Microphone access for voice interaction
- Stable internet connection for WebSocket streaming

### Performance

- Less than 50ms audio-to-visual delay
- WebGL2 acceleration for smooth 120fps animation
- Minimal CPU usage (less than 1%)

## 🐛 Troubleshooting

### Avatar Not Moving?

1. Check browser console for WebSocket errors
2. Verify environment variables are set correctly
3. Ensure Rive file has correct input names (`is_speaking`, `gesture`)
4. Confirm you're using the Mascot Bot proxy endpoint, not direct ElevenLabs connection

### Connection Failed?

1. Verify your API keys are correct
2. Check that your ElevenLabs agent is active
3. Ensure microphone permissions are granted
4. Look for errors in the browser console

### Lip Sync Out of Sync?

1. Check network latency
2. Adjust natural lip sync parameters
3. Try different presets based on speech speed

## 📚 Documentation

For complete documentation on the Mascot Bot SDK and all available features, visit:
- [Mascot Bot Documentation](https://docs.mascot.bot)
- [ElevenLabs Integration Guide](https://docs.mascot.bot/integrations/elevenlabs)

## 📄 License

This demo is provided as an open-source example for Mascot Bot subscribers. You're free to use, modify, and deploy it as needed for your projects.

## 🤝 Support

- For SDK issues: support@mascot.bot
- For ElevenLabs issues: [ElevenLabs Support](https://elevenlabs.io/support)
- Community: [Discord Server](https://discord.gg/mascotbot)

---

Built with ❤️ by the Mascot Bot team

# Earth Pulse

<img width="2240" height="1199" alt="image" src="https://github.com/user-attachments/assets/3cf7d857-7c09-459a-9017-3b8505fd0e7d" />

**Real-time 3D planet dashboard — 10 live data feeds on a Three.js globe with browser-local AI narrator and cross-feed correlation engine.**

A single HTML file that renders an interactive 3D Earth pulling live data from USGS, NASA, NOAA, and other free public APIs. It visualizes earthquakes, the ISS, solar wind, aurora, volcanoes, asteroids, ocean temperatures, air quality, lightning, and cosmic rays — all on one dark-themed globe. **Planet Brain**, a browser-local AI powered by WebLLM and WebGPU, narrates live cross-feed patterns, answers questions about current planetary data, and provides contextual analysis when you click any data point — all running entirely in your browser with zero API keys.

![Earth Pulse Dashboard](https://img.shields.io/badge/feeds-10_live-00d4ff) ![AI](https://img.shields.io/badge/AI-browser--local-ff6600) ![No Build](https://img.shields.io/badge/build-none_required-44ff88) ![License](https://img.shields.io/badge/license-MIT-aa44ff)

---

## Quick Start

No dependencies. No build step. Just serve the files:

```bash
# Option 1: npx (one-liner)
npx serve .

# Option 2: Python
python3 -m http.server 3333

# Option 3: Any static file server
```

Open `http://localhost:3333` in your browser. Data starts flowing immediately.

> **Note:** A local server is required because the app loads a texture file. Opening `index.html` directly via `file://` will not work due to browser CORS restrictions on local files.

---

## What It Shows

### 10 Live Data Layers

| # | Layer | Source | Data | Refresh Rate |
|---|-------|--------|------|-------------|
| 1 | **Earthquakes** | [USGS](https://earthquake.usgs.gov/) | M2.5+ events worldwide, past 24h | 60 seconds |
| 2 | **ISS Position** | [Where The ISS At](https://wheretheiss.at/) | Real-time lat/lon, altitude, velocity | 5 seconds |
| 3 | **Aurora Probability** | [NOAA SWPC](https://www.swpc.noaa.gov/) | Ovation aurora model + Kp index | 5 minutes |
| 4 | **Solar X-Ray Flux** | [NOAA GOES](https://www.swpc.noaa.gov/) | Primary GOES satellite X-ray readings | 5 minutes |
| 5 | **Volcanoes** | [USGS HANS](https://volcanoes.usgs.gov/) | Elevated alert-level volcanoes (US) | 10 minutes |
| 6 | **Solar Wind** | [NOAA SWPC](https://www.swpc.noaa.gov/) | DSCOVR plasma speed, density | 1 minute |
| 7 | **Asteroids** | [NASA NeoWs](https://api.nasa.gov/) | Near-Earth objects for today | On load |
| 8 | **Ocean Temperature** | [Open-Meteo Marine](https://open-meteo.com/) | Sea surface temp at 12 ocean sample points | 30 minutes |
| 9 | **Air Quality** | [WAQI](https://waqi.info/) | AQI readings for 12 major world cities | 30 minutes |
| 10 | **Lightning** | Simulated | Based on known global storm-prone regions | Continuous |

All APIs are **free** and require **no API keys** (NASA uses the public `DEMO_KEY`, WAQI uses the `demo` token).

### Visual Elements on the Globe

- **Earthquake rings** — pulsing circles sized by magnitude, colored by depth (red = shallow, cyan = deep)
- **ISS marker** — bright cyan dot with glowing halo and orbital trail
- **Aurora bands** — translucent green (north) and purple (south) bands at high latitudes, opacity scales with Kp index
- **Volcano cones** — orange/red markers at elevated-alert volcanoes with pulsing glow rings
- **Solar wind stream** — animated yellow particle flow from the sun direction, speed scales with real solar wind data
- **Asteroid arcs** — purple trajectory lines around the globe (red for potentially hazardous)
- **Ocean temperature dots** — thermal-colored spheres (blue = cold, red = warm) at ocean sample points
- **Air quality halos** — colored rings over major cities (green = good, red = hazardous)
- **Lightning flashes** — rapid white flashes in storm-prone regions (Central Africa, SE Asia, Amazon, Gulf of Mexico)
- **Cosmic ray particles** — pink particles streaming inward from deep space, hitting the atmosphere
- **Atmospheric glow** — Fresnel shader creating a blue halo around the globe
- **Starfield** — 3,000 background stars
- **Sun glow** — pulsing light source with directional illumination

### Sidebar Dashboard

- **Solar Activity** — real-time gauges for X-ray flux, Kp index, and solar wind speed with color-coded severity
- **Live Stats** — earthquake count, elevated volcanoes, ISS altitude/position, asteroid count, max quake magnitude, aurora status
- **Event Feed** — scrolling list of notable events with timestamps and color-coded categories
- **Cross-Feed Correlation** — automatic detection of signals that align across feeds

### Cross-Feed Correlation Engine

The dashboard doesn't just display data — it watches for patterns across independent feeds:

| Correlation | Trigger | What It Means |
|-------------|---------|--------------|
| **Geomagnetic Storm** | Kp >= 5 | Aurora at unusually low latitudes, cosmic ray suppression |
| **Solar Wind Elevated** | Wind > 500 km/s | Enhanced auroral activity, satellite drag increases |
| **Seismic Cluster** | 3+ quakes within 500km in 1 hour | Possible swarm or aftershock sequence |
| **Volcanic-Seismic** | Elevated volcano + nearby earthquakes | Potential magmatic activity |
| **Solar Flare** | X-ray flux > 1e-5 W/m² | M-class or above flare, possible radio blackouts |
| **System Nominal** | No triggers active | All feeds normal, no cross-feed correlations detected |

### Planet Brain — On-Device AI

Planet Brain is a browser-local AI system that reads all 10 live feeds and provides intelligent narration, conversational chat, and contextual data analysis — entirely on-device via WebGPU.

#### How It Works

1. **Model loading:** On page load, a small language model ([SmolLM2-360M](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct)) is downloaded and loaded into your GPU via [WebLLM](https://github.com/mlc-ai/web-llm). On desktop, a larger model ([Phi-3.5-mini](https://huggingface.co/microsoft/Phi-3.5-mini-instruct)) silently upgrades in the background for deeper analysis.
2. **Ambient narration:** Every 45 seconds, Planet Brain reads the current state of all feeds and generates a 1-2 sentence insight about cross-feed patterns — rotating through topics like seismic activity, solar weather, atmospheric conditions, and more.
3. **Conversational chat:** Click "Ask the Planet" to ask questions about what's happening right now. The AI has full context of all live data and provides informed, scientific responses.
4. **Smart data tooltips:** Click any data point on the globe and Planet Brain adds a contextual AI analysis paragraph alongside the raw data.
5. **Graceful fallback:** If your browser lacks WebGPU support, the rule-based correlation engine provides narration instead.

#### Key Features

| Feature | Description |
|---------|-------------|
| **Zero API keys** | No OpenAI, no Anthropic, no cloud inference. The model runs in your browser's GPU. |
| **Privacy-first** | No data leaves your device. All inference happens locally via WebGPU. |
| **Progressive enhancement** | SmolLM2 loads in ~10-30s, Phi-3.5 upgrades silently on desktop. |
| **Minimized state** | Planet Brain minimizes to a small 🧠 icon. It pulses when new insights arrive. |
| **WebGPU required** | Chrome 113+, Edge 113+, or Safari 18+ with WebGPU enabled. |

### Locate Me

Click the crosshair button to share your browser location. The globe smoothly animates to zoom into your region and drops a pulsing marker at your coordinates.

---

## Architecture

```
earth-pulse/
├── index.html          # Everything: HTML + CSS + JS (~3,600 lines)
├── textures/
│   └── earth_night.jpg # 2K night-side Earth texture (CC BY 4.0)
└── README.md
```

### Tech Stack

- **[Three.js](https://threejs.org/) v0.170.0** — 3D rendering via CDN (ES modules with import maps)
- **[WebLLM](https://github.com/mlc-ai/web-llm)** — browser-local LLM inference via WebGPU
- **OrbitControls** — mouse/touch interaction (rotate, zoom)
- **Native Fetch API** — all data fetching, no libraries
- **Geolocation API** — browser-based user location for globe navigation
- **CSS Grid** — responsive layout
- **Zero build tools** — no npm, no webpack, no framework

### How It Works

1. **On load:** Fetches all 10 feeds in parallel, renders the 3D globe with night-side Earth texture
2. **AI initialization:** WebLLM downloads and loads SmolLM2-360M into the browser's GPU (~10-30s). On desktop, Phi-3.5-mini upgrades silently in the background after 60s.
3. **Continuous:** Each feed has its own refresh interval (5s for ISS up to 30min for ocean/air quality)
4. **Per frame:** Animates earthquake pulses, ISS glow, solar wind particles, cosmic rays, lightning flashes, volcano rings, sun glow
5. **Every 45s:** Planet Brain reads current feed state, generates an AI narration about cross-feed patterns
6. **On data update:** Re-renders affected globe layer, updates sidebar stats, runs correlation engine
7. **On data click:** Shows info panel with raw data + streams AI contextual analysis
8. **On chat:** User questions are answered with full live-data context via streaming inference

### CORS

All 8 external APIs support CORS and work directly from the browser — no proxy needed:

| API | CORS Header |
|-----|------------|
| earthquake.usgs.gov | `Access-Control-Allow-Origin: *` |
| services.swpc.noaa.gov | `Access-Control-Allow-Origin: *` |
| api.wheretheiss.at | `Access-Control-Allow-Origin: *` |
| volcanoes.usgs.gov | `Access-Control-Allow-Origin: *` |
| api.nasa.gov | Reflects requesting origin |
| marine-api.open-meteo.com | `Access-Control-Allow-Origin: *` |
| api.waqi.info | `Access-Control-Allow-Origin: *` |

---

## Controls

| Action | Effect |
|--------|--------|
| **Click + drag** | Rotate globe |
| **Scroll wheel** | Zoom in/out |
| **Layer toggles** (top-left) | Show/hide individual data layers |
| **🧠 icon** (bottom-left) | Open Planet Brain AI narrator and chat |
| **⊕ crosshair** (bottom-right) | Locate me — zoom to your region |
| **ℹ️ button** (top-right) | About modal with feature overview |
| **Do nothing** | Globe auto-rotates slowly |

---

## Customization

### Add More Cities for Air Quality

Edit the `AQ_CITIES` array in `index.html`:

```js
const AQ_CITIES = [
  { name: 'Beijing', lat: 39.9, lon: 116.4 },
  { name: 'Delhi', lat: 28.6, lon: 77.2 },
  // Add your city:
  { name: 'Berlin', lat: 52.5, lon: 13.4 },
];
```

### Add Ocean Temperature Sample Points

Edit the `OCEAN_POINTS` array:

```js
const OCEAN_POINTS = [
  { lat: 25, lon: -80 },
  // Add more points in oceans:
  { lat: 0, lon: 0 },
];
```

### Adjust Correlation Thresholds

The `runCorrelation()` function contains all rules. Modify thresholds like:

```js
// Make geomagnetic storm trigger more sensitive
if (state.solar.kp >= 4) { // was 5
```

### Change Refresh Rates

Modify the `setInterval` calls at the bottom of `init()`:

```js
setInterval(fetchEarthquakes, 30000);  // More frequent earthquake checks
setInterval(fetchISS, 3000);           // Faster ISS tracking
```

---

## Data Sources & Credits

| Source | License | URL |
|--------|---------|-----|
| USGS Earthquake Hazards Program | Public Domain | https://earthquake.usgs.gov/ |
| NOAA Space Weather Prediction Center | Public Domain | https://www.swpc.noaa.gov/ |
| NASA Near Earth Object Web Service | Public Domain | https://api.nasa.gov/ |
| USGS Volcano Hazards Program | Public Domain | https://volcanoes.usgs.gov/ |
| Where The ISS At | Free API | https://wheretheiss.at/ |
| Open-Meteo Marine API | CC BY 4.0 | https://open-meteo.com/ |
| World Air Quality Index | Free API | https://waqi.info/ |
| Solar System Scope Textures | CC BY 4.0 | https://www.solarsystemscope.com/textures/ |
| Three.js | MIT | https://threejs.org/ |
| WebLLM (MLC AI) | Apache 2.0 | https://github.com/mlc-ai/web-llm |
| SmolLM2 (HuggingFace) | Apache 2.0 | https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct |
| Phi-3.5-mini (Microsoft) | MIT | https://huggingface.co/microsoft/Phi-3.5-mini-instruct |

---

## The Concept: Why These 10 Feeds?

Everything is connected. A solar flare triggers aurora, which correlates with geomagnetic shifts. Tectonic forces behind earthquakes also drive volcanic eruptions. Ocean temperatures influence marine migration and severe weather. One dashboard, one story:

```
Sun emits flare
  -> Solar wind hits magnetosphere
    -> Aurora lights up polar regions
    -> Kp index spikes
      -> ISS crew sees aurora below
      -> Cosmic ray flux at surface shifts

Meanwhile on Earth:
  Earthquake swarm near subduction zone
    -> Volcanic alert level raised
      -> Aerosol plume degrades air quality
      -> Ocean temp anomaly near vent
        -> Lightning storm intensifies over warm water

The ISS passes overhead, tying it all together.
```

The value isn't any single feed — it's when multiple independent signals align. That's what the correlation engine watches for.

---

## License

MIT

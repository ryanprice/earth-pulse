# Earth Pulse

**Real-time 3D planet dashboard — 10 live data feeds on a Three.js globe with cross-feed correlation engine.**

A single HTML file that renders an interactive 3D Earth pulling live data from USGS, NASA, NOAA, and other free public APIs. It visualizes earthquakes, the ISS, solar wind, aurora, volcanoes, asteroids, ocean temperatures, air quality, lightning, and cosmic rays — all on one dark-themed globe with an AI-style correlation sidebar that detects when independent signals align.

![Earth Pulse Dashboard](https://img.shields.io/badge/feeds-10_live-00d4ff) ![No Build](https://img.shields.io/badge/build-none_required-44ff88) ![License](https://img.shields.io/badge/license-MIT-aa44ff)

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

---

## Architecture

```
earth-pulse/
├── index.html          # Everything: HTML + CSS + JS (~1,600 lines)
├── textures/
│   └── earth_night.jpg # 2K night-side Earth texture (CC BY 4.0)
└── README.md
```

### Tech Stack

- **[Three.js](https://threejs.org/) v0.170.0** — 3D rendering via CDN (ES modules with import maps)
- **OrbitControls** — mouse/touch interaction (rotate, zoom)
- **Native Fetch API** — all data fetching, no libraries
- **CSS Grid** — responsive layout
- **Zero build tools** — no npm, no webpack, no framework

### How It Works

1. **On load:** Fetches all 10 feeds in parallel, renders the 3D globe with night-side Earth texture
2. **Continuous:** Each feed has its own refresh interval (5s for ISS up to 30min for ocean/air quality)
3. **Per frame:** Animates earthquake pulses, ISS glow, solar wind particles, cosmic rays, lightning flashes, volcano rings, sun glow
4. **On data update:** Re-renders affected globe layer, updates sidebar stats, runs correlation engine
5. **Correlation engine:** Checks cross-feed rules on every solar/seismic data update, surfaces insights

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

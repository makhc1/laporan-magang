# CHARACTER DESIGN & SVG ILLUSTRATION SPECIFICATIONS

## 1. Overview & Concept
To avoid stiff or mismatched assets, all five squad members (**Ahmad, Abimanyu, Rafly, Fero, and Alfi**) are rendered using a cohesive, custom 2D vector SVG character illustration style. Inspired by modern competitive game operator cards (like *THE FINALS* and tactical esports banners), each character features a distinct silhouette, body build, role badge, and color aura while maintaining a unified dark tactical aesthetic.

---

## 2. Global SVG Character Structure
Every SVG character component should be wrapped in a responsive container with a fixed aspect ratio (`viewBox="0 0 240 320"`).

```xml
<svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
  <!-- 1. Background Aura / Spotlight Glow -->
  <ellipse cx="120" cy="280" rx="70" ry="18" fill="var(--accent-glow)" opacity="0.4" filter="blur(8px)" />
  
  <!-- 2. Character Torso & Shoulders (Based on Build Type) -->
  <!-- 3. Head, Visor / Tactical Gear & Facial Expression -->
  <!-- 4. Role Accent Badges & Division Insignia -->
</svg>
```

---

## 3. Character Profiles & Visual Specifications

### 3.1 Ahmad (Full-Stack & IT Support)
* **Build Type:** Medium Build (`width="140"`, athletic posture).
* **Primary Accent Color:** Radiant Gold (`#facc15`).
* **Secondary Tone:** Dark Slate Tactical (`#181c26`).
* **Visual Details:** 
  * Wearing a fitted tactical zip-jacket with a golden chest emblem.
  * Short neat haircut, focused gaze, subtle code bracket overlay (`</>`) on the shoulder pad.
  * Standing pose with arms crossed or one hand holding a mobile tablet mockup.

### 3.2 Abimanyu (System & Network Build)
* **Build Type:** Heavy Build (`width="160"`, broad shoulders, robust stance).
* **Primary Accent Color:** Crimson Red (`#ef4444`).
* **Secondary Tone:** Carbon Black (`#0f0507`).
* **Visual Details:**
  * Heavy-duty tactical utility vest with cable management pouches.
  * Strong jawline, short buzz cut, wearing a rugged headset communication band.
  * Standing pose with arms akimbo, projecting stability and infrastructure strength.

### 3.3 Rafly (Frontend & UI/UX Build)
* **Build Type:** Light Build (`width="120"`, lean and agile posture).
* **Primary Accent Color:** Cyan / Electric Blue (`#38bdf8`).
* **Secondary Tone:** Deep Navy (`#0b1329`).
* **Visual Details:**
  * Sleek minimalist windbreaker jacket with asymmetrical diagonal stripe.
  * Modern styled hair, confident smile, holding a stylus/design tablet outline.
  * Dynamic leaning posture with an active floating wireframe UI card nearby.

### 3.4 Fero (Data & Archive Ops)
* **Build Type:** Medium Build (`width="135"`, balanced posture).
* **Primary Accent Color:** Emerald Green (`#10b981`).
* **Secondary Tone:** Dark Forest (`#062318`).
* **Visual Details:**
  * Structured corporate-tactical jacket with orderly document pouch badges.
  * Calm demeanor, neat hairstyle, wearing tactical wire-rim glasses.
  * Standing upright holding an encrypted digital dossier folder.

### 3.5 Alfi (Technical & Media Support)
* **Build Type:** Light-Medium Build (`width="130"`, agile and ready stance).
* **Primary Accent Color:** Cyber Purple (`#a855f7`).
* **Secondary Tone:** Dark Violet (`#1e102d`).
* **Visual Details:**
  * Lightweight technical hoodie with multimedia badge patches.
  * Energetic expression, wearing a media headset microphone around the neck.
  * Ready stance with one hand gesturing toward a floating camera/lens icon.

---

## 4. Implementation Guidelines for AI Agents & Developers
1. **No External Raster Dependencies:** Never rely on external PNG/JPG avatar links that might break; use inline SVG paths or structured vector data.
2. **Scalability:** Ensure all SVG coordinate units scale cleanly across mobile viewports and large projection screens.
3. **Interactive States:** When a character card is selected, apply an active glow filter (`filter: drop-shadow(0 0 16px #facc15)`) and elevate the SVG container by `translate-y-2`.
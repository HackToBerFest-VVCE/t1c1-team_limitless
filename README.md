# ScamLens AI — Think Before You Trust

> **AI-Powered Scam Detection • Multimodal Screenshot Vision • Real QR Code Inspector • Multilingual Protection • Scam Psychologist**

---

## 🌟 1. Product Vision & Differentiator

ScamLens AI answers three critical questions for every message, link, QR code, or screenshot:

1. **Can I trust this message, email, URL, or QR code?**
2. **What specific evidence makes it suspicious?**
3. **How is the sender trying to manipulate me psychologically?**

### The Key Differentiator: Scam Psychologist

Most legacy security solutions only label content with a dry "Spam" or "Clean" score. **ScamLens AI** goes deeper by identifying and unmasking the **9 cognitive manipulation tactics** used by modern scammers:

* **FEAR & THREATS** — Fabricated account suspensions and legal/police consequences.
* **ARTIFICIAL URGENCY** — Tight artificial deadlines ("within 24 hours") designed to starve the brain of reflection time.
* **TRUST IMPERSONATION** — Counterfeit brand logos and sender headers imitating banks, postal couriers, and tax offices.
* **AUTHORITY PRESSURE** — Exploitation of social deference to executive or governmental rank.
* **REWARD BAIT** — Dopamine spikes induced by lottery prizes, unclaimed crypto grants, or refunds.
* **SECRECY & ISOLATION** — Coercing victims to hide transactions from family, friends, or bank tellers.
* **EMOTIONAL MANIPULATION** — Leveraging guilt, sympathy, or fabricated hospital emergencies.
* **FINANCIAL PRESSURE** — Directing victims toward irreversible gift cards, wire transfers, or crypto.
* **CREDENTIAL HARVESTING** — Disguising OTP, PIN, and password requests as routine verifications.

ScamLens AI illustrates the **Cognitive Manipulation Chain**:
$$\text{Message Clue} \longrightarrow \text{Mental Trigger} \longrightarrow \text{Cognitive Vulnerability} \longrightarrow \text{Safer Defense Shield}$$

---

## 🎨 2. Visual Design & Theme

ScamLens AI features a light, colorful, modern cybersecurity and fintech interface:

| Element | Color Hex | Description |
| :--- | :--- | :--- |
| **Background** | `#F8FAFF` | Ultra-clean soft white-blue canvas |
| **Cards** | `#FFFFFF` | Crisp white cards with soft elevated shadows |
| **Primary Indigo** | `#4F46F5` | Modern cybersecurity brand primary |
| **Violet** | `#7C3AED` | Scam Psychologist signature accent |
| **Cyan** | `#06B6D4` | Multimodal vision & scanner highlights |
| **Mint** | `#10B981` | Safe status & protective shields |
| **Soft Lavender** | `#F1ECFF` | Cognitive breakdown panels |
| **Warning** | `#F59E0B` | Suspicious alerts |
| **Danger** | `#EF4444` | High-confidence scam alerts |
| **Main Text** | `#172554` | Deep contrast navy |

---

## 🚀 3. Core Features

### 1. Splash & Welcome Screen
* Branded original SVG logo combining a protective shield with an optical lens and scanner crosshairs.
* "Think Before You Trust" product identity.
* Language selection in 9 languages.
* "Get Started" and "Explore Demo" for frictionless evaluation.

### 2. Login & Sign-up
* Real Supabase Auth integration when credentials are configured.
* Transparent demo guest mode when Supabase is unconfigured (no fake credential roadblocks for hackathon judges).
* Password visibility toggle and input validation.

### 3. Dashboard
* Personalized user greeting or guest badge.
* Prominent **"Can I Trust This?"** quick verification bar.
* 4 main feature cards with direct navigation.
* 4 pre-configured real-world demonstration scenarios (Banking KYC alert, Delivery smishing, Crypto seed phrase drainer, Legitimate control).
* Local private scan history log.

### 4. Multimodal Screenshot Scanner
* Drag-and-drop or file upload for WhatsApp, Instagram DMs, SMS, and emails.
* Supported formats: PNG, JPEG, WebP (up to 10MB).
* Live preview with remove/replace capability.
* Visible text extraction, suspicious clue identification, and direct link to Scam Psychologist.

### 5. One-Click Safety Assistant ("Can I Trust This?")
* Modes for SMS/Chat messages, emails, and URLs.
* Plain-language verdicts: **SAFE**, **SUSPICIOUS**, and **SCAM**.
* Evidence quotes, suspicious indicators, and practical next steps.
* "Copy Summary" and "View in Scam Psychologist" actions.

### 6. Scam Psychologist Signature Module
* Live interactive psychological profiler.
* Cognitive manipulation chain visualization.
* Comprehensive catalog of the 9 manipulation tactics with detailed defense shields.

### 7. Real QR Code Inspector
* Real hardware camera scanner using `html5-qrcode` (starts only on user request, stops immediately on page leave).
* QR code image upload and manual payload input fallback.
* Payload classification: URL, Wi-Fi network, vCard, Plain Text.
* Automated URL lookalike and typosquatting inspection.
* One-click transfer to Safety Assistant.

### 8. 9-Language Genuine Internationalization
Full interface translation across:
1. **English (en)**
2. **Hindi / हिन्दी (hi)**
3. **Kannada / ಕನ್ನಡ (kn)**
4. **Tamil / தமிழ் (ta)**
5. **Telugu / తెలుగు (te)**
6. **Bengali / বাংলা (bn)**
7. **Marathi / मराठी (mr)**
8. **Spanish / Español (es)**
9. **French / Français (fr)**

### 9. Progressive Web App (PWA)
* Standalone installation on desktop and mobile browsers.
* Web App Manifest and Service Worker with safe offline fallback.
* Never caches private user messages or credentials.

---

## 🛠️ 4. Technology Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **Icons:** Lucide React
* **Routing:** React Router v6
* **Database & Auth:** Supabase (`@supabase/supabase-js`)
* **QR Scanning:** `html5-qrcode`
* **Validation:** Zod
* **Testing:** Vitest, React Testing Library, JSDOM
* **PWA:** Service Worker (`sw.js`), Web App Manifest (`manifest.webmanifest`)

---

## 💻 5. Local Development Setup

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation

1. Navigate to the project directory:
   ```bash
   cd scamlens2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173
   ```

---

## 🧪 6. Running Tests

ScamLens AI includes an automated unit test suite covering the URL inspection engine, psychological coercion extractor, and multilingual dictionaries:

```bash
npm run test
```

To run a production TypeScript build verification:
```bash
npm run build
```

---

## 🗄️ 7. Supabase Database & Backend Setup

ScamLens AI works out-of-the-box in **Demo Mode**. To connect your live Supabase project:

### Step 1: Set up Frontend Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Supabase project keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### Step 2: Apply Database Schema & RLS Migrations
Run the SQL migration in `supabase/migrations/20261026000000_scamlens_schema.sql` via the Supabase Dashboard SQL Editor or via Supabase CLI:
```bash
supabase db push
```
This sets up:
* `profiles` table with user row ownership policies.
* `scan_history` table with Row Level Security (RLS) guaranteeing that users can only view and manage their own scans.
* Automatic profile creation trigger on signup.

### Step 3: Deploy the `analyze-scam` Edge Function
Deploy the secure server-side boundary:
```bash
supabase functions deploy analyze-scam
```
Set your server-side AI provider key (e.g. Google AI Studio Gemma / Gemini key):
```bash
supabase secrets set GEMMA_API_KEY="your-verified-api-key"
```

---

## 🔒 8. Privacy & Responsible AI Commitments

1. **Zero Credential Retention:** We never store passwords, banking PINs, or SMS OTPs.
2. **Ephemeral Image Processing:** Screenshots are processed strictly for extraction and are not kept in server storage.
3. **Local Privacy Default:** Unauthenticated guest scans reside exclusively in the user's browser `localStorage` and can be purged at any time.
4. **SSRF Guardrails:** URL analysis is performed syntactically and does not download dangerous payloads from foreign websites.

---

## 🏆 9. Hackathon Demonstration Guide

For evaluators and judges, follow this 3-minute walkthrough:

1. **Open Welcome Screen (`/`)**: Observe the light theme, original logo, and switch languages using the globe selector.
2. **Click "Explore Demo"**: Lands directly on the Dashboard in guest mode without entering fake credentials.
3. **Click "Explore Demo Scenarios"**: Choose **"Urgent Bank KYC Suspension Alert"** to instantly populate the Safety Assistant.
4. **Inspect Verdict & Evidence**: See the **SCAM** badge, 94/100 risk indicator, and specific domain typosquatting evidence.
5. **Open Scam Psychologist**: Examine the **Cognitive Manipulation Chain** (`FEAR + URGENCY + TRUST IMPERSONATION + CREDENTIAL HARVESTING`).
6. **Test QR Inspector (`/qr-scanner`)**: Upload a QR image or start the camera feed to see real-time payload decoding.
7. **Verify Tests**: Run `npm run test` to see all 12 unit tests passing.

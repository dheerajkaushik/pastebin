# Pastebin Clone (Next.js + Redis)

live: https://pastebin-rust.vercel.app/

A lightweight Pastebin-like web application built with **Next.js App Router**.  
Users can create text pastes and access them via unique URLs. Each paste supports optional expiration and view limits, making it suitable for sharing temporary or sensitive text.

---

## 🚀 Features

- Create and retrieve text pastes via unique links
- Optional paste expiration (time-based)
- Optional view limits per paste
- Server-rendered UI using Next.js App Router
- REST API for paste retrieval
- Deployed on Vercel

---

## 🛠️ Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Redis** (for persistence)
- **Vercel** (deployment)

---

## ▶️ Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/pastebin-rust.git
cd pastebin-rust

2️⃣ Install dependencies
npm install

3️⃣ Set environment variables

Create a .env.local file in the root:

NEXT_PUBLIC_BASE_URL=http://localhost:3000
REDIS_URL=your_redis_connection_url


You can use Redis providers like Upstash or a local Redis instance

4️⃣ Start the development server
npm run dev


Open:

http://localhost:3000

📦 Persistence Layer

This project uses Redis as its persistence layer.

-Each paste is stored as a Redis hash

-Keys follow the pattern: paste:<id>

-Stored fields include:

    -content – paste text

    -views – number of times accessed

    -max_views – optional view limit

    -expires_at – optional expiration timestamp

Redis was chosen for its speed, simplicity, and TTL support, making it ideal for temporary, high-read workloads like paste sharing.
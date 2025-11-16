# ⚡️ LZ LAGER – Die Artikelsuchmaschine für Lager-Ninjas 🧠📦

## 🚀 Was ist LZ LAGER?

Im Labyrinth der Logistik, wo verlorene Artikel zu Legenden werden und Effizienz oft nur ein Gerücht ist, kommt **LZ LAGER** ins Spiel – ein blitzschnelles, präzises und skalierbares Tool zur Artikelsuche in komplexen Lagerumgebungen.

Keine Geisterpaletten mehr. Keine rätselhaften Regale. Nur Ergebnisse.**

 🧰 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) – Modular, modern und bereit für alles.
- **Backend**: [Node Js - Azure Functions](https://azure.microsoft.com/en-us/services/functions/) – Skalierbar, serverless und kampferprobt.
- **Datenbank**: [MongoDB](https://www.mongodb.com/) – NoSQL, weil Lagerlogik nicht relational ist.
- **Hosting**: Azure / Vercel (je nach Einsatzzweck)

## 🎯 Features

- 🔍 **Ultraschnelle Artikelsuche** – Keine Wartezeiten, kein Frust.
- 🤖 **Intelligente Filterlogik** – Nur relevante Resultate.
- 📦 **Lagerintegration** – Bereit für Scanner, Sensoren, APIs.
- 🧱 **Modular aufgebaut** – Leicht erweiterbar für neue Lagerzonen, neue Anforderungen.
- 🧠 **UX mit Gehirn** – Minimale kognitive Belastung, maximale Klarheit.
- 🧩 **Skalierbar & rückverfolgbar** – Von kleinen Regalen bis hin zu Mega-Hubs.

## 🛠️ Setup & Installation

.env-example -> NEXT_PUBLIC_BACKEND_URL=

```bash
https://github.com/Mariano-Ryser/LZ-Front.git
cd lz-lager
npm install
npm run dev


Konstruktive Kritik ist immer willkommen. =D

medida cel 380 x 700

° Mariano Ryser


# {{}}

/my-front
├─ .next
├─ node_modules
├─ components
│   ├─ auth
│   │   ├─ AuthProvider.js
│   │   └─ client.routes.js
│   ├─ dashboard
│   │   ├─ DashboardLayout.mocule.css
│   │   └─ DashboardLayout.js
│   ├─ header
│   │   └─ Cabezera.js
│   ├─ ui
│   │   └─ LogoutButton.tsx
│   ├─ Layout.js
│   ├─ MapaAlmacen.js
│   └─ Skeleton.js
│
├─ hooks
│   └─ useProducts.js
│       
├─ pages
│   ├─ adminDash
│   │   ├─ artikel
│   │   │    ├─ components
│   │   │    │    ├─ productCreator.tsx
│   │   │    │    └─ productEditor.tsx
│   │   │    └─ index.tsx
│   │   ├─ clients
│   │   │    ├─ components
│   │   │    │    └─ ClientCreator.js
│   │   │    └─ index.tsx
│   │   ├─ regnung
│   │   │    ├─ components
│   │   │    │    ├─ RechnungCreator.tsx
│   │   │    │    ├─ RechnungPrint.tsx
│   │   │    │    └─ RechnungUpdate.tsx
│   │   │    └─ index.tsx
│   │   ├─ verkauftteArtikel
│   │   │    ├─ components
│   │   │    │    └─ ArtikelList.js
│   │   │    └─ index.tsx
│   │   └─ index.tsx
│   ├─ api
│   ├─ login
│   │   └─ index.tsx
│   ├─ mapa
│   │   └─ index.tsx
│   ├─ register
│   │   └─ index.tsx
│   ├─ _app.js
│   ├─ _document.js
│   ├─ about.tsx
│   └─ index.tsx
│
├─ public
│
├─ services
│    └─ productService.tsx
├─ styles
│
├─ utils
│   ├─ formatters.js
│   └─ loader.js
├─ .env
├─ .env-example
├─ eslint.json
├─ .gitignore
├─ next-env.d.js
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ styled-jsx.d.ts


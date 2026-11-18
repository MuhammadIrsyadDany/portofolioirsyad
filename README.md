# Muhammad Irsyad Dany — Personal Developer Portfolio

Cyber-tactical / Brutalist editorial portfolio inspired by the **Alter** design language ([alter.framer.photos](https://alter.framer.photos/)), adapted and customized for **Muhammad Irsyad Dany** (Web Developer & Full-Stack Developer).

---

## ⚡ Fitur Utama
1. **Interactive "Suit Up" Hero Stage**:
   - WebGL Canvas Shader menggunakan Three.js & GLSL fragment shader custom.
   - Dual-state mask blending: Karakter Civilian bertransisi menjadi Suited Alter Ego saat di-scroll atau disentuh kursor.
   - Efek glitch chromatic aberration (RGB split), dynamic scanlines, dan topographic contour lines.
   - Scramble/Glitch Text Morphing: Huruf raksasa `IRSYAD DANY` $\rightarrow$ `ALTER EGO`.
   - Real-time HUD: Integrity meter `000%` – `100%`, Status `Civilian` / `Transforming` / `Suited`, dan koordinat GPS `07.984° S 112.621° E // MALANG, ID`.
2. **Origin Story Section**:
   - Statement editorial personal.
   - Rute timeline interaktif: `Malang` $\rightarrow$ `Polinema` $\rightarrow$ `UTERO` $\rightarrow$ `Independent`.
3. **Power Profile (4 Core Skills)**:
   - PWR-01: Web Development (Laravel, PHP, JS, Bootstrap)
   - PWR-02: Backend & Database (MySQL, PostgreSQL, RBAC, API)
   - PWR-03: UI/UX & Interface Design
   - PWR-04: System Analysis & Problem Solving
   - Radar scanner interaktif dengan crosshair, rotating sweep, dan live readout card.
4. **Mission Files (7 Proyek Terpilih)**:
   - 01: Digital Information System (Website Development)
   - 02: Management Dashboard (Dashboard & Analytics)
   - 03: Mobile Application Development (UTERO Indonesia)
   - 04: Database Management System (Database Design)
   - 05: Authentication & Access Control (System Development)
   - 06: Company Profile Website (Web Development)
   - 07: Personal Portfolio Website (UI/UX & Web Development)
   - Floating hover preview mengikuti kursor mouse.
   - Drawer modal detail proyek (Briefing, Approach, Debrief).
5. **Dossier & Terminal Modals**:
   - Modal About: Dossier lengkap, career record, dan **interactive drag comparison slider** untuk membandingkan foto Civilian vs Suited.
   - Modal Contact: Form terminal `TX-01` untuk briefing misi baru.
6. **Footer & Signal Beacon**:
   - Headline `SEND THE SIGNAL ↗`.
   - Tautan langsung ke LinkedIn (`@muhammadirsyaddany`) dan live portfolio Cloudflare Pages (`irsyaddany-portfolio.pages.dev`).

---

## 💻 Cara Menjalankan Lokal

### Menggunakan PHP Built-in Server:
```bash
php -S localhost:8080
```
Buka browser: **http://localhost:8080**

### Menggunakan Node.js / npx serve:
```bash
npx serve
```

---

## ☁️ Panduan Deploy ke Cloudflare Pages

Project ini dibangun dengan **100% Pure Static Web Architecture** (HTML5, CSS3, Vanilla JavaScript, Three.js) sehingga **sangat cepat dan gratis selamanya di Cloudflare Pages**.

### Opsi 1: Direct Upload via Cloudflare Dashboard
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Buka menu **Workers & Pages** $\rightarrow$ klik **Create application** $\rightarrow$ pilih tab **Pages**.
3. Pilih **Upload assets**.
4. Beri nama proyek (misal: `irsyaddany-portfolio`).
5. Drag & drop folder `portofolioirsyad` (seluruh isi folder: `index.html`, folder `assets/`).
6. Klik **Deploy site**.
7. Website Anda langsung live di `https://irsyaddany-portfolio.pages.dev`!

### Opsi 2: Otomatis via Git (GitHub / GitLab)
1. Push project ini ke repository GitHub Anda (misal: `github.com/MuhammadIrsyadDany/portofolio`).
2. Di Cloudflare Pages, pilih **Connect to Git** dan pilih repository tersebut.
3. Pada pengaturan build:
   - **Framework preset**: `None`
   - **Build command**: *(kosongkan)*
   - **Build output directory**: `/` *(atau kosongkan untuk root)*
4. Klik **Save and Deploy**. Setiap kali Anda melakukan git push, Cloudflare akan otomatis mengupdate websitenya.

---

## 🖼️ Cara Mengganti Foto Proyek dengan Screenshot Asli Anda
Bila Anda ingin mengganti foto proyek dengan screenshot asli dari aplikasi/sistem yang pernah Anda buat:
1. Simpan screenshot aplikasi Anda ke dalam folder: `assets/images/`
   Contoh: `assets/images/screenshot-dashboard.png`, `assets/images/screenshot-mobile.png`.
2. Buka file [assets/js/main.js](file:///c:/xampp3/htdocs/portofolioirsyad/assets/js/main.js).
3. Pada array `PROJECTS_DATA` (baris ~180), ubah properti `image:` sesuai nama file gambar baru Anda.

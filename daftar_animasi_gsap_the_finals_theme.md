# DAFTAR REKOMENDASI ANIMASI GSAP — WEB PKL (THE FINALS THEME)

Berikut adalah daftar efek animasi **GSAP (GreenSock)** per bagian halaman supaya tampilan web presentasi PKL kelompok kamu berasa kayak *game menu* beneran dan nggak kaku:

---

### 1. Hero Section (Landing Page)
* **Headline "Slam & Skew" Entrance:**
  * **Target:** Judul besar (`SATU ARENA WEB, LIMA CONTESTANT`) & badge merah di atasnya.
  * **Efek:** Teks muncul dari bawah sambil agak miring (*skew*), lalu "ngebanting" (*slam*) ke posisi tegak secara berurutan per baris.
  * **Properti GSAP:** `gsap.from()` $\rightarrow$ `y: 80`, `skewY: 5`, `opacity: 0`, `stagger: 0.12`, `ease: "back.out(1.7)"`.
* **Bento Metrics Counter & Pop-Up:**
  * **Target:** 4 kotak statistik (Jumlah Contestant, Jurnal, Project, 3 Bulan).
  * **Efek:** Kotak membesar dari `scale: 0.8` secara berurutan (*stagger*), sementara angkanya jalan ngitung naik dari $0$ ke angka asli.
  * **Properti GSAP:** `gsap.from()` $\rightarrow$ `scale: 0.8`, `opacity: 0`, `stagger: 0.08`, ditambah `snap: { innerText: 1 }` untuk efek angka berjalan.
* **Active Roster Slide-In:**
  * **Target:** Daftar 5 anggota (**Ahmad, Abimanyu, Rafly, Fero, Alfi**) di kartu sebelah kanan.
  * **Efek:** Kartu nama meluncur masuk satu per satu dari sisi kanan layar.
  * **Properti GSAP:** `gsap.from()` $\rightarrow$ `x: 60`, `opacity: 0`, `stagger: 0.1`, `ease: "power3.out"`.

---

### 2. Background & Ambient Arena
* **Diagonal Crimson Stripes Drift:**
  * **Target:** Garis-garis merah diagonal di background Hero & Stage.
  * **Efek:** Bergeser pelan-pelan tanpa henti (*infinite loop*) supaya background nggak kelihatan mati seperti gambar statis saat dipresentasikan di proyektor.
  * **Properti GSAP:** `gsap.to()` $\rightarrow$ `backgroundPosition: "200px 0px"`, `duration: 15`, `repeat: -1`, `ease: "none"`.

---

### 3. Panggung Karakter (`SELECT CONTESTANT`)
* **Carousel Spotlight Rotation (Saat Ganti Karakter):**
  * **Target:** 5 karakter 2D SVG di panggung.
  * **Efek:** Karakter yang dipilih meluncur mulus ke titik tengah (`left: 50%`), membesar (`scale: 1.15`), dan maju ke depan. Karakter yang tadinya di tengah otomatis mengecil dan mundur ke barisan belakang dengan efek pegas halus.
  * **Properti GSAP:** `gsap.to()` $\rightarrow$ `xPercent: -50`, `scale`, `y`, `opacity`, `duration: 0.6`, `ease: "expo.out"`.
* **Idle Breathing Animation (Efek Karakter Bernapas):**
  * **Target:** Karakter SVG yang sedang aktif di tengah panggung.
  * **Efek:** Bahu dan badan karakter naik-turun tipis secara berulang (*looping*) supaya ilustrasi 2D SVG kelihatan hidup dan nggak kaku kayak patung kardus.
  * **Properti GSAP:** `gsap.to()` $\rightarrow$ `y: -4`, `scaleY: 1.015`, `transformOrigin: "bottom center"`, `duration: 1.6`, `repeat: -1`, `yoyo: true`, `ease: "sine.inOut"`.
* **Stadium Spotlight Flicker & Beam:**
  * **Target:** Cahaya sorot kuning dari atas panggung & lingkaran cahaya di lantai.
  * **Efek:** Setiap kali pindah karakter, cahaya lampu sorot berkedip tipis cepat (kayak lampu stadion baru nyala) lalu melebar menyorot karakter yang baru dipilih.
  * **Properti GSAP:** `gsap.fromTo()` $\rightarrow$ `scaleX: 0.3`, `opacity: 0.2` menuju `scaleX: 1`, `opacity: 1`, `duration: 0.45`, `ease: "power4.out"`.
* **Contestant Bio Box Text Refresh:**
  * **Target:** Teks di dalam kotak tengah (`HEAVY BUILD // AHMAD`, Role, dan Bio) serta tombol kuning `SELECT`.
  * **Efek:** Setiap klik tombol `<` atau `>`, teks lama hilang dan teks karakter baru muncul bergeser cepat dari samping.
  * **Properti GSAP:** `gsap.fromTo()` $\rightarrow$ `x: 25`, `opacity: 0` menuju `x: 0`, `opacity: 1`, `duration: 0.3`, `ease: "power2.out"`.

---

### 4. Section Logbook & Featured Projects
* **Timeline Line Draw & Card Stagger (`ScrollTrigger`):**
  * **Target:** Garis vertikal timeline dan daftar kartu jurnal harian.
  * **Efek:** Saat layar turun ke bagian Logbook (atau saat ganti anggota), garis vertikal tergambar dari atas ke bawah (`scaleY: 0` $\rightarrow$ `1`), diikuti kartu kegiatan harian yang muncul berurutan dari bawah ke atas.
  * **Properti GSAP:** `gsap.from()` dengan `ScrollTrigger` $\rightarrow$ `y: 35`, `opacity: 0`, `stagger: 0.08`, `ease: "power2.out"`.
* **Accordion Smooth Expand/Collapse:**
  * **Target:** Detail deskripsi dan foto dokumentasi di dalam kartu jurnal harian.
  * **Efek:** Saat judul kegiatan diklik, detailnya terbuka mulus tanpa patah-patah.
  * **Properti GSAP:** `gsap.fromTo()` $\rightarrow$ `height: 0`, `opacity: 0` menuju `height: "auto"`, `opacity: 1`, `duration: 0.35`, `ease: "power2.inOut"`.
* **Project Card Hover Tilt / Lift:**
  * **Target:** Kartu *Featured Projects* di kolom kanan.
  * **Efek:** Saat kursor diarahkan ke kartu project, kartu sedikit terangkat ke atas (`y: -6`) dan *border* kuningnya menyala (*glow*).
  * **Properti GSAP:** `gsap.to()` $\rightarrow$ `y: -6`, `scale: 1.02`, `duration: 0.25`, `ease: "power1.out"`.
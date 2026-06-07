<h1 align="center">StegaSecure 🔒</h1>

<p align="center">
  <a href="https://github.com/nfalarr/StegaSecure"><img src="https://img.shields.io/badge/status-active%20development-brightgreen" alt="status"></a>
  <a href="https://stegasecure.netlify.app"><img src="https://img.shields.io/badge/demo-Netlify-00C7B7?logo=netlify&logoColor=white" alt="demo"></a>
  <a href="https://github.com/nfalarr/StegaSecure"><img src="https://img.shields.io/badge/language-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="language"></a>
  <a href="https://github.com/nfalarr/StegaSecure/tree/main"><img src="https://img.shields.io/badge/branch-main-blue?logo=github" alt="branch"></a>
  <a href="https://github.com/nfalarr/StegaSecure"><img src="https://img.shields.io/badge/repository-public-blue?logo=github" alt="repository"></a>
  <a href="https://github.com/nfalarr/StegaSecure/stargazers"><img src="https://img.shields.io/github/stars/nfalarr/StegaSecure?style=flat&logo=github" alt="stars"></a>
</p>

Aplikasi web statis untuk menyembunyikan pesan pada gambar menggunakan metode LSB dan AES.

🌐 **Demo Aplikasi:** https://stegasecure.netlify.app

## Fitur

* Enkripsi pesan dengan AES sebelum disisipkan ke gambar.
* Penyisipan pesan ke dalam bit paling rendah (LSB) pada setiap pixel gambar.
* Ekstraksi pesan dari gambar dan dekripsi menggunakan password yang sama.
* Berjalan sepenuhnya di browser tanpa memerlukan server atau database.
* Dibangun menggunakan HTML, CSS, dan JavaScript.

## Penggunaan

### Menyisipkan Pesan

1. Upload gambar.
2. Masukkan password.
3. Ketik pesan.
4. Klik **Encode & Download Image**.

### Mengekstrak Pesan

1. Upload gambar stego.
2. Masukkan password.
3. Klik **Decode Message**.

## Catatan

* Gunakan password yang kuat untuk meningkatkan keamanan pesan.
* Hasil stego akan diunduh dalam format PNG.
* Pastikan gambar memiliki ruang yang cukup untuk menyimpan pesan terenkripsi.

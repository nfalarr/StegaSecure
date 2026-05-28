# StegaSecure 🔒

Aplikasi web statis untuk menyembunyikan pesan pada gambar menggunakan metode LSB dan AES.

## Fitur

* Enkripsi pesan dengan AES sebelum disisipkan ke gambar.
* Penyisipan pesan ke dalam bit paling rendah (LSB) pada setiap pixel gambar.
* Ekstraksi pesan dari gambar dan dekripsi menggunakan password yang sama.
* Berjalan sepenuhnya di browser tanpa memerlukan server atau database.
* Dibangun menggunakan HTML, CSS, dan JavaScript.

## Cara Menjalankan

1. Clone atau download repository ini.
2. Buka file `index.html` di browser.

Atau jalankan server lokal sederhana seperti **Live Server** di VS Code.

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

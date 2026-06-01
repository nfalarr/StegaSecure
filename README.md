# StegaSecure 🔒

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

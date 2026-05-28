# StegaSecure

Aplikasi web statis untuk menyembunyikan pesan pada gambar menggunakan metode LSB dan AES.

## Fitur

- Enkripsi pesan dengan AES sebelum disisipkan ke gambar.
- Penyisipan pesan ke dalam bit paling rendah (LSB) setiap pixel gambar.
- Ekstraksi pesan dari gambar dan dekripsi menggunakan password yang sama.
- Hanya menggunakan HTML, CSS, dan JavaScript.

## Cara Menjalankan

1. Buka `index.html` di browser.
2. Atau jalankan server lokal sederhana seperti `Live Server` di VS Code.

## Penggunaan

- Untuk menyisipkan pesan:
  1. Upload gambar.
  2. Masukkan password.
  3. Ketik pesan.
  4. Klik `Encode & Download Image`.

- Untuk mengekstrak pesan:
  1. Upload gambar stego.
  2. Masukkan password.
  3. Klik `Decode Message`.

## Catatan

- Gunakan password yang kuat.
- Hasil stego akan diunduh sebagai PNG.
- Pastikan gambar memiliki ruang yang cukup untuk pesan terenkripsi.

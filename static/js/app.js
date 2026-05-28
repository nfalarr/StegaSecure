function textToBinary(text) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

function binaryToText(binary) {
  let text = "";

  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    if (byte === "00000000") break;
    text += String.fromCharCode(parseInt(byte, 2));
  }

  return text;
}

function showAlert(message) {
  window.alert(message);
}

function setupDropZone(dropZoneId, inputId, fileNameId, previewId, previewImgId, placeholderId, deleteButtonId, storageKey) {
  const zone = document.getElementById(dropZoneId);
  const input = document.getElementById(inputId);
  const fileName = document.getElementById(fileNameId);
  const preview = document.getElementById(previewId);
  const previewImg = document.getElementById(previewImgId);

  if (!zone || !input || !fileName) return;

  function updateFileLabel(files) {
    if (files && files.length) {
      fileName.textContent = files[0].name;
      showImagePreview(files[0], previewImg, preview, placeholderId, deleteButtonId, storageKey);
    } else {
      fileName.textContent = "Belum ada file dipilih";
      if (preview) preview.classList.add("hidden");
    }
  }

  zone.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    updateFileLabel(input.files);
  });

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("drop-active");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drop-active");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drop-active");
    const files = event.dataTransfer.files;
    if (files && files.length) {
      input.files = files;
      updateFileLabel(files);
    }
  });
}

function showImagePreview(file, previewImg, previewContainer, placeholderId, deleteButtonId, storageKey) {
  if (!file.type.startsWith("image/")) return;
  
  const placeholder = document.getElementById(placeholderId);
  const deleteBtn = document.getElementById(deleteButtonId);
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageData = e.target.result;
    previewImg.src = imageData;
    previewImg.classList.remove("hidden");
    if (placeholder) placeholder.classList.add("hidden");
    if (deleteBtn) deleteBtn.classList.remove("hidden");
    previewContainer.classList.remove("hidden");
    
    // Save to localStorage
    localStorage.setItem(storageKey, imageData);
  };
  reader.readAsDataURL(file);
}

function deleteImagePreview(inputId, previewImgId, deleteButtonId, previewId, placeholderId, fileNameId, storageKey) {
  const input = document.getElementById(inputId);
  const previewImg = document.getElementById(previewImgId);
  const deleteBtn = document.getElementById(deleteButtonId);
  const preview = document.getElementById(previewId);
  const placeholder = document.getElementById(placeholderId);
  const fileName = document.getElementById(fileNameId);
  
  input.value = "";
  previewImg.src = "";
  previewImg.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  if (placeholder) placeholder.classList.remove("hidden");
  if (fileName) fileName.textContent = "Belum ada file dipilih";
  
  // Remove from localStorage
  localStorage.removeItem(storageKey);
}

function loadImageFromStorage(previewImgId, previewContainerId, placeholderId, deleteButtonId, storageKey) {
  const imageData = localStorage.getItem(storageKey);
  if (imageData) {
    const previewImg = document.getElementById(previewImgId);
    const previewContainer = document.getElementById(previewContainerId);
    const placeholder = document.getElementById(placeholderId);
    const deleteBtn = document.getElementById(deleteButtonId);
    
    if (previewImg && previewContainer) {
      previewImg.src = imageData;
      previewImg.classList.remove("hidden");
      if (placeholder) placeholder.classList.add("hidden");
      if (deleteBtn) deleteBtn.classList.remove("hidden");
      previewContainer.classList.remove("hidden");
    }
  }
}

function initDragAndDrop() {
  setupDropZone("encodeDropZone", "encodeImage", "encodeFileName", "encodePreview", "encodePreviewImg", "encodePreviewPlaceholder", "encodeDeleteBtn", "encodeImageData");
  setupDropZone("decodeDropZone", "decodeImage", "decodeFileName", "decodePreview", "decodePreviewImg", "decodePreviewPlaceholder", "decodeDeleteBtn", "decodeImageData");
  
  // Load images from localStorage
  loadImageFromStorage("encodePreviewImg", "encodePreview", "encodePreviewPlaceholder", "encodeDeleteBtn", "encodeImageData");
  loadImageFromStorage("decodePreviewImg", "decodePreview", "decodePreviewPlaceholder", "decodeDeleteBtn", "decodeImageData");
  
  // Setup delete buttons
  const encodeDeleteBtn = document.getElementById("encodeDeleteBtn");
  if (encodeDeleteBtn) {
    encodeDeleteBtn.addEventListener("click", () => {
      deleteImagePreview("encodeImage", "encodePreviewImg", "encodeDeleteBtn", "encodePreview", "encodePreviewPlaceholder", "encodeFileName", "encodeImageData");
    });
  }
  
  const decodeDeleteBtn = document.getElementById("decodeDeleteBtn");
  if (decodeDeleteBtn) {
    decodeDeleteBtn.addEventListener("click", () => {
      deleteImagePreview("decodeImage", "decodePreviewImg", "decodeDeleteBtn", "decodePreview", "decodePreviewPlaceholder", "decodeFileName", "decodeImageData");
    });
  }
}

document.addEventListener("DOMContentLoaded", initDragAndDrop);

function encodeMessage() {
  const imageInput = document.getElementById("encodeImage");
  const message = document.getElementById("secretMessage").value.trim();
  const password = document.getElementById("encodePassword").value.trim();

  if (!imageInput.files[0] || !message || !password) {
    showAlert("Lengkapi semua input!");
    return;
  }

  const encrypted = CryptoJS.AES.encrypt(message, password).toString();
  const binaryMessage = textToBinary(encrypted + "\0");

  const img = new Image();
  img.src = URL.createObjectURL(imageInput.files[0]);
  img.onload = function () {
    const canvas = document.getElementById("encodeCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const maxBits = pixels.length / 4;

    if (binaryMessage.length > maxBits) {
      showAlert("Pesan terlalu panjang untuk gambar ini!");
      URL.revokeObjectURL(img.src);
      return;
    }

    for (let i = 0; i < binaryMessage.length; i += 1) {
      const bit = parseInt(binaryMessage[i], 10);
      const pixelIndex = i * 4;
      pixels[pixelIndex] = (pixels[pixelIndex] & 0xfe) | bit;
    }

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        showAlert("Gagal membuat gambar stego.");
        URL.revokeObjectURL(img.src);
        return;
      }

      const link = document.createElement("a");
      link.download = "stegasecure.png";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      URL.revokeObjectURL(img.src);
      showAlert("Pesan berhasil disisipkan!");
    }, "image/png");
  };

  img.onerror = function () {
    showAlert("Gagal memuat gambar. Pastikan file gambar valid.");
  };
}

function decodeMessage() {
  const imageInput = document.getElementById("decodeImage");
  const password = document.getElementById("decodePassword").value.trim();

  if (!imageInput.files[0] || !password) {
    showAlert("Lengkapi semua input!");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(imageInput.files[0]);
  img.onload = function () {
    const canvas = document.getElementById("decodeCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let binary = "";

    for (let i = 0; i < pixels.length; i += 4) {
      binary += pixels[i] & 1;
    }

    const extractedText = binaryToText(binary);
    if (!extractedText) {
      showAlert("Tidak ada pesan yang ditemukan di gambar ini.");
      URL.revokeObjectURL(img.src);
      return;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(extractedText, password).toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error("Password salah atau data rusak");
      }

      document.getElementById("decodedMessage").value = decrypted;
      showAlert("Pesan berhasil didecode!");
    } catch (error) {
      showAlert("Password salah atau data rusak!");
    } finally {
      URL.revokeObjectURL(img.src);
    }
  };

  img.onerror = function () {
    showAlert("Gagal memuat gambar. Pastikan file gambar valid.");
  };
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    observer.observe(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}

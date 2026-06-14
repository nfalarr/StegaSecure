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

function imageDataToFile(dataUrl, fileName) {
  const parts = dataUrl.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], fileName, { type: mime });
}

function assignInputFile(input, file) {
  if (!input || !file) return;

  try {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
  } catch (error) {
    input.value = "";
  }
}

function getSelectedImage(inputId, storageKey, fallbackName) {
  const input = document.getElementById(inputId);

  if (input && input.files && input.files[0]) {
    return {
      source: URL.createObjectURL(input.files[0]),
      revoke: true,
    };
  }

  const imageData = localStorage.getItem(storageKey);
  if (!imageData) return null;

  try {
    const file = imageDataToFile(imageData, fallbackName);
    assignInputFile(input, file);
  } catch (error) {
    localStorage.removeItem(storageKey);
    return null;
  }

  return {
    source: imageData,
    revoke: false,
  };
}

function loadImage(source, onLoad, onError) {
  const img = new Image();

  img.onload = function () {
    onLoad(img);
  };

  img.onerror = function () {
    if (source.revoke) URL.revokeObjectURL(source.source);
    onError();
  };

  img.src = source.source;
}

function showAlert(message) {
  window.alert(message);
}

function fitDropZoneToImage(previewImg, previewContainer) {
  const zone = previewContainer.closest(".file-drop-zone");
  if (!zone || !previewImg.naturalWidth || !previewImg.naturalHeight) return;

  zone.style.setProperty("--preview-aspect-ratio", `${previewImg.naturalWidth} / ${previewImg.naturalHeight}`);
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
      zone.classList.remove("has-image");
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
      try {
        input.files = files;
      } catch (error) {
        assignInputFile(input, files[0]);
      }
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
    previewImg.onload = () => fitDropZoneToImage(previewImg, previewContainer);
    previewImg.src = imageData;
    previewImg.classList.remove("hidden");
    if (placeholder) placeholder.classList.add("hidden");
    if (deleteBtn) deleteBtn.classList.remove("hidden");
    previewContainer.classList.remove("hidden");
    const zone = previewContainer.closest(".file-drop-zone");
    if (zone) zone.classList.add("has-image");
    
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
  
  if (input) input.value = "";
  if (previewImg) {
    previewImg.src = "";
    previewImg.classList.add("hidden");
  }
  if (deleteBtn) deleteBtn.classList.add("hidden");
  if (placeholder) placeholder.classList.remove("hidden");
  if (fileName) fileName.textContent = "Belum ada file dipilih";
  if (preview) preview.classList.add("hidden");
  const zone = preview ? preview.closest(".file-drop-zone") : null;
  if (zone) {
    zone.classList.remove("has-image");
    zone.style.removeProperty("--preview-aspect-ratio");
  }
  
  // Remove from localStorage
  localStorage.removeItem(storageKey);
}

function loadImageFromStorage(previewImgId, previewContainerId, placeholderId, deleteButtonId, storageKey, inputId, fileNameId) {
  const imageData = localStorage.getItem(storageKey);
  if (imageData) {
    const previewImg = document.getElementById(previewImgId);
    const previewContainer = document.getElementById(previewContainerId);
    const placeholder = document.getElementById(placeholderId);
    const deleteBtn = document.getElementById(deleteButtonId);
    const input = document.getElementById(inputId);
    const fileName = document.getElementById(fileNameId);
    
    if (previewImg && previewContainer) {
      previewImg.onload = () => fitDropZoneToImage(previewImg, previewContainer);
      previewImg.src = imageData;
      previewImg.classList.remove("hidden");
      if (placeholder) placeholder.classList.add("hidden");
      if (deleteBtn) deleteBtn.classList.remove("hidden");
      if (fileName) fileName.textContent = "Gambar tersimpan dari sesi sebelumnya";
      try {
        assignInputFile(input, imageDataToFile(imageData, "stegasecure-saved.png"));
      } catch (error) {
        localStorage.removeItem(storageKey);
      }
      previewContainer.classList.remove("hidden");
      const zone = previewContainer.closest(".file-drop-zone");
      if (zone) zone.classList.add("has-image");
    }
  }
}

function initDragAndDrop() {
  setupDropZone("encodeDropZone", "encodeImage", "encodeFileName", "encodePreview", "encodePreviewImg", "encodePreviewPlaceholder", "encodeDeleteBtn", "encodeImageData");
  setupDropZone("decodeDropZone", "decodeImage", "decodeFileName", "decodePreview", "decodePreviewImg", "decodePreviewPlaceholder", "decodeDeleteBtn", "decodeImageData");
  
  // Load images from localStorage
  loadImageFromStorage("encodePreviewImg", "encodePreview", "encodePreviewPlaceholder", "encodeDeleteBtn", "encodeImageData", "encodeImage", "encodeFileName");
  loadImageFromStorage("decodePreviewImg", "decodePreview", "decodePreviewPlaceholder", "decodeDeleteBtn", "decodeImageData", "decodeImage", "decodeFileName");
  
  // Setup delete buttons
  const encodeDeleteBtn = document.getElementById("encodeDeleteBtn");
  if (encodeDeleteBtn) {
    encodeDeleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteImagePreview("encodeImage", "encodePreviewImg", "encodeDeleteBtn", "encodePreview", "encodePreviewPlaceholder", "encodeFileName", "encodeImageData");
    });
  }
  
  const decodeDeleteBtn = document.getElementById("decodeDeleteBtn");
  if (decodeDeleteBtn) {
    decodeDeleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteImagePreview("decodeImage", "decodePreviewImg", "decodeDeleteBtn", "decodePreview", "decodePreviewPlaceholder", "decodeFileName", "decodeImageData");
    });
  }
}

function initPageEntrance() {
  requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPageEntrance();
  initDragAndDrop();
});

function encodeMessage() {
  const message = document.getElementById("secretMessage").value.trim();
  const password = document.getElementById("encodePassword").value.trim();
  const imageSource = getSelectedImage("encodeImage", "encodeImageData", "encode-source.png");

  if (!imageSource || !message || !password) {
    showAlert("Lengkapi semua input!");
    return;
  }

  if (typeof CryptoJS === "undefined") {
    showAlert("Library enkripsi belum termuat. Periksa koneksi internet lalu coba lagi.");
    return;
  }

  const encrypted = CryptoJS.AES.encrypt(message, password).toString();
  const binaryMessage = textToBinary(encrypted + "\0");

  loadImage(imageSource, (img) => {
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
      if (imageSource.revoke) URL.revokeObjectURL(imageSource.source);
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
        if (imageSource.revoke) URL.revokeObjectURL(imageSource.source);
        return;
      }

      const link = document.createElement("a");
      link.download = "stegasecure.png";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      if (imageSource.revoke) URL.revokeObjectURL(imageSource.source);
      showAlert("Pesan berhasil disisipkan!");
    }, "image/png");
  }, () => {
    showAlert("Gagal memuat gambar. Pastikan file gambar valid.");
  });
}

function decodeMessage() {
  const password = document.getElementById("decodePassword").value.trim();
  const imageSource = getSelectedImage("decodeImage", "decodeImageData", "decode-source.png");

  if (!imageSource || !password) {
    showAlert("Lengkapi semua input!");
    return;
  }

  if (typeof CryptoJS === "undefined") {
    showAlert("Library enkripsi belum termuat. Periksa koneksi internet lalu coba lagi.");
    return;
  }

  loadImage(imageSource, (img) => {
    const canvas = document.getElementById("decodeCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let binary = "";
    let extractedText = "";

    for (let i = 0; i < pixels.length; i += 4) {
      binary += pixels[i] & 1;

      if (binary.length === 8) {
        const charCode = parseInt(binary, 2);
        if (charCode === 0) break;
        extractedText += String.fromCharCode(charCode);
        binary = "";
      }
    }

    if (!extractedText) {
      showAlert("Tidak ada pesan yang ditemukan di gambar ini.");
      if (imageSource.revoke) URL.revokeObjectURL(imageSource.source);
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
      if (imageSource.revoke) URL.revokeObjectURL(imageSource.source);
    }
  }, () => {
    showAlert("Gagal memuat gambar. Pastikan file gambar valid.");
  });
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

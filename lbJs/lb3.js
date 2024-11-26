const originalCanvas = document.getElementById('original-image');
const processedCanvas = document.getElementById('processed-image');
const originalContext = originalCanvas.getContext('2d');
const processedContext = processedCanvas.getContext('2d');

let originalImageData = null;

function loadImage(file) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
        originalCanvas.width = image.width;
        originalCanvas.height = image.height;
        processedCanvas.width = image.width;
        processedCanvas.height = image.height;
        originalContext.drawImage(image, 0, 0);
        originalImageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        processedContext.drawImage(image, 0, 0);
    };
}

function applyBrightness(value) {
    const imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalCanvas.width, originalCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] += value; // Red channel
        data[i + 1] += value; // Green channel
        data[i + 2] += value; // Blue channel
    }
    processedContext.putImageData(imageData, 0, 0);
}

function applyContrast(value) {
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    const imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalCanvas.width, originalCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128; // Red channel
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green channel
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue channel
    }
    processedContext.putImageData(imageData, 0, 0);
}

function applyLinearContrast() {
    const imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalCanvas.width, originalCanvas.height);
    const data = imageData.data;
    let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 4) {
        min = Math.min(min, data[i], data[i + 1], data[i + 2]);
        max = Math.max(max, data[i], data[i + 1], data[i + 2]);
    }
    const range = max - min;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] - min) * 255 / range; // Red channel
        data[i + 1] = (data[i + 1] - min) * 255 / range; // Green channel
        data[i + 2] = (data[i + 2] - min) * 255 / range; // Blue channel
    }
    processedContext.putImageData(imageData, 0, 0);
}

document.getElementById('image-upload').addEventListener('change', (event) => {
    loadImage(event.target.files[0]);
});

document.getElementById('brightness-slider').addEventListener('input', (event) => {
    applyBrightness(parseInt(event.target.value));
});

document.getElementById('contrast-slider').addEventListener('input', (event) => {
    applyContrast(parseInt(event.target.value));
});

document.getElementById('apply-linear-contrast').addEventListener('click', () => {
    applyLinearContrast();
});
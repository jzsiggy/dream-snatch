const canvas = document.getElementById('screenshot');
const ctx = canvas.getContext('2d');
let cropper;

window.api.onCaptureScreen((stream) => {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    stream.getTracks().forEach(t => t.stop());
    cropper = new Cropper(canvas, { viewMode: 1 });
  };
});

const radiusInput = document.getElementById('radius');
const shadowInput = document.getElementById('shadow');
const bgColorInput = document.getElementById('bgColor');

function applyStyles() {
  canvas.style.setProperty('--radius', radiusInput.value + 'px');
  canvas.style.setProperty('--shadow', shadowInput.checked ? '0 4px 10px rgba(0,0,0,0.3)' : 'none');
  document.body.style.background = bgColorInput.value;
}

radiusInput.addEventListener('input', applyStyles);
shadowInput.addEventListener('change', applyStyles);
bgColorInput.addEventListener('input', applyStyles);

applyStyles();

document.getElementById('download').addEventListener('click', () => {
  if (cropper) {
    const croppedCanvas = cropper.getCroppedCanvas();
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = croppedCanvas.toDataURL('image/png');
    link.click();
  }
});

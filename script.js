const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Load your frame
const frameImg = new Image();
frameImg.src = 'image/frame.png';

frameImg.onload = function () {
    console.log('✅ Frame loaded!');
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
};

frameImg.onerror = function () {
    alert('❌ Hindi mahanap ang frame.png! Siguraduhing nasa parehong folder.');
};

// Upload photo button
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.marginBottom = '15px';

    const container = document.querySelector('.container');
    container.insertBefore(fileInput, canvas);

    fileInput.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const userImg = new Image();
            userImg.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Circle cutout — sakto sa butas ng frame mo
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = 500;

                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.clip();

                // Fit photo inside circle
                const aspect = userImg.width / userImg.height;
                let drawW, drawH, drawX, drawY;
                if (aspect > 1) {
                    drawH = radius * 2;
                    drawW = drawH * aspect;
                    drawX = centerX - drawW / 2;
                    drawY = centerY - radius;
                } else {
                    drawW = radius * 2;
                    drawH = drawW / aspect;
                    drawX = centerX - drawW / 2;
                    drawY = centerY - drawH / 2;
                }
                ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
                ctx.restore();

                // Draw frame on top
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
            };
            userImg.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });
});

// Download button
downloadBtn.addEventListener('click', function () {
    const link = document.createElement('a');
    link.download = 'AltarServer_Frame.png';
    const dataURL = canvas.toDataURL('image/png');
    link.href = canvas.toDataURL();
    link.click();
});

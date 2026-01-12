// server.js - Simple server for tablet clock display
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const BACKGROUNDS_DIR = path.join(__dirname, 'backgrounds');

// Ensure backgrounds directory exists
if (!fs.existsSync(BACKGROUNDS_DIR)) {
  fs.mkdirSync(BACKGROUNDS_DIR);
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

// Get local IP for display
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Upload page HTML
const uploadPageHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Upload Background Images</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1a1a2e;
      color: #eee;
      padding: 20px;
      margin: 0;
      min-height: 100vh;
    }
    h1 { color: #fff; margin-bottom: 10px; }
    .subtitle { color: #888; margin-bottom: 30px; }
    .upload-area {
      border: 3px dashed #444;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      margin-bottom: 30px;
      transition: border-color 0.3s;
    }
    .upload-area.dragover { border-color: #4a9eff; background: rgba(74,158,255,0.1); }
    .upload-btn {
      background: #4a9eff;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 18px;
      cursor: pointer;
      margin-top: 15px;
    }
    .upload-btn:active { background: #3a8eef; }
    input[type="file"] { display: none; }
    .file-list { margin-top: 20px; }
    .file-item {
      background: #2a2a4e;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .file-item.success { border-left: 4px solid #4caf50; }
    .file-item.error { border-left: 4px solid #f44336; }
    .status { font-size: 14px; color: #888; }
    .current-images { margin-top: 40px; }
    .current-images h2 { color: #fff; margin-bottom: 15px; }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }
    .image-thumb {
      aspect-ratio: 1;
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      position: relative;
    }
    .delete-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(244,67,54,0.9);
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
  </style>
</head>
<body>
  <h1>Upload Background Images</h1>
  <p class="subtitle">Add photos from your device to the tablet display</p>

  <div class="upload-area" id="dropZone">
    <p>Tap to select images or drag & drop</p>
    <input type="file" id="fileInput" multiple accept="image/*">
    <button class="upload-btn" onclick="document.getElementById('fileInput').click()">Select Images</button>
  </div>

  <div class="file-list" id="fileList"></div>

  <div class="current-images">
    <h2>Current Backgrounds</h2>
    <div class="image-grid" id="imageGrid"></div>
  </div>

  <script>
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const imageGrid = document.getElementById('imageGrid');

    // Load current images
    async function loadImages() {
      const resp = await fetch('/api/backgrounds');
      const images = await resp.json();
      imageGrid.innerHTML = images.map(img => \`
        <div class="image-thumb" style="background-image: url('/backgrounds/\${encodeURIComponent(img)}')">
          <button class="delete-btn" onclick="deleteImage('\${img}')">&times;</button>
        </div>
      \`).join('');
    }
    loadImages();

    // Delete image
    async function deleteImage(filename) {
      if (!confirm('Delete this image?')) return;
      await fetch('/api/backgrounds/' + encodeURIComponent(filename), { method: 'DELETE' });
      loadImages();
    }

    // Handle file selection
    fileInput.addEventListener('change', (e) => uploadFiles(e.target.files));

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      uploadFiles(e.dataTransfer.files);
    });

    // Upload files
    async function uploadFiles(files) {
      for (const file of files) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = \`<span>\${file.name}</span><span class="status">Uploading...</span>\`;
        fileList.appendChild(item);

        try {
          const formData = new FormData();
          formData.append('image', file);

          const resp = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (resp.ok) {
            item.classList.add('success');
            item.querySelector('.status').textContent = 'Uploaded!';
            loadImages();
          } else {
            throw new Error('Upload failed');
          }
        } catch (e) {
          item.classList.add('error');
          item.querySelector('.status').textContent = 'Failed';
        }
      }
    }
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  // API endpoint to list background images
  if (req.url === '/api/backgrounds' && req.method === 'GET') {
    fs.readdir(BACKGROUNDS_DIR, (err, files) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
        return;
      }
      const images = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(images));
    });
    return;
  }

  // Delete background image
  if (req.url.startsWith('/api/backgrounds/') && req.method === 'DELETE') {
    const filename = decodeURIComponent(req.url.replace('/api/backgrounds/', ''));
    const filePath = path.join(BACKGROUNDS_DIR, filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      }
    });
    return;
  }

  // Upload endpoint
  if (req.url === '/api/upload' && req.method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const boundary = req.headers['content-type'].split('boundary=')[1];

      // Simple multipart parser
      const parts = buffer.toString('binary').split('--' + boundary);
      for (const part of parts) {
        if (part.includes('filename="')) {
          const filenameMatch = part.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            let filename = filenameMatch[1];
            // Sanitize filename
            filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
            // Add timestamp to avoid duplicates
            const ext = path.extname(filename);
            const base = path.basename(filename, ext);
            filename = `${base}_${Date.now()}${ext}`;

            // Extract binary data
            const dataStart = part.indexOf('\r\n\r\n') + 4;
            const dataEnd = part.lastIndexOf('\r\n');
            const fileData = Buffer.from(part.substring(dataStart, dataEnd), 'binary');

            fs.writeFile(path.join(BACKGROUNDS_DIR, filename), fileData, (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to save file' }));
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, filename }));
              }
            });
            return;
          }
        }
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No file found' }));
    });
    return;
  }

  // Serve upload page
  if (req.url === '/upload') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(uploadPageHTML);
    return;
  }

  // Serve background images
  if (req.url.startsWith('/backgrounds/')) {
    const fileName = decodeURIComponent(req.url.replace('/backgrounds/', ''));
    const filePath = path.join(BACKGROUNDS_DIR, fileName);
    const ext = path.extname(fileName).toLowerCase();

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    });
    return;
  }

  // Serve index.html
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nTablet Display Server Running!`);
  console.log(`─────────────────────────────────`);
  console.log(`Display:  http://localhost:${PORT}`);
  console.log(`Upload:   http://${localIP}:${PORT}/upload`);
  console.log(`─────────────────────────────────`);
  console.log(`\nOpen the Upload URL on your iPhone to add background images.\n`);
});

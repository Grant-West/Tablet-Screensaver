# Tablet Dashboard

A lightweight wall-mounted tablet display featuring:
- 🕐 Current time and date
- 🌤️ Weather forecast
- 🏈 NFL, MLB, and NHL scores
- 📰 Sports team news (Rams & Yankees)
- 🖼️ Rotating background images with upload capability

## Features

- **No external dependencies** - Uses only Node.js built-in modules
- **Lightweight** - ~35KB of code (plus your background images)
- **Self-contained** - All data from free public APIs
- **Cross-platform** - Runs on macOS and Windows
- **Simple setup** - Just run one script to start

---

## Requirements

- **Node.js** version 14.0.0 or higher ([download here](https://nodejs.org/))
- Git installed (to clone the repository)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/tablet-dashboard.git
cd tablet-dashboard

# That's it! No dependencies to install.
```

**Important:** Add your own background images to the `backgrounds/` folder before starting the server, or upload them through the web interface after starting.

---

## Quick Start

### macOS / Linux

```bash
# Navigate to the project folder (if not already there)
cd tablet-dashboard

# Start the server (opens browser automatically)
./start-tablet.sh

# Stop the server
./stop-tablet.sh
```

### Windows

```batch
REM Navigate to the project folder (if not already there)
cd tablet-dashboard

REM Start the server (opens browser automatically)
start-tablet.bat

REM Stop the server
stop-tablet.bat
```

The display will open automatically at: **http://localhost:3000**

---

## First Time Setup

### macOS / Linux

1. Open Terminal
2. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/YOUR-USERNAME/tablet-dashboard.git
   cd tablet-dashboard
   ```
3. Make scripts executable (first time only):
   ```bash
   chmod +x start-tablet.sh stop-tablet.sh
   ```
4. Run the start script:
   ```bash
   ./start-tablet.sh
   ```

### Windows

1. Clone the repository using Git Bash or GitHub Desktop
2. Navigate to the project folder
3. Double-click `start-tablet.bat`
4. If prompted by Windows Firewall, click "Allow access"

---

## Alternative: Using npm

If you prefer using npm directly:

```bash
# Start the server
npm start

# Then open your browser to:
# http://localhost:3000
```

---

## Customization

### Changing Your Favorite Sports Teams

By default, the display shows scores and news for:
- 🏈 **NFL:** Los Angeles Rams
- ⚾ **MLB:** New York Yankees
- 🏒 **NHL:** Pittsburgh Penguins

To change these to your favorite teams:

1. Open `index.html` in a text editor
2. Find the `TEAMS` configuration section (around line 361):
   ```javascript
   const TEAMS = {
     NFL: { name: 'Los Angeles Rams', abbr: 'LAR' },
     MLB: { name: 'New York Yankees', abbr: 'NYY' },
     NHL: { name: 'Pittsburgh Penguins', abbr: 'PIT' }
   };
   ```
3. Replace with your teams (find team abbreviations on ESPN.com):
   ```javascript
   const TEAMS = {
     NFL: { name: 'Dallas Cowboys', abbr: 'DAL' },
     MLB: { name: 'Boston Red Sox', abbr: 'BOS' },
     NHL: { name: 'Toronto Maple Leafs', abbr: 'TOR' }
   };
   ```
4. Save the file and refresh your browser

**Finding Team Abbreviations:**
- Visit [ESPN.com](https://www.espn.com/)
- Navigate to your team's page
- The URL will contain the team abbreviation (e.g., `espn.com/nfl/team/_/name/dal` → `DAL`)

---

## Uploading Background Images

When the server starts, it will display an upload URL in the terminal:

```
📱 Upload images from your phone:
   http://192.168.1.100:3000/upload
```

1. Open Safari (or any browser) on your phone
2. Navigate to the upload URL shown
3. Select and upload images from your photo library
4. Images will automatically rotate on the display

---

## Project Structure

```
Tablet/
├── index.html           # Main display page (24KB)
├── server.js            # HTTP server (11KB)
├── package.json         # Project metadata
├── backgrounds/         # Uploaded background images
│
├── start-tablet.sh      # macOS/Linux start script
├── stop-tablet.sh       # macOS/Linux stop script
├── start-tablet.bat     # Windows start script (batch)
├── start-tablet.ps1     # Windows start script (PowerShell)
├── stop-tablet.bat      # Windows stop script (batch)
├── stop-tablet.ps1      # Windows stop script (PowerShell)
│
├── README.md            # This file
├── MACOS-SETUP.txt      # Detailed macOS instructions
└── WINDOWS-SETUP.txt    # Detailed Windows instructions
```

---

## Detailed Commands

### macOS / Linux Commands

```bash
# Navigate to folder
cd tablet-dashboard

# Start server (script)
./start-tablet.sh

# Start server (npm)
npm start

# Stop server (script)
./stop-tablet.sh

# Stop server (manual)
pkill -f "node server.js"

# Check if server is running
ps aux | grep "node server.js" | grep -v grep

# Kill all Node processes
killall node
```

### Windows Commands

**Command Prompt / Batch:**
```batch
REM Navigate to folder
cd tablet-dashboard

REM Start server
start-tablet.bat

REM Stop server
stop-tablet.bat
```

**PowerShell:**
```powershell
# Navigate to folder
cd tablet-dashboard

# Start server (PowerShell script)
.\start-tablet.ps1

# Start server (batch file from PowerShell)
cmd /c start-tablet.bat

# Start server (npm)
npm start

# Stop server
.\stop-tablet.ps1

# Check if server is running
Get-Process -Name node -ErrorAction SilentlyContinue

# Kill all Node processes manually
Stop-Process -Name node -Force
```

---

## Optional: Auto-Start on Boot/Login

### macOS

**Method 1: Using Automator (Recommended)**

1. Open **Automator** (Applications > Automator)
2. Create a new **Application**
3. Search for "Run Shell Script" and drag it to the workflow
4. Set Shell to `/bin/bash`
5. Paste this script:
   ```bash
   cd tablet-dashboard
   npm start &
   sleep 2
   open http://localhost:3000
   ```
6. Save as "Start Tablet Display" to Desktop or Applications
7. Go to **System Settings > General > Login Items**
8. Click **+** and select your "Start Tablet Display" app
9. Done! It will start automatically on login

**Method 2: Using LaunchAgent**
See `MACOS-SETUP.txt` for advanced LaunchAgent configuration.

### Windows

**Using Startup Folder:**

1. Press `Win+R`, type `shell:startup`, press Enter
2. Right-click in the Startup folder, select **New > Shortcut**
3. Browse to `start-tablet.bat` in your Tablet folder
4. Click OK and name it "Tablet Display"
5. Done! It will start automatically when Windows boots

---

## Troubleshooting

### General Issues

**Images don't show:**
- Make sure you're accessing `http://localhost:3000` (not opening `index.html` directly in browser)
- The server must be running to serve images

**Server won't start:**
- Run the stop script first, then try starting again
- Check if port 3000 is already in use by another application
- Verify Node.js is installed: `node --version`

**Port 3000 is in use:**
- Close other applications using port 3000
- Run the stop script to kill any hanging processes
- Try restarting your computer

### macOS Specific

**Scripts won't run:**
- Make sure they're executable: `chmod +x start-tablet.sh stop-tablet.sh`
- Run from Terminal, not by double-clicking in Finder

**"Command not found" error:**
- Make sure you're in the correct directory (use `pwd` to check)
- Navigate to the Tablet folder first using `cd` command

### Windows Specific

**Batch files won't run:**
- Try: `cmd /c start-tablet.bat`
- Right-click > "Run as Administrator" (first time only)

**PowerShell execution policy error:**
Run this once as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Network Access

To access from other devices on your network (e.g., your phone):

1. Find your computer's local IP address:
   - **macOS/Linux:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows:** `ipconfig` (look for IPv4 Address)

2. On your other device, use: `http://YOUR-IP-ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

**Note:** The server must be running on your computer for network access to work.

---

## Technical Details

### APIs Used

- **Weather:** [Open-Meteo](https://open-meteo.com/) - Free weather forecast API
- **Sports Scores:** [ESPN API](https://www.espn.com/apis/devcenter/) - Free public scores for NFL, MLB, NHL
- **Team News:** ESPN News API for Rams and Yankees

### No Dependencies

This project uses **only Node.js built-in modules**:
- `http` - HTTP server
- `fs` - File system operations
- `path` - Path utilities
- `os` - Network interface information

### Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

---

## Support

For detailed platform-specific instructions:
- macOS users: See `MACOS-SETUP.txt`
- Windows users: See `WINDOWS-SETUP.txt`

---

## License

Personal project - free to use and modify for your own needs.

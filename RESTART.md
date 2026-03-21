# How to Restart MindMap AI

Your progress is automatically saved in `C:\Users\Sudhanshu\.agent\mindmap-ai`. After you turn your laptop back on, follow these steps to resume development.

## 🚀 Easy Restart Script
I have created a script to start all services for you.
1. Open **PowerShell**.
2. Run the following command:
   ```powershell
   ./start_app.ps1
   ```

## 🛠 Manual Restart Steps

### 1. Start MongoDB
Inside the project root, run:
```powershell
& "C:\Users\Sudhanshu\.agent\mindmap-ai\mongodb\mongodb-win32-x86_64-windows-7.0.5\bin\mongod.exe" --dbpath="C:\Users\Sudhanshu\.agent\mindmap-ai\mongodb-data"
```

### 2. Start Backend Server
Open a new terminal in `server/` and run:
```powershell
npm run dev
```

### 3. Start Frontend Client
Open a new terminal in `client/` and run:
```powershell
npm run dev
```

---
**Done!** Your app will be available at [http://localhost:5173/](http://localhost:5173/).

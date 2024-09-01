# SiteSlice

[![Site Slice Demo 🌐 - Watch Video](https://cdn.loom.com/sessions/thumbnails/e800c3ff27f24cb8b561e78d790bb51e-86c6cea38da8aa0b-full-play.gif)](https://www.loom.com/share/e800c3ff27f24cb8b561e78d790bb51e)

[Site Slice Demo 🌐 - Watch Video](https://www.loom.com/share/e800c3ff27f24cb8b561e78d790bb51e)

Example site used in demo: [lic.0thdraft.com](http://lic.0thdraft.com)

[SiteSlice Design Figjam](https://www.figma.com/board/VycCxXxoyuFOHKiP6GqBw8/JB-SiteSlice?node-id=0-1&t=5XpbVy4f0RP6OwKX-1)

## Launch commands

### First-time use:
```
chmod +x launch_all.sh;chmod +x kill_all.sh
```

### Launch frontend & backend:
```
./launch_all.sh
```
*Note: launching will start two screens which will not automatically close.*

### Stop and kill all screens:
```
./kill_all.sh
```

## Manual launching

### Frontend

```
cd Frontend
npm install
npx run dev
```

### Backend

```
cd Backend
yarn install
yarn run start
```

### Testbench

*Not recommended except for viewing in editor, to make FTP changes use an example site like [lic.0thdraft.com](http://lic.0thdraft.com)*
```
cd Frontend/Testbench
export TESTBENCH=Lundahl-backup/homedir/public_html;node app.js
```
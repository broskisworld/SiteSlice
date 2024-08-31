#!/bin/sh

echo ""

cd Backend
screen -dmS siteslice-backend sh -c 'nodemon app.js; exec zsh'
cd ..
echo "🗄️  Backend/proxy started on port 80."

cd Frontend
screen -dmS siteslice-frontend sh -c 'npm run dev; exec zsh'
cd ..
echo "💻 Frontend started on port 8080"

echo ""
echo "👍 Helper commands"
echo "  screen -r siteslice-backend"
echo "  screen -r siteslice-frontend"
echo "  ./kill_all.sh"

echo ""
echo "🏢 Test site: http://lic.0thdraft.com"
echo "👉 App running at http://localhost:8080"

echo ""

# Testbench
# cd Frontend/Testbench
# export TESTBENCH=Lundahl-backup/homedir/public_html;node app.js
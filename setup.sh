#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
sudo yum update -y
sudo yum install git -y
tar -xvzf fragments-0.0.1.tgz
mv package fragments
mv .env fragments/
cd fragments
npm install
nohup npm start > app.log 2>&1 &

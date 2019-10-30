AGENT_URL=https://raw.githubusercontent.com/AsherFoster/halloween/master/agent/agent.zip

echo Installing to ~/Destkop/halloween
mkdir -P ~/Desktop/halloween
cd ~/Desktop/halloween
curl $AGENT_URL > agent.zip

unzip agent.zip
echo Unzipped!
sh install.sh

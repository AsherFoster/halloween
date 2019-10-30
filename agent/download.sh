AGENT_URL=https://raw.githubusercontent.com/AsherFoster/halloween/master/agent/agent.zip
DEST=~/Desktop/halloween-agent

echo Installing to $DEST
if [ -d $DEST ]; then
  echo Warning! $DEST already exists. Erasing in 1s
  sleep 1
  rm -rf $DEST
fi

mkdir -p $DEST
cd $DEST
curl $AGENT_URL > agent.zip

unzip agent.zip
echo Unzipped!
sh install.sh

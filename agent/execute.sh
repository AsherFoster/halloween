URL=https://asherfoster.com/halloween/client/index.html

osascript -e "set Volume 10"

if [ -d "/Applications/Google Chrome.app" ]; then
  if [ $(ps -ax | grep Google\ Chrome | wc -l | xargs) == 1 ]; then
    open /Applications/Google\ Chrome.app --args --kiosk $URL &
  else
    open -a "google chrome" $URL &
  fi
else
  open -a safari $URL &
fi

if [[ -n $1 ]]; then
  sleep $1
  afplay sound.mp4
fi

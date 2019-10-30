URL=https://asherfoster.com/halloween/client/index.html

if [ -d "/Applications/Google\ Chrome.app" ]; then
  open /Applications/Google\ Chrome.app --args $URL
else
  open -a safari $URL
fi

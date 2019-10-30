GOLIVE_MS=$(curl https://asherfoster.com/kv/golive)
GOLIVE=$((GOLIVE_MS/1000))
DELAY=$((GOLIVE - $(date +'%s')))

echo "GOLIVE is at $(date -r $GOLIVE) in ${DELAY}"

if [ $DELAY -gt 0 ]; then
  sleep $DELAY
else
  echo GOLIVE is in past
fi

sh $(dirname $(realpath $0))/execute.sh

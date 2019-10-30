GOLIVE_MS=$(curl https://asherfoster.com/kv/golive)
GOLIVE=$((GOLIVE_MS/1000 - 15)) # Open 30s before golive
DELAY=$((GOLIVE - $(date +'%s')))

echo "GOLIVE is at $(date -r $GOLIVE) in ${DELAY}"

if [ $DELAY -gt 0 ]; then
  sleep $DELAY
else
  echo GOLIVE is in past
fi

sh agent/execute.sh 15

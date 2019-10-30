GOLIVE_MS=$(curl https://asherfoster.com/kv/golive)
OFFSET=getOffset
GOLIVE=$((GOLIVE_MS/1000 - 15 - OFFSET)) # Open 30s before golive
DELAY=$((GOLIVE - $(date +'%s')))

echo "GOLIVE is at $(date -r $GOLIVE) in ${DELAY}"

if [ $DELAY -gt 0 ]; then
  sleep $DELAY
else
  echo GOLIVE is in past
fi

sh execute.sh 15

function getOffset() {
    START=$(($(gdate +%s%N)/1000000))
    SRV_TIME=$(curl https://asherfoster.com/time)
    NOW=$(($(gdate +%s%N)/1000000))
    LATENCY=$(((NOW - START)/2))
    echo $(((SRV_TIME + LATENCY - NOW)/1000))
}

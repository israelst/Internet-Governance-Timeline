jq "group_by(.institutions) | map({name: .[0].institutions, total: length}) | sort_by(.total) | reverse" $1

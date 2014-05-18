#!/bin/bash

jq 'map(select(.date != ""))[].date' data/data.json

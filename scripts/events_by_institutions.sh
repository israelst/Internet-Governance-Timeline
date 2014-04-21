#!/bin/bash

jq ".[].institutions" data/data.json | sort | uniq -c | sort -rn


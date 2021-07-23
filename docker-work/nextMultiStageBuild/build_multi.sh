#! /bin/bash

sourceDir=$1
docker build --rm -t next_multi:latest -f ./multi/Dockerfile ${sourceDir}
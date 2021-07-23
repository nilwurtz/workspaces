#! /bin/bash

sourceDir=$1
docker build --rm -t next_single:latest -f ./single/Dockerfile ${sourceDir}
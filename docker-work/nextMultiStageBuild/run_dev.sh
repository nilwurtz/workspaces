#! /bin/bash

sourceDir=$1
cd `dirname $0`
echo ">>> Build image..."
docker build --rm -t next_dev:latest -f ./dev/Dockerfile ${sourceDir}

echo ">>> Start contaier..."
cd ${sourceDir}
docker run -p 3000:3000 -v $PWD:/app -it next_dev:latest
cd `dirname $0`

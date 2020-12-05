#/bin/bash
TAG=${1:-`date '+%m%d%H%M'`}

docker build -f scripts/docker/Dockerfile -t zcapp .

docker tag zcapp:latest zcapp:${TAG}
docker tag zcapp:latest zclin/zcapp:${TAG}
docker tag zcapp:latest zclin/zcapp:latest

docker push zclin/zcapp:${TAG}
docker push zclin/zcapp:latest

echo
echo "latest version is ${TAG}"
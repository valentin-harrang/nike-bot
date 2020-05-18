#!/bin/bash

docker pull dperson/torproxy
for i in {1..2}
do
	docker run --name proxy --rm -it -p 8118:8118 -p 9050:9050 -d dperson/torproxy -e
	curl -Lx http://127.0.0.1:8118 http://jsonip.com/
	docker kill proxy
done

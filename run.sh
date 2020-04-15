#!/bin/bash

for i in {1..1}
do
	docker pull dperson/torproxy
	docker run --name "proxy"$i -it -p 8118:8118 -p 9050:9050 -d dperson/torproxy -e
	curl -Lx http://127.0.0.1:8118 http://jsonip.com/
done
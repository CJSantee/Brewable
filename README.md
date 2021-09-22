# Coffee-Lab
docker run -it --rm -p 19000:19000 -p 19001:19001 -p 19002:19002 -v "$PWD:/usr/app" \
-e REACT_NATIVE_PACKAGER_HOSTNAME=10.51.82.113 \
-e EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
--name=expo cjsantee/docker-expo:1.0
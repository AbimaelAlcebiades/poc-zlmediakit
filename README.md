#POC ZLMediaKit

```shell
start msedge "http://localhost:63342/zlmediakit/frontend/flv.html?_ijt=3p1nbd5oai5606ptpa06i2ci98&_ij_reload=RELOAD_ON_SAVE"
vlc http://127.0.0.1:80/live/BigBuckBunny/hls.m3u8
start msedge "http://127.0.0.1/live/BigBuckBunny.mp4?user=abimael&password=teste&app=live"
```
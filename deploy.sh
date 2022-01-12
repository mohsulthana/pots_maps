#!/bin/bash
cd dist
mv img/ public/
mv js/ public/
mv css/ public/
mv favicon.ico public/
mv index.html public/
mv manifest.json public/
mv precache-manifest.* public/
mv robots.txt public/
mv service-worker.js public/

firebase deploy
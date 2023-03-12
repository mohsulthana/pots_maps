#!/bin/bash
cd dist
mv css/ public/
mv img/ public/
mv js/ public/
mv favicon.ico public/
mv index.html public/
mv manifest.json public/
mv precache-manifest* public/
mv robots.txt public/
mv service-worker.js public/

firebase deploy
#!/bin/bash
# The `sudo service mongod start` line below can be extracted to a Unix startup script.
sudo service mongod start & node ../server/server.js & grunt deploy
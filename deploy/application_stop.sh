#!/usr/bin/env bash
mkdir /home/ubuntu/walk/batman -p
if [ -f /home/ubuntu/.forever/pids/batman.pid ]
then
  forever stop batman
fi

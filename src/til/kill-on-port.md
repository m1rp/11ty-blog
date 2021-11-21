---
title        : "Kill processes running on specific ports"
slug         : "kill-on-poprts"
tags         : ["unix", "bash"]
categories   : ["til"]
author       : "Sam"
date         : "2021-11-19"
---
## The Problem

you had a couple of node.js apps running from you terminal and you closed the tabs. You opened a new terminal tan, tried to `npm run dev` and got hit with a `EADDRINUSE` error. You could run `ps` and try to figure out which jobs are your node apps.

## The solution

One thing you do know is what ports these apps are listening/running on.

`lsof` Lists open files and the corresponding processes. There are 2 options werer interested in here:
 - `-t` to only get the process id
 - `-i:{port||3000||8080}` to get the process that opened a specific port (you can "daisy chain" the -i option)

So when we execute `lsof -t -i:3000 -i:8080` in our shell we should get 2 pids. Cool.

We can pipe (`|`) the output of this command to `xargs`  and the `kill` command like so:

```bash
lsof -t -i:8080 -i:3000 | xargs -n1 sh -c 'kill -9 $0'
```
A quick breakdown:
 - `xargs -n1`: number of argument (1 in this case)
 - `sh -c 'kill -9 $0'` : instruct sh to run the following command and replace $0 with value from xargs


this also works
```bash
lsof -t -i:8080 -i:3000 | xargs -i % sh -c 'kill -9 %'
```
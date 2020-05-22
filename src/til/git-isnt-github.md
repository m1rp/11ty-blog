---
title        : "git isn't github"
slug         : "git-isnt-github"
tags         : ["git", "servers"]
categories   : ["til"]
author       : "Sam"
date         : "2020-05-22"
---

A lot of developpers use git everyday, a high percentage of them probabl use Github. 

I use github every work day. I use it to the extent that I use words `git` and `github` interchangeably, but this is wrong. Github is a hosting service for your git projects, like Gitlab. They offer a bunch of bells and whistles, but you can also self host your git projects, you probably already do if you have a cloned a git repo before. But you can also host your repos on a remote server that you or someone else owns.

This might seem obvious, but somehow it never really occured to me that I could pay for a server or data storage somewhere (like aws, gcp, azure to name a few) and host my git repos on there. 

I realized this by cloning a repo hosted on GCP at work that hadn't been commited to github.

ANYWAY, the procedure is similar to the one you'd use for cloning a repo from github. You need to have SSH access to the remote server. For that you need to generate a ssh key like so:

```bash
$ cd ~/.ssh && ssh-keygen -t rsa -b 4096 -C "email@example.com"
```

then you need to add the generated public key in the `authorized_keys` folder on the remote server

once that's done, you can got ahead and clone the repo:


```bash
git clone <username>@<hostname>:<repository>.git
```

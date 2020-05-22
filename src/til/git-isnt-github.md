---
title        : "Git isn't Github"
slug         : "git-isnt-github"
tags         : ["git", "servers"]
categories   : ["til"]
author       : "Sam"
date         : "2020-05-22"
---

A lot of developpers use Git everyday, a high percentage of them probably use Github. 

I use Github every work day. I use it to the extent that I use the words `Git` and `Github` interchangeably, but this is technically wrong. Github is a hosting service for your Git projects, like Gitlab. these services offer a bunch of bells and whistles, but you can also self host your Git projects. You probably already do if you have a cloned a Git repo before. But you can also host your repos on a remote server that you or someone else owns.

This might seem obvious, but somehow it never really occured to me that I could pay for a server or data storage somewhere (like AWS, GCP, Azure to name a few) and host my Git repos on there. 

I realized this by cloning a repo, hosted on a virtual machine in GCP, at work that hadn't been commited to Github.

ANYWAY, the procedure is similar to the one used for cloning a repo from Github. 

You need to have SSH access to the remote server. For that you need to generate a ssh key like so:

```bash
$ cd ~/.ssh && ssh-keygen -t rsa -b 4096 -C "email@example.com"
```

lets break that down a bit:
  - `ssh` is a short-hand for Secure SHell protocol, `ssh` is a network protocol to securely communicate between computer <sup>[1](#foot-1)</sup>, 
  - `ssh-keygen` is a CLI tool used to generate key pairs for `ssh`, this tool can take several options (or flags?)
  - the ` -t` in our command is to specify the type of algorithm used to encrypt our key, in our command we're using the `rsa` algorithm,
  - the ` -b` option specifies the number of bits in the key to create, in our command we're using `4096` bits,
  - finally, the ` -C` command is a comment, this will add our `email@example.com` to our public key (I believe that this is used on Github for authentication reasons, but i could be wrong.)

Great, we have a `ssh` key pair, but we need to add the generated public key in the `authorized_keys` folder on the remote server. There are a couple of ways to do this. For each method you need to know the `ip` address of the server, and the `user`. You can define the user when setting up your server or virtual machine. Figuring out the `ip` might be a bit trickier if you don't have a static `ip` (in GCP you can request a static 'ip', or use their CLI that gives you access to all you servers). 

```bash
ssh-copy-id -i ~/.ssh/my-new-sshkey user@host
```

The `ssh-copy-id` does what it says. It copies your ssh id to your remote host.

If your interacting with servers, you'll be ssh'ing into them regularly like so:

```bash
ssh user@host -i ~/.ssh/my-new-sshkey
```
This quickly gets old, and for several ssh type commandes you'll need to supply this info. We can add this information into our `~/.ssh/config`:

```bash
ForwardAgent yes

Host my-remote-server
  Hostname 192.168.1.20
  User user
  IdentityFile ~/.ssh/my-new-sshkey.key
```

Now you can `ssh` into your server using this config
```bash
ssh my-remote-server
```

same for `ssh-copy-id`

```bash
ssh-copy-id my-remote-server
```

Now after having spent quite some time setting up ssh access to our server, we can finally clone/push the repo!

```bash
# normal cloning
git clone user@host:my-repo.git
#cloning, but with ssh config set
git clone my-remote-server:my-repo.git

#pushing your local repo to your remote server
git remote add origin user@host:my-repo.git 
#with ssh config
git remote add origin my-remote-server:my-repo.git
```

<a name='foot-1'></a>checkout more about ssh at [https://www.ssh.com/](https://www.ssh.com/)
---
title        : "Orca on Arch"
slug         : "orca-on-arch"
tags         : ["arch", "a11y"]
categories   : ["til"]
author       : "Sam"
date         : "2021-05-05"
---

[Orca](https://help.gnome.org/users/orca/stable/) seems to be the go-to screen reader on linux systems.

On Ubuntu, the setup is straight forward
```bash
sudo apt install orca
```

similar thing for Arch

```bash
yay orca
#or
sudo pacman -S orca
```

It gets really tricky when you have a bizarre mix of window manager or GUI or sound system. [this message from a mail archive set me on the right track to solving my issue](https://mail.gnome.org/archives/orca-list/2014-March/msg00033.html)

This can be configured through `spd-conf` in the terminal.

I had to change my output from `pulse-audio` to `alsa` (I don't know why, but it worked).

The screen reader can be started by pressing `Super` + `Alt` + `S`

It can also be accessed through Settings.

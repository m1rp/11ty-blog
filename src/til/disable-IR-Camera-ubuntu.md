---
title        : "remove IR camera from lenovo on Ubuntu 20"
slug         : "ir-camera-removal"
tags         : ["hardware", "ubuntu"]
categories   : ["til"]
author       : "Sam"
date         : "2020-09-22"
---
## Problem
my lenovo Thinkpad T480 has a built in IR camera that does some basic movement
tracking and detection with some windows program, but on ubuntu it's mostly
useless. Worse than that! it's set as the default camera which isn't helpful as
it only renders a bright green output.

## Solution
I only found one solution
[here](https://askubuntu.com/questions/1119743/how-do-i-change-the-default-webcam/1119832#1119832).
The idea is to create a config file specifically for the device to "detach" it
and this config to the usb_modeswitch udev rules

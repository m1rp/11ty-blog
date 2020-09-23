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
and this config to the `usb_modeswitch` udev rules

## Step by Step

- find vendor and product id of camera
  ```
  birb@box: dmesg | grep 'Camera'
  [    2.093051] usb 1-5: Product: Integrated IR Camera
  [    3.104388] usb 1-8: Product: Integrated Camera
  [    4.617796] uvcvideo: Found UVC 1.10 device Integrated IR Camera (5986:1141)
  [    4.621236] uvcvideo 1-5:1.0: Entity type for entity Camera 1 was not initialized!
  [    4.621300] input: Integrated IR Camera: Integrate as /devices/pci0000:00/0000:00:14.0/usb1/1-5/1-5:1.0/input/input11
  [    4.622344] uvcvideo: Found UVC 1.00 device Integrated Camera (5986:2113)
  [    4.656120] uvcvideo 1-8:1.0: Entity type for entity Camera 1 was not initialized!
  [    4.656206] input: Integrated Camera: Integrated C as /devices/pci0000:00/0000:00:14.0/usb1/1-8/1-8:1.0/input/input12
  ```
- create config file for this device that will detach driver from device
  ```
  birb@box: echo "echo DetachStorageOnly=1 > /etc/usb_modeswitch.d/5986:1141" |
  sudo zsh
  ```
- open `/lib/udev/rules.d/40-usb_modeswitch.rules` and add these lines before
	the end to apply config on startup 
	```
	# IR Camera
  ATTR{idVendor}=="5986", ATTR{idProduct}=="1141", RUN+="usb_modeswitch '%k'"
	```

## Important 

make suure that you add `==` not `=`, an error in the rules will break the
whole system and require looking for a usb key with and ubuntu image, booting
from usb and looking everywhere to find where to fix your mistake (... ask me
how I found that out) 

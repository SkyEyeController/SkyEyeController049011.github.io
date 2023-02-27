---
title: Windows和Linux下 Vscode C++环境的配置
date: 2023-02-25 23:05:30
tags: VScoode C++ windows linux
categories: 教程
---

Vscode是一款相当强大的编程软件，其万能的通用插件系统可以让程序猿非常方（kun）便（nan）的完成工作。

为什么要加个kunnan？

因为方便的前提是经过安装的时候配置的痛苦（~~md绝了~~）

本片文章将详细的讲述Vscode之于windows和linux系统的C++环境的配置与调试，（~~以方便博主自己忘了的时候查阅~~）

#第一部分 Windows系统配置
##1.1 盟军机动建设车————MinGW展开部署

Vscode与其说是个编程软件，不如说是一个编程平台：它自己不会携带任何的语言编译软件，这些东西需要自己安装。

[SourceForge网站](https://sourceforge.net/projects/mingw-w64/)可以下载到全套的MinGW，但是出于外网的原因这个东西下载起来很慢，所以这里我附上了MinGW的压缩文件，下载后直接解压就可以了

[MinGW下载]()

接下来，要在Windows里面配置环境变量，让电脑知道自己集成了C语言环境（~~毕竟它不是550W~~）

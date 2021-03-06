---
title: Running Commands As Sudo or Root
shortTitle: Using Sudo Or Root
menus:
  basic/builds:
    title: Running Commands As Root
    weight: 7
tags:
  - sudo
  - packages
  - root
  - admin
categories:
  - Builds and Configuration  
redirect_from:
  - /faq/root-level-access/
  - /basic/getting-started/root-level-access/
---

* include a table of contents
{:toc}

## Sudo and Root On Codeship Basic

Codeship does not allow root level access (i.e. commands run via `sudo`) for security reasons. If you are looking to install a dependency that's not available via a language specific package manager (e.g. `gem`, `pip`, `npm` or a similar tool), please contact [support@codeship.com](mailto:support@codeship.com) or send us a message using our in-app messenger.

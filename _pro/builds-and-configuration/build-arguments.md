---
title: Using Docker Build Arguments In CI/CD
shortTitle: Build Arguments
menus:
  pro/builds:
    title: Build Arguments
    weight: 7
tags:
  - docker
  - tutorial
  - build arguments
  - secrets
  - environment
  - security
  - encryption
  - aes key

categories:
  - Builds and Configuration

redirect_from:
  - /pro/getting-started/build-arguments/
  - /docker/getting-started/build-arguments/

---

* include a table of contents
{:toc}

<div class="info-block">
This article is about using Docker build arguments with Codeship Pro.

 If you are unfamiliar with build arguments, we recommend reading [Docker's build arguments documentation](https://docs.docker.com/engine/reference/builder/#arg).

 If you are unfamiliar with Codeship Pro, we recommend our [getting started guide]({{ site.baseurl }}{% link _pro/quickstart/getting-started.md %}) or [the features overview page](http://codeship.com/features/pro).

 Note that you will also need to use the [Codeship Pro local CLI tool]({{ site.baseurl }}{% link _pro/jet-cli/usage-overview.md %}) to encrypt your build arguments.
</div>

## Overview: Build Arguments

For each service, you can declare [build arguments](https://docs.docker.com/compose/compose-file/#/args), which are values available to the image only at build time. For example, if you must pass the image a set of credentials in order to access an asset or repository when the image is built, you would pass that value to the image as a build argument.

## Build Arguments vs. Environment Variables

During a build on Codeship's Docker platform, there are three ways to pass custom values to your services:

* Build arguments or encrypted build arguments: available only at image build time
* ENV variable declared in Dockerfile: available at build time and runtime
* environment or encrypted environment: available only at runtime

Build arguments are unique in that they are available only at build time. They are not persisted in the image. However, you may assign a build argument to an environment variable during the build process, and that environment variable will be available.

## Unencrypted Build Arguments

Declaring build arguments in your services file requires updates in two places: the service's Dockerfile and the `codeship-services.yml` file.

### Dockerfile ARG instruction

The service's Dockerfile must include the `ARG` [instruction](https://docs.docker.com/engine/reference/builder/#/arg), which declares the name of the argument you will pass at build time. You may also declare a default here.

```dockerfile
FROM ubuntu:latest

ARG build_env # build_env=test would make test the default value

RUN script-requiring-build-env.sh "$build_env"
```

### Passing build args in the services file

Now that the Dockerfile knows to expect an argument, you can pass the argument to the image via the service configuration in `codeship-services.yml`.

```yaml
app:
  build:
    dockerfile: Dockerfile
    args:
      build_env: staging
```

When the `app` service is built, the value of `build_env` becomes `staging`. If no value was set, `build_env` would remain `test`. You are not required to declare a default, but you must add an `ARG` instruction to the Dockerfile for each build argument you pass in via `codeship-services.yml`.

You may also declare a build argument before the `FROM` instruction, which is a new feature introduced in Docker 17.05. Following the same pattern, you must first declare the argument before consuming it.

```dockerfile
ARG BASE_IMAGE_TAG

FROM ubuntu:$BASE_IMAGE_TAG
```

Note: YAML boolean values (true, false, yes, no, on, off) must be enclosed in quotes, so that the parser interprets them as strings.

## Encrypted Build Arguments

In a lot of cases, the values needed by the image at build time are secrets -- credentials, passwords, and other things that you don't want to check in to source control in plain text. Because of this, Codeship supports encrypted build arguments. You can either encrypt a build argument individually, or encrypt an entire file containing all of the build arguments you need.

First, create a file in the root directory - in this case, a file named `build_args`. You will also need to [download the project AES key]({{ site.baseurl }}{% link _pro/builds-and-configuration/environment-variables.md %}#downloading-your-aes-key) to the root directory (and add it to the `.gitignore` file).

<div class="info-block">
If you need to reset your AES key you can do so by visiting _Project Settings_ > _General_ and clicking _Reset project AES key_.
</div>

```shell
GEM_SERVER_TOKEN=XXXXXXXXXXXX
SECRET_BUILDTIME_PASSWORD=XXXXXXXXXXXX
```

Take care to use `KEY=value` syntax and not `key: value`.

Once the AES key is in the root directory, run the `jet encrypt` command with an *input* and an *output* filename: `jet encrypt build_args build_args.encrypted` ([Learn more about using Jet]({{ site.baseurl }}{% link _pro/jet-cli/usage-overview.md %}))

Pass that file to your service's build directive.

```yaml
app:
  build:
    dockerfile: Dockerfile
    encrypted_args_file: build_args.encrypted
```

If your use case is simple enough, you may want to pass in encrypted values directly instead of requiring Codeship to read them from a file. The following syntax is also supported:

```yaml
app:
  build:
    dockerfile: Dockerfile
    encrypted_args: 8rD1P1xO1CwB4L99JBqnvoSOX+1wimf9qwHXATf9foasPtU6Sw==
```

Codeship will decrypt your build arguments and pass them to the image when it is built.

## CI/CD Variables As Build Arguments

Codeship sets a variety of CI/CD-related environment variables at runtime with information about your build.

These can be set as build arguments and used in the Dockerfile, but they must be explicitly set as unencrypted arguments in your [codeship-services.yml file]({% link _pro/builds-and-configuration/services.md %}).

For example:

```yaml
app:
  build:
    dockerfile: Dockerfile
    args:
      BRANCH: "{{.Branch}}"
      CI: "{{.CI}}"
```

The full list of CI/CD-related variables you can use is:

* `ProjectID` (the Codeship defined project ID)
* `BuildID` (the Codeship defined build ID)
* `RepoName` (the name of the repository according to the SCM)
* `Branch` (the name of the current branch)
* `CommitID` (the commit hash or ID)
* `CommitMessage` (the commit message)
* `CommitDescription` (the commit description, see footnote)
* `CommitterName` (the name of the person who committed the change)
* `CommitterEmail` (the email of the person who committed the change)
* `CommitterUsername` (the username of the person who committed the change)
* `Time` (a golang [`Time` object](http://golang.org/pkg/time/#Time) of the build time)
* `Timestamp` (a unix timestamp of the build time)
* `StringTime` (a readable version of the build time)
* `Ci` (defaults to `true`)

## Impact on Docker Image Caching

Docker will attempt to reuse layers of your image if there are no changes. Although the values of a build argument are not persisted to the image, they do impact the build cache in a similar way. Refer to Docker's [notes on cache invalidation](https://docs.docker.com/engine/reference/builder/#/impact-on-build-caching) when using build arguments.

## Common Error Messages

`One or more build-args [XXX] were not consumed`

If you pass a build argument to an image at build time, but do not have a corresponding `ARG` instruction in the Dockerfile, Docker (versions < 1.13) will fail the image build.

As of 1.13, unused build args will not fail the build, but will generate a warning message.

[![N|Solid](https://s3.amazonaws.com/assets.nodesource.com/nsolid-logo-dark%402x.png)](https://nodesource.com/products/nsolid)

N|Solid From NPM
=====================

## Description

This module is intended to be used as a quickstart with **N|Solid SaaS** platform and also works in restricted environments where **N|Solid runtime** is not installed. 

See [examples](./examples) of how to use it.

## Requirements

- We only support LTS versions, so this will fail for stable Node.js versions.
- Shouldn't you have a valid **N|Solid SaaS** license, consider [downloading and installing](https://downloads.nodesource.com/) the `N|Solid for desktop` on your local machine.
## Installation

Install the module for your project as a regular dependency:

```bash
npm install nsolid
```

or using npx:

```bash
npx nsolid
```
## Usage

- TL;DR: Check out our [examples](./examples) page.


### How to add nsolid to an existent project

- Run `npm install nsolid` on the `package.json`'s project location
- Replace the `node` command with `nsolid` at the desired npm scripts executing the applications you want to connect to the N|Solid Console, like this

  __before__:
  ```json
    "scripts": {
      "start": "node index.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

  __after__:
  ```json
    "scripts": {
      "start": "nsolid index.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

### How to get my N|Solid Command URL
#### Instructions for N|Solid Local Instance

- The command for N|Solid Desktop is `localhost:9001`
- The URL for N|Solid Console is `http://localhost:6753`

#### Instructions for N|Solid SaaaS

- Go to your [Node Source account](https://accounts.nodesource.com/downloads) and choose the `NodeSource - SaaS` account as the print below

![](./resources/01-initial-page.png)

- You should see the same page as below:

![](./resources/02-saas-console-url.png)
The page shows you the Console URL and the NodeSource SaaS command that you'll need to link your app
where: 
1. The console URL available to copy it
2. a button to visit the console page
3. your account N|Solid command address 

Copy the the **command address** to use it on the next section.
### How to link your Node.js app to a N|Solid Console

- In order to link your current application to the desired **N|Solid Console** you must add configuration properties either on your `package.json` or using the `NSOLID_COMMAND`, for local N-Solid instance,  or `NSOLID_SAAS` environment variables on your machine. See our [examples](./examples).


- Should you add the configuration on your current `package.json` file, it should look as follows:

  __before__:
  ```json
    "scripts": {
      "start": "nsolid index.js"
    },
  ```

  __after__:
  ```json
    "scripts": {
      "start": "nsolid index.js"
    },
    "nsolid": {
      "saas": "YOUR N|Solid SaaS URL"
    }
  ```
  or for local N|Solid instance: 

  __after__:
  ```json
    "scripts": {
      "start": "nsolid index.js"
    },
    "nsolid": {
      "command": "localhost:9001"
    }

  ```

*For more information on these settings please go to [https://docs.nodesource.com/nsolid/4.5/docs#nsolid-runtime](https://docs.nodesource.com/nsolid/4.6/docs#nsolid-runtime)*

- Then, after running `npm start` command, go back to the browser and visit the console (as shown on the previous section).
- Your *N|Solid Console* show the apps you've linked as follows:

![](./resources/03-metrics-working.png)

*If you're running the N|Solid Console locally, you just need to open the URL `http://localhost:6753` and you should see the same page as above.*

## How it works

It downloads the latest version of the runtime matching the current Node.js LTS used in the local Node.js installation. 

The download happens at the `postinstall` process of this module, then proceeds to extract and put the runtime files at the current user's home directory inside a folder like `.nsolid-runtime/nsolid-fermium` to be used later by an __NPM command__.

The module includes a command called `nsolid`, which is designed to replace the `node` command __inside an NPM script__ and then executes the original task using the N|Solid binary previously downloaded at the postinstall phase.

Currently, this module supports Linux, Windows, and Mac.
## Contributing

To submit a bug report, please create an [issue at GitHub](https://github.com/nodesource/nsolid-npm/issues/new).

Contributions are always welcome!

## License & Copyright

**nsolid-npm** is Copyright (c) 2021 NodeSource and licensed under the
MIT license. All rights not explicitly granted in the MIT license are reserved.
See the included [LICENSE.md](./LICENSE.md) file for more details.

The projects contained within the **nsolid-npm** images maintain their own Licenses.

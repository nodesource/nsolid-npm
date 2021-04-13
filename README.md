# N|Solid Exec

This module is intended to be used in restricted environments where N|Solid runtime is not installed. It downloads the latest version of the runtime matching the current Node.js LTS used in the local Node.js installation. We only support LTS versions, so this will fail for stable Node.js versions.

The download happens at the `postinstall` process of this module, then proceeds to uncompress and put the runtime files at the user's home directory inside a folder `.nsolid-runtime/nsolid-fermium` to be used later by a Node.js command.

The module includes a command called `nsolid-exec`, which is designed to replace the `node` command inside an NPM script and then execute the original task using the N|Solid binary previously downloaded at the postinstall phase.

Currently, this module is published in our private NPM registry under the name `@ns-private/nsolid-exec` and supports Linux, Windows, and Mac.

## Instructions to use it

- Make sure you have configured our private NPM registry or execute this command:

  ```bash
    $ npm config set @ns-private:registry http://packages-internal.nodesource.io
  ```

- Go to the project you need to install the module and install it with:

  ```bash
    $ npm install @ns-private/nsolid-exec
  ```

- Replace the `node` command with `nsolid-exec` in the desired npm scripts executing the applications you want to connect to a Console, like this

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
      "start": "nsolid-exec index.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

- Make sure to configure the connection to the desired console using NSOLID_COMMAND environment variable or use the package.json for that before executing the modified npm task.


## @TODO

This is a working PoC; if we want to launch it officially, we would need to execute these tasks:

- Currently is working in most cases in Docker, but there are a couple of cases when the user installing and the user executing is different
- Add tests and CI
- Create the final documentation
- Change our metadata.json file to include artifacts for ARMhf and ARM64 Linux architectures
- Detect and properly use Linux Alpine

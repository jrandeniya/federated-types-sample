# Sharing Typescript Definitions between MFEs

This sample application shows how you can share Typescript definitions between microfrontends that are exposed/consumed via Webpack Module Federation.

## Challenge

Webpack Federation is great for run-time compliation of microfrontends but you lose the benefits of Typescript since only the compiled Javascript code makes it to the remote's `remoteEntry` file.

## Solution

In this example, we are sharing the React component interfaces of a remote application (`cars`) with the shell application (`vehicles`). Whenever the shell application is compiled, it will compile against the currently deployed interfaces. If there is a breaking change that the shell application hasn't conformed to - it will throw a type error.

### Steps:

1. In the remote application, use [@touk/federated-types](https://www.npmjs.com/package/@touk/federated-types) to generate the Typescript definitions of all exposed components into a single folder (i.e. `./cars-dts`).
2. Package all the definitions into a `tar` file and upload it to a repository that is accessible by your shell application (file system, S3 etc.)
3. In the shell application, use [webpack-remote-types-plugin](https://github.com/ruanyl/webpack-remote-types-plugin) to fetch the `tar`, unzip to a common `@federated` types folder which is read by the shell application's `tsconfig.json`
4. Enjoy the benefits of federated types in your favorite IDE!

### Warning:

This does not replace integration or unit tests. The remote application can still deploy to production with breaking changes and the shell application won't be aware of it until it fails at runtime.

However, this ensures at least at the point of deployment, the shell app is type-compliant with the remote app's interface. It also improves the developer experience.

## Local Setup

Run two separate terminals:

```
cd ./cars
npm install
npm run gen-types
npm run start
```

```
cd ./vehicles
npm install
npm run start
```

### Environments

This has only been tested on MacOS.

`npm run gen-types` might not work on other operating systems due to the `tar` command. If you need to, you can extract out this step to a utility script and use [node-tar](https://www.npmjs.com/package/tar) instead.

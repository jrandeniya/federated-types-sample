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
4. Make a breaking change to the props in `./cars/src/components/Button` and within the `./cars` build you will see immediately that `./cars/src/bootstrap.tsx` is broken.
5. Run `npm run gen-types` in `./cars`
6. Run `npm run start` in `./vehicles` and now this build will also fail due to the breaking change in step #4.
7. Enjoy the benefits of federated types in your favorite IDE!

### What's next?

The aim is to ultimately catch compile errors as soon as possible in your pipeline.
You could add steps to your CI/CD where:

1. Everytime a microfrontend deploys to an environment, run `npm run gen-types`
2. Upload the `tar` file to a S3 bucket (or equivalent).
3. Since the federation configuration is shared between `WebpackModuleFederation` and `WebpackRemoteTypesPlugin`, everytime the host application compiles, it will fetch the associated types for that given remote given you _run time type checking_!

### Warning:

This does not replace unit, integration or E2E tests. The remote application can still deploy to production with breaking changes and the shell application won't be aware of it until it compiles again or worse; it fails at runtime.

However, this ensures at least at the point of deployment, the shell app is type-compliant with the remote app's contracts. Not to mention, it also greatly improves the developer experience.

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

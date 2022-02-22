# Sharing Typescript Definitions between MFEs

This sample application shows how you can share Typescript definitions between microfrontends that are exposed/consumed via [Webpack Module Federation](https://webpack.js.org/concepts/module-federation).

## Challenge

Webpack Federation is great for run-time compliation of microfrontends but you lose the benefits of Typescript since only the compiled Javascript code makes it to the remote's `remoteEntry` file.

## Solution

In this example, we are sharing React component prop interfaces of a remote application (`cars`) with the shell application (`vehicles`). Whenever the shell application is compiled, it will check against the currently deployed prop interfaces from `cars`. If there is a breaking change that the shell application hasn't conformed to - it will throw a compiele error.

### Local Setup

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

### Explanation:

1. In the remote application, use [@touk/federated-types](https://www.npmjs.com/package/@touk/federated-types) to aggregate the Typescript definitions of all **exposed** components into a single folder (i.e. `./cars/cars-dts`).
2. Package all of these definitions into a `tar` file and upload it to a repository that is accessible by your shell application (i.e. file system, S3 etc.)
3. In the shell application, use [webpack-remote-types-plugin](https://github.com/ruanyl/webpack-remote-types-plugin) to fetch the `tar`, unzip to a common, git-ignored `@federated` types folder which is read by the shell application's `tsconfig.json`
4. To test, add a new required prop to `./cars/src/components/Button` and within the `./cars` build you will immediately see that `./cars/src/bootstrap.tsx` is missing the required prop.
5. However, the `./vehicle` build is not complaining
6. Run `npm run gen-types` in `./cars`
7. Re-run `npm run start` in `./vehicles` and now this build will also fail due to the breaking change in step #4.
8. Enjoy the benefits of federated types in your favorite IDE!

## Pipelines

The aim is to ultimately catch compile errors as soon as possible in your pipeline. You could add steps to your CI/CD where everytime a microfrontend deploys to an environment, it runs `npm run gen-types` and uploads the `tar` file to a S3 bucket (or equivalent). Since the federation configuration is shared between `WebpackModuleFederation` and `WebpackRemoteTypesPlugin`, everytime the host application compiles, it will fetch the associated types for that given remote given you _run time type checking_!

## Caveats:

- This does not replace unit, integration or E2E tests. The remote application can still deploy to production with breaking changes and the shell application won't be aware of it until it compiles again or worse; it fails at runtime. However, this ensures at least at the point of deployment, the shell app is type-compliant with the remote app's contracts. Not to mention, it also greatly improves the developer experience.
- This has only been tested on MacOS. `npm run gen-types` might not work on other operating systems due to the `tar` command. If you need to, you can extract out this step to a utility script and use [node-tar](https://www.npmjs.com/package/tar) instead.

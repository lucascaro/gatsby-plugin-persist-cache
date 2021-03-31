# gatsby-plugin-persist-cache

Persist certain plugin caches through gatsby clean.

This plugin allows you to set-up specific plugins whose caches will be stored outisde `.cache` between builds.

Used in case of really slow plugins that get cleaned often than needed.

## Usage

```sh
npm i -D gatsby-plugin-persist-cache
```

add to your `gatsby-config`

```js
plugins: [
  {
    resolve: `gatsby-plugin-persist-cache`,
    options: {
      enabled: !process.env.DISABLE_PERSISTENT_CACHE,
      persistentDir: ".persistent-cache",
      pluginNames: [`your-plugin-names-here`],
    },
  },
];
```

run `DISABLE_PERSISTENT_CACHE=1 gatsby build` to temporarily disable persistent cache.

run `gatsby clean && rm -rf .persistent-cache` to clear all caches. (Note `.peristent-cache` here will be whatever directory was configured as `persistentDir` in `gatsby-config`).

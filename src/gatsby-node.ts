import path from "path";
import { ensureDir, copy, rmdir } from "fs-extra";
import { GatsbyNode, PluginOptions } from "gatsby";

export interface ThisPluginOptions extends PluginOptions {
  persistentDir: string;
  pluginNames: string[];
  remove: boolean;
  enabled: boolean;
}

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({
  Joi,
}) => {
  return Joi.object({
    persistentDir: Joi.string()
      .required()
      .description("Directory where persistent cache will be stored."),
    pluginNames: Joi.array()
      .items(Joi.string())
      .required()
      .description("Names of plugins to persist."),
    enabled: Joi.boolean()
      .required()
      .description(
        "Set to false to prevent persisting, allows you to clean the persistent cache."
      ),
  });
};

const getPaths = (
  persistentDir: string,
  rootDir: string,
  pluginName: string
) => {
  return {
    pluginPath: path.join(rootDir, ".cache", "caches", pluginName),
    persistentPath: path.join(persistentDir, pluginName),
  };
};

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async function (
  { store, reporter },
  { persistentDir, pluginNames, enabled, remove }: ThisPluginOptions
) {
  if (!enabled) {
    return;
  }
  const rootDir = store.getState().program.directory;
  const task = reporter.createProgress(
    `plugin-persist-cache: `,
    pluginNames.length,
    0
  );
  task.start();
  for (const pluginName of pluginNames) {
    task.setStatus(`Restoring cache for ${pluginName}`);
    const { pluginPath, persistentPath } = getPaths(
      persistentDir,
      rootDir,
      pluginName
    );

    await ensureDir(pluginPath);
    await ensureDir(persistentPath);

    await copy(persistentPath, pluginPath);
    task.tick(1);
  }
  task.setStatus(`Restored cache for ${pluginNames.length} plugins`);
  task.done();
};

export const onPostBuild: GatsbyNode["onPostBuild"] = async function (
  { store, reporter },
  { persistentDir, pluginNames, enabled }: ThisPluginOptions
) {
  if (!enabled) {
    return;
  }

  const rootDir = store.getState().program.directory;
  const task = reporter.createProgress(
    `plugin-persist-cache: `,
    pluginNames.length,
    0
  );
  task.start();
  for (const pluginName of pluginNames) {
    task.setStatus(`Saving cache for ${pluginName}`);
    const { pluginPath, persistentPath } = getPaths(
      persistentDir,
      rootDir,
      pluginName
    );

    await ensureDir(pluginPath);
    await ensureDir(persistentPath);

    console.log(`copy${pluginPath}, ${persistentPath});`);
    await copy(pluginPath, persistentPath);

    task.tick(1);
  }
  task.setStatus(`Saved cache for ${pluginNames.length} plugins`);
  task.done();
};

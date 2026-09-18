const path = require('path')

const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Yarn workspaces hoist to the repo root, so Metro has to watch and resolve from there.
config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true
config.resolver.unstable_enablePackageExports = true

// SVGs compile to react-native-svg components rather than being copied as assets, so the same
// `import Logo from './logo.svg'` works on both platforms (Vite does this with vite-plugin-svgr).
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo')
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg')
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg']

module.exports = config

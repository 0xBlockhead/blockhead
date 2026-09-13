import { defineConfig, mergeConfig } from 'vite'
import viteConfig from '../../vite.config.ts'
import { e2eProbeVitePlugin } from './_e2eProbeVitePlugin.ts'
import { messariGraphFixtureVitePlugin } from './_messariGraphFixtureVitePlugin.ts'

export default mergeConfig(viteConfig, defineConfig({
	plugins: [e2eProbeVitePlugin(), messariGraphFixtureVitePlugin()],
}))

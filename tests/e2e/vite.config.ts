import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import viteConfig from '../../vite.config.ts'
import { e2eProbeVitePlugin } from './_e2eProbeVitePlugin.ts'

export default mergeConfig(viteConfig, defineConfig({
	cacheDir: resolve(import.meta.dirname, '../../.svelte-kit/vite-e2e'),
	// Finish optional signer optimization before a wallet journey enables it.
	optimizeDeps: {
		include: [
			'@ledgerhq/device-management-kit',
			'@ledgerhq/device-signer-kit-ethereum',
			'@ledgerhq/device-transport-kit-speculos',
			'ox/PersonalMessage',
			'ox/Secp256k1',
			'ox/Signature',
			'rxjs',
		],
	},
	plugins: [e2eProbeVitePlugin()],
}))

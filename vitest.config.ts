import { defineConfig, mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config.ts'
import {
	vitestClientExclude,
	vitestClientInclude,
	vitestServerExclude,
	vitestServerInclude,
} from './test-discovery.config.mjs'

export default mergeConfig(viteConfig, defineConfig({
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }],
					},
					include: vitestClientInclude,
					exclude: vitestClientExclude,
				},
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: vitestServerInclude,
					exclude: vitestServerExclude,
				},
			},
		],
	},
}))

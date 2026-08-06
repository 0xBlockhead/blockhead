import { resolve } from 'node:path'

import {
	test as base,
	type BrowserContext,
	type Page,
} from '@playwright/test'

import {
	launchWalletExtensions,
	resolveWalletExtensionDirectories,
	type LoadedWalletExtension,
} from '../../../../scripts/wallet-extensions/WalletExtensionHarness.ts'


export const test = base.extend<{
	context: BrowserContext
	extensions: LoadedWalletExtension[]
	harness: Awaited<ReturnType<typeof launchWalletExtensions>>
	page: Page
}>({
	harness: async ({}, use) => {
		const harness = await launchWalletExtensions({
			extensionDirectories: (
				process.env.BACKPACK_EXTENSION_DIR ?
					[
						resolve(process.env.BACKPACK_EXTENSION_DIR),
					]
				:
					resolveWalletExtensionDirectories()
			),
			headless: process.env.PLAYWRIGHT_WALLET_HEADLESS === '1',
		})

		await use(harness)
		await harness.close()
	},
	context: async ({ harness }, use) => {
		await use(harness.context)
	},
	extensions: async ({ harness }, use) => {
		await use(harness.extensions)
	},
	page: async ({ context }, use) => {
		await use(context.pages()[0] ?? await context.newPage())
	},
})

export { expect } from '@playwright/test'

import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import {
	test as base,
	type BrowserContext,
	type Page,
} from '@playwright/test'

import {
	launchWalletExtensions,
	parseExtensionDirectories,
	type LoadedWalletExtension,
} from '../../../scripts/wallet-extensions/harness.ts'


export const test = base.extend<{
	context: BrowserContext,
	extensions: LoadedWalletExtension[],
	harness: Awaited<ReturnType<typeof launchWalletExtensions>>,
	page: Page,
}>({
	harness: async ({}, use) => {
		const extensionDirectories = (
			parseExtensionDirectories(process.env.WALLET_EXTENSION_DIRS).length > 0 ?
				parseExtensionDirectories(process.env.WALLET_EXTENSION_DIRS)
			:
				[
					resolve('tests/e2e/wallet-extensions/fixture-extension'),
				]
		)
		const harness = await launchWalletExtensions({
			extensionDirectories,
			headless: process.env.PLAYWRIGHT_WALLET_HEADLESS === '1',
		})

		await use(harness)
		await harness.context.close()
		await rm(harness.profileDirectory, {
			force: true,
			recursive: true,
		})
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

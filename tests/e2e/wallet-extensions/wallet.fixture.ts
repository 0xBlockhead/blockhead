import {
	expect,
	test as base,
	type BrowserContext,
	type Page,
} from '@playwright/test'
import { writeFile } from 'node:fs/promises'

import {
	launchWalletExtensions,
	resolveWalletExtensionDirectories,
	type LoadedWalletExtension,
} from '../../../scripts/wallet-extensions/WalletExtensionHarness.ts'
import { attachWalletExtensionStructuralTelemetry } from '../../../scripts/wallet-extensions/WalletExtensionRequestCheckpoint.ts'


export const test = base.extend<{
	context: BrowserContext
	extensions: LoadedWalletExtension[]
	harness: Awaited<ReturnType<typeof launchWalletExtensions>>
	page: Page
}>({
	harness: async ({}, use, testInfo) => {
		const extensionDirectories = resolveWalletExtensionDirectories()
		const harness = await launchWalletExtensions({
			extensionDirectories,
			headless: process.env.PLAYWRIGHT_WALLET_HEADLESS === '1',
			serviceWorkerTimeoutMs: Number(process.env.WALLET_EXTENSION_SW_TIMEOUT_MS ?? 45_000),
		})
		const telemetry = attachWalletExtensionStructuralTelemetry(harness.context)

		try {
			harness.context.setDefaultTimeout(30_000)
			expect(harness.extensions.length).toBe(extensionDirectories.length)
			for (const extension of harness.extensions) {
				expect(extension.serviceWorker.url()).toContain(`chrome-extension://${extension.id}/`)
				expect(extension.manifest.manifest_version).toBe(3)
			}

			await use(harness)
		}
		finally {
			let captureTimer: ReturnType<typeof setTimeout> | undefined
			try {
				const diagnostics = await Promise.race([
					telemetry.capture().catch(() => ({ captureUnavailable: true })),
					new Promise<{ captureTimedOut: true }>((resolve) => {
						captureTimer = setTimeout(() => resolve({ captureTimedOut: true }), 2_000)
					}),
				])
				const diagnosticBody = JSON.stringify({
					worker: testInfo.workerIndex,
					retry: testInfo.retry,
					repeat: testInfo.repeatEachIndex,
					wallets: harness.extensions.map(({ kind, manifest }) => ({ kind, version: manifest.version })),
					diagnostics,
				})
				await writeFile(testInfo.outputPath('wallet-structural-diagnostics.json'), diagnosticBody)
				await testInfo.attach('wallet-structural-diagnostics', {
					body: diagnosticBody,
					contentType: 'application/json',
				})
			}
			finally {
				clearTimeout(captureTimer)
				telemetry.dispose()
				await harness.close()
			}
		}
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

export { expect }

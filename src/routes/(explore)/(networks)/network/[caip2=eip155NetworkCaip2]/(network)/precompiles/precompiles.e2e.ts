import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../tests/_e2eBrowserHelpers.ts'

test.describe('network precompiles list', () => {
	test('mainnet lists precompile contract links', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/network/eip155:1/precompiles', {
			waitUntil: 'load',
			timeout: 120_000,
		}))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#main a[href*="/contract/0x"]').first()).toBeAttached({ timeout: 120_000 }))
	})
})

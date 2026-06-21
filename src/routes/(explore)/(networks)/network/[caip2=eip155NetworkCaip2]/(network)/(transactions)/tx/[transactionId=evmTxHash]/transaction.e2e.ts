import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'

const SAMPLE_TOKEN_TRANSFER_TX = (
	'0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01'
)

test.describe('/network/[caip2]/tx/[transactionId]', () => {
	test('transaction page mounts the selector-owned execution shell', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto(
			`/network/eip155:1/tx/${SAMPLE_TOKEN_TRANSFER_TX}`,
			{ waitUntil: 'load', timeout: 120_000 }
		))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.getByRole('heading', {
			name: /Transaction 0x5e47/,
		})).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.getByRole('link', {
			name: 'Movements',
		})).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.getByRole('heading', {
			name: 'Receipt logs',
		})).toBeAttached({
			timeout: 120_000,
		}))
	})
})

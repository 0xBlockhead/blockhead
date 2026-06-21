import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'

const transactionWithReceiptLogs = (
	'0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'
)


test.describe('Evm transaction logs', () => {
	test('transaction page renders receipt log rows from the selected $$logs field', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await page.goto(`/network/eip155:1/tx/${transactionWithReceiptLogs}`, { waitUntil: 'load' })
		await expectMainVisible(page, 120_000, diagnostics)
		await assertMainSettled(page, 120_000, diagnostics)
		await page.getByRole('link', { name: 'Events' }).click()
		await expect(page.locator(`#main a[href$="/tx/${transactionWithReceiptLogs}/log/981"]`).first()).toBeVisible({ timeout: 120_000 })
		await expect(page.locator(`#main a[href$="/tx/${transactionWithReceiptLogs}/log/982"]`).first()).toBeVisible({ timeout: 120_000 })

		expect(diagnostics.issues, diagnostics.issues.join('\n')).toEqual([])
	})

	test('log detail page renders a selector-owned receipt log', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await page.goto(`/network/eip155:1/tx/${transactionWithReceiptLogs}/log/981`, { waitUntil: 'load' })
		await expectMainVisible(page, 120_000, diagnostics)
		await expect(page).toHaveURL((url) => (
			url.pathname === `/network/eip155:1/tx/${transactionWithReceiptLogs}/log/981`
		))
		await expect(page.locator(`#main a[href$="/tx/${transactionWithReceiptLogs}/log/981"]`).first()).toBeAttached({ timeout: 120_000 })
		await expect(page.locator('#main [data-column]').first()).toBeAttached({ timeout: 120_000 })

		expect(diagnostics.issues, diagnostics.issues.join('\n')).toEqual([])
	})

	test('transaction and log routes reject invalid selector params', async ({ page }) => {
		await expect((await page.request.get('/network/eip155:1/tx/not-a-hash')).status()).toBe(404)
		await expect((await page.request.get('/network/eip155:1/tx/0x1')).status()).toBe(404)
		await expect((await page.request.get('/network/eip155:1/tx/not-a-hash/log/0')).status()).toBe(404)
		await expect((await page.request.get(`/network/eip155:1/tx/${transactionWithReceiptLogs}/log/-1`)).status()).toBe(404)
		await expect((await page.request.get(`/network/eip155:1/tx/${transactionWithReceiptLogs}/log/01`)).status()).toBe(404)
		await expect((await page.request.get(`/network/eip155:1/tx/${transactionWithReceiptLogs}/log/1e2`)).status()).toBe(404)
		await expect((await page.request.get(`/network/eip155:1/tx/${transactionWithReceiptLogs}/log/9007199254740992`)).status()).toBe(404)
	})
})

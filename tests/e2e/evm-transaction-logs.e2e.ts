import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	countRequestsMatching,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

const transactionWithReceiptLogs = (
	'0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'
)


test.describe('Evm transaction logs', () => {
	test('transaction page renders receipt logs without per-log refetches', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		const transactionRequest = countRequestsMatching(page, (url, method) => {
			const decoded = decodeURIComponent(url)
			return (
				method === 'GET'
				&& new RegExp(`/api/v2/transactions/${transactionWithReceiptLogs}(?:[?#]|$)`).test(decoded)
			)
		})
		const logsRequest = countRequestsMatching(page, (url, method) => {
			const decoded = decodeURIComponent(url)
			return (
				method === 'GET'
				&& new RegExp(`/api/v2/transactions/${transactionWithReceiptLogs}/logs(?:[?#]|$)`).test(decoded)
			)
		})

		await page.goto(`/network/eip155:1/tx/${transactionWithReceiptLogs}`, { waitUntil: 'load' })
		await assertMainSettled(page, 120_000)
		await expect(page.getByText('Receipt log #981')).toBeVisible({ timeout: 120_000 })
		await expect(page.getByText('Receipt log #982')).toBeVisible({ timeout: 120_000 })

		transactionRequest.detach()
		logsRequest.detach()

		expect(transactionRequest.get(), transactionRequest.urls.join('\n')).toBe(1)
		expect(logsRequest.get(), logsRequest.urls.join('\n')).toBe(1)
		expect(issues, issues.join('\n')).toEqual([])
	})
})

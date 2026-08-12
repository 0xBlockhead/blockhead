import { expect, test } from '@playwright/test'

const validatorPath = '/network/eip155:1/validator/12/observations/1/Beacon_Rest'
const pubkey = `0x${'a'.repeat(96)}`
const withdrawalCredentials = `0x${'b'.repeat(64)}`

test('Beacon validator route renders a coordinate-bound validator observation', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (url.includes('/eth/v1/beacon/states/1/validators/12')) {
			await route.fulfill({
				json: {
					data: {
						index: '12',
						balance: '32000000001',
						status: 'active_ongoing',
						validator: {
							pubkey,
							withdrawal_credentials: withdrawalCredentials,
							effective_balance: '32000000000',
							activation_eligibility_epoch: '1',
							activation_epoch: '2',
							exit_epoch: '18446744073709551615',
							withdrawable_epoch: '18446744073709551615',
							slashed: false,
						},
					},
					execution_optimistic: false,
					finalized: true,
				},
			})
			return
		}

		await route.continue()
	})

	await page.goto(validatorPath, { waitUntil: 'domcontentloaded' })

	const main = page.locator('#main')
	await expect(main).toContainText('Slot #1', {
		timeout: 120_000,
	})
	await expect(main).toContainText('active_ongoing')
	await expect(main).toContainText(/32[\s,]?000[\s,]?000[\s,]?001/)
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

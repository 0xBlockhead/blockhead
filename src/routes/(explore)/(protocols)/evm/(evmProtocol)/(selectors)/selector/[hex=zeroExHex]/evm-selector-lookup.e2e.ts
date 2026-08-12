import { expect, test } from '@playwright/test'

const selector = '0xa9059cbb'

test('EVM selector route renders source-attributed signature candidates', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const encodedTarget = new URL(route.request().url()).pathname.split('/').at(-1)
		const target = encodedTarget == null ? '' : decodeURIComponent(encodedTarget)
		if (!target.includes('api.4byte.sourcify.dev')) {
			await route.fallback()
			return
		}

		await route.fulfill({
			json: {
				ok: true,
				result: {
					function: {
						[selector]: [
							{
								name: 'transfer(address,uint256)',
								filtered: false,
								hasVerifiedContract: true,
							},
						],
					},
				},
			},
		})
	})

	await page.goto(`/evm/selectors/selector/${selector}`, {
		waitUntil: 'domcontentloaded',
	})

	const main = page.locator('#main')
	await expect(main).toContainText('transfer(address,uint256)', {
		timeout: 120_000,
	})
	await expect(main).toContainText('Verified candidate count')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

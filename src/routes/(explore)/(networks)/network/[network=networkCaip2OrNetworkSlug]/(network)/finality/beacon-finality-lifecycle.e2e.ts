import { expect, test } from '@playwright/test'


const finalityPath = '/network/eip155:1/finality/0'
const finalizedRoot = `0x${'f'.repeat(64)}`
const currentJustifiedRoot = `0x${'c'.repeat(64)}`
const previousJustifiedRoot = `0x${'a'.repeat(64)}`

test('Beacon finality route keeps current and finalized checkpoints visibly distinct', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/*', async (route) => {
		if (!decodeURIComponent(route.request().url()).includes('/eth/v1/beacon/states/head/finality_checkpoints')) {
			await route.continue()
			return
		}

		await route.fulfill({
			json: {
				data: {
					previous_justified: {
						epoch: '123',
						root: previousJustifiedRoot,
					},
					current_justified: {
						epoch: '124',
						root: currentJustifiedRoot,
					},
					finalized: {
						epoch: '122',
						root: finalizedRoot,
					},
				},
			},
		})
	})

	await page.goto(finalityPath, { waitUntil: 'domcontentloaded' })

	const main = page.locator('#main')
	await expect(main).toContainText('Finalized checkpoint epoch', {
		timeout: 120_000,
	})
	await expect(main).toContainText('122')
	await expect(main).toContainText('Current justified checkpoint epoch')
	await expect(main).toContainText('124')
	await expect(main).toContainText('Previous justified checkpoint epoch')
	await expect(main).toContainText('123')
	await expect(main).toContainText(finalizedRoot)
	await expect(main).toContainText(currentJustifiedRoot)
	await expect(main).toContainText(previousJustifiedRoot)
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

test('Beacon finality route exposes a malformed checkpoint response as failure', async ({ page }) => {
	test.setTimeout(180_000)

	await page.route('**/*', async (route) => {
		if (!decodeURIComponent(route.request().url()).includes('/eth/v1/beacon/states/head/finality_checkpoints')) {
			await route.continue()
			return
		}

		await route.fulfill({
			json: {
				data: {
					previous_justified: {
						epoch: '123',
						root: previousJustifiedRoot,
					},
					current_justified: {
						epoch: 'not-an-epoch',
						root: currentJustifiedRoot,
					},
					finalized: {
						epoch: '122',
						root: finalizedRoot,
					},
				},
			},
		})
	})

	await page.goto(finalityPath, { waitUntil: 'domcontentloaded' })

	await expect(page.locator('#main [data-resource-state="failed"]').first()).toBeAttached({
		timeout: 120_000,
	})
})

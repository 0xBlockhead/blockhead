import { expect, test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

test.use({ video: { mode: 'on', size: { width: 1440, height: 1000 } }, viewport: { width: 1440, height: 1000 } })
test.skip(process.env.E2E_UNISWAP_LIVE !== '1', 'Requires a reachable historical Ethereum RPC')

test('interprets a real block-pinned Uniswap pool and preserves the selected block after reload', async ({ page }, testInfo) => {
	testInfo.setTimeout(240_000)
	const errors: string[] = []
	const pending = new Set<string>()
	const failed: { path: string, status?: number }[] = []
	let phase = 'document'
	page.on('request', (request) => pending.add(new URL(request.url()).pathname))
	page.on('requestfinished', (request) => pending.delete(new URL(request.url()).pathname))
	page.on('requestfailed', (request) => {
		const path = new URL(request.url()).pathname
		pending.delete(path)
		failed.push({ path })
	})
	page.on('response', (response) => {
		if (response.status() >= 400)
			failed.push({ path: new URL(response.url()).pathname, status: response.status() })
	})
	page.on('pageerror', (error) => errors.push(error.message.slice(0, 300)))
	const route = '/uniswap-v3/pool/1/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640/block/20000000'
	try {
		const response = await page.goto(route)
		expect(response?.status()).toBe(200)
		phase = 'application-mount'
		await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible({ timeout: 120_000 })
		const interpretation = page.getByRole('region', { name: 'Pool state interpretation' })
		phase = 'pool-observation'
		await expect(interpretation).toBeVisible({ timeout: 120_000 })
		await expect(interpretation).toContainText(/Spot ratio \(raw token1\/token0\): \d+ \/ \d+/)
		await expect(interpretation).toContainText('Protocol fee share: token0 off; token1 off')
		await expect(interpretation).toContainText('Oracle capacity: 723 observations')
		const before = await interpretation.innerText()
		await interpretation.screenshot({ path: testInfo.outputPath('uniswap-pool-interpretation.png') })
		if (process.env.E2E_DEMO_RECORDING === '1') {
			await interpretation.scrollIntoViewIfNeeded()
			// Editorial reading time after readiness assertions, never a readiness substitute.
			await page.waitForTimeout(8_000)
		}
		await page.reload()
		phase = 'reload'
		await expect(page).toHaveURL(new RegExp(`${route}$`))
		await expect(interpretation).toHaveText(before, { timeout: 120_000 })
		if (process.env.E2E_DEMO_RECORDING === '1') {
			await interpretation.scrollIntoViewIfNeeded()
			await page.waitForTimeout(8_000)
		}
		expect(errors).toEqual([])
		phase = 'accepted'
	} finally {
		const diagnostics = testInfo.outputPath('diagnostics.json')
		await writeFile(diagnostics, JSON.stringify({ phase, errors, failed, pending: [...pending] }, null, 2))
		await testInfo.attach('diagnostics', { path: diagnostics, contentType: 'application/json' })
	}
})

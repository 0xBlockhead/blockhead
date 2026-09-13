import { expect, test } from '@playwright/test'


test.use({ video: { mode: 'on', size: { width: 1440, height: 1000 } }, viewport: { width: 1440, height: 1000 } })
test.skip(process.env.E2E_GRAPH_LIVE !== '1', 'Requires an explicitly authorized live Graph gateway on the application server')

test('invokes a live Graph tool and restores the exact recorded response without redispatch', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	let invocations = 0
	page.on('request', (request) => {
		if (new URL(request.url()).pathname.endsWith('/invoke'))
			invocations += 1
	})
	await page.goto('/mcp/server/TheGraph_Mcp%3Asubgraph-mcp/tool/search_subgraphs_by_keyword')
	const main = page.getByRole('main')
	await expect(main.getByRole('button', { name: 'Call tool', exact: true })).toBeVisible()
	await expect(main.getByRole('heading', { name: 'Input schema', exact: true })).toBeVisible({ timeout: 60_000 })
	await main.getByRole('textbox', { name: 'Arguments (JSON object)' }).fill(JSON.stringify({ keyword: 'Uniswap' }))
	await main.getByRole('button', { name: 'Call tool', exact: true }).click()
	const observation = main.locator('a[href*="/observations/"][href$="/Local_Internal"]')
	await expect(observation).toHaveCount(1, { timeout: 90_000 })
	await observation.click()
	await expect(main.getByRole('heading', { name: 'Provider response', exact: true })).toBeVisible()
	const response = main.locator('pre')
	const payload = await response.innerText()
	expect(JSON.parse(payload)).toMatchObject({ isError: false })
	expect(payload).toContain('Uniswap')
	expect(invocations).toBe(1)
	const observationUrl = page.url()
	await page.reload()
	await expect(response).toHaveText(payload)
	expect(page.url()).toBe(observationUrl)
	expect(invocations).toBe(1)
	await page.screenshot({ path: testInfo.outputPath('graph-response-restored.png') })
	await testInfo.attach('live-graph-observation', {
		body: JSON.stringify({ observationUrl, invocations, reloaded: true, isError: false }),
		contentType: 'application/json',
	})
})

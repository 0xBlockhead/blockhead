import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	chainlistRpcsWire,
	chunk,
	clickInternalNavHrefs,
	clearOriginOpfs,
	collectIssues,
	expandClosedAncestors,
	installChainlistRpcsJsonStub,
	navMenu,
	orderedInternalNavHrefs,
} from '../_e2eBrowserHelpers.ts'


const NAV_CHUNK = 5

const MAX_SIDEBAR_SHARDS = 10

test.describe('sidebar navigation', () => {
	test.describe.configure({ retries: 2 })

	test('Networks via sidebar after cold OPFS (chainlist stub)', async ({ page }) => {
		test.setTimeout(120_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		const menu = navMenu(page)
		await page.goto('/', { waitUntil: 'load', timeout: 15_000 })
		await clearOriginOpfs(page)
		await page.reload({ waitUntil: 'load', timeout: 30_000 })
		await page.waitForSelector('#nav-menu', { state: 'visible', timeout: 30_000 })
		const networksLink = menu.getByRole('link', { name: 'Networks', exact: true })
		await expandClosedAncestors(networksLink)
		await networksLink.click()
		const coldRpcs = page.waitForResponse(
			(r) => chainlistRpcsWire(r.url()),
			{ timeout: 90_000 }
		)
		await expect(page).toHaveURL((u) => u.pathname === '/networks')
		await coldRpcs
		const ethereumMainnetHref = page.locator('#networks').locator('a[href$="/network/eip155:1"]').first()
		const networksListPending = page.locator('#networks').getByText('Loading networks…')
		await expect(
			ethereumMainnetHref.or(networksListPending)
		).toBeVisible({ timeout: 90_000 })
		await expect(networksListPending).toHaveCount(0, { timeout: 60_000 })
		await assertMainSettled(page)
		expect(issues, issues.join('\n\n')).toEqual([])
	})

	for (let ci = 0; ci < MAX_SIDEBAR_SHARDS; ci += 1) {
		test(`shard ${ci}`, async ({ page }) => {
			test.setTimeout(600_000)
			await installChainlistRpcsJsonStub(page)
			const issues = collectIssues(page)
			const menu = navMenu(page)
			await page.goto('/', { waitUntil: 'load', timeout: 15_000 })
			await clearOriginOpfs(page)
			await page.reload({ waitUntil: 'load', timeout: 15_000 })
			await expect(menu).toBeVisible({ timeout: 15_000 })
			const all = await orderedInternalNavHrefs(menu)
			const hrefs = chunk(all, NAV_CHUNK)[ci] ?? []
			if (hrefs.length === 0)
				return
			await clickInternalNavHrefs(page, menu, hrefs)
			expect(issues, issues.join('\n\n')).toEqual([])
		})
	}
})

/**
 * Regression guard for persisted collection `queryFn` when live queries use
 * `innerJoin` (correlated `eq(ref, ref)`): strict `parseLoadSubsetOptions` used to throw;
 * `parseLoadSubsetForQueryFn` in `$client.svelte.ts` must keep these pages loadable.
 */
test.describe('collections query lifecycle', () => {
	test.describe.configure({ retries: 1 })

	test('join-heavy Farcaster feed settles with no console issues', async ({ page }) => {
		test.setTimeout(120_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		await page.goto('/farcaster/feed', { waitUntil: 'load', timeout: 30_000 })
		await assertMainSettled(page)
		expect(issues, issues.join('\n\n')).toEqual([])
	})
})

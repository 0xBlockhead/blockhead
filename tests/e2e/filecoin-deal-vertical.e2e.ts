/**
 * Filfox-backed Filecoin storage deal vertical: network hub → Storage deals carousel → deal detail.
 * Live Filfox (and Lotus on the hub) — opt-in; default skipped so CI stays green:
 *
 * ```
 * E2E_FILECOIN_DEAL=1 pnpm exec playwright test filecoin-deal-vertical
 * E2E_FILECOIN_DEAL=1 PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm exec playwright test filecoin-deal-vertical
 * ```
 */
import {
	expect,
	test,
} from '@playwright/test'

import {
	assertCanonicalRouteUrl,
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


test.skip(
	process.env.E2E_FILECOIN_DEAL !== '1',
	'Filfox Filecoin deal vertical is opt-in (set E2E_FILECOIN_DEAL=1)'
)

test.describe('Filecoin storage deal vertical', () => {
	test('network hub Storage deals navigate to settled deal detail', async ({ page }) => {
		test.setTimeout(400_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await page.goto('/network/filecoin', {
			waitUntil: 'domcontentloaded',
		})
		await expectMainVisible(page, 120_000, diagnostics)

		const chainActivityCarousel = page.locator('[id$="-carousel-filecoin-chain-activity"]')
		await expect(chainActivityCarousel).toBeAttached({
			timeout: 120_000,
		})
		await chainActivityCarousel.getByRole('link', {
			name: 'Storage deals',
		}).click()

		const dealsSection = page.locator('section[data-scroll-marker-label="Storage deals"]')
		await expect(dealsSection).toBeAttached({
			timeout: 120_000,
		})

		const dealLink = dealsSection.locator('a[href^="/network/filecoin/deal/"]').first()
		await expect(dealLink).toBeAttached({
			timeout: 120_000,
		})

		const dealHref = await dealLink.getAttribute('href')
		if (dealHref == null)
			throw new Error('Filecoin deal link is missing its href')

		expect(dealHref).toMatch(/^\/network\/filecoin\/deal\/\d+$/)

		await dealLink.click()
		await page.waitForURL(`**${dealHref}`, {
			timeout: 120_000,
		})
		await assertCanonicalRouteUrl(page, dealHref)
		await assertMainSettled(page, 180_000, diagnostics, {
			requiredDt: [
				'Deal ID',
				'Network',
			],
		})

		expect(
			diagnostics.issues.filter((issue) => (
				!(
					(
						issue.includes('filfox.info')
						|| issue.includes('filecoin')
					)
					&& (
						issue.includes('status of 404')
						|| issue.includes('status of 422')
						|| issue.includes('status of 429')
					)
				)
			)),
			diagnostics.issues.join('\n')
		).toEqual([])
	})
})

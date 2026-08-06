/**
 * Arweave GraphQL + gateway REST vertical: network hub → Blocks / Resources → settled detail.
 * Live arweave.net — opt-in; default skipped so CI stays green:
 *
 * ```
 * E2E_ARWEAVE=1 pnpm exec playwright test arweave-blocks-resources-vertical
 * E2E_ARWEAVE=1 PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm exec playwright test arweave-blocks-resources-vertical
 * ```
 *
 * Docs:
 * - GraphQL `blocks` / `block` / `transactions`: https://arweave.net/graphql
 * - Gateway `/block/height/{h}`, `/block/hash/{id}`, `/info`: https://docs.arweave.org/developers/arweave-node-server/http-api
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
	process.env.E2E_ARWEAVE !== '1',
	'Arweave blocks/resources vertical is opt-in (set E2E_ARWEAVE=1)'
)

test.describe('Arweave blocks and resources vertical', () => {
	test('network hub Blocks navigate to settled block detail', async ({ page }) => {
		test.setTimeout(400_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await page.goto('/network/arweave', {
			waitUntil: 'domcontentloaded',
		})
		await expectMainVisible(page, 120_000, diagnostics)

		const chainActivityCarousel = page.locator('[id$="-carousel-arweave-chain-activity"]')
		await expect(chainActivityCarousel).toBeAttached({
			timeout: 120_000,
		})
		await chainActivityCarousel.getByRole('link', {
			name: 'Blocks',
		}).click()

		const blocksSection = page.locator('section[data-scroll-marker-label="Blocks"]')
		await expect(blocksSection).toBeAttached({
			timeout: 120_000,
		})

		const blockLink = blocksSection.locator('a[href*="/block/"]').first()
		await expect(blockLink).toBeAttached({
			timeout: 120_000,
		})

		const blockHref = await blockLink.getAttribute('href')
		if (blockHref == null)
			throw new Error('Arweave block link is missing its href')

		await blockLink.click()
		await page.waitForURL(`**${blockHref}`, {
			timeout: 120_000,
		})
		await assertCanonicalRouteUrl(page, blockHref)
		await assertMainSettled(page, 180_000, diagnostics, {
			requiredDt: [
				'network',
			],
		})

		expect(
			diagnostics.issues.filter((issue) => (
				!(
					(
						issue.includes('arweave.net')
						|| issue.includes('ar-io.net')
						|| issue.includes('arweave')
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

	test('network hub Resources list attaches data-bearing transaction resources', async ({ page }) => {
		test.setTimeout(400_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await page.goto('/network/arweave', {
			waitUntil: 'domcontentloaded',
		})
		await expectMainVisible(page, 120_000, diagnostics)

		const resourcesCarousel = page.locator('[id$="-carousel-arweave-resources"]')
		await expect(resourcesCarousel).toBeAttached({
			timeout: 120_000,
		})
		await resourcesCarousel.getByRole('link', {
			name: 'Resources',
		}).click()

		const resourcesSection = page.locator('section[data-scroll-marker-label="Resources"]')
		await expect(resourcesSection).toBeAttached({
			timeout: 120_000,
		})
		await expect(
			resourcesSection.locator('a').first()
		).toBeAttached({
			timeout: 180_000,
		})

		expect(
			diagnostics.issues.filter((issue) => (
				!(
					(
						issue.includes('arweave.net')
						|| issue.includes('ar-io.net')
						|| issue.includes('arweave')
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

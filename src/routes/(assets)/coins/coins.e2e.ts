import { expect, test } from '@playwright/test'

import {
	assertCanonicalRouteUrl,
	assertMainSettled,
	assertNoGeneratedRouteArtifacts,
	e2eBrowserNewContextOptions,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

test.use(e2eBrowserNewContextOptions())
test.setTimeout(180_000)

test('coins discovery navigates to a recognizable asset detail', async ({ page }) => {
	await installBoundaryProbe(page)
	await installChainlistRpcsJsonStub(page)
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnDevServerContamination: true,
		failOnTanStackWarnings: true,
	})

	await diagnostics.step(page.goto('/coins', {
		waitUntil: 'load',
		timeout: 120_000,
	}))
	await diagnostics.step(assertCanonicalRouteUrl(page, '/coins'))
	await diagnostics.step(expect.poll(
		() => page.locator('#main .entity-view-summary').count(),
		{
			message: '/coins entity summary rows',
			timeout: 120_000,
		}
	).toBeGreaterThanOrEqual(5))
	await diagnostics.step(expect.poll(
		() => page.locator('#main a[href^="/coin/"]').evaluateAll((links) => (
			new Set(
				links
					.map((link) => link.getAttribute('href'))
					.filter((href) => href != null)
			).size
		)),
		{
			message: '/coins unique coin links',
			timeout: 120_000,
		}
	).toBeGreaterThanOrEqual(5))
	await diagnostics.step(assertNoGeneratedRouteArtifacts(page, '/coins'))
	await diagnostics.step(expect(page.locator('#main [role="alert"], #main [data-error]')).toHaveCount(0))
	await diagnostics.step(expect(page.locator('#main').getByText(/Loading\b/)).toHaveCount(0))
	await diagnostics.step(expect(page.locator('#main')).not.toContainText('[object Object]'))
	await diagnostics.step(expect(page.locator('#main')).not.toContainText('"$coin"'))

	const ethereumLink = page.locator('#main').getByRole('link', {
		name: /Ethereum.*ETH|ETH.*Ethereum/,
	})
	await diagnostics.step(expect(ethereumLink).toHaveCount(1))
	await diagnostics.step(expect(ethereumLink).toHaveAttribute('href', '/coin/ETH'))
	await diagnostics.step(ethereumLink.click())
	await diagnostics.step(page.waitForURL('/coin/ETH'))
	await diagnostics.step(assertCanonicalRouteUrl(page, '/coin/ETH'))
	await diagnostics.step(assertMainSettled(
		page,
		120_000,
		diagnostics,
		{
			requiredText: [
				'Ethereum',
				'ETH',
			],
			requiredDt: [
				'Latest snapshot',
			],
		}
	))
	await diagnostics.step(expect(page.locator('#main')).toContainText(/360,000,000,000|No latest snapshot available\./))
	await diagnostics.step(expect(page.getByRole('heading', {
		level: 4,
		name: 'ETH Ether',
		exact: true,
	}).first()).toBeVisible())
	await diagnostics.step(expect(page.getByRole('heading', {
		level: 4,
		name: 'ETH Ether ETH Ether',
		exact: true,
	})).toHaveCount(0))
	await diagnostics.step(expect(page.locator('#main [role="alert"], #main [data-error]')).toHaveCount(0))
	await diagnostics.step(expect(page.locator('#main')).not.toContainText('[object Object]'))
	await diagnostics.step(expect(page.locator('#main')).not.toContainText('"$coin"'))
	await diagnostics.step(assertNoGeneratedRouteArtifacts(page, '/coin/ETH'))
})

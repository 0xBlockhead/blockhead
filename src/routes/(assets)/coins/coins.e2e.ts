import { expect, test } from '@playwright/test'

import {
	assertCanonicalRouteUrl,
	assertNoGeneratedRouteArtifacts,
	e2eBrowserNewContextOptions,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

test.use(e2eBrowserNewContextOptions())
test.setTimeout(180_000)

test('coins list reaches its catalog-backed settled state', async ({ page }) => {
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
		() => page.locator('#main a').evaluateAll((links) => (
			new Set(
				links
					.map((link) => link.getAttribute('href'))
					.filter((href) => href != null && href !== '' && !href.startsWith('#'))
			).size
		)),
		{
			message: '/coins unique non-fragment links',
			timeout: 120_000,
		}
	).toBeGreaterThanOrEqual(8))
	await diagnostics.step(assertNoGeneratedRouteArtifacts(page, '/coins'))
	await diagnostics.step(expect(page.locator('#main [role="alert"], #main [data-error]')).toHaveCount(0))
	await diagnostics.step(expect(page.locator('#main').getByText(/Loading\b/)).toHaveCount(0))
	await diagnostics.step(expect(page.locator('#main')).not.toContainText('[object Object]'))
})

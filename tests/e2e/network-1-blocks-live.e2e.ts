import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
} from '../_e2eBrowserHelpers.ts'

const pageErrors = (issues: string[]) => (
	issues.filter((i) => i.startsWith('pageerror:'))
)

const readBlocksDiagnostics = (
	page: import('@playwright/test').Page,
) => page.evaluate(() => {
	const probe = window.__blockheadClientProbe
	if (probe == null)
		throw new Error('missing blockhead client probe')

	return {
		fieldRows: probe.collectionSizes().fields.EvmNetwork?.$$blocks ?? 0,
		queries: probe.queryStates().filter((query) => query.key[0] === 'Field:EvmNetwork:$$blocks'),
	}
})

test.describe('/network/eip155:1/blocks (EvmBlocksView + $$blocks collection query)', () => {
	test('materializes queried block rows into the field collection and DOM', async ({ page }) => {
		test.setTimeout(240_000)
		await installPersistenceProbe(page)
		await installChainlistRpcsJsonStub(page)

		const issues = collectIssues(page)
		await page.goto('/network/eip155:1/blocks', { waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible()
		await assertMainSettled(page, 120_000)

		await expect.poll(async () => {
			const diagnostics = await readBlocksDiagnostics(page)
			return (
				diagnostics.fieldRows > 0
				&& diagnostics.queries.some((query) => query.status === 'success')
			) ?
				'ok'
			:
				JSON.stringify(diagnostics)
		}, {
			message: 'Field:EvmNetwork:$$blocks query must materialize rows into the TanStack DB field collection',
			timeout: 60_000,
			intervals: [
				500,
				1_000,
				2_000,
			],
		}).toBe('ok')
		expect((await readBlocksDiagnostics(page)).fieldRows).toBeGreaterThan(0)
		const firstBlockLink = page.locator('#blocks-items a[href*="/block/"]').first()
		await expect(firstBlockLink).toBeAttached()
		await expect(firstBlockLink).toHaveAttribute('href', /\/block\/[0-9]+\b/)

		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n'),
		).toEqual([])
	})
})

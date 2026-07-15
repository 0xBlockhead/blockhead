import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'


test('ActivityPub hub renders settled directory and federation sections', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await page.addInitScript(({ name, schemaVersion }) => {
			window.__blockheadClientProbeEnabled = true
			window.__blockheadWaSqliteDatabaseNameOverride = name
			window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
			window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
		}, {
			name: `blockhead-activitypub-hub-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
			schemaVersion: Date.now(),
		})
		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/activitypub', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0, {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))
		const main = page.locator('#main')
		await step(expect(main).toContainText('global ActivityPub network'))
		await step(expect(main).toContainText('Directory'))
		await step(expect(main).toContainText('Federation'))
		await step(expect(main.locator('a[href="/activitypub/actors"]')).toHaveText('Actors'))
		await step(expect(main).toContainText('No ActivityPub actors in this observed.'))
		await step(main.locator('a[data-scroll-marker-label="Notes"]').click())
		await step(expect(main.locator('a[href="/activitypub/notes"]')).toHaveText('Notes'))
		await step(expect(main).toContainText('No ActivityPub notes in this observed.'))
		await step(main.locator('a[data-scroll-marker-label="Instances"]').click())
		await step(expect(main).toContainText('No ActivityPub instances declared.'))
		await step(expect(main).toContainText('No ActivityPub instance peers in this observed.'))
		await step(main.locator('a[data-scroll-marker-label="Moderated domains"]').click())
		await step(expect(main).toContainText('No ActivityPub moderated domains in this observed.'))
		await step(expect(main).not.toContainText('Internal Error'))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main.getByText(/Loading\b/)).toHaveCount(0))
	}
	catch (e) {
		await flushArtifacts(testInfo)
		throw e
	}
})

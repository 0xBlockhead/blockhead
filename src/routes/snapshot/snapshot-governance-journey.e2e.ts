import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../tests/_e2eBrowserHelpers.ts'
import { routeViewSmokeTimeoutsMs } from '../../../tests/e2e/_routeViewDiagnostics.ts'


const proposalId = `0x${'1'.repeat(64)}`
const proposal = {
	id: proposalId,
	ipfs: null,
	author: `0x${'2'.repeat(40)}`,
	created: 1_700_000_000,
	updated: null,
	space: {
		id: 'journey.eth',
	},
	network: '1',
	symbol: 'JOURNEY',
	type: 'basic',
	strategies: [],
	title: 'Snapshot executable governance journey',
	body: 'Snapshot proposal details loaded through the Hub transport.',
	discussion: '',
	choices: [
		'For',
		'Against',
	],
	labels: [],
	start: 1_700_000_100,
	end: 1_700_100_000,
	quorum: 100,
	quorumType: 'default',
	privacy: null,
	snapshot: 19_000_000,
	state: 'closed',
	link: 'https://snapshot.org',
	app: 'snapshot',
	scores: [
		80,
		20,
	],
	scores_by_strategy: [],
	scores_state: 'final',
	scores_total: 100,
	scores_total_value: 100,
	scores_updated: 1_700_100_001,
	votes: 7,
}

test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-snapshot-journey-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('Snapshot proposal route renders proposal and vote totals from Hub GraphQL', async ({ page }) => {
	await page.route('https://hub.snapshot.org/graphql', async (route) => {
		expect(route.request().postData()).toContain('query SnapshotHubProposal')
		await route.fulfill({
			json: {
				data: {
					proposal,
				},
			},
		})
	})

	await page.goto(`/snapshot/proposal/${proposalId}`, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const main = page.locator('#main')
	await expect(main).toContainText(proposal.title, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(main).toContainText(proposal.body)
	await expect(main.locator('dt').filter({ hasText: /^Votes$/ }).locator('..')).toContainText('7')
	await expect(main.locator('dt').filter({ hasText: /^Scores total$/ }).locator('..')).toContainText('100')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

test('Snapshot proposal route exposes an upstream failure', async ({ page }) => {
	await page.route('https://hub.snapshot.org/graphql', async (route) => {
		await route.fulfill({
			status: 503,
			body: 'Snapshot journey failure',
		})
	})

	await page.goto(`/snapshot/proposal/${proposalId}`, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	await expect(page.locator('#main [data-resource-state="failed"]').first()).toBeAttached({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
})

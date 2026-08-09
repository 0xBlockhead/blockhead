import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../tests/_e2eBrowserHelpers.ts'
import { routeViewSmokeTimeoutsMs } from '../../../tests/e2e/_routeViewDiagnostics.ts'


test.skip(process.env.TALLY_API_KEY == null, 'Tally browser journeys require the runtime-secret capability to be enabled')

const proposalId = '2207450143689540901'
const proposal = {
	id: proposalId,
	onchainId: '42',
	chainId: 'eip155:1',
	status: 'active',
	quorum: '10987654321',
	metadata: {
		title: 'Tally executable governance journey',
		description: 'Tally proposal details loaded through the proxied GraphQL transport.',
		eta: null,
		ipfsHash: null,
		txHash: null,
		discourseURL: null,
		snapshotURL: null,
	},
	governor: {
		id: 'eip155:1:0x7e90e03654732abedf89Faf87f05BcD03ACEeFdc',
		chainId: 'eip155:1',
		name: 'Journey governor',
		slug: 'journey-governor',
	},
	organization: {
		id: '2207450143689540900',
		slug: 'journey',
		name: 'Journey DAO',
	},
	proposer: {
		address: '0x1234567800000000000000000000000000000abc',
		ens: 'journey.eth',
		name: 'Journey proposer',
	},
	start: {
		timestamp: '1700000100',
	},
	end: {
		timestamp: '1700100000',
	},
	voteStats: [
		{
			type: 'for',
			votesCount: '100000',
			votersCount: 3,
			percent: 80,
		},
		{
			type: 'against',
			votesCount: '25000',
			votersCount: 1,
			percent: 20,
		},
	],
}
const governor = {
	...proposal.governor,
	type: 'governorbravo',
	kind: 'single',
	quorum: proposal.quorum,
	timelockId: null,
	tokenId: null,
	delegatesCount: 3,
	delegatesVotesCount: '100000',
	tokenOwnersCount: 4,
	isPrimary: true,
	organization: proposal.organization,
	proposalStats: {
		total: 1,
		active: 1,
		failed: 0,
		passed: 0,
	},
	parameters: null,
	contracts: null,
	metadata: {
		description: 'Journey governor',
	},
}

test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-tally-journey-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('Tally proposal route renders proposal and vote breakdown from GraphQL', async ({ page }) => {
	await page.route('**/api-proxy/**', async (route) => {
		const requestBody = route.request().postData() ?? ''
		if (!requestBody.includes('query Tally'))
			return route.continue()

		expect(requestBody).toMatch(/query Tally(?:Proposal|Governor)/)
		await route.fulfill({
			json: {
				data: {
					...(requestBody.includes('query TallyProposal') && {
						proposal,
					}),
					...(requestBody.includes('query TallyGovernor') && {
						governor,
					}),
				},
			},
		})
	})

	await page.goto(`/tally/proposal/${proposalId}`, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	const main = page.locator('#main')
	await expect(main).toContainText(proposal.metadata.title, {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(main).toContainText(proposal.metadata.description)
	await expect(main.locator('dt').filter({ hasText: /^Votes$/ }).locator('..')).toContainText('for: 100000 (3 voters, 80%)')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

test('Tally proposal route exposes an upstream failure', async ({ page }) => {
	await page.route('**/api-proxy/**', async (route) => {
		if (!(route.request().postData() ?? '').includes('query Tally'))
			return route.continue()

		await route.fulfill({
			status: 502,
			body: 'Tally journey failure',
		})
	})

	await page.goto(`/tally/proposal/${proposalId}`, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	await expect(page.locator('#main [data-resource-state="failed"]').first()).toBeAttached({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
})

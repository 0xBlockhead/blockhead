import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../tests/_e2eBrowserHelpers.ts'
import { routeViewSmokeTimeoutsMs } from '../../../tests/e2e/_routeViewDiagnostics.ts'
import { installRouteViewSqliteIsolation } from '../../../tests/e2e/_routeViewFixtures.ts'


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
	executableCalls: [
		{
			index: 7,
			chainId: 'eip155:1',
			target: '0x1111111111111111111111111111111111111111',
			value: '1000000000000000000',
			calldata: '0x1234',
			signature: 'transfer(address,uint256)',
			type: 'standard',
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
	await installRouteViewSqliteIsolation(page, `blockhead-tally-journey-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
})


test('Tally proposal route links its ordered executable call detail', async ({ page }) => {
	const unexpectedProviderRequests: string[] = []
	await page.route('**/api-proxy/**', async (route) => {
		const requestBody = route.request().postData() ?? ''
		if (!requestBody.includes('query Tally')) {
			unexpectedProviderRequests.push(requestBody)
			return route.fulfill({ status: 418, body: 'Unexpected provider request' })
		}

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

	await page.goto(`/~/tally/proposal/${proposalId}`, {
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
	const executableCallLink = main.locator(`a[href="/~/tally/proposal/${proposalId}/executable-call/7"]`)
	await expect(executableCallLink).toContainText('Call #7')
	await executableCallLink.click()
	await expect(page).toHaveURL(`/~/tally/proposal/${proposalId}/executable-call/7`)
	await expect(page.locator('#main a[href="/network/eip155:1/account/0x1111111111111111111111111111111111111111"]')).toBeVisible()
	await expect(page.locator('#main')).toContainText('1000000000000000000')
	await expect(page.locator('#main')).toContainText('0x1234')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
	expect(unexpectedProviderRequests).toEqual([])
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

	await page.goto(`/~/tally/proposal/${proposalId}`, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)
	await expect(page.locator('#main [data-resource-state="failed"]').first()).toBeAttached({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
})

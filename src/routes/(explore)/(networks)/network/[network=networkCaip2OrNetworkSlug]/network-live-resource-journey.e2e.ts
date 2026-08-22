import { expect, test } from '@playwright/test'

import {
	collapseNetworkEntityView,
	clearOriginOpfs,
	expectMainVisible,
	installNetworkLiveResourceJourneyStubs,
	networkSummaryHeadBlockRow,
	networkSummaryHeadFeeMarketRow,
	networkSummaryHeadNativePriceRow,
	readLiveBlockStreamSubscriptions,
	readNetworkHeadBlockBigint,
	readNetworkHeadEpochBigint,
	readNetworkHeadSlotBigint,
	readNetworkLiveDirectHeadBlock,
	refreshNetworkVoltaireHeadBlocks,
	type NetworkLiveResourceVoltaireStubState,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'


const networkPath = '/network/eip155:1'
const initialHeadBlock = 1000n
const advancedHeadBlock = 1001n
const nativePriceText = '$3,000.00'

test.setTimeout(300_000)

const appOrigin = new URL(
	process.env.PLAYWRIGHT_BASE_URL?.trim() || 'http://127.0.0.1:5282'
).origin

test.beforeEach(async ({ page }) => {
	page.on('console', (msg) => {
		if (msg.text().includes('BHDBG')) console.log(`BROWSER: ${msg.type()}: ${msg.text()}`)
	})
})

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-network-live-resource-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('Network summary live resources: expanded/collapsed dl, head push, refresh retention, unsubscribe', async ({ page }) => {
	const voltaireStubState: NetworkLiveResourceVoltaireStubState = {
		headBlockNumber: initialHeadBlock,
		refreshFails: false,
	}
	await installNetworkLiveResourceJourneyStubs(page, voltaireStubState, appOrigin)

	await page.goto(`${appOrigin}/`, {
		waitUntil: 'domcontentloaded',
	})
	await clearOriginOpfs(page)
	await page.goto(networkPath, {
		waitUntil: 'load',
	})
	await expectMainVisible(page, 120_000)
	await page.locator('body').evaluate((body) => {
		body.dataset.networkLiveResourceRouteInstance = 'open'
	})

	const summaryBlockLink = networkSummaryHeadBlockRow(page).locator('a[href*="/block/"]').first()
	await expect(summaryBlockLink).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByTestId('network-live-direct-head-ready')).toHaveText('true', {
		timeout: 120_000,
	})
	await expect(page.getByTestId('network-live-direct-head-block')).toHaveText(String(initialHeadBlock), {
		timeout: 120_000,
	})
	await expect(summaryBlockLink).toHaveAttribute('href', /\/block\/1000\b/)
	await expect(networkSummaryHeadNativePriceRow(page)).toContainText(nativePriceText, {
		timeout: 120_000,
	})
	await expect(networkSummaryHeadFeeMarketRow(page).getByText('wei').first()).toBeAttached({
		timeout: 120_000,
	})

	const epochExpanded = await readNetworkHeadEpochBigint(page, 120_000)
	expect(epochExpanded, 'head epoch in expanded summary').not.toBeNull()

	const slotExpanded = await readNetworkHeadSlotBigint(page, 120_000)
	expect(slotExpanded, 'head slot in expanded summary').not.toBeNull()
	expect((slotExpanded ?? 0n) > 0n).toBe(true)

	await expect.poll(
		async () => (await readLiveBlockStreamSubscriptions(page)).length,
		{
			message: 'Voltaire blockStream live subscription should mount once on the network page',
			timeout: 120_000,
		}
	).toBe(1)

	const blockStreamNode = summaryBlockLink
	await collapseNetworkEntityView(page)
	await expect(summaryBlockLink).toBeVisible({
		timeout: 30_000,
	})
	await expect(page.getByTestId('network-live-direct-head-block')).toHaveText(String(initialHeadBlock))
	await expect(networkSummaryHeadNativePriceRow(page).getByText(nativePriceText)).toBeAttached()
	expect(await readNetworkHeadBlockBigint(page, 30_000)).toBe(initialHeadBlock)
	await expect.poll(
		async () => (await readLiveBlockStreamSubscriptions(page)).length,
		{
			message: 'Voltaire blockStream live subscription should stay mounted while collapsed',
			timeout: 30_000,
		}
	).toBe(1)

	voltaireStubState.headBlockNumber = advancedHeadBlock
	await refreshNetworkVoltaireHeadBlocks(page, advancedHeadBlock)
	const collectionBlocksAfterPush = await page.evaluate(() => {
		const trace = window.__blockheadClientProbe?.traceCollections()
		const fieldRows = trace?.collectionRows.fields.Network ?? {}
		const blocksKey = Object.keys(fieldRows).find((key) => key.includes('$$blocks'))
		const rows = blocksKey ? fieldRows[blocksKey] : []
		return rows.map((row) => String(
			row.__value?.blockNumber
			?? row.__value?.__selector?.blockNumber
			?? ''
		))
	})
	expect(collectionBlocksAfterPush, 'TanStack field collection should materialize pushed head block').toContain(String(advancedHeadBlock))

	const networkFieldToArray = await page.evaluate(() => {
		const appClient = window.__blockheadClientProbe?.appClient as any
		if (appClient == null) return 'no appClient'
		const fieldAddressKey = ['Network', ['Evm'], '$$blocks'].join('\u001e')
		const collection = appClient.entityFieldCollections.Network?.[fieldAddressKey]
		if (collection == null) return 'no collection'
		return collection.toArray.map((row: any) => ({
			source: row.__source,
			valueKey: row.valueKey,
			blockNumber: row.__value?.blockNumber ?? row.__value?.__selector?.blockNumber,
		}))
	})
	console.log('FIELD_TOARRAY', networkFieldToArray)
	console.log('COLLECTION_BLOCKS', collectionBlocksAfterPush)

	await expect.poll(
		() => readNetworkHeadBlockBigint(page, 5_000),
		{
			message: 'ResourceBoundary DOM should observe controlled Voltaire head push while collapsed',
			timeout: 120_000,
			intervals: [500, 1_000, 1_500, 2_000],
		}
	).toBe(advancedHeadBlock)
	await expect.poll(
		() => readNetworkLiveDirectHeadBlock(page),
		{
			message: 'direct resource getter should observe controlled Voltaire head push while collapsed',
			timeout: 120_000,
			intervals: [500, 1_000, 1_500, 2_000],
		}
	).toBe(String(advancedHeadBlock))
	await expect(page.locator('body')).toHaveAttribute('data-network-live-resource-route-instance', 'open')
	await expect(blockStreamNode).toBe(blockStreamNode)

	voltaireStubState.refreshFails = true

	await page.waitForTimeout(2_500)
	await expect(page.getByTestId('network-live-direct-head-block')).toHaveText(String(advancedHeadBlock))
	await expect.poll(
		() => readNetworkHeadBlockBigint(page, 5_000),
		{
			message: 'ResourceBoundary DOM should retain advanced head after refresh failure',
			timeout: 30_000,
		}
	).toBe(advancedHeadBlock)
	await expect(page.getByTestId('network-live-direct-head-ready')).toHaveText('true')

	await page.locator('#nav-menu a[href="/networks"]').first().click()
	await expect(page).toHaveURL(/\/networks$/, {
		timeout: 30_000,
	})
	await expect.poll(
		async () => (await readLiveBlockStreamSubscriptions(page)).length,
		{
			message: 'SPA navigation away from the network page should release the blockStream subscription',
			timeout: 120_000,
		}
	).toBe(0)
	await expect(page.locator('body')).toHaveAttribute('data-network-live-resource-route-instance', 'open')
})

import { expect, test } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import type {
	BlockfrostEpoch,
	BlockfrostGovernanceProposal,
	BlockfrostGovernanceProposalMetadata,
	BlockfrostGovernanceProposalVotes,
	BlockfrostTransaction,
	BlockfrostTransactionUtxos,
} from '$/sources/Blockfrost/Rest/types.ts'
import type { CardanoKoiosTransactionInfo } from '$/sources/CardanoKoios/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const attach = { timeout: 120_000 }
const blockfrostBaseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/'
const koiosBaseUrl = 'https://api.koios.rest/api/v1/'
const proposalPath = '/network/cardano/governance/proposal/proposal-hash/1'
const currentObservationPath = '/network/cardano/governance/proposal/proposal-hash/1/observations/599/Blockfrost_Rest'

const latestEpoch = {
	epoch: 599,
	start_time: 1_719_964_800,
	end_time: 1_720_396_799,
	first_block_time: 1_719_964_820,
	last_block_time: 1_720_300_000,
	block_count: 21_600,
	tx_count: 350_000,
	output: '1',
	fees: '2',
	active_stake: '30000000000000000',
} satisfies BlockfrostEpoch

const proposal = {
	id: 'gov_action1fixture',
	tx_hash: 'proposal-hash',
	cert_index: 1,
	governance_type: 'info_action',
	governance_description: {
		tag: 'InfoAction',
	},
	deposit: '1000000',
	return_address: 'stake1fixture',
	ratified_epoch: 596,
	enacted_epoch: 597,
	dropped_epoch: null,
	expired_epoch: null,
	expiration: 600,
} satisfies BlockfrostGovernanceProposal

const proposalMetadata = {
	id: 'gov_action1fixture',
	tx_hash: 'proposal-hash',
	cert_index: 1,
	url: 'https://example.com/cardano/proposal.json',
	hash: 'proposal-metadata-hash',
	json_metadata: null,
	bytes: '',
} satisfies BlockfrostGovernanceProposalMetadata

const koiosProposalTransaction = {
	tx_hash: 'proposal-hash',
	epoch_no: 590,
	absolute_slot: 130_000_000,
	tx_timestamp: 1_720_000_000,
	tx_size: 433,
	fee: '182485',
	deposit: '2000000',
	invalid_before: null,
	invalid_after: null,
	inputs: [],
	outputs: [],
	collateral_inputs: [],
	reference_inputs: [],
	certificates: [],
	native_scripts: [],
	plutus_contracts: [],
	voting_procedures: [],
	proposal_procedures: [{
		type: 'InfoAction',
		index: 1,
		deposit: '1000000',
		meta_url: 'https://example.com/cardano/proposal.json',
		meta_hash: 'proposal-metadata-hash',
		description: {
			tag: 'InfoAction',
		},
		return_address: 'stake1fixture',
	}],
} satisfies CardanoKoiosTransactionInfo

const blockfrostProposalTransaction = {
	hash: 'proposal-hash',
	block: 'block-hash',
	block_height: 10_000_000,
	block_time: 1_720_000_000,
	slot: 130_000_000,
	index: 1,
	output_amount: [],
	fees: '182485',
	deposit: '2000000',
	size: 433,
	invalid_before: null,
	invalid_hereafter: null,
	utxo_count: 0,
	withdrawal_count: 0,
	mir_cert_count: 0,
	delegation_count: 0,
	stake_cert_count: 0,
	pool_update_count: 0,
	pool_retire_count: 0,
	asset_mint_or_burn_count: 0,
	redeemer_count: 0,
	valid_contract: true,
	treasury_donation: '0',
} satisfies BlockfrostTransaction

const blockfrostProposalTransactionUtxos = {
	hash: 'proposal-hash',
	inputs: [],
	outputs: [],
} satisfies BlockfrostTransactionUtxos

const installFixtures = async (page: Page) => {
	const requests = new Map<string, number>()
	const unexpected: string[] = []
	const blockfrostResponseByRequest = new Map<string, JsonValue>(Object.entries({
		'GET epochs/latest': latestEpoch,
		'GET governance/proposals/proposal-hash/1': proposal,
		'GET governance/proposals/proposal-hash/1/metadata': proposalMetadata,
		'GET governance/proposals/proposal-hash/1/votes?count=64&page=1': [] satisfies BlockfrostGovernanceProposalVotes,
		'GET txs/proposal-hash': blockfrostProposalTransaction,
		'GET txs/proposal-hash/utxos': blockfrostProposalTransactionUtxos,
	}))

	await page.route('**/*', async (route) => {
		const request = route.request()
		const decodedUrl = decodeURIComponent(request.url())
		const baseUrl = (
			decodedUrl.includes(blockfrostBaseUrl) ?
				blockfrostBaseUrl
			: decodedUrl.includes(koiosBaseUrl) ?
				koiosBaseUrl
			:
				undefined
		)
		if (baseUrl == null) {
			const url = new URL(request.url())
			if (
				url.origin === 'https://chainid.network'
				|| url.origin === 'https://chainlist.org'
				|| url.hostname === 'localhost'
				|| url.hostname === '127.0.0.1'
			) {
				await route.fallback()
				return
			}

			unexpected.push(`${request.method()} ${request.url()}`)
			await route.fulfill({
				body: 'Unexpected external Cardano observation request',
				status: 418,
			})
			return
		}

		const requestKey = `${request.method()} ${decodedUrl.slice(decodedUrl.indexOf(baseUrl) + baseUrl.length)}`
		requests.set(requestKey, (requests.get(requestKey) ?? 0) + 1)
		const response = (
			baseUrl === blockfrostBaseUrl ?
				blockfrostResponseByRequest.get(requestKey)
			: requestKey === 'POST tx_info' ?
				[koiosProposalTransaction]
			:
				undefined
		)
		if (response === undefined) {
			unexpected.push(requestKey)
			await route.fulfill({
				body: `Unexpected Cardano observation fixture request: ${requestKey}`,
				status: 418,
			})
			return
		}

		await route.fulfill({
			contentType: 'application/json',
			json: response,
		})
	})

	return {
		requests,
		unexpected,
	}
}

const preparePage = async (
	page: Page,
	testInfo: TestInfo
) => {
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `cardano-proposal-observation-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	return installFixtures(page)
}


test('navigates from a proposal to its current Blockfrost observation', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const fixture = await preparePage(page, testInfo)
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnDevServerContamination: true,
		failOnTanStackWarnings: true,
	})

	await diagnostics.step(page.goto(proposalPath, {
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))
	expect(fixture.unexpected).toEqual([])
	expect(fixture.requests.get('GET governance/proposals/proposal-hash/1')).toBeGreaterThan(0)
	await page.locator(`#timestamps a[href="${currentObservationPath}"]`).first().click()
	await expect(page).toHaveURL((url) => url.pathname === currentObservationPath)
	await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))

	await expect(page.locator('#main')).toContainText('ratified epoch', attach)
	await expect(page.locator('#main')).toContainText('596', attach)
	await expect(page.locator('#main')).toContainText('enacted epoch', attach)
	await expect(page.locator('#main')).toContainText('597', attach)
	await expect(page.locator('#main')).toContainText('expiration epoch', attach)
	await expect(page.locator('#main')).toContainText('600', attach)
	await expect(page.locator('#main [data-error]')).toHaveCount(0)

	expect(fixture.requests.get('GET epochs/latest')).toBeGreaterThan(0)
	expect(fixture.requests.get('GET governance/proposals/proposal-hash/1')).toBeGreaterThan(0)
	expect(fixture.unexpected).toEqual([])
	expect(diagnostics.issues).toEqual([])
})

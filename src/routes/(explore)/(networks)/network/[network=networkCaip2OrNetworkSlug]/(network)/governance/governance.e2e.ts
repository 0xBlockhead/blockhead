import { expect, test } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
	waitForBoundarySettle,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'
import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json'
import type {
	BlockfrostAssets,
	BlockfrostBlock,
	BlockfrostCommittee,
	BlockfrostCommitteeVotes,
	BlockfrostDRep,
	BlockfrostDRepMetadata,
	BlockfrostDReps,
	BlockfrostDRepVotes,
	BlockfrostEpoch,
	BlockfrostGovernanceProposal,
	BlockfrostGovernanceProposalMetadata,
	BlockfrostGovernanceProposals,
	BlockfrostGovernanceProposalVotes,
	BlockfrostProtocolParameters,
	BlockfrostStakePool,
	BlockfrostStakePoolMetadata,
	BlockfrostStakePools,
	BlockfrostTransaction,
	BlockfrostTransactionUtxos,
	BlockfrostTransactions,
} from '$/sources/Blockfrost/Rest/types.ts'
import type {
	CardanoKoiosAsset,
	CardanoKoiosBlock,
	CardanoKoiosBlockTransaction,
	CardanoKoiosCommittee,
	CardanoKoiosDRep,
	CardanoKoiosGovernanceProposal,
	CardanoKoiosProtocolParameters,
	CardanoKoiosStakePool,
	CardanoKoiosTip,
	CardanoKoiosTransactionInfo,
} from '$/sources/CardanoKoios/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const attach = { timeout: 120_000 }
const blockfrostBaseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/'
const koiosBaseUrl = 'https://api.koios.rest/api/v1/'
const proposalPath = '/network/cardano/governance/proposal/proposal-hash/1'
const drepPath = '/network/cardano/drep/drep1fixture'
const poolPath = '/network/cardano/stake-pool/pool1fixture'
const committeePath = '/network/cardano/governance/committee/epoch/599/CardanoKoios_Rest'
const utxoSections = [
	['utxo-consensus-observations', 'Observations'],
	['utxo-consensus-blocks', 'Blocks'],
	['utxo-execution-transactions', 'Transactions'],
] as const
const cardanoSections = [
	['cardano-chain-blocks', 'Blocks'],
	['cardano-chain-transactions', 'Transactions'],
	['cardano-chain-observations', 'Observations'],
	['cardano-stake-pools', 'Stake pools'],
	['cardano-governance-proposals', 'Proposals'],
	['cardano-governance-dreps', 'DReps'],
	['cardano-governance-committee', 'Committee epochs'],
	['cardano-assets-native', 'Native assets'],
	['cardano-protocol-parameters', 'Protocol parameters'],
	['cardano-resources-endpoints', 'Endpoints'],
] as const

const proposalList = [{
	id: 'gov_action1fixture',
	tx_hash: 'proposal-hash',
	cert_index: 1,
	governance_type: 'info_action',
}] satisfies BlockfrostGovernanceProposals
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
	json_metadata: {
		body: {
			title: 'Deterministic governance proposal',
		},
	},
	bytes: '',
} satisfies BlockfrostGovernanceProposalMetadata
const proposalVotes = [{
	tx_hash: 'proposal-vote-hash',
	cert_index: 2,
	voter_role: 'drep',
	voter: 'drep1fixture',
	vote: 'yes',
}] satisfies BlockfrostGovernanceProposalVotes
const drepList = [{
	drep_id: 'drep1fixture',
	hex: 'ab',
	amount: '2000000',
	has_script: false,
	retired: false,
	expired: false,
	last_active_epoch: 598,
	metadata: {
		url: 'https://example.com/cardano/drep.json',
		hash: 'drep-metadata-hash',
		json_metadata: {
			body: {
				givenName: 'Fixture DRep',
			},
		},
		bytes: '',
	},
}] satisfies BlockfrostDReps
const drep = {
	drep_id: 'drep1fixture',
	hex: 'ab',
	amount: '2000000',
	active: true,
	active_epoch: 590,
	has_script: false,
	last_active_epoch: 598,
	retired: false,
	expired: false,
} satisfies BlockfrostDRep
const drepMetadata = {
	drep_id: 'drep1fixture',
	hex: 'ab',
	url: 'https://example.com/cardano/drep.json',
	hash: 'drep-metadata-hash',
	json_metadata: {
		body: {
			givenName: 'Fixture DRep',
		},
	},
	bytes: '',
} satisfies BlockfrostDRepMetadata
const drepVotes = [{
	tx_hash: 'drep-vote-hash',
	cert_index: 3,
	proposal_id: 'gov_action1fixture',
	proposal_tx_hash: 'proposal-hash',
	proposal_cert_index: 1,
	vote: 'yes',
}] satisfies BlockfrostDRepVotes
const stakePool = {
	pool_id: 'pool1fixture',
	hex: 'cd',
	vrf_key: 'fixture-vrf-key',
	blocks_minted: 12,
	blocks_epoch: 2,
	live_stake: '5000000',
	live_size: 0.1,
	live_saturation: 0.2,
	live_delegators: 3,
	active_stake: '4000000',
	active_size: 0.1,
	declared_pledge: '1000000',
	live_pledge: '1000000',
	margin_cost: 0.03,
	fixed_cost: '340000000',
	reward_account: 'stake1poolfixture',
	owners: ['stake1ownerfixture'],
	registration: ['pool-registration-hash'],
	retirement: [],
	calidus_key: null,
} satisfies BlockfrostStakePool
const stakePoolMetadata = {
	pool_id: 'pool1fixture',
	hex: 'cd',
	url: 'https://example.com/cardano/pool.json',
	hash: 'pool-metadata-hash',
	ticker: 'FIX',
	name: 'Fixture Pool',
	description: 'Deterministic Cardano stake pool',
	homepage: 'https://example.com/cardano/pool',
} satisfies BlockfrostStakePoolMetadata
const committee = {
	gov_action_id: 'gov_action1committee',
	proposal_tx_hash: 'proposal-hash',
	proposal_index: 1,
	is_dissolved: false,
	quorum: {
		numerator: 2,
		denominator: 3,
	},
	members: [{
		cc_cold_id: 'cc_cold1fixture',
		cc_cold_hex: 'ef',
		cc_cold_has_script: false,
		cc_hot_id: 'cc_hot1fixture',
		cc_hot_hex: '01',
		cc_hot_has_script: false,
		status: 'authorized',
		expiration_epoch: 610,
	}],
} satisfies BlockfrostCommittee
const committeeVotes = [{
	tx_hash: 'committee-vote-hash',
	voter_hot_id: 'cc_hot1fixture',
	proposal_id: 'gov_action1fixture',
	proposal_tx_hash: 'proposal-hash',
	proposal_index: 1,
	governance_type: 'info_action',
	vote: 'yes',
	metadata_url: 'https://example.com/cardano/committee-vote.json',
	metadata_hash: 'committee-vote-metadata-hash',
	block_height: 10_000_000,
	block_time: 1_720_000_000,
}] satisfies BlockfrostCommitteeVotes
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
const proposalTransaction = {
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
const proposalTransactionUtxos = {
	hash: 'proposal-hash',
	inputs: [],
	outputs: [],
} satisfies BlockfrostTransactionUtxos
const protocolParameters = {
	epoch: 599,
	min_fee_a: 44,
	min_fee_b: 155_381,
	max_block_size: 65_536,
	max_tx_size: 16_384,
	max_block_header_size: 1_100,
	key_deposit: '2000000',
	pool_deposit: '500000000',
	e_max: 18,
	n_opt: 500,
	a0: 0.3,
	rho: 0.003,
	tau: 0.2,
	decentralisation_param: 0,
	extra_entropy: null,
	protocol_major_ver: 9,
	protocol_minor_ver: 0,
	min_utxo: '1000000',
	min_pool_cost: '170000000',
	nonce: 'fixture-nonce',
	cost_models: null,
	cost_models_raw: {
		PlutusV3: [1],
	},
	price_mem: 0.0577,
	price_step: 0.0000721,
	max_tx_ex_mem: '10000000',
	max_tx_ex_steps: '10000000000',
	max_block_ex_mem: '50000000',
	max_block_ex_steps: '40000000000',
	max_val_size: '5000',
	collateral_percent: 150,
	max_collateral_inputs: 3,
	coins_per_utxo_size: '4310',
	coins_per_utxo_word: null,
	pvt_motion_no_confidence: 0.51,
	pvt_committee_normal: 0.51,
	pvt_committee_no_confidence: 0.51,
	pvt_hard_fork_initiation: 0.51,
	dvt_motion_no_confidence: 0.67,
	dvt_committee_normal: 0.67,
	dvt_committee_no_confidence: 0.67,
	dvt_update_to_constitution: 0.75,
	dvt_hard_fork_initiation: 0.6,
	dvt_p_p_network_group: 0.67,
	dvt_p_p_economic_group: 0.67,
	dvt_p_p_technical_group: 0.67,
	dvt_p_p_gov_group: 0.75,
	dvt_treasury_withdrawal: 0.67,
	committee_min_size: '7',
	committee_max_term_length: '146',
	gov_action_lifetime: '6',
	gov_action_deposit: '100000000000',
	drep_deposit: '500000000',
	drep_activity: '20',
	pvtpp_security_group: 0.51,
	pvt_p_p_security_group: 0.51,
	min_fee_ref_script_cost_per_byte: 15,
} satisfies BlockfrostProtocolParameters
const koiosTip = {
	hash: 'koios-block-hash',
	epoch_no: 599,
	era: 'Conway',
	abs_slot: 130_000_000,
	block_height: 10_000_000,
	block_time: 1_720_000_000,
} satisfies CardanoKoiosTip
const koiosBlocks = [{
	...koiosTip,
	tx_count: 4,
}] satisfies CardanoKoiosBlock[]
const koiosProposals = [{
	proposal_tx_hash: 'proposal-hash',
	proposal_index: 1,
	proposal_type: 'info_action',
}] satisfies CardanoKoiosGovernanceProposal[]
const koiosCommittee = {
	proposal_id: 'gov_action1fixture',
	proposal_tx_hash: 'proposal-hash',
	proposal_index: 1,
	quorum_numerator: 2,
	quorum_denominator: 3,
	members: [
		{
			status: 'authorized',
			cc_hot_id: 'cc_hot1fixture',
			cc_cold_id: 'cc_cold1fixture',
			cc_hot_hex: '01',
			cc_cold_hex: '02',
			expiration_epoch: 726,
			cc_hot_has_script: true,
			cc_cold_has_script: true,
		},
	],
} satisfies CardanoKoiosCommittee
const koiosProtocolParameters = {
	epoch_no: 599,
	min_fee_a: 44,
	min_fee_b: 155_381,
	max_block_size: 90_112,
	max_tx_size: 16_384,
	max_bh_size: 1_100,
	key_deposit: '2000000',
	pool_deposit: '500000000',
	max_epoch: 18,
	optimal_pool_count: 500,
	monetary_expand_rate: 0.003,
	treasury_growth_rate: 0.2,
	decentralisation: 0,
	protocol_major: 9,
	protocol_minor: 0,
	min_pool_cost: '170000000',
	coins_per_utxo_size: '4310',
} satisfies CardanoKoiosProtocolParameters
const koiosTransactionInfo = {
	tx_hash: 'proposal-hash',
	epoch_no: 599,
	absolute_slot: 130_000_000,
	tx_timestamp: 1_720_000_000,
	fee: '170000',
	deposit: '1000000',
	tx_size: 512,
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
	proposal_procedures: [
		{
			type: 'NoConfidence',
			index: 0,
			deposit: '900000',
			meta_url: 'https://example.com/cardano/wrong-proposal.json',
			meta_hash: 'wrong-proposal-anchor-hash',
			description: {
				tag: 'NoConfidence',
				contents: null,
			},
			return_address: 'stake1wrongproposal',
		},
		{
			type: 'InfoAction',
			index: 1,
			deposit: '1000000',
			meta_url: 'https://example.com/cardano/koios-proposal.json',
			meta_hash: 'koios-proposal-anchor-hash',
			description: {
				tag: 'InfoAction',
			},
			return_address: 'stake1koiosproposal',
		},
	],
} satisfies CardanoKoiosTransactionInfo

const koiosVoteTransactionInfo = {
	...koiosTransactionInfo,
	tx_hash: 'proposal-vote-hash',
	voting_procedures: [{
		vote: 'Yes',
		voter: 'drep1fixture',
		voter_hex: 'ab',
		voter_role: 'DRep',
		proposal_index: 1,
		proposal_tx_hash: 'proposal-hash',
	}],
	proposal_procedures: [],
} satisfies CardanoKoiosTransactionInfo

type Scenario = 'happy' | 'optional-empty' | 'proposal-error' | 'wrong-index'

const installCardanoGovernanceFixtures = async (
	page: Page,
	scenario: Scenario
) => {
	const requests = new Map<string, number>()
	const unexpected: string[] = []
	const responseByRequest = new Map<string, JsonValue>(Object.entries({
		'GET assets?count=16': [] satisfies BlockfrostAssets,
		'GET blocks/latest/txs?count=16': [] satisfies BlockfrostTransactions,
		'GET epochs/latest': latestEpoch,
		'GET epochs/latest/parameters': protocolParameters,
		'GET governance/committee': committee,
		'GET governance/committee/votes?count=16': committeeVotes,
		'GET governance/committee/votes?count=64': committeeVotes,
		'GET governance/dreps?count=16': drepList,
		'GET governance/dreps/drep1fixture': drep,
		'GET governance/dreps/drep1fixture/metadata': drepMetadata,
		'GET governance/dreps/drep1fixture/votes?count=64': drepVotes,
		'GET governance/proposals?count=16': proposalList,
		'GET governance/proposals/proposal-hash/1': proposal,
		'GET governance/proposals/proposal-hash/1/metadata': proposalMetadata,
		'GET governance/proposals/proposal-hash/1/votes?count=64&page=1': proposalVotes,
		'GET governance/proposals/proposal-hash/2': {
			...proposal,
			cert_index: 2,
		},
		'GET governance/proposals/proposal-hash/2/metadata': {
			...proposalMetadata,
			cert_index: 2,
		},
		'GET governance/proposals/proposal-hash/2/votes?count=64&page=1': proposalVotes,
		'GET pools?count=16': ['pool1fixture'] satisfies BlockfrostStakePools,
		'GET pools/pool1fixture': stakePool,
		'GET pools/pool1fixture/metadata': stakePoolMetadata,
		'GET txs/proposal-hash': proposalTransaction,
		'GET txs/proposal-hash/utxos': proposalTransactionUtxos,
	}))
	const koiosResponseByRequest = new Map<string, JsonValue>(Object.entries({
		'GET asset_list?limit=16': [] satisfies CardanoKoiosAsset[],
		'GET blocks?limit=16': koiosBlocks,
		'GET committee_info': [koiosCommittee],
		'GET drep_list?limit=16': [{
			drep_id: 'drep1fixture',
			has_script: false,
		}] satisfies CardanoKoiosDRep[],
		'GET epoch_params?limit=1&order=epoch_no.desc': [koiosProtocolParameters],
		'GET proposal_list?limit=16&offset=0': koiosProposals,
		'GET pool_list?limit=16': [{
			pool_id_bech32: 'pool1fixture',
			ticker: 'FIX',
		}] satisfies CardanoKoiosStakePool[],
		'GET tip': [koiosTip],
		'POST block_txs': [] satisfies CardanoKoiosBlockTransaction[],
		'POST tx_info': [koiosTransactionInfo],
	}))

	await page.route(
		'**/*',
		async (route) => {
			const request = route.request()
			const decodedUrl = decodeURIComponent(request.url())
			if (
				!decodedUrl.includes(blockfrostBaseUrl)
				&& !decodedUrl.includes(koiosBaseUrl)
			) {
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
				await route.abort('blockedbyclient')
				return
			}
			const baseUrl = (
				decodedUrl.includes(blockfrostBaseUrl) ?
					blockfrostBaseUrl
				:
					koiosBaseUrl
			)
			const requestKey = `${request.method()} ${decodedUrl.slice(decodedUrl.indexOf(baseUrl) + baseUrl.length)}`
			requests.set(requestKey, (requests.get(requestKey) ?? 0) + 1)

			if (
				baseUrl === blockfrostBaseUrl
				&& requestKey === 'GET governance/proposals/proposal-hash/1'
				&& scenario === 'proposal-error'
			) {
				await route.fulfill({
					body: 'Intentional Cardano proposal fixture failure',
					status: 503,
				})
				return
			}
			if (
				baseUrl === blockfrostBaseUrl
				&& requestKey === 'GET governance/proposals/proposal-hash/1/metadata'
				&& scenario === 'optional-empty'
			) {
				await route.fulfill({
					body: 'Optional proposal metadata is absent',
					status: 404,
				})
				return
			}
			if (
				baseUrl === blockfrostBaseUrl
				&& requestKey === 'GET governance/proposals/proposal-hash/1/votes?count=64&page=1'
				&& scenario === 'optional-empty'
			) {
				await route.fulfill({
					contentType: 'application/json',
					json: [] satisfies BlockfrostGovernanceProposalVotes,
				})
				return
			}
			if (
				baseUrl === koiosBaseUrl
				&& requestKey === 'POST tx_info'
				&& request.postData()?.includes('proposal-vote-hash')
			) {
				await route.fulfill({
					contentType: 'application/json',
					json: [koiosVoteTransactionInfo],
				})
				return
			}

			const response = (
				baseUrl === blockfrostBaseUrl ?
					responseByRequest.get(requestKey)
				:
					koiosResponseByRequest.get(requestKey)
			)
			if (response === undefined) {
				unexpected.push(requestKey)
				await route.fulfill({
					body: `Unexpected Cardano fixture request: ${requestKey}`,
					status: 418,
				})
				return
			}

			await route.fulfill({
				contentType: 'application/json',
				json: response,
			})
		}
	)

	return {
		requests,
		unexpected,
	}
}

const preparePage = async (
	page: Page,
	testInfo: TestInfo,
	scenario: Scenario
) => {
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `cardano-${testInfo.workerIndex}-${testInfo.retry}-${scenario}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	return installCardanoGovernanceFixtures(page, scenario)
}

const expectNoWalletActions = async (page: Page) => {
	await expect(page.locator('#main article').getByRole('button', {
		name: /connect wallet|vote|delegate|submit/i,
	})).toHaveCount(0)
}


test.describe('Cardano governance reading journey', () => {
	test('renders and traverses source-backed proposal, DRep, pool, and committee cards', async ({ page }, testInfo) => {
		testInfo.setTimeout(300_000)
		const fixture = await preparePage(page, testInfo, 'happy')
		const diagnostics = setupPageRuntimeDiagnostics(page, {
			failFast: true,
			failOnDevServerContamination: true,
			failOnTanStackWarnings: true,
		})

		await diagnostics.step(page.goto('/network/cardano', {
			waitUntil: 'domcontentloaded',
		}))
		await expectMainVisible(page, 120_000, diagnostics)
		await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))

		const eligibleSections = page.locator('#main :is([id*="-carousel-utxo-"], [id*="-carousel-cardano-"]) [data-collapsible-tabs-pane-host] > section[data-column][data-column-item="flexible"]')
		await expect(eligibleSections).toHaveCount(utxoSections.length + cardanoSections.length)
		await expect(eligibleSections.locator(':scope > article[data-column-item="flexible"][data-card][data-scroll-container]')).toHaveCount(utxoSections.length + cardanoSections.length)
		for (const [sectionId, marker] of utxoSections)
			await expect(page.locator(`#main [id*="-carousel-utxo-"] section[id$=":${sectionId}"][data-scroll-marker-label="${marker}"]`)).toHaveCount(1)
		const paneHosts = page.locator('#main [id*="-carousel-cardano-"] [data-collapsible-tabs-pane-host]')
		await expect(paneHosts).toHaveCount(5)
		const sections = paneHosts.locator(':scope > section[data-column][data-column-item="flexible"]')
		await expect(sections).toHaveCount(cardanoSections.length)
		await expect(sections.locator(':scope > article[data-column-item="flexible"][data-card][data-scroll-container]')).toHaveCount(cardanoSections.length)
		for (const [sectionId, marker] of cardanoSections) {
			const section = paneHosts.locator(`:scope > section[id$=":${sectionId}"][data-scroll-marker-label="${marker}"][data-column][data-column-item="flexible"]`)
			await expect(section).toHaveCount(1)
			await expect(section.locator(`:scope > article[id$=":${sectionId}-list"][data-column-item="flexible"][data-card][data-scroll-container]`)).toHaveCount(1)
		}
		await expect(paneHosts.locator(':scope > section[data-scroll-marker-label="DReps"]')).toContainText('drep1fixture')
		await expect(paneHosts.locator(':scope > section[data-scroll-marker-label="Stake pools"]')).toContainText('FIX')

		const traverse = async ({
			marker,
			pathname,
			expectedText,
		}: {
			marker: string
			pathname: string
			expectedText: string | RegExp
		}) => {
			const section = paneHosts.locator(`:scope > section[data-scroll-marker-label="${marker}"]`)
			await section.locator(`article[data-card][data-scroll-container] a[href="${pathname}"]`).first().click()
			await expect(page).toHaveURL((url) => url.pathname === pathname)
			await expect(page.locator('#main article[data-card][data-scroll-container]').first()).toBeAttached(attach)
			await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))
			await expect(page.locator('#main')).toContainText(expectedText, attach)
			await expect(page.locator('#main [data-error]')).toHaveCount(0)
			await expect(page.locator('#main')).not.toContainText('[object Object]')
			await expect(page.locator('#main')).not.toContainText('This information is not available')
			await expectNoWalletActions(page)
		}

		await traverse({
			marker: 'Proposals',
			pathname: proposalPath,
			expectedText: 'koios-proposal-anchor-hash',
		})
		const proposalCard = page.locator('#main article[id^="cardano-governance-proposal-%"]')
		await expect(proposalCard).toContainText('info_action')
		await expect(proposalCard).toContainText('1,000,000')
		await expect(proposalCard).toContainText('stake1koiosproposal')
		await expect(proposalCard.getByRole('link', {
			name: 'https://example.com/cardano/koios-proposal.json',
		})).toHaveAttribute('href', 'https://example.com/cardano/koios-proposal.json')
		await expect(proposalCard).toContainText('koios-proposal-anchor-hash')
		await expect(proposalCard.locator('dt', { hasText: 'transaction' }).locator('+ dd a')).toHaveAttribute(
			'href',
			'/network/cardano/tx/proposal-hash'
		)
		await expect(proposalCard).toContainText('gov_action1fixture')
		await expect(page.locator('#timestamps')).toContainText(/599|596|597/)
		await expect(page.locator('#votes')).toContainText('yes')
		await expect(proposalCard.getByText(/yes votes|no votes|abstain votes|approval|quorum/i)).toHaveCount(0)

		await page.goBack({ waitUntil: 'domcontentloaded' })
		await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))
		await traverse({
			marker: 'DReps',
			pathname: drepPath,
			expectedText: 'drep-metadata-hash',
		})
		await expect(page.locator('#votes')).toContainText('yes')

		await page.goBack({ waitUntil: 'domcontentloaded' })
		await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))
		await traverse({
			marker: 'Stake pools',
			pathname: poolPath,
			expectedText: 'Fixture Pool',
		})

		await page.goBack({ waitUntil: 'domcontentloaded' })
		await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))
		await traverse({
			marker: 'Committee epochs',
			pathname: committeePath,
			expectedText: /Epoch 599/,
		})

		expect(diagnostics.issues).toEqual([])
		expect(fixture.unexpected).toEqual([])
		expect([
			'GET governance/proposals/proposal-hash/1',
			'GET governance/proposals/proposal-hash/1/votes?count=64&page=1',
			'GET governance/dreps/drep1fixture',
			'GET governance/dreps/drep1fixture/metadata',
			'GET governance/dreps/drep1fixture/votes?count=64',
			'GET pools/pool1fixture',
			'GET pools/pool1fixture/metadata',
		].filter((requestKey) => !fixture.requests.has(requestKey))).toEqual([])
		expect(fixture.requests.get('GET proposal_list?limit=16&offset=0')).toBeGreaterThan(0)
		expect(fixture.requests.get('POST tx_info')).toBeGreaterThan(0)
	})

	test('fails a mismatched Koios proposal index through the proposal boundary', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const fixture = await preparePage(page, testInfo, 'wrong-index')
		const diagnostics = setupPageRuntimeDiagnostics(page, {
			failFast: false,
			failOnDevServerContamination: true,
			failOnTanStackWarnings: true,
		})

		await page.goto('/network/cardano/governance/proposal/proposal-hash/2', {
			waitUntil: 'domcontentloaded',
		})
		await expect(page.locator('#layout')).toBeVisible(attach)
		const settled = await waitForBoundarySettle(page, {
			timeoutMs: 120_000,
			quietMs: 4_000,
		})
		expect(settled.loading).toEqual([])
		expect(settled.failed.length).toBeGreaterThan(0)
		expect(settled.failed.every(({ context }) => (
			context.includes('cardano-governance-proposal-')
		))).toBe(true)
		await expectNoWalletActions(page)
		expect(fixture.requests.get('POST tx_info')).toBeGreaterThan(0)
		expect(fixture.unexpected).toEqual([])
		expect(diagnostics.issues.filter((issue) => (
			!issue.includes('CardanoKoios_Rest: proposal response does not match the subject')
			&& !issue.includes('[blockhead:boundary:uncaught]')
		))).toEqual([])
	})

	test('keeps an empty vote collection non-failing', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const fixture = await preparePage(page, testInfo, 'optional-empty')
		const diagnostics = setupPageRuntimeDiagnostics(page, {
			failFast: false,
			failOnDevServerContamination: true,
			failOnTanStackWarnings: true,
		})

		await page.goto(proposalPath, { waitUntil: 'domcontentloaded' })
		await expectMainVisible(page, 120_000, diagnostics)
		await assertMainSettled(page, 120_000, diagnostics)

		await expect(page.locator('#main')).toContainText(/info_action|InfoAction/)
		await expect(page.locator('#timestamps')).toContainText(/599|596|597/)
		await expect(page.locator('#votes')).toHaveCount(0)
		await expect(page.locator('#main [data-error]')).toHaveCount(0)
		await expectNoWalletActions(page)
		expect(fixture.requests.get('GET governance/proposals/proposal-hash/1/votes?count=64&page=1')).toBeGreaterThan(0)
		expect(diagnostics.issues).toEqual([])
		expect(fixture.unexpected).toEqual([])
	})

	test('renders an exact source-qualified DRep vote detail with its transaction clock', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const fixture = await preparePage(page, testInfo, 'happy')
		const diagnostics = setupPageRuntimeDiagnostics(page, {
			failFast: true,
			failOnDevServerContamination: true,
			failOnTanStackWarnings: true,
		})

		await diagnostics.step(page.goto(
			'/network/cardano/governance/proposal/proposal-hash/1/vote/DRep/drep1fixture/proposal-vote-hash/CardanoKoios_Rest',
			{ waitUntil: 'domcontentloaded' }
		))
		await expectMainVisible(page, 120_000, diagnostics)
		await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))

		const voteCard = page.locator('#main article[id^="cardano-governance-vote-"]')
		await expect(voteCard).toContainText('Yes')
		await expect(voteCard).toContainText('DRep')
		await expect(voteCard).toContainText('drep1fixture')
		await expect(voteCard).toContainText('proposal-vote-hash')
		await expect(voteCard).toContainText('599')
		await expect(voteCard).toContainText('130,000,000')
		await expect(voteCard).toContainText('CardanoKoios_Rest')
		await expect(voteCard.locator('dt', { hasText: 'drep' }).locator('+ dd a')).toHaveAttribute(
			'href',
			'/network/cardano/drep/drep1fixture'
		)
		await expect(voteCard.locator('dt', { hasText: 'transaction' }).locator('+ dd a')).toHaveAttribute(
			'href',
			'/network/cardano/tx/proposal-vote-hash'
		)
		await expectNoWalletActions(page)

		expect(fixture.requests.get('POST tx_info')).toBeGreaterThan(0)
		expect(fixture.unexpected).toEqual([])
		expect(diagnostics.issues).toEqual([])
	})

	test('keeps a proposal transport failure inside its resource boundary', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const fixture = await preparePage(page, testInfo, 'proposal-error')
		const diagnostics = setupPageRuntimeDiagnostics(page, {
			failFast: false,
			failOnDevServerContamination: true,
			failOnTanStackWarnings: true,
		})

		await page.goto(proposalPath, { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#layout')).toBeVisible(attach)
		const settled = await waitForBoundarySettle(page, {
			timeoutMs: 120_000,
			quietMs: 4_000,
		})
		expect(settled.loading).toEqual([])
		expect(settled.failed.length).toBeGreaterThan(0)
		expect(settled.failed.every(({ context }) => (
			context.includes('cardano-governance-proposal-')
		))).toBe(true)
		await expect(page.locator('#timestamps')).toHaveCount(0)
		await expect(page.locator('#main')).not.toContainText('This information is not available')
		await expectNoWalletActions(page)

		expect(fixture.requests.get('GET governance/proposals/proposal-hash/1')).toBeGreaterThan(0)
		expect(diagnostics.issues.filter((issue) => (
			!issue.includes('503')
			&& !issue.includes('Blockfrost_Rest')
			&& !issue.includes('[blockhead:boundary:uncaught]')
		))).toEqual([])
		expect(fixture.unexpected).toEqual([])
	})
})

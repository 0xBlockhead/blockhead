import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/CardanoKoios/bindings.ts'
import {
	SourceDelivery,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type { CardanoKoiosTransactionInfo } from '$/sources/CardanoKoios/Rest/types.ts'

const {
	sourceFetch,
	sourceGetJson,
} = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
	sourceGetJson,
}))

const {
	getCommittee,
	getLatestProtocolParameters,
	getTip,
	getTransactionInfo,
	listAssets,
	listBlocks,
	listDReps,
	listGovernanceProposals,
	listLatestBlockTransactions,
	listStakePools,
} = await import('$/sources/CardanoKoios/Rest/queries.ts')

const binding = bindings[Source.CardanoKoios_Rest][0]

const transactionInfo = {
	tx_hash: 'transaction-hash',
	epoch_no: 500,
	absolute_slot: 130_000_000,
	tx_timestamp: 1_700_000_000,
	tx_size: 512,
	fee: '170000',
	deposit: '0',
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
		type: 'TreasuryWithdrawals',
		index: 2,
		deposit: '100000000000',
		meta_url: 'ipfs://bafybeigdyrzt/proposal.json',
		meta_hash: '9f01cafe',
		description: {
			tag: 'TreasuryWithdrawals',
			contents: [
				[[
					{
						network: 'Mainnet',
						credential: {
							keyHash: 'treasury-key-hash',
						},
					},
					42_000_000,
				]],
				'treasury-policy-hash',
			],
		},
		return_address: 'stake1u8return',
	}],
} satisfies CardanoKoiosTransactionInfo

describe('Cardano Koios REST transaction transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('requests one decoded transaction snapshot with inputs, assets, and relationship payloads enabled', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([transactionInfo]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).resolves.toEqual(transactionInfo)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.koios.rest/api/v1/tx_info',
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					_tx_hashes: [transactionInfo.tx_hash],
					_inputs: true,
					_metadata: false,
					_assets: true,
					_withdrawals: false,
					_certs: true,
					_scripts: true,
					_bytecode: false,
					_governance: true,
				}),
			}
		)
	})

	it('normalizes null collateral and reference input arrays and rejects duplicate I/O identities', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json([{
				...transactionInfo,
				collateral_inputs: null,
				reference_inputs: null,
			}]))
			.mockResolvedValueOnce(Response.json([{
				...transactionInfo,
				outputs: [
					{
						payment_addr: {
							bech32: 'addr1output',
						},
						tx_hash: transactionInfo.tx_hash,
						tx_index: 0,
						value: '1000000',
						asset_list: [],
					},
					{
						payment_addr: {
							bech32: 'addr1output-b',
						},
						tx_hash: transactionInfo.tx_hash,
						tx_index: 0,
						value: '2000000',
						asset_list: [],
					},
				],
			}]))
			.mockResolvedValueOnce(Response.json([{
				...transactionInfo,
				inputs: [
					{
						payment_addr: {
							bech32: 'addr1input',
						},
						tx_hash: 'spent-a',
						tx_index: 1,
						value: '1000000',
						asset_list: [],
					},
					{
						payment_addr: {
							bech32: 'addr1input-b',
						},
						tx_hash: 'spent-a',
						tx_index: 1,
						value: '2000000',
						asset_list: [],
					},
				],
			}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).resolves.toMatchObject({
			collateral_inputs: [],
			reference_inputs: [],
		})
		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(
			'CardanoKoios_Rest: outputs contains duplicate identities'
		)
		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(
			'CardanoKoios_Rest: inputs contains duplicate identities'
		)
	})

	it.each([
		['ParameterChange', {
			tag: 'ParameterChange',
			contents: [
				{
					txId: 'parameter-change-parent',
					govActionIx: 0,
				},
				{
					minPoolCost: 75_000_000,
					maxBlockExecutionUnits: {
						steps: 20_000_000_000,
						memory: 77_500_000,
					},
				},
				'parameter-policy-hash',
			],
		}],
		['HardForkInitiation', {
			tag: 'HardForkInitiation',
			contents: [
				{
					txId: 'hard-fork-parent',
					govActionIx: 1,
				},
				{
					major: 11,
					minor: 0,
				},
			],
		}],
		['TreasuryWithdrawals', {
			tag: 'TreasuryWithdrawals',
			contents: [
				[[
					{
						network: 'Testnet',
						credential: {
							keyHash: 'treasury-key-hash',
						},
					},
					10_000_000,
				]],
				'treasury-policy-hash',
			],
		}],
		['NoConfidence', {
			tag: 'NoConfidence',
			contents: {
				txId: 'committee-parent',
				govActionIx: 2,
			},
		}],
		['UpdateCommittee', {
			tag: 'UpdateCommittee',
			contents: [
				{
					txId: 'committee-parent',
					govActionIx: 3,
				},
				[{
					scriptHash: 'retiring-committee-script',
				}],
				{
					'keyHash-new-committee-key': 1720,
				},
				{
					numerator: 2,
					denominator: 3,
				},
			],
		}],
		['NewConstitution', {
			tag: 'NewConstitution',
			contents: [
				null,
				{
					anchor: {
						url: 'https://example.com/constitution.txt',
						dataHash: 'constitution-data-hash',
					},
					script: null,
				},
			],
		}],
		['InfoAction', {
			tag: 'InfoAction',
		}],
	] as const)('validates the %s governance action outer wire shape', async (proposalType, description) => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			...transactionInfo,
			proposal_procedures: [{
				...transactionInfo.proposal_procedures[0],
				type: proposalType,
				description,
			}],
		}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).resolves.toMatchObject({
			proposal_procedures: [{
				type: proposalType,
				description,
			}],
		})
	})

	it.each([
		['mismatched type and tag', {
			type: 'InfoAction',
			description: {
				tag: 'NoConfidence',
				contents: null,
			},
		}],
		['unknown constructor tag', {
			type: 'InfoAction',
			description: {
				tag: 'UnknownAction',
			},
		}],
		['malformed constructor arity', {
			type: 'HardForkInitiation',
			description: {
				tag: 'HardForkInitiation',
				contents: [null],
			},
		}],
		['malformed constructor component', {
			type: 'TreasuryWithdrawals',
			description: {
				tag: 'TreasuryWithdrawals',
				contents: [
					[[
						{
							network: 'Mainnet',
							credential: {
								keyHash: 'treasury-key-hash',
							},
						},
						-1,
					]],
					null,
				],
			},
		}],
	])('rejects a governance action with %s', async (_case, proposal) => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			...transactionInfo,
			proposal_procedures: [{
				...transactionInfo.proposal_procedures[0],
				...proposal,
			}],
		}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow()
	})

	it('rejects an absent or non-singleton transaction instead of resolving authoritative emptiness', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json([]))
			.mockResolvedValueOnce(Response.json([
				transactionInfo,
				transactionInfo,
			]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(
			'CardanoKoios_Rest: transaction response is missing'
		)
		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(
			'tx_info must return exactly one transaction'
		)
	})

	it('rejects a transaction response for a different requested hash', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			...transactionInfo,
			tx_hash: 'different-transaction-hash',
		}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(
			'CardanoKoios_Rest: transaction response does not match request'
		)
	})

	it('rejects transaction outputs that do not match the requested hash', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			...transactionInfo,
			outputs: [{
				payment_addr: {
					bech32: 'addr1output',
				},
				tx_hash: 'different-transaction-hash',
				tx_index: 0,
				value: '1000000',
				asset_list: [],
			}],
		}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(
			'CardanoKoios_Rest: transaction output does not match request'
		)
	})

	it.each([
		{
			field: 'malformed fee',
			patch: {
				fee: '1.5',
			},
			message: 'fee',
		},
		{
			field: 'unsafe absolute slot',
			patch: {
				absolute_slot: Number.MAX_SAFE_INTEGER + 1,
			},
			message: 'unsafe integer',
		},
		{
			field: 'duplicate certificate identity',
			patch: {
				certificates: [
					{
						info: {},
						type: 'pool_update',
						index: 0,
					},
					{
						info: {},
						type: 'pool_retire',
						index: 0,
					},
				],
			},
			message: 'duplicate identities',
		},
	])('rejects a transaction with $field before resolver mapping', async ({
		patch,
		message,
	}) => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			...transactionInfo,
			...patch,
		}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow(message)
	})

	it.each([
		{
			field: 'proposal index',
			proposal: {
				...transactionInfo.proposal_procedures[0],
				index: -1,
			},
		},
		{
			field: 'proposal deposit',
			proposal: {
				...transactionInfo.proposal_procedures[0],
				deposit: '1.5',
			},
		},
	])('rejects a malformed $field before resolver mapping', async ({ proposal }) => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			...transactionInfo,
			proposal_procedures: [proposal],
		}]))

		await expect(getTransactionInfo(transactionInfo.tx_hash)).rejects.toThrow()
	})

	it('retains pool ticker identity from the list response', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				pool_id_bech32: 'pool1example',
				ticker: 'EXAMPLE',
			},
			{
				pool_id_bech32: 'pool1null',
				ticker: null,
			},
			{
				pool_id_bech32: 'pool1absent',
			},
		])

		await expect(listStakePools(3)).resolves.toEqual([
			{
				pool_id_bech32: 'pool1example',
				ticker: 'EXAMPLE',
			},
			{
				pool_id_bech32: 'pool1null',
			},
			{
				pool_id_bech32: 'pool1absent',
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.koios.rest/api/v1/pool_list?limit=3'
		)
	})
})

describe('Cardano Koios REST network tip, block, and transaction wire validation', () => {
	const tip = {
		hash: 'block-hash-102',
		epoch_no: 500,
		era: 'Conway',
		abs_slot: 130_000_102,
		block_height: 102,
		block_time: 1_700_000_102,
	}
	const blocks = [
		{
			...tip,
			tx_count: 2,
		},
		{
			...tip,
			hash: 'block-hash-101',
			abs_slot: tip.abs_slot - 1,
			block_height: tip.block_height - 1,
			block_time: tip.block_time - 1,
			tx_count: 1,
		},
	]

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves one exact tip and a strictly newest-first block page', async () => {
		sourceGetJson
			.mockResolvedValueOnce([tip])
			.mockResolvedValueOnce(blocks)

		await expect(getTip(binding)).resolves.toEqual([tip])
		await expect(listBlocks(2)).resolves.toEqual(blocks)
	})

	it.each([
		{
			label: 'missing tip singleton',
			load: () => getTip(binding),
			response: [],
			message: 'exactly one network observation',
		},
		{
			label: 'duplicate tip singleton',
			load: () => getTip(binding),
			response: [tip, tip],
			message: 'exactly one network observation',
		},
		{
			label: 'malformed tip field',
			load: () => getTip(binding),
			response: [{
				...tip,
				era: 42,
			}],
			message: 'era',
		},
		{
			label: 'unsafe tip number',
			load: () => getTip(binding),
			response: [{
				...tip,
				abs_slot: Number.MAX_SAFE_INTEGER + 1,
			}],
			message: 'unsafe integer',
		},
		{
			label: 'missing block field',
			load: () => listBlocks(1),
			response: [{
				...blocks[0],
				tx_count: undefined,
			}],
			message: 'tx_count',
		},
		{
			label: 'duplicate block identity',
			load: () => listBlocks(2),
			response: [
				blocks[0],
				{
					...blocks[1],
					hash: blocks[0].hash,
				},
			],
			message: 'duplicate identities',
		},
		{
			label: 'unsafe block number',
			load: () => listBlocks(1),
			response: [{
				...blocks[0],
				tx_count: Number.MAX_SAFE_INTEGER + 1,
			}],
			message: 'unsafe integer',
		},
		{
			label: 'non-descending block height',
			load: () => listBlocks(2),
			response: [
				blocks[0],
				{
					...blocks[1],
					block_height: blocks[0].block_height,
				},
			],
			message: 'strictly newest-first',
		},
		{
			label: 'non-descending block slot',
			load: () => listBlocks(2),
			response: [
				blocks[0],
				{
					...blocks[1],
					abs_slot: blocks[0].abs_slot,
				},
			],
			message: 'strictly newest-first',
		},
	])('rejects $label', async ({
		load,
		response,
		message,
	}) => {
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(load()).rejects.toThrow(message)
	})

	it('preserves provider transaction order and the requested latest-block limit', async () => {
		sourceGetJson.mockResolvedValueOnce([tip])
		sourceFetch.mockResolvedValueOnce(Response.json([
			{ tx_hash: 'transaction-0' },
			{ tx_hash: 'transaction-1' },
			{ tx_hash: 'transaction-2' },
		]))

		await expect(listLatestBlockTransactions(2)).resolves.toEqual([
			{ tx_hash: 'transaction-0' },
			{ tx_hash: 'transaction-1' },
		])
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.koios.rest/api/v1/block_txs',
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					_block_hashes: [tip.hash],
				}),
			}
		)
	})

	it('rejects malformed and duplicate latest-block transactions', async () => {
		sourceGetJson
			.mockResolvedValueOnce([tip])
			.mockResolvedValueOnce([tip])
		sourceFetch
			.mockResolvedValueOnce(Response.json([{ tx_hash: 42 }]))
			.mockResolvedValueOnce(Response.json([
				{ tx_hash: 'transaction-0' },
				{ tx_hash: 'transaction-0' },
			]))

		await expect(listLatestBlockTransactions(1)).rejects.toThrow('tx_hash')
		await expect(listLatestBlockTransactions(2)).rejects.toThrow('duplicate identities')
	})

	it('validates the latest-block limit before reading a tip', async () => {
		await expect(listLatestBlockTransactions(
			Number.MAX_SAFE_INTEGER + 1
		)).rejects.toThrow('list count must be an integer from 0 through 100')
		expect(sourceGetJson).not.toHaveBeenCalled()
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('Cardano Koios REST stake-pool wire validation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		{
			label: 'missing identity',
			response: [{ ticker: 'POOL' }],
			message: 'pool_id_bech32',
		},
		{
			label: 'malformed ticker',
			response: [{
				pool_id_bech32: 'pool1fixture',
				ticker: 42,
			}],
			message: 'ticker',
		},
		{
			label: 'duplicate pool identity',
			response: [
				{
					pool_id_bech32: 'pool1fixture',
					ticker: 'ONE',
				},
				{
					pool_id_bech32: 'pool1fixture',
					ticker: 'TWO',
				},
			],
			message: 'duplicate identities',
		},
	])('rejects $label', async ({
		response,
		message,
	}) => {
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(listStakePools(response.length)).rejects.toThrow(message)
	})
})

describe('Cardano Koios governance proposal pagination', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves the exact provider offset and rejects malformed paging inputs', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			proposal_tx_hash: 'proposal-hash',
			proposal_index: 0,
			proposal_type: 'InfoAction',
		}])

		await expect(listGovernanceProposals(16, 32)).resolves.toHaveLength(1)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.koios.rest/api/v1/proposal_list?limit=16&offset=32'
		)
		await expect(listGovernanceProposals(16, -1)).rejects.toThrow(
			'list offset must be a nonnegative integer'
		)
		expect(sourceGetJson).toHaveBeenCalledOnce()
	})

	it.each([
		{
			label: 'missing proposal field',
			response: [{
				proposal_tx_hash: 'proposal-hash',
				proposal_index: 0,
			}],
			message: 'proposal_type',
		},
		{
			label: 'duplicate proposal identity',
			response: [
				{
					proposal_tx_hash: 'proposal-hash',
					proposal_index: 0,
					proposal_type: 'InfoAction',
				},
				{
					proposal_tx_hash: 'proposal-hash',
					proposal_index: 0,
					proposal_type: 'InfoAction',
				},
			],
			message: 'duplicate identities',
		},
	])('rejects $label on proposal_list', async ({
		response,
		message,
	}) => {
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(listGovernanceProposals(response.length)).rejects.toThrow(message)
	})
})

describe('Cardano Koios REST committee transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('validates the real committee_info member shape including a resigned member', async () => {
		const committee = {
			proposal_id: 'gov_action1fixture',
			proposal_tx_hash: 'proposal-hash',
			proposal_index: 0,
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
				{
					status: 'resigned',
					cc_hot_id: null,
					cc_cold_id: 'cc_cold1resigned',
					cc_hot_hex: null,
					cc_cold_hex: '03',
					expiration_epoch: 653,
					cc_hot_has_script: null,
					cc_cold_has_script: true,
				},
			],
		}
		sourceGetJson.mockResolvedValueOnce([committee])

		await expect(getCommittee(binding)).resolves.toEqual([committee])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.koios.rest/api/v1/committee_info'
		)
	})

	it('rejects malformed committee members before resolver materialization', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			proposal_id: 'gov_action1fixture',
			proposal_tx_hash: 'proposal-hash',
			proposal_index: 0,
			quorum_numerator: 2,
			quorum_denominator: 3,
			members: ['cc_cold1fixture'],
		}])

		await expect(getCommittee(binding)).rejects.toThrow('members[0]')
	})

	it.each([
		{
			label: 'missing singleton',
			response: [],
			message: 'exactly one committee',
		},
		{
			label: 'duplicate singleton',
			response: [
				{
					proposal_id: 'gov_action1fixture',
					proposal_tx_hash: 'proposal-hash',
					proposal_index: 0,
					quorum_numerator: 2,
					quorum_denominator: 3,
					members: [],
				},
				{
					proposal_id: 'gov_action1fixture',
					proposal_tx_hash: 'proposal-hash',
					proposal_index: 0,
					quorum_numerator: 2,
					quorum_denominator: 3,
					members: [],
				},
			],
			message: 'exactly one committee',
		},
		{
			label: 'unsafe committee number',
			response: [{
				proposal_id: 'gov_action1fixture',
				proposal_tx_hash: 'proposal-hash',
				proposal_index: Number.MAX_SAFE_INTEGER + 1,
				quorum_numerator: 2,
				quorum_denominator: 3,
				members: [],
			}],
			message: 'unsafe integer',
		},
		{
			label: 'duplicate member',
			response: [{
				proposal_id: 'gov_action1fixture',
				proposal_tx_hash: 'proposal-hash',
				proposal_index: 0,
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
						cc_cold_has_script: false,
					},
					{
						status: 'authorized',
						cc_hot_id: 'cc_hot1other',
						cc_cold_id: 'cc_cold1fixture',
						cc_hot_hex: '03',
						cc_cold_hex: '02',
						expiration_epoch: 727,
						cc_hot_has_script: false,
						cc_cold_has_script: false,
					},
				],
			}],
			message: 'duplicate member identities',
		},
	])('rejects $label', async ({
		response,
		message,
	}) => {
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(getCommittee(binding)).rejects.toThrow(message)
	})
})

describe('Cardano Koios REST network collection wire validation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves valid DRep and native asset identities', async () => {
		const dReps = [{
			drep_id: 'drep1fixture',
			has_script: false,
		}]
		const assets = [{
			policy_id: 'policy-fixture',
			asset_name: 'asset-fixture',
		}]
		sourceGetJson
			.mockResolvedValueOnce(dReps)
			.mockResolvedValueOnce(assets)

		await expect(listDReps(1)).resolves.toEqual(dReps)
		await expect(listAssets(1)).resolves.toEqual(assets)
	})

	it.each([
		{
			label: 'missing DRep field',
			load: () => listDReps(1),
			response: [{ drep_id: 'drep1fixture' }],
			message: 'has_script',
		},
		{
			label: 'duplicate DRep identity',
			load: () => listDReps(2),
			response: [
				{
					drep_id: 'drep1fixture',
					has_script: false,
				},
				{
					drep_id: 'drep1fixture',
					has_script: true,
				},
			],
			message: 'duplicate identities',
		},
		{
			label: 'malformed asset field',
			load: () => listAssets(1),
			response: [{
				policy_id: 'policy-fixture',
				asset_name: 42,
			}],
			message: 'asset_name',
		},
		{
			label: 'duplicate asset identity',
			load: () => listAssets(2),
			response: [
				{
					policy_id: 'policy-fixture',
					asset_name: 'asset-fixture',
				},
				{
					policy_id: 'policy-fixture',
					asset_name: 'asset-fixture',
				},
			],
			message: 'duplicate identities',
		},
	])('rejects $label', async ({
		load,
		response,
		message,
	}) => {
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(load()).rejects.toThrow(message)
	})
})

describe('Cardano Koios REST protocol parameter wire validation', () => {
	const parameters = {
		epoch_no: 500,
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
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves the latest parameter snapshot and its lossless units', async () => {
		sourceGetJson.mockResolvedValueOnce([parameters])

		await expect(getLatestProtocolParameters(binding)).resolves.toEqual([parameters])
	})

	it('keeps optional Plutus leftover fields when present', async () => {
		const parametersWithLeftovers = {
			...parameters,
			cost_models: {
				PlutusV3: [1, 2, 3],
			},
			price_mem: 0.0577,
			price_step: 7.21e-5,
			max_tx_ex_mem: 14_000_000,
			max_tx_ex_steps: 10_000_000_000,
			max_block_ex_mem: 62_000_000,
			max_block_ex_steps: 20_000_000_000,
			max_val_size: 5_000,
			collateral_percent: 150,
			max_collateral_inputs: 3,
		}
		sourceGetJson.mockResolvedValueOnce([parametersWithLeftovers])

		await expect(getLatestProtocolParameters(binding)).resolves.toEqual([parametersWithLeftovers])
	})

	it.each([
		{
			label: 'missing singleton',
			response: [],
			message: 'exactly one latest epoch',
		},
		{
			label: 'duplicate singleton',
			response: [parameters, parameters],
			message: 'exactly one latest epoch',
		},
		{
			label: 'missing field',
			response: [{
				...parameters,
				coins_per_utxo_size: undefined,
			}],
			message: 'coins_per_utxo_size',
		},
		{
			label: 'malformed lossless unit',
			response: [{
				...parameters,
				key_deposit: '2.5',
			}],
			message: 'key_deposit',
		},
		{
			label: 'unsafe integer',
			response: [{
				...parameters,
				epoch_no: Number.MAX_SAFE_INTEGER + 1,
			}],
			message: 'unsafe integer',
		},
	])('rejects $label', async ({
		response,
		message,
	}) => {
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(getLatestProtocolParameters(binding)).rejects.toThrow(message)
	})
})

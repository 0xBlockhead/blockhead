import { beforeEach, describe, expect, it, vi } from 'vitest'

import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json'
import type { BlockfrostBlock } from '$/sources/Blockfrost/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Blockfrost/bindings.ts'

const { sourceFetch } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	getAccount,
	getAddress,
	getAddressTotal,
	getAsset,
	getDRepMetadata,
	getGovernanceProposal,
	getGovernanceProposalMetadata,
	getStakePoolMetadata,
	getCommittee,
	getBlock,
	getTransaction,
	getTransactionUtxos,
	getLatestProtocolParameters,
	listAccountAddresses,
	listAssets,
	listAddressTransactions,
	listAddressUtxos,
	listBlocks,
	listCommitteeVotes,
	listDRepVotes,
	listDReps,
	listGovernanceProposals,
	listLatestBlockTransactions,
	listStakePools,
} = await import('$/sources/Blockfrost/Rest/queries.ts')

const binding = bindings[Source.Blockfrost_Rest][0]

const block = blockFixture satisfies BlockfrostBlock

describe('Blockfrost REST transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('encodes selector paths and sends the Blockfrost project header', async () => {
		const transaction = {
			hash: 'hash/with delimiter',
			block: 'block-hash',
			block_height: 10_000_000,
			block_time: 1_720_000_000,
			slot: 130_000_000,
			index: 0,
			output_amount: [{
				unit: 'lovelace',
				quantity: '1',
			}],
			fees: '0',
			deposit: '0',
			size: 200,
			invalid_before: null,
			invalid_hereafter: null,
			utxo_count: 1,
			withdrawal_count: 0,
			mir_cert_count: 0,
			delegation_count: 0,
			stake_cert_count: 0,
			pool_update_count: 0,
			pool_retire_count: 0,
			asset_mint_or_burn_count: 0,
			redeemer_count: 0,
			valid_contract: true,
		}
		sourceFetch
			.mockResolvedValueOnce(Response.json(block))
			.mockResolvedValueOnce(Response.json(transaction))
			.mockResolvedValueOnce(Response.json({
				hash: 'hash/with delimiter',
				inputs: [],
				outputs: [],
			}))

		await expect(getBlock('hash/with delimiter')).resolves.toEqual(block)
		await expect(getTransaction('hash/with delimiter')).resolves.toMatchObject({
			hash: 'hash/with delimiter',
		})
		await expect(getTransactionUtxos('hash/with delimiter')).resolves.toMatchObject({
			hash: 'hash/with delimiter',
			inputs: [],
			outputs: [],
		})

		sourceFetch
			.mockResolvedValueOnce(Response.json({
				...transaction,
				hash: 'foreign-transaction',
			}))
			.mockResolvedValueOnce(Response.json({
				hash: 'foreign-transaction',
				inputs: [],
				outputs: [],
			}))
		await expect(getTransaction('hash/with delimiter')).rejects.toThrow('transaction response does not match request')
		await expect(getTransactionUtxos('hash/with delimiter')).rejects.toThrow('transaction UTXO response does not match request')

		expect(sourceFetch).toHaveBeenNthCalledWith(
			1,
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/blocks/hash%2Fwith%20delimiter'
		)
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/txs/hash%2Fwith%20delimiter'
		)
		expect(sourceFetch).toHaveBeenNthCalledWith(
			3,
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/txs/hash%2Fwith%20delimiter/utxos'
		)
	})

	it('loads the latest block followed by the documented previous-block page', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json(block))
			.mockResolvedValueOnce(Response.json([
				{
					...block,
					hash: 'previous-block-hash',
					height: block.height - 1,
					slot: block.slot - 1,
				},
			]))

		await expect(listBlocks(2)).resolves.toMatchObject([
			{ hash: 'block-hash' },
			{ hash: 'previous-block-hash' },
		])
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/blocks/block-hash/previous?count=1'
		)
	})

	it('loads encoded address detail, totals, newest transactions, and UTXOs', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json({
				address: 'addr/example',
				amount: [],
				stake_address: null,
				type: 'shelley',
				script: false,
			}))
			.mockResolvedValueOnce(Response.json({
				address: 'addr/example',
				received_sum: [],
				sent_sum: [],
				tx_count: 2,
			}))
			.mockResolvedValueOnce(Response.json([
				{
					tx_hash: 'transaction-hash',
					tx_index: 0,
					block_height: 1,
					block_time: 1_700_000_000,
				},
			]))
			.mockResolvedValueOnce(Response.json([]))

		await expect(getAddress('addr/example')).resolves.toMatchObject({
			address: 'addr/example',
		})
		await expect(getAddressTotal('addr/example')).resolves.toMatchObject({
			tx_count: 2,
		})
		await expect(listAddressTransactions('addr/example', 16)).resolves.toHaveLength(1)
		await expect(listAddressUtxos('addr/example', 16)).resolves.toEqual([])
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr%2Fexample',
			'https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr%2Fexample/total',
			'https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr%2Fexample/transactions?count=16&order=desc&page=1',
			'https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr%2Fexample/utxos?count=16&order=desc&page=1',
		])
	})

	it('rejects invalid limits before transport', async () => {
		await expect(listBlocks(-1)).rejects.toThrow(
			'Blockfrost_Rest: block list count must be an integer from 0 through 100'
		)
		await expect(listBlocks(101)).rejects.toThrow(
			'Blockfrost_Rest: block list count must be an integer from 0 through 100'
		)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('loads nonempty typed relationship list pages from documented operations', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json(['transaction-hash']))
			.mockResolvedValueOnce(Response.json(['pool1example']))
			.mockResolvedValueOnce(Response.json([
				{
					drep_id: 'drep1example',
					hex: 'ab',
					amount: '1',
					has_script: false,
					retired: false,
					expired: false,
					last_active_epoch: 500,
					metadata: {
						url: 'https://example.com/drep.json',
						hash: 'metadata-hash',
						json_metadata: {
							body: {
								givenName: 'Example DRep',
							},
						},
						bytes: null,
					},
				},
			]))
			.mockResolvedValueOnce(Response.json([
				{
					id: 'gov_action1example',
					tx_hash: 'proposal-transaction-hash',
					cert_index: 1,
					governance_type: 'info_action',
				},
			]))
			.mockResolvedValueOnce(Response.json([
				{
					asset: `${'a'.repeat(56)}746f6b656e`,
					quantity: '1',
				},
			]))

		await expect(listLatestBlockTransactions(16)).resolves.toEqual(['transaction-hash'])
		await expect(listStakePools(16)).resolves.toEqual(['pool1example'])
		await expect(listDReps(16)).resolves.toEqual([
			{
				drep_id: 'drep1example',
				hex: 'ab',
				amount: '1',
				has_script: false,
				retired: false,
				expired: false,
				last_active_epoch: 500,
				displayName: 'Example DRep',
			},
		])
		await expect(listGovernanceProposals(16, 3)).resolves.toHaveLength(1)
		await expect(listAssets(16)).resolves.toHaveLength(1)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/blocks/latest/txs?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/pools?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/dreps?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/proposals?count=16&page=3',
			'https://cardano-mainnet.blockfrost.io/api/v0/assets?count=16',
		])
	})

	it('rejects duplicate transaction hashes in the latest block', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([
			'transaction-hash',
			'transaction-hash',
		]))

		await expect(listLatestBlockTransactions(2)).rejects.toThrow(
			'Blockfrost_Rest: latest block transactions contains duplicate identities'
		)
	})

	it('loads nonempty typed protocol and committee singleton operations', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json({ epoch: 500 }))
			.mockResolvedValueOnce(Response.json({
				gov_action_id: null,
				proposal_tx_hash: null,
				proposal_index: null,
				is_dissolved: false,
				quorum: {
					numerator: 2,
					denominator: 3,
				},
				members: [],
			}))

		await expect(getLatestProtocolParameters()).resolves.toEqual({ epoch: 500 })
		await expect(getCommittee()).resolves.toMatchObject({ is_dissolved: false })
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest/parameters',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/committee',
		])
	})

	it('fail-closes on malformed block and address envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json({
				hash: 'incomplete-block',
			}))
			.mockResolvedValueOnce(Response.json({
				address: 'addr1',
				amount: 'not-an-array',
			}))

		await expect(getBlock('incomplete-block')).rejects.toThrow(
			'Blockfrost_Rest: invalid block envelope'
		)
		await expect(getAddress('addr1')).rejects.toThrow(
			'Blockfrost_Rest: invalid address envelope'
		)
	})

	it('accepts transaction UTXO leftovers and fail-closes malformed consumed_by_tx', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json({
				hash: 'utxo-hash',
				inputs: [{
					address: 'addr1input',
					amount: [{
						unit: 'lovelace',
						quantity: '1',
					}],
					tx_hash: 'spent-hash',
					output_index: 0,
					collateral: false,
					reference: true,
				}],
				outputs: [{
					address: 'addr1output',
					amount: [{
						unit: 'lovelace',
						quantity: '1',
					}],
					tx_hash: 'utxo-hash',
					output_index: 0,
					collateral: false,
					consumed_by_tx: 'consuming-hash',
				}],
			}))
			.mockResolvedValueOnce(Response.json({
				hash: 'bad-utxo-hash',
				inputs: [],
				outputs: [{
					address: 'addr1output',
					amount: [{
						unit: 'lovelace',
						quantity: '1',
					}],
					tx_hash: 'bad-utxo-hash',
					output_index: 0,
					consumed_by_tx: 42,
				}],
			}))

		await expect(getTransactionUtxos('utxo-hash')).resolves.toMatchObject({
			hash: 'utxo-hash',
			inputs: [{
				reference: true,
			}],
			outputs: [{
				consumed_by_tx: 'consuming-hash',
			}],
		})
		await expect(getTransactionUtxos('bad-utxo-hash')).rejects.toThrow(
			'Blockfrost_Rest: invalid transaction utxos envelope'
		)
	})

	it('omits DRep display identity when CIP-119 metadata is absent or malformed', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([
			{
				drep_id: 'drep1missing',
				hex: 'ab',
				amount: '1',
				has_script: false,
				retired: false,
				expired: false,
				last_active_epoch: 500,
				metadata: null,
			},
			{
				drep_id: 'drep1malformed',
				hex: 'cd',
				amount: '2',
				has_script: false,
				retired: false,
				expired: false,
				last_active_epoch: 500,
				metadata: {
					url: 'https://example.com/drep.json',
					hash: 'metadata-hash',
					json_metadata: {
						body: {
							givenName: 42,
						},
					},
					bytes: null,
				},
			},
		]))

		await expect(listDReps(2)).resolves.toEqual([
			expect.not.objectContaining({ displayName: expect.anything() }),
			expect.not.objectContaining({ displayName: expect.anything() }),
		])
	})

	it('normalizes validated CIP-119 identity on DRep detail metadata', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json({
				drep_id: 'drep1example',
				hex: 'ab',
				url: 'https://example.com/drep.json',
				hash: 'metadata-hash',
				json_metadata: {
					body: {
						givenName: 'Example DRep',
					},
				},
				bytes: null,
			}))
			.mockResolvedValueOnce(Response.json({
				drep_id: 'drep1malformed',
				hex: 'cd',
				url: 'https://example.com/malformed.json',
				hash: 'malformed-metadata-hash',
				json_metadata: {
					body: {
						givenName: 42,
					},
				},
				bytes: null,
			}))

		await expect(getDRepMetadata('drep1example')).resolves.toEqual({
			url: 'https://example.com/drep.json',
			hash: 'metadata-hash',
			displayName: 'Example DRep',
		})
		await expect(getDRepMetadata('drep1malformed')).resolves.toEqual({
			url: 'https://example.com/malformed.json',
			hash: 'malformed-metadata-hash',
		})
	})

	it('loads official committee votes and treats only missing metadata as optional', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json([
				{
					tx_hash: 'vote-hash',
					voter_hot_id: 'cc_hot1example',
					proposal_id: 'gov_action1example',
					proposal_tx_hash: 'proposal-hash',
					proposal_index: 1,
					governance_type: 'info_action',
					vote: 'yes',
					metadata_url: null,
					metadata_hash: null,
					block_height: 1_000,
					block_time: 1_700_000_000,
				},
			]))
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
			.mockRejectedValueOnce(new Error('metadata transport unavailable'))
			.mockResolvedValueOnce(new Response(null, { status: 404 }))

		await expect(listCommitteeVotes(16)).resolves.toHaveLength(1)
		await expect(getGovernanceProposalMetadata('proposal-hash', 1)).resolves.toBeUndefined()
		await expect(getDRepMetadata('drep1example')).rejects.toThrow('metadata transport unavailable')
		await expect(getStakePoolMetadata('pool1example')).resolves.toBeUndefined()
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/committee/votes?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/proposals/proposal-hash/1/metadata',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/dreps/drep1example/metadata',
			'https://cardano-mainnet.blockfrost.io/api/v0/pools/pool1example/metadata',
		])
	})

	it('paginates DRep and committee vote rows with their native identities', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json([{
				tx_hash: 'drep-vote-hash',
				cert_index: 2,
				proposal_tx_hash: 'proposal-hash',
				proposal_cert_index: 1,
				vote: 'yes',
			}]))
			.mockResolvedValueOnce(Response.json([{
				tx_hash: 'committee-vote-hash',
				voter_hot_id: 'cc_hot1example',
				proposal_id: 'gov_action1example',
				proposal_tx_hash: 'proposal-hash',
				proposal_index: 1,
				governance_type: 'info_action',
				vote: 'yes',
				metadata_url: null,
				metadata_hash: null,
				block_height: 1_000,
				block_time: 1_700_000_000,
			}]))

		await expect(listDRepVotes('drep1/example', 16, 2)).resolves.toHaveLength(1)
		await expect(listCommitteeVotes(16, 3)).resolves.toHaveLength(1)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/dreps/drep1%2Fexample/votes?count=16&page=2',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/committee/votes?count=16&page=3',
		])
	})

	it.each([
		['parameter_change', {
			tag: 'ParameterChange',
			contents: [
				{
					txId: 'parameter-change-parent',
					govActionIx: 0,
				},
				{
					committeeMinSize: 5,
					maxTxExecutionUnits: {
						steps: 10_000_000_000,
						memory: 17_500_000,
					},
				},
				'parameter-policy-hash',
			],
		}],
		['hard_fork_initiation', {
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
		['treasury_withdrawals', {
			tag: 'TreasuryWithdrawals',
			contents: [
				[[
					{
						network: 'Mainnet',
						credential: {
							scriptHash: 'treasury-script-hash',
						},
					},
					120_000_000_000_000,
				]],
				'treasury-policy-hash',
			],
		}],
		['no_confidence', {
			tag: 'NoConfidence',
			contents: {
				txId: 'committee-parent',
				govActionIx: 2,
			},
		}],
		['new_committee', {
			tag: 'UpdateCommittee',
			contents: [
				{
					txId: 'committee-parent',
					govActionIx: 3,
				},
				[{
					keyHash: 'retiring-committee-key',
				}],
				{
					'scriptHash-new-committee-script': 653,
				},
				{
					numerator: 2,
					denominator: 3,
				},
			],
		}],
		['new_constitution', {
			tag: 'NewConstitution',
			contents: [
				{
					txId: 'constitution-parent',
					govActionIx: 4,
				},
				{
					anchor: {
						url: 'ipfs://constitution',
						dataHash: 'constitution-data-hash',
					},
					script: 'constitution-script-hash',
				},
			],
		}],
		['info_action', {
			tag: 'InfoAction',
		}],
	] as const)('validates the %s governance action outer wire shape', async (governanceType, governanceDescription) => {
		sourceFetch.mockResolvedValueOnce(Response.json({
			id: 'gov_action1example',
			tx_hash: 'proposal/hash',
			cert_index: 1,
			governance_type: governanceType,
			governance_description: governanceDescription,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		}))

		await expect(getGovernanceProposal('proposal/hash', 1)).resolves.toMatchObject({
			id: 'gov_action1example',
			governance_description: governanceDescription,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/proposals/proposal%2Fhash/1'
		)
	})

	it.each([
		['mismatched provider type and tag', {
			governance_type: 'info_action',
			governance_description: {
				tag: 'NoConfidence',
				contents: null,
			},
		}],
		['unknown constructor tag', {
			governance_type: 'info_action',
			governance_description: {
				tag: 'UnknownAction',
			},
		}],
		['malformed constructor arity', {
			governance_type: 'hard_fork_initiation',
			governance_description: {
				tag: 'HardForkInitiation',
				contents: [null],
			},
		}],
		['malformed constructor component', {
			governance_type: 'new_constitution',
			governance_description: {
				tag: 'NewConstitution',
				contents: [
					null,
					{
						anchor: {
							url: 'ipfs://constitution',
						},
						script: null,
					},
				],
			},
		}],
	])('rejects a governance action with %s', async (_case, proposal) => {
		sourceFetch.mockResolvedValueOnce(Response.json({
			id: 'gov_action1example',
			tx_hash: 'proposal/hash',
			cert_index: 1,
			...proposal,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		}))

		await expect(getGovernanceProposal('proposal/hash', 1)).rejects.toThrow()
	})

	it('skips zero-count list transport and rejects malformed list limits', async () => {
		await expect(listAssets(0)).resolves.toEqual([])
		await expect(listStakePools(101)).rejects.toThrow(
			'Blockfrost_Rest: list count must be an integer from 0 through 100'
		)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('loads encoded stake accounts, account addresses, and native assets', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json({
				stake_address: 'stake/example',
				active: true,
				registered: true,
				active_epoch: 500,
				controlled_amount: '1',
				rewards_sum: '0',
				withdrawals_sum: '0',
				reserves_sum: '0',
				treasury_sum: '0',
				withdrawable_amount: '0',
				pool_id: null,
				drep_id: null,
			}))
			.mockResolvedValueOnce(Response.json([
				{
					address: 'addr1example',
				},
			]))
			.mockResolvedValueOnce(Response.json({
				asset: `${'a'.repeat(56)}746f6b656e`,
				policy_id: 'a'.repeat(56),
				asset_name: '746f6b656e',
				fingerprint: 'asset1example',
				quantity: '12',
				initial_mint_tx_hash: 'mint-hash',
				mint_or_burn_count: 1,
				onchain_metadata: null,
				metadata: null,
			}))

		await expect(getAccount('stake/example')).resolves.toMatchObject({
			stake_address: 'stake/example',
		})
		await expect(listAccountAddresses('stake/example', 16)).resolves.toEqual([
			{
				address: 'addr1example',
			},
		])
		await expect(getAsset(`${'a'.repeat(56)}746f6b656e`)).resolves.toMatchObject({
			fingerprint: 'asset1example',
		})
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/accounts/stake%2Fexample',
			'https://cardano-mainnet.blockfrost.io/api/v0/accounts/stake%2Fexample/addresses?count=16&order=asc&page=1',
			`https://cardano-mainnet.blockfrost.io/api/v0/assets/${'a'.repeat(56)}746f6b656e`,
		])
	})

	it('preserves HTTP failure semantics', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(
			JSON.stringify({ message: 'not found' }),
			{
				status: 404,
				statusText: 'Not Found',
			}
		))

		await expect(getBlock('missing')).rejects.toThrow(/Blockfrost_Rest/)
		sourceFetch.mockResolvedValueOnce(new Response(
			JSON.stringify({ message: 'not found' }),
			{
				status: 404,
				statusText: 'Not Found',
			}
		))
		await expect(getAsset('missing')).rejects.toThrow(/Blockfrost_Rest/)
		sourceFetch.mockResolvedValueOnce(new Response(
			JSON.stringify({ message: 'not found' }),
			{
				status: 404,
				statusText: 'Not Found',
			}
		))
		await expect(getAccount('missing')).rejects.toThrow(/Blockfrost_Rest/)
	})
})

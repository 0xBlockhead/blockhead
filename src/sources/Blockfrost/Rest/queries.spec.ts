import { beforeEach, describe, expect, it, vi } from 'vitest'

import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json'
import type { BlockfrostBlock } from '$/sources/Blockfrost/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'

const { sourceFetch } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const {
	getDRepMetadata,
	getGovernanceProposalMetadata,
	getStakePoolMetadata,
	getCommittee,
	getBlock,
	getLatestProtocolParameters,
	listAssets,
	listBlocks,
	listCommitteeVotes,
	listDReps,
	listGovernanceProposals,
	listLatestBlockTransactions,
	listStakePools,
} = await import('$/sources/Blockfrost/Rest/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Blockfrost_Rest)

if (binding == null)
	throw new Error('Blockfrost_Rest spec missing source binding')

const block = blockFixture satisfies BlockfrostBlock

describe('Blockfrost REST transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('encodes selector paths and sends the Blockfrost project header', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(block))

		await expect(getBlock(binding, 'hash/with delimiter')).resolves.toEqual(block)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/blocks/hash%2Fwith%20delimiter'
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

		await expect(listBlocks(binding, 2)).resolves.toMatchObject([
			{ hash: 'block-hash' },
			{ hash: 'previous-block-hash' },
		])
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://cardano-mainnet.blockfrost.io/api/v0/blocks/block-hash/previous?count=1'
		)
	})

	it('rejects invalid limits before transport', async () => {
		await expect(listBlocks(binding, -1)).rejects.toThrow(
			'Blockfrost_Rest: block list count must be an integer from 0 through 100'
		)
		await expect(listBlocks(binding, 101)).rejects.toThrow(
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
					metadata: null,
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

		await expect(listLatestBlockTransactions(binding, 16)).resolves.toEqual(['transaction-hash'])
		await expect(listStakePools(binding, 16)).resolves.toEqual(['pool1example'])
		await expect(listDReps(binding, 16)).resolves.toHaveLength(1)
		await expect(listGovernanceProposals(binding, 16)).resolves.toHaveLength(1)
		await expect(listAssets(binding, 16)).resolves.toHaveLength(1)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/blocks/latest/txs?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/pools?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/dreps?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/proposals?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/assets?count=16',
		])
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

		await expect(getLatestProtocolParameters(binding)).resolves.toEqual({ epoch: 500 })
		await expect(getCommittee(binding)).resolves.toMatchObject({ is_dissolved: false })
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest/parameters',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/committee',
		])
	})

	it('loads official committee votes and treats metadata transport failures as optional', async () => {
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

		await expect(listCommitteeVotes(binding, 16)).resolves.toHaveLength(1)
		await expect(getGovernanceProposalMetadata(binding, 'proposal-hash', 1)).resolves.toBeUndefined()
		await expect(getDRepMetadata(binding, 'drep1example')).resolves.toBeUndefined()
		await expect(getStakePoolMetadata(binding, 'pool1example')).resolves.toBeUndefined()
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/committee/votes?count=16',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/proposals/proposal-hash/1/metadata',
			'https://cardano-mainnet.blockfrost.io/api/v0/governance/dreps/drep1example/metadata',
			'https://cardano-mainnet.blockfrost.io/api/v0/pools/pool1example/metadata',
		])
	})

	it('skips zero-count list transport and rejects malformed list limits', async () => {
		await expect(listAssets(binding, 0)).resolves.toEqual([])
		expect(() => listStakePools(binding, 101)).toThrow(
			'Blockfrost_Rest: list count must be an integer from 0 through 100'
		)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('preserves HTTP failure semantics', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(
			JSON.stringify({ message: 'not found' }),
			{
				status: 404,
				statusText: 'Not Found',
			}
		))

		await expect(getBlock(binding, 'missing')).rejects.toThrow(/Blockfrost_Rest/)
	})
})

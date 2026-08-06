import { beforeEach, describe, expect, it, vi } from 'vitest'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { NearRpcBlock } from '$/sources/NearRpc/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const { default: nearRpc } = await import('$/resolvers/NearRpc-JsonRpc.ts')
const { getBlock, viewState } = await import('$/sources/NearRpc/JsonRpc/queries.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const storageEntryResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearContractStorageEntry
))

if (storageEntryResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearContractStorageEntry resolver')

const blockResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearBlock
))

if (blockResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearBlock resolver')

const networkBlocksResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearNetwork
	&& '$$blocks' in resolver.projections
))

if (networkBlocksResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearNetwork.$$blocks resolver')

const networkValidatorsResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearNetwork
	&& '$$validators' in resolver.projections
))

if (networkValidatorsResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearNetwork.$$validators resolver')

const networkTimestampsResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'resolveLive' in resolver
))
const nearNetworkTimestampsResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearNetwork
	&& '$$timestamps' in resolver.projections
))

if (networkTimestampsResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearNetwork.$$timestamps resolver')
if (nearNetworkTimestampsResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearNetwork.$$timestamps snapshot resolver')

const selector = {
	$contract: {
		$network: {
			slug: 'near',
		},
		accountId: 'contract.near',
	},
	keyBase64: 'YWNjb3VudA==',
	blockHeight: 123n,
	source: Source.NearRpc_JsonRpc,
}
const network = {
	slug: networkBySlug.near.slug,
}
const wireBlock = {
	author: 'validator.near',
	header: {
		height: 1_234_567,
		hash: 'block-hash',
		prev_hash: 'parent-hash',
		epoch_id: 'epoch-id',
		timestamp_nanosec: '1722470400000000000',
	},
	chunks: [{
		chunk_hash: 'chunk-hash',
		shard_id: 0,
		gas_used: 42,
		height_included: 1_234_567,
	}],
} satisfies NearRpcBlock
const height = BigInt(wireBlock.header.height)

const jsonRpcResult = (result: unknown) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}))
)

describe('NEAR contract storage query', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('queries view_state at the selected historical block and exact key prefix', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			block_hash: 'block-hash',
			block_height: 123,
			values: [{
				key: selector.keyBase64,
				value: 'dmFsdWU=',
			}],
			proof: [],
		}))

		await expect(viewState({
			accountId: selector.$contract.accountId,
			prefixBase64: selector.keyBase64,
			blockHeight: 123,
		})).resolves.toMatchObject({
			block_hash: 'block-hash',
			block_height: 123,
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toMatchObject({
			method: 'query',
			params: {
				request_type: 'view_state',
				block_id: 123,
				account_id: 'contract.near',
				prefix_base64: selector.keyBase64,
			},
		})
	})
})

describe('NEAR contract storage resolver', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('materializes only the exact key returned at the selected block', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			block_hash: 'block-hash',
			block_height: 123,
			values: [
				{
					key: `${selector.keyBase64}suffix`,
					value: 'd3Jvbmc=',
				},
				{
					key: selector.keyBase64,
					value: 'dmFsdWU=',
				},
			],
			proof: [],
		}))

		await expect(storageEntryResolver.resolve[
			'ContractKeyBlockHeightSource'
		].resolve(selector, context)).resolves.toEqual({
			blockHash: 'block-hash',
			valueBase64: 'dmFsdWU=',
			prefixBase64: selector.keyBase64,
		})
		expect(Object.keys(storageEntryResolver.projections).sort()).toEqual([
			'blockHash',
			'prefixBase64',
			'valueBase64',
		])
	})

	it('rejects wrong sources, networks, heights, and prefix-only results', async () => {
		await expect(storageEntryResolver.resolve[
			'ContractKeyBlockHeightSource'
		].resolve({
			...selector,
			source: Source.Constants_Internal,
		}, context)).rejects.toThrow('unsupported source')
		expect(corsFetch).not.toHaveBeenCalled()

		await expect(storageEntryResolver.resolve[
			'ContractKeyBlockHeightSource'
		].resolve({
			...selector,
			$contract: {
				...selector.$contract,
				$network: {
					slug: 'ethereum',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(corsFetch).not.toHaveBeenCalled()

		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			block_hash: 'wrong-block',
			block_height: 124,
			values: [{
				key: selector.keyBase64,
				value: 'dmFsdWU=',
			}],
			proof: [],
		}))
		await expect(storageEntryResolver.resolve[
			'ContractKeyBlockHeightSource'
		].resolve(selector, context)).rejects.toThrow('response block height 124 does not match 123')

		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			block_hash: 'block-hash',
			block_height: 123,
			values: [{
				key: `${selector.keyBase64}suffix`,
				value: 'd3Jvbmc=',
			}],
			proof: [],
		}))
		await expect(storageEntryResolver.resolve[
			'ContractKeyBlockHeightSource'
		].resolve(selector, context)).rejects.toThrow('storage key')
	})
})

describe('NEAR block selectors', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('resolves NetworkHeight and NetworkHeightHash through the same projection surface', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult(wireBlock))
		const byHeight = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height,
		}, context)

		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toMatchObject({
			method: 'block',
			params: {
				block_id: Number(height),
			},
		})
		expect(Object.keys(blockResolver.resolve).sort()).toEqual([
			'NetworkHeight',
			'NetworkHeightHash',
		])
		expect(Object.keys(blockResolver.projections).sort()).toEqual([
			'$$chunks',
			'$parent',
			'epochId',
			'hash',
			'timestampMs',
		])
		expect(blockResolver.projections.hash(byHeight)).toBe(wireBlock.header.hash)
		expect(blockResolver.projections.timestampMs(byHeight)).toBe(1_722_470_400_000)
		expect(blockResolver.projections.$parent(byHeight)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: height - 1n,
				hash: wireBlock.header.prev_hash,
			},
		})
		expect(blockResolver.projections.$$chunks(byHeight)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					chunkHash: wireBlock.chunks[0].chunk_hash,
				},
			}),
		])

		corsFetch.mockResolvedValueOnce(jsonRpcResult(wireBlock))
		expect(await blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height,
			hash: wireBlock.header.hash,
		}, context)).toEqual(byHeight)
		expect(JSON.parse(corsFetch.mock.calls[1][1].init.body)).toMatchObject({
			method: 'block',
			params: {
				block_id: wireBlock.header.hash,
			},
		})
	})

	it('rejects height and hash identity mismatches independently', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			...wireBlock,
			header: {
				...wireBlock.header,
				height: wireBlock.header.height + 1,
			},
		}))
		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height,
		}, context)).rejects.toThrow('block height does not match the requested selector')

		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			...wireBlock,
			header: {
				...wireBlock.header,
				hash: 'different-hash',
			},
		}))
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height,
			hash: wireBlock.header.hash,
		}, context)).rejects.toThrow('block hash does not match the requested selector')
	})

	it('queries final head for height-only $$blocks refs', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult(wireBlock))
		const blocks = await networkBlocksResolver.resolve.Slug.resolve(network, {
			...context,
			pagination: {
				limit: 3,
			},
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toMatchObject({
			method: 'block',
			params: {
				finality: 'final',
			},
		})
		expect(networkBlocksResolver.projections.$$blocks(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: height - 1n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: height - 2n,
				},
			},
		])
	})
})

describe('NEAR network reading facets', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('materializes current validator refs from validators()', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			current_fishermen: [],
			current_proposals: [],
			current_validators: [
				{
					account_id: 'alice.near',
					public_key: 'ed25519:alice',
					stake: '1000',
					is_slashed: false,
					num_expected_blocks: 10,
					num_produced_blocks: 9,
				},
				{
					account_id: 'bob.near',
					public_key: 'ed25519:bob',
					stake: '2000',
					is_slashed: true,
				},
			],
			epoch_height: 100,
			epoch_start_height: 1_200_000,
			next_fishermen: [],
			next_validators: [],
			prev_epoch_kickout: [],
		}))
		const validators = await networkValidatorsResolver.resolve.Slug.resolve(network, {
			...context,
			pagination: {
				limit: 1,
			},
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toMatchObject({
			method: 'validators',
		})
		expect(networkValidatorsResolver.projections.$$validators(validators)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					accountId: 'alice.near',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.NearValidator, [], 'publicKey')]: 'ed25519:alice',
					[entityFieldAddressKey(EntityType.NearValidator, [], 'stakeYoctoNear')]: 1000n,
					[entityFieldAddressKey(EntityType.NearValidator, [], 'isSlashed')]: false,
					[entityFieldAddressKey(EntityType.NearValidator, [], 'expectedBlocks')]: 10,
					[entityFieldAddressKey(EntityType.NearValidator, [], 'producedBlocks')]: 9,
				},
			},
		])
	})

	it('materializes a network timestamp snapshot from head status gas and validators', async () => {
		corsFetch
			.mockResolvedValueOnce(jsonRpcResult(wireBlock))
			.mockResolvedValueOnce(jsonRpcResult({
				gas_price: '100000000',
			}))
			.mockResolvedValueOnce(jsonRpcResult({
				chain_id: 'mainnet',
				genesis_hash: 'genesis',
				latest_protocol_version: 72,
				protocol_version: 71,
				sync_info: {
					epoch_id: 'epoch-id',
					epoch_start_height: 1_200_000,
					latest_block_hash: wireBlock.header.hash,
					latest_block_height: wireBlock.header.height,
					latest_block_time: '2024-08-01T00:00:00.000Z',
					syncing: false,
				},
				version: {
					version: '2.0.0',
				},
			}))
			.mockResolvedValueOnce(jsonRpcResult({
				current_fishermen: [],
				current_proposals: [{
					account_id: 'proposal.near',
					public_key: 'ed25519:proposal',
					stake: '1',
					is_slashed: false,
				}],
				current_validators: [{
					account_id: 'alice.near',
					public_key: 'ed25519:alice',
					stake: '1000',
					is_slashed: false,
				}],
				epoch_height: 100,
				epoch_start_height: 1_200_000,
				next_fishermen: [],
				next_validators: [{
					account_id: 'next.near',
					public_key: 'ed25519:next',
					stake: '1',
					is_slashed: false,
				}],
				prev_epoch_kickout: [],
			}))

		const timestamps = await nearNetworkTimestampsResolver.resolve.Slug.resolve(network, context)
		expect(corsFetch.mock.calls.map((call) => JSON.parse(call[1].init.body).method)).toEqual([
			'block',
			'gas_price',
			'status',
			'validators',
		])
		expect(nearNetworkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: 1_722_470_400_000,
					source: Source.NearRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'headHeight')]: height,
					[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'headHash')]: wireBlock.header.hash,
					[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'currentValidatorCount')]: 1,
					[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'nextValidatorCount')]: 1,
					[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'currentProposalCount')]: 1,
					[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'syncing')]: false,
				}),
			}),
		])
	})
})

describe('NEAR live final head', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		vi.useFakeTimers()
	})

	it('publishes the final block and timestamp until exact abort cleanup', async () => {
		const livePublisher = networkTimestampsResolver.resolveLive.finalHead
		const replaceTimestamps = vi.fn()
		const replaceBlocks = vi.fn()
		const abortController = new AbortController()
		corsFetch
			.mockResolvedValueOnce(jsonRpcResult(wireBlock))
			.mockResolvedValueOnce(jsonRpcResult({ gas_price: '100000000' }))
			.mockResolvedValueOnce(jsonRpcResult({
				chain_id: 'mainnet',
				genesis_hash: 'genesis',
				latest_protocol_version: 72,
				protocol_version: 71,
				sync_info: {
					epoch_id: 'epoch-id',
					epoch_start_height: 1_200_000,
					latest_block_hash: wireBlock.header.hash,
					latest_block_height: wireBlock.header.height,
					latest_block_time: '2024-08-01T00:00:00.000Z',
					syncing: false,
				},
				version: { version: '2.0.0' },
			}))
			.mockResolvedValueOnce(jsonRpcResult({
				current_fishermen: [],
				current_proposals: [],
				current_validators: [],
				epoch_height: 100,
				epoch_start_height: 1_200_000,
				next_fishermen: [],
				next_validators: [],
				prev_epoch_kickout: [],
			}))
			.mockResolvedValueOnce(jsonRpcResult(wireBlock))

		const cleanup = await livePublisher.start({
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: context,
			fields: {
				$$timestamps: {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				$$blocks: {
					replaceRows: replaceBlocks,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
		})
		await vi.waitFor(() => {
			expect(replaceTimestamps).toHaveBeenCalledOnce()
			expect(replaceBlocks).toHaveBeenCalledOnce()
		})
		expect(replaceBlocks.mock.calls[0][0][0].value[0]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: {
				$network: network,
				height,
				hash: wireBlock.header.hash,
			},
		}))

		abortController.abort()
		cleanup?.()
		await vi.advanceTimersByTimeAsync(2_000)
		expect(corsFetch).toHaveBeenCalledTimes(5)
		vi.useRealTimers()
	})
})

describe('NEAR block query', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('requests finality, height, and hash block ids', async () => {
		corsFetch.mockResolvedValueOnce(jsonRpcResult(wireBlock))
		await expect(getBlock({
			blockId: 'final',
		})).resolves.toMatchObject({
			header: {
				height: wireBlock.header.height,
				hash: wireBlock.header.hash,
			},
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toMatchObject({
			method: 'block',
			params: {
				finality: 'final',
			},
		})

		corsFetch.mockResolvedValueOnce(jsonRpcResult(wireBlock))
		await getBlock({
			blockId: height,
		})
		expect(JSON.parse(corsFetch.mock.calls[1][1].init.body)).toMatchObject({
			method: 'block',
			params: {
				block_id: Number(height),
			},
		})

		corsFetch.mockResolvedValueOnce(jsonRpcResult(wireBlock))
		await getBlock({
			blockId: wireBlock.header.hash,
		})
		expect(JSON.parse(corsFetch.mock.calls[2][1].init.body)).toMatchObject({
			method: 'block',
			params: {
				block_id: wireBlock.header.hash,
			},
		})
	})
})

describe('NEAR receipts and tx status projection', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('hydrates enrolled NearReceipt predecessor/receiver from EXPERIMENTAL_tx_status receipts', async () => {
		const transactionResolver = nearRpc.resolvers.find((resolver) => (
			resolver.entityType === EntityType.NearTransaction
		))
		if (transactionResolver == null)
			throw new Error('NearRpc_JsonRpc spec missing NearTransaction resolver')

		corsFetch.mockResolvedValueOnce(jsonRpcResult({
			transaction: {
				hash: 'tx-hash',
				signer_id: 'signer.near',
				receiver_id: 'receiver.near',
				nonce: 7,
				actions: [{
					Transfer: {
						deposit: '1',
					},
				}],
			},
			transaction_outcome: {
				id: 'outcome-tx',
				outcome: {
					gas_burnt: 10,
					receipt_ids: ['receipt-1'],
					status: {
						SuccessValue: '',
					},
				},
			},
			receipts_outcome: [],
			status: {
				SuccessValue: '',
			},
			receipts: [{
				predecessor_id: 'signer.near',
				receiver_id: 'receiver.near',
				receipt_id: 'receipt-1',
				receipt: {
					Action: {},
				},
			}],
		}))

		const transaction = await transactionResolver.resolve.NetworkHashSignerAccountId.resolve({
			$network: network,
			hash: 'tx-hash',
			signerAccountId: 'signer.near',
		}, context)
		const receipts = transaction.$$executionOutcomes[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.NearExecutionOutcome, [], '$$receipts')]
		expect(receipts).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				receiptId: 'receipt-1',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NearReceipt, [], '$predecessor')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId: 'signer.near',
					},
				},
				[entityFieldAddressKey(EntityType.NearReceipt, [], '$receiver')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId: 'receiver.near',
					},
				},
			},
		}])
	})
})

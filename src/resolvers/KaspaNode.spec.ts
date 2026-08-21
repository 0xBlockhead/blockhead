import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const queries = vi.hoisted(() => ({
	getAddressBalance: vi.fn(),
	getAddressUtxos: vi.fn(),
	getBlockDagInfo: vi.fn(),
	getServerInfo: vi.fn(),
	getBlock: vi.fn(),
	getTransaction: vi.fn(),
	getVirtualChain: vi.fn(),
}))

vi.mock('$/sources/KaspaNode/Rest/queries.ts', () => queries)

const { default: resolverModule } = await import('$/resolvers/KaspaNode-Rest.ts')
const networkResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.KaspaNetwork)
const addressResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.KaspaAddress && '$$timestamps' in resolver.projections)
const addressUtxoResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.KaspaAddress && '$$utxos' in resolver.projections)
const virtualChainResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.KaspaVirtualChain_Timestamp)

if (networkResolver == null || addressResolver == null || addressUtxoResolver == null || virtualChainResolver == null)
	throw new Error('Kaspa node resolver slice is incomplete')

const network = { $network: { slug: networkBySlug.kaspa.slug } }
const address = { $network: network, address: 'kaspa:qq' }
const context = {
	filters: [],
	sorts: [],
	pagination: { limit: 2 },
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
}

describe('Kaspa node resolver cold reads', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('emits one network observation at the upstream past-median timestamp', async () => {
		queries.getBlockDagInfo.mockResolvedValue({
			blockCount: 12,
			tipHashes: ['a'],
			difficulty: 1,
			pastMedianTime: 1_720_000_000_000,
			virtualParentHashes: ['b'],
			pruningPointHash: 'c',
			virtualDaaScore: '4',
		})
		queries.getServerInfo.mockResolvedValue({ serverVersion: 'v1', isSynced: true, networkId: 'mainnet', hasUtxoIndex: true })

		const rows = await networkResolver.resolve.Network.resolve(network, context)
		expect(rows[0][EntityMetaKey.Selector]).toEqual({ $network: network, timestampMs: 1_720_000_000_000, source: Source.KaspaNode_Rest })
		expect(rows[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualDaaScore')]).toBe(4n)
	})

	it('uses one observation clock for address balance and UTXO count', async () => {
		queries.getAddressBalance.mockResolvedValue({ balance: '7' })
		queries.getAddressUtxos.mockResolvedValue({ entries: [] })
		queries.getBlockDagInfo.mockResolvedValue({ pastMedianTime: 1_720_000_000_000 })

		const rows = await addressResolver.resolve.NetworkAddress.resolve(address, context)
		expect(rows[0][EntityMetaKey.Selector]).toEqual({ $address: address, timestampMs: 1_720_000_000_000, source: Source.KaspaNode_Rest })
		expect(rows[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'balanceSompi')]: 7n,
			[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'utxoCount')]: 0,
		})
	})

	it('uses the provider clock for address UTXO observations', async () => {
		queries.getAddressUtxos.mockResolvedValue({ entries: [{
			outpoint: { transactionId: 'tx-a', index: 0 },
			utxoEntry: {
				amount: '9',
				scriptPublicKey: { scriptPublicKey: '20aa' },
				blockDaaScore: '4',
				isCoinbase: false,
			},
		}] })
		queries.getBlockDagInfo.mockResolvedValue({ pastMedianTime: 1_720_000_000_000 })

		const rows = await addressUtxoResolver.resolve.NetworkAddress.resolve(address, context)
		expect(rows[0][EntityMetaKey.Selector]).toEqual({
			$address: address,
			outpointTransactionId: 'tx-a',
			outpointIndex: 0,
			timestampMs: 1_720_000_000_000,
			source: Source.KaspaNode_Rest,
		})
	})

	it('uses the provider clock for virtual-chain observations', async () => {
		queries.getVirtualChain.mockResolvedValue({
			addedChainBlockHashes: ['added-a'],
			removedChainBlockHashes: [],
			acceptedTransactionIds: [],
		})
		queries.getBlockDagInfo.mockResolvedValue({ pastMedianTime: 1_720_000_000_000 })

		const rows = await virtualChainResolver.resolve.NetworkStartHashTimestampMsSource.resolve({
			$network: network,
			startHash: 'start-a',
			timestampMs: 1_720_000_000_000,
			source: Source.KaspaNode_Rest,
		}, context)
		expect(rows[0][EntityMetaKey.Selector]).toMatchObject({
			startHash: 'start-a',
			timestampMs: 1_720_000_000_000,
			source: Source.KaspaNode_Rest,
		})
	})

	it('does not replay a newly clocked address state into an old selector', async () => {
		queries.getAddressBalance.mockResolvedValueOnce({ balance: '7' }).mockResolvedValue({ balance: '8' })
		queries.getAddressUtxos.mockResolvedValue({ entries: [] })
		queries.getBlockDagInfo.mockResolvedValueOnce({ pastMedianTime: 1_720_000_000_000 }).mockResolvedValue({ pastMedianTime: 1_720_000_001_000 })

		const firstRows = await addressResolver.resolve.NetworkAddress.resolve(address, context)
		const secondRows = await addressResolver.resolve.NetworkAddress.resolve(address, context)
		const firstTimestamp = firstRows[0][EntityMetaKey.Selector].timestampMs
		const oldSelectorContext = {
			...context,
			filters: [{ fieldPath: ['timestampMs'], operator: 'eq' as const, value: firstTimestamp }],
		}

		expect(secondRows.filter((row) => row[EntityMetaKey.Selector].timestampMs === firstTimestamp)).toHaveLength(0)
		expect(secondRows[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'balanceSompi')]).toBe(8n)
		await expect(addressResolver.resolve.NetworkAddress.resolve(address, oldSelectorContext)).rejects.toThrow('historical address observations are unsupported')
	})
})

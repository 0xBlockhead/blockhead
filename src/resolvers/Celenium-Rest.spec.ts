import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getHead = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())
const getBlockByHash = vi.hoisted(() => vi.fn())
const getBlockCount = vi.hoisted(() => vi.fn())
const getBlobMetadata = vi.hoisted(() => vi.fn())
const getNamespace = vi.hoisted(() => vi.fn())
const getTransaction = vi.hoisted(() => vi.fn())
const listBlocks = vi.hoisted(() => vi.fn())
const listNamespaces = vi.hoisted(() => vi.fn())
const listBlobMetadata = vi.hoisted(() => vi.fn())
const listBlockBlobs = vi.hoisted(() => vi.fn())
const listNamespaceBlobs = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Celenium/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Celenium/Rest/queries.ts')>(),
	getHead,
	getBlock,
	getBlockByHash,
	getBlockCount,
	getBlobMetadata,
	getNamespace,
	getTransaction,
	listBlocks,
	listNamespaces,
	listBlobMetadata,
	listBlockBlobs,
	listNamespaceBlobs,
}))

const { default: celeniumRest } = await import('$/resolvers/Celenium-Rest.ts')

const network = {
	slug: 'celestia',
} satisfies EntitySelector<typeof schema, EntityType.Network>
const celestiaNetwork = {
	$network: network,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const networkResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$timestamps' in resolver.projections
))
const timestampResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork_Timestamp
))
const blocksResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$blocks' in resolver.projections
	&& typeof resolver.projections.$$blocks === 'object'
	&& resolver.projections.$$blocks != null
	&& 'select' in resolver.projections.$$blocks
))
const blocksCountResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$blocks' in resolver.projections
	&& typeof resolver.projections.$$blocks === 'object'
	&& resolver.projections.$$blocks != null
	&& 'resolveCount' in resolver.projections.$$blocks
))
const blockResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlock
	&& 'hash' in resolver.projections
))
const blockBlobsResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlock
	&& '$$blobs' in resolver.projections
	&& typeof resolver.projections.$$blobs === 'function'
))
const blockBlobsCountResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlock
	&& '$$blobs' in resolver.projections
	&& typeof resolver.projections.$$blobs === 'object'
	&& resolver.projections.$$blobs != null
	&& 'resolveCount' in resolver.projections.$$blobs
))
const namespaceResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNamespace
	&& 'namespaceVersion' in resolver.projections
))
const namespaceTimestampResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNamespace_Timestamp
))
const namespaceBlobsResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNamespace
	&& '$$blobs' in resolver.projections
	&& typeof resolver.projections.$$blobs === 'function'
))
const namespaceBlobsCountResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNamespace
	&& '$$blobs' in resolver.projections
	&& typeof resolver.projections.$$blobs === 'object'
	&& resolver.projections.$$blobs != null
	&& 'resolveCount' in resolver.projections.$$blobs
))
const blobResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlob
))
const transactionResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosTransaction
))
const namespacesResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$namespaces' in resolver.projections
	&& typeof resolver.projections.$$namespaces === 'function'
))
const namespacesCountResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$namespaces' in resolver.projections
	&& typeof resolver.projections.$$namespaces === 'object'
	&& resolver.projections.$$namespaces != null
	&& 'resolveCount' in resolver.projections.$$namespaces
))
const blobsResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$blobs' in resolver.projections
	&& typeof resolver.projections.$$blobs === 'function'
))

if (
	networkResolver == null
	|| timestampResolver == null
	|| blocksResolver == null
	|| blocksCountResolver == null
	|| blockResolver == null
	|| blockBlobsResolver == null
	|| blockBlobsCountResolver == null
	|| namespaceResolver == null
	|| namespaceTimestampResolver == null
	|| namespaceBlobsResolver == null
	|| namespaceBlobsCountResolver == null
	|| blobResolver == null
	|| transactionResolver == null
	|| namespacesResolver == null
	|| namespacesCountResolver == null
	|| blobsResolver == null
)
	throw new Error('Celenium REST head resolvers are not registered')
const resolveTimestamps = (
	'Network' in networkResolver.resolve ?
		networkResolver.resolve.Network.resolve
	:
		undefined
)
const resolveBlocks = (
	'Network' in blocksResolver.resolve ?
		blocksResolver.resolve.Network.resolve
	:
		undefined
)
const resolveNamespaces = (
	'Network' in namespacesResolver.resolve ?
		namespacesResolver.resolve.Network.resolve
	:
		undefined
)
const resolveBlobs = (
	'Network' in blobsResolver.resolve ?
		blobsResolver.resolve.Network.resolve
	:
		undefined
)
if (
	resolveTimestamps == null
	|| resolveBlocks == null
	|| resolveNamespaces == null
	|| resolveBlobs == null
)
	throw new Error('Celenium REST discovery resolvers are not registered')

describe('Celenium REST head projection', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		vi.setSystemTime(1_753_248_000_000)
	})

	it('loads the resolver module from the generated registry', async () => {
		await expect(loadResolvers(new Set([
			Source.Celenium_Rest,
		]))).resolves.toMatchObject([{
			source: Source.Celenium_Rest,
		}])
	})

	it('discovers a source-owned observation selector for Celestia mainnet', async () => {
		getHead.mockResolvedValue({
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash: 'A'.repeat(64),
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 64_039_630,
			total_accounts: 1_697_994,
			total_fee: '427685943185',
			total_blobs_size: 4_403_903_879_869,
			total_supply: '1173477103807920',
			synced: true,
			total_namespaces: 1_095,
		})

		await expect(resolveTimestamps({
			$network: network,
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					timestampMs: 1_784_782_088_000,
					source: Source.Celenium_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHeight')]: 12_424_720n,
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHash')]: 'a'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestBlockTimeMs')]: 1_784_782_088_000,
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'syncing')]: false,
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'namespaceCount')]: 1_095,
				},
			},
		])
		expect(getHead).toHaveBeenCalledWith()
	})

	it('projects the native head row into the addressed timestamp', async () => {
		getHead.mockResolvedValue({
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash: 'A'.repeat(64),
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 64_039_630,
			total_accounts: 1_697_994,
			total_fee: '427685943185',
			total_blobs_size: 4_403_903_879_869,
			total_supply: '1173477103807920',
			synced: true,
		})

		await expect(timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: celestiaNetwork,
			timestampMs: 1_784_782_088_000,
			source: Source.Celenium_Rest,
		})).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: celestiaNetwork,
			},
			timestampMs: 1_784_782_088_000,
			source: Source.Celenium_Rest,
			latestHeight: 12_424_720n,
			latestHash: 'a'.repeat(64),
			latestBlockTimeMs: 1_784_782_088_000,
			syncing: false,
		})
	})

	it('projects enrolled namespaceCount from head total_namespaces', async () => {
		getHead.mockResolvedValue({
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash: 'A'.repeat(64),
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 64_039_630,
			total_accounts: 1_697_994,
			total_fee: '427685943185',
			total_blobs_size: 4_403_903_879_869,
			total_supply: '1173477103807920',
			total_namespaces: 1_095,
			synced: true,
		})

		await expect(timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: celestiaNetwork,
			timestampMs: 1_784_782_088_000,
			source: Source.Celenium_Rest,
		})).resolves.toMatchObject({
			namespaceCount: 1_095,
		})
	})

	it('rejects a head row that does not match the addressed observation time', async () => {
		getHead.mockResolvedValue({
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash: 'A'.repeat(64),
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 64_039_630,
			total_accounts: 1_697_994,
			total_fee: '427685943185',
			total_blobs_size: 4_403_903_879_869,
			total_supply: '1173477103807920',
			synced: true,
		})

		await expect(timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: celestiaNetwork,
			timestampMs: 1_753_248_000_000,
			source: Source.Celenium_Rest,
		})).rejects.toThrow('does not match the observation time')
	})

	it('discovers native block rows by height with bounded pagination', async () => {
		listBlocks.mockResolvedValue([
			{
				height: 12_424_720,
				hash: 'A'.repeat(64),
				parent_hash: 'B'.repeat(64),
				app_hash: 'C'.repeat(64),
				data_hash: 'D'.repeat(64),
				time: '2026-07-23T04:48:08Z',
				proposer: {
					cons_address: 'E'.repeat(40),
				},
				stats: {
					tx_count: 5,
					blobs_count: 4,
					blobs_size: 24_857,
					fee: '1000',
					bytes_in_block: 50_000,
				},
			},
		])

		const snapshot = await resolveBlocks(
			{
				$network: network,
			},
			{
				...context,
				pagination: {
					limit: 1,
					offset: 2,
				},
			}
		)
		expect(blocksResolver.projections.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					height: 12_424_720n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'hash')]: 'a'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'appHash')]: 'c'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'dataHash')]: 'd'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'proposerAddress')]: 'e'.repeat(40),
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'timestampMs')]: 1_784_782_088_000,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'blobCount')]: 4,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'transactionCount')]: 5,
				},
			},
		])
		expect(blocksResolver.projections.$$blocks.continuation(snapshot).token).toBe('12424719')
		expect(listBlocks).toHaveBeenCalledWith({
			limit: 1,
			offset: 2,
		})

		getBlock.mockResolvedValueOnce({
			height: 12_424_719,
			hash: 'F'.repeat(64),
			parent_hash: 'G'.repeat(64),
			app_hash: 'H'.repeat(64),
			data_hash: 'I'.repeat(64),
			time: '2026-07-23T04:48:07Z',
			proposer: {
				cons_address: 'J'.repeat(40),
			},
			stats: {
				tx_count: 3,
				blobs_count: 2,
				blobs_size: 12_000,
				fee: '500',
				bytes_in_block: 25_000,
			},
		})
		const continuedSnapshot = await resolveBlocks(
			{
				$network: network,
			},
			{
				...context,
				pagination: {
					limit: 1,
				},
				providerContinuationToken: '12424719',
			}
		)
		expect(blocksResolver.projections.$$blocks.select(continuedSnapshot)[0][EntityMetaKey.Selector].height).toBe(12_424_719n)
		expect(blocksResolver.projections.$$blocks.continuation(continuedSnapshot).token).toBe('12424718')
		expect(getBlock).toHaveBeenCalledWith(12_424_719n)
	})

	it('projects the native block row at the schema boundary', async () => {
		getBlock.mockResolvedValue({
			height: 12_424_720,
			hash: 'A'.repeat(64),
			parent_hash: 'B'.repeat(64),
			app_hash: 'C'.repeat(64),
			data_hash: 'D'.repeat(64),
			time: '2026-07-23T04:48:08Z',
			proposer: {
				cons_address: 'E'.repeat(40),
			},
			stats: {
				tx_count: 5,
				blobs_count: 4,
				blobs_size: 24_857,
				fee: '1000',
				bytes_in_block: 50_000,
			},
		})

		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: celestiaNetwork,
			height: 12_424_720n,
		})).resolves.toEqual({
			hash: 'a'.repeat(64),
			appHash: 'c'.repeat(64),
			dataHash: 'd'.repeat(64),
			proposerAddress: 'e'.repeat(40),
			timestampMs: 1_784_782_088_000,
			blobCount: 4,
			transactionCount: 5,
			height: 12_424_720n,
		})
		expect(getBlock).toHaveBeenCalledWith(12_424_720n)
	})

	it('projects NetworkHash through search-backed block detail', async () => {
		getBlockByHash.mockResolvedValue({
			height: 12_424_720,
			hash: 'A'.repeat(64),
			parent_hash: 'B'.repeat(64),
			app_hash: 'C'.repeat(64),
			data_hash: 'D'.repeat(64),
			time: '2026-07-23T04:48:08Z',
			proposer: {
				cons_address: 'E'.repeat(40),
			},
			stats: {
				tx_count: 5,
				blobs_count: 4,
				blobs_size: 24_857,
				fee: '1000',
				bytes_in_block: 50_000,
			},
		})

		await expect(blockResolver.resolve.NetworkHash.resolve({
			$network: celestiaNetwork,
			hash: 'a'.repeat(64),
		})).resolves.toEqual({
			hash: 'a'.repeat(64),
			appHash: 'c'.repeat(64),
			dataHash: 'd'.repeat(64),
			proposerAddress: 'e'.repeat(40),
			timestampMs: 1_784_782_088_000,
			blobCount: 4,
			transactionCount: 5,
			height: 12_424_720n,
		})
		expect(getBlockByHash).toHaveBeenCalledWith('a'.repeat(64))
	})

	it('projects $$blocks resolveCount from /v1/block/count', async () => {
		getBlockCount.mockResolvedValue(12_424_721)
		const resolveCount = (
			'Network' in blocksCountResolver.resolve ?
				blocksCountResolver.resolve.Network.resolve
			:
				undefined
		)
		if (resolveCount == null)
			throw new Error('Celenium REST block count resolver is not registered')
		await expect(resolveCount({
			$network: network,
		}, context)).resolves.toBe(12_424_721)
		expect(
			typeof blocksCountResolver.projections.$$blocks === 'object'
			&& blocksCountResolver.projections.$$blocks != null
			&& 'resolveCount' in blocksCountResolver.projections.$$blocks
			&& blocksCountResolver.projections.$$blocks.resolveCount(12_424_721)
		).toBe(12_424_721)
	})

	it('projects native transaction units into the addressed Cosmos transaction', async () => {
		getTransaction.mockResolvedValue({
			height: 12_424_743,
			position: 3,
			gas_wanted: 289_167,
			gas_used: 262_979,
			hash: 'A'.repeat(64),
			fee: '900719925474099312345',
			time: '2026-07-23T04:49:13Z',
			status: 'success',
			timeout_height: 12_500_000,
			memo: 'relayed by hermes',
			codespace: 'sdk',
			signers: [
				{
					hash: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
				},
			],
			message_types: ['MsgPayForBlobs'],
		})

		await expect(transactionResolver.resolve.NetworkTxHash.resolve({
			$network: network,
			txHash: 'a'.repeat(64),
		})).resolves.toEqual({
			$block: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 12_424_743n,
				},
			},
			code: 0,
			codespace: 'sdk',
			gasWanted: 289_167n,
			gasUsed: 262_979n,
			feeAmount: [
				{
					denom: 'utia',
					amount: 900_719_925_474_099_312_345n,
				},
			],
			memo: 'relayed by hermes',
			timeoutHeight: 12_500_000n,
			signerAddresses: [
				'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
			],
		})
		expect(getTransaction).toHaveBeenCalledWith('a'.repeat(64))
	})

	it('projects namespace / block / namespace-blob resolveCount leftovers', async () => {
		getHead.mockResolvedValue({
			chain_id: 'celestia',
			last_height: 12_424_720,
			hash: 'a'.repeat(64),
			last_time: '2026-07-23T04:48:08Z',
			total_tx: 1,
			total_accounts: 1,
			total_fee: '1',
			total_blobs_size: 1,
			total_supply: '1',
			synced: true,
			total_namespaces: 1_095,
		})
		getBlock.mockResolvedValue({
			height: 12_424_743,
			hash: 'a'.repeat(64),
			parent_hash: 'b'.repeat(64),
			app_hash: 'c'.repeat(64),
			data_hash: 'd'.repeat(64),
			time: '2026-07-23T04:49:13Z',
			proposer: {
				cons_address: 'e'.repeat(40),
			},
			stats: {
				tx_count: 5,
				blobs_count: 4,
				blobs_size: 100,
				fee: '1',
				bytes_in_block: 100,
			},
		})
		getNamespace.mockResolvedValue({
			size: 24_857,
			blobs_count: 4,
			version: 0,
			namespace_id: 'A'.repeat(56),
			hash: `${'B'.repeat(39)}=`,
			last_height: 12_424_720,
			reserved: false,
		})

		if (!('Network' in namespacesCountResolver.resolve))
			throw new Error('Celenium namespace count resolver missing Network')
		await expect(namespacesCountResolver.resolve.Network.resolve({
			$network: network,
		}, context)).resolves.toBe(1_095)
		expect(
			typeof namespacesCountResolver.projections.$$namespaces === 'object'
			&& namespacesCountResolver.projections.$$namespaces != null
			&& 'resolveCount' in namespacesCountResolver.projections.$$namespaces
			&& namespacesCountResolver.projections.$$namespaces.resolveCount(1_095)
		).toBe(1_095)

		if (!('NetworkHeight' in blockBlobsCountResolver.resolve))
			throw new Error('Celenium block blob count resolver missing NetworkHeight')
		await expect(blockBlobsCountResolver.resolve.NetworkHeight.resolve({
			$network: celestiaNetwork,
			height: 12_424_743n,
		}, context)).resolves.toBe(4)

		if (!('NetworkNamespaceId' in namespaceBlobsCountResolver.resolve))
			throw new Error('Celenium namespace blob count resolver missing NetworkNamespaceId')
		await expect(namespaceBlobsCountResolver.resolve.NetworkNamespaceId.resolve({
			$network: celestiaNetwork,
			namespaceId: `00${'a'.repeat(56)}`,
		}, context)).resolves.toBe(4)
	})

	it('projects native namespace rows into selectors and embedded observations', async () => {
		listNamespaces.mockResolvedValue([
			{
				size: 24_857,
				blobs_count: 4,
				version: 0,
				namespace_id: 'A'.repeat(56),
				hash: `${'B'.repeat(39)}=`,
				last_height: 12_424_720,
				last_message_time: '2026-07-23T04:48:00Z',
				name: 'PayForBlobs',
				reserved: false,
			},
		])
		const namespaceSelector = {
			$network: celestiaNetwork,
			namespaceId: `00${'a'.repeat(56)}`,
		}

		await expect(resolveNamespaces({
			$network: network,
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 3,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: namespaceSelector,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaNamespace, [], 'namespaceVersion')]: 0,
					[entityFieldAddressKey(EntityType.CelestiaNamespace, [], 'label')]: 'PayForBlobs',
					[entityFieldAddressKey(EntityType.CelestiaNamespace, [], '$$timestamps')]: [
						{
			[EntityMetaKey.Selector]: {
				$namespace: namespaceSelector,
				timestampMs: 1_784_782_080_000,
				source: Source.Celenium_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'height')]: 12_424_720n,
								[entityFieldAddressKey(EntityType.CelestiaNamespace_Timestamp, [], 'blobCount')]: 4,
							},
						},
					],
				},
			},
		])
		expect(listNamespaces).toHaveBeenCalledWith({
			limit: 1,
			offset: 3,
		})
	})

	it('resolves namespace observations only at the source-owned namespace clock', async () => {
		const namespaceSelector = {
			$network: celestiaNetwork,
			namespaceId: `00${'a'.repeat(56)}`,
		}
		getNamespace.mockResolvedValueOnce({
			size: 24_857,
			blobs_count: 4,
			version: 0,
			namespace_id: 'A'.repeat(56),
			hash: `${'B'.repeat(39)}=`,
			last_height: 12_424_720,
			last_message_time: '2026-07-23T04:48:00Z',
			reserved: false,
		})
		await expect(namespaceTimestampResolver.resolve.NamespaceTimestampMsSource.resolve({
			$namespace: namespaceSelector,
			timestampMs: 1_784_782_080_000,
			source: Source.Celenium_Rest,
		}, context)).resolves.toEqual({
			$namespace: {
				[EntityMetaKey.Selector]: namespaceSelector,
			},
			timestampMs: 1_784_782_080_000,
			source: Source.Celenium_Rest,
			height: 12_424_720n,
			blobCount: 4,
		})

		await expect(namespaceTimestampResolver.resolve.NamespaceTimestampMsSource.resolve({
			$namespace: namespaceSelector,
			timestampMs: 1_784_782_080_000,
			source: Source.CelestiaNode,
		}, context)).rejects.toThrow('unsupported namespace observation source')

		getNamespace.mockResolvedValueOnce({
			size: 24_857,
			blobs_count: 4,
			version: 0,
			namespace_id: 'A'.repeat(56),
			hash: `${'B'.repeat(39)}=`,
			last_height: 12_424_720,
			last_message_time: '2026-07-23T04:48:00Z',
			reserved: false,
		})
		await expect(namespaceTimestampResolver.resolve.NamespaceTimestampMsSource.resolve({
			$namespace: namespaceSelector,
			timestampMs: 1_784_782_080_001,
			source: Source.Celenium_Rest,
		}, context)).rejects.toThrow('does not match the observation time')
	})

	it('projects blob metadata into canonical namespace, block, and metadata fields', async () => {
		listBlobMetadata.mockResolvedValue([
			{
				commitment: `${'B'.repeat(43)}=`,
				size: 24_857,
				share_version: 1,
				height: 12_424_743,
				time: '2026-07-23T04:49:13Z',
				content_type: 'application/octet-stream',
				namespace: 'AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=',
				tx_hash: 'A'.repeat(64),
				signer: {
					hash: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
				},
			},
		])

		await expect(resolveBlobs({
			$network: network,
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 4,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$namespace: {
						$network: celestiaNetwork,
						namespaceId: `00${'aa'.repeat(28)}`,
					},
					height: 12_424_743n,
					commitment: `${'B'.repeat(43)}=`,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'shareVersion')]: 1,
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'sizeBytes')]: 24_857n,
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'signer')]: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'txHash')]: 'a'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: celestiaNetwork,
							height: 12_424_743n,
						},
					},
				},
			},
		])
		expect(listBlobMetadata).toHaveBeenCalledWith({
			limit: 1,
			offset: 4,
		})
	})

	it('projects singular namespace, block blobs, namespace blobs, and blob metadata leftovers', async () => {
		getNamespace.mockResolvedValue({
			size: 24_857,
			blobs_count: 4,
			version: 0,
			namespace_id: 'A'.repeat(56),
			hash: `${'B'.repeat(39)}=`,
			last_height: 12_424_720,
			name: 'PayForBlobs',
			reserved: false,
		})
		const namespaceId = `00${'a'.repeat(56)}`
		await expect(namespaceResolver.resolve.NetworkNamespaceId.resolve({
			$network: celestiaNetwork,
			namespaceId,
		})).resolves.toMatchObject({
			namespaceVersion: 0,
			label: 'PayForBlobs',
		})

		listBlockBlobs.mockResolvedValue([
			{
				commitment: `${'B'.repeat(43)}=`,
				size: 379,
				share_version: 0,
				height: 12_424_743,
				time: '2026-07-23T04:49:13Z',
				content_type: 'application/octet-stream',
				namespace: `${'A'.repeat(39)}=`,
				namespaceVersion: 0,
				namespaceId: 'a'.repeat(56),
				tx_hash: 'A'.repeat(64),
				signer: {
					hash: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
				},
			},
		])
		await expect(blockBlobsResolver.resolve.NetworkHeight.resolve({
			$network: celestiaNetwork,
			height: 12_424_743n,
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 0,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$namespace: {
						$network: celestiaNetwork,
						namespaceId: `00${'a'.repeat(56)}`,
					},
					height: 12_424_743n,
					commitment: `${'B'.repeat(43)}=`,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'shareVersion')]: 0,
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'sizeBytes')]: 379n,
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'signer')]: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], 'txHash')]: 'a'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlob, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: celestiaNetwork,
							height: 12_424_743n,
						},
					},
				},
			},
		])

		listNamespaceBlobs.mockResolvedValue([
			{
				commitment: `${'B'.repeat(43)}=`,
				size: 11,
				share_version: 1,
				height: 12_424_720,
				time: '2026-07-23T04:48:08Z',
				content_type: 'text/plain',
				namespace: `${'A'.repeat(39)}=`,
				namespaceVersion: 0,
				namespaceId: 'a'.repeat(56),
				tx_hash: 'A'.repeat(64),
				signer: {
					hash: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
				},
			},
		])
		await expect(namespaceBlobsResolver.resolve.NetworkNamespaceId.resolve({
			$network: celestiaNetwork,
			namespaceId,
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 0,
			},
		})).resolves.toHaveLength(1)

		getBlobMetadata.mockResolvedValue({
			commitment: `${'B'.repeat(43)}=`,
			size: 379,
			share_version: 0,
			height: 12_424_743,
			time: '2026-07-23T04:49:13Z',
			content_type: 'application/octet-stream',
			namespace: `${'A'.repeat(39)}=`,
			tx_hash: 'A'.repeat(64),
			signer: {
				hash: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
			},
		})
		await expect(blobResolver.resolve.NamespaceHeightCommitment.resolve({
			$namespace: {
				$network: celestiaNetwork,
				namespaceId,
			},
			height: 12_424_743n,
			commitment: `${'B'.repeat(43)}=`,
		})).resolves.toEqual({
			shareVersion: 0,
			sizeBytes: 379n,
			signer: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
			txHash: 'a'.repeat(64),
			$block: {
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					height: 12_424_743n,
				},
			},
		})
	})

	it('rejects unsupported networks and observation sources before transport', async () => {
		await expect(resolveTimestamps({
			$network: {
				slug: 'ethereum',
			},
		}, context)).rejects.toThrow('unsupported network')
		await expect(timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: celestiaNetwork,
			timestampMs: 1_753_248_000_000,
			source: Source.Constants_Internal,
		})).rejects.toThrow('unsupported observation source')
		await expect(transactionResolver.resolve.NetworkTxHash.resolve({
			$network: {
				slug: 'cosmos',
			},
			txHash: 'a'.repeat(64),
		})).rejects.toThrow('unsupported network')
		expect(getHead).not.toHaveBeenCalled()
		expect(getTransaction).not.toHaveBeenCalled()
	})
})

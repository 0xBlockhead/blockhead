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
const getTransaction = vi.hoisted(() => vi.fn())
const listBlocks = vi.hoisted(() => vi.fn())
const listNamespaces = vi.hoisted(() => vi.fn())
const listBlobMetadata = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Celenium/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Celenium/Rest/queries.ts')>(),
	getHead,
	getBlock,
	getTransaction,
	listBlocks,
	listNamespaces,
	listBlobMetadata,
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
))
const blockResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlock
))
const transactionResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CosmosTransaction
))
const namespacesResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$namespaces' in resolver.projections
))
const blobsResolver = celeniumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$blobs' in resolver.projections
))

if (
	networkResolver == null
	|| timestampResolver == null
	|| blocksResolver == null
	|| blockResolver == null
	|| transactionResolver == null
	|| namespacesResolver == null
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

		await expect(resolveBlocks(
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
		)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					height: 12_424_720n,
				},
			},
		])
		expect(listBlocks).toHaveBeenCalledWith({
			limit: 1,
			offset: 2,
		})
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
		})
		expect(getBlock).toHaveBeenCalledWith(12_424_720n)
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
			gasWanted: 289_167n,
			gasUsed: 262_979n,
			feeAmount: [
				{
					denom: 'utia',
					amount: 900_719_925_474_099_312_345n,
				},
			],
			signerAddresses: [
				'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
			],
		})
		expect(getTransaction).toHaveBeenCalledWith('a'.repeat(64))
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
								timestampMs: 1_753_248_000_000,
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

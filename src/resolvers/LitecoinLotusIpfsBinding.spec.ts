import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import ipfsBindings from '$/sources/Ipfs/bindings.ts'
import litecoinCoreBindings from '$/sources/LitecoinCore/bindings.ts'
import lotusBindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'

const {
	fetchBrowseResult,
	getBlock,
	getTipSet,
	getTipSetByHeight,
} = vi.hoisted(() => ({
	fetchBrowseResult: vi.fn(),
	getBlock: vi.fn(),
	getTipSet: vi.fn(),
	getTipSetByHeight: vi.fn(),
}))

vi.mock('$/sources/Ipfs/Rest/queries.ts', () => ({
	fetchBrowseResult,
}))

vi.mock('$/sources/LitecoinCore/JsonRpc/queries.ts', () => ({
	getBlock,
}))

vi.mock('$/sources/Lotus/JsonRpc/queries.ts', () => ({
	getTipSet,
	getTipSetByHeight,
}))

const [
	{ default: ipfsResolvers },
	{ default: litecoinResolvers },
	{ default: lotusResolvers },
] = await Promise.all([
	import('$/resolvers/Ipfs-Rest.ts'),
	import('$/resolvers/LitecoinCore-JsonRpc.ts'),
	import('$/resolvers/Lotus-JsonRpc.ts'),
])

const litecoinBlockResolver = litecoinResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof litecoinResolvers.resolvers[number],
	{ entityType: EntityType.UtxoBlock }
> => resolver.entityType === EntityType.UtxoBlock)

const lotusTipsetResolver = lotusResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof lotusResolvers.resolvers[number],
	{ entityType: EntityType.FilecoinTipset }
> => resolver.entityType === EntityType.FilecoinTipset)

if (
	litecoinBlockResolver == null
	|| lotusTipsetResolver == null
)
	throw new Error('resolver binding spec is missing a subject resolver')

describe('Litecoin, Lotus, and IPFS canonical resolver bindings', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('passes the exact Litecoin mainnet binding and rejects another network', async () => {
		getBlock.mockResolvedValueOnce({
			hash: 'litecoin-block',
			height: 2_700_000,
			time: 1_713_484_800,
			merkleroot: 'litecoin-merkle-root',
			nonce: 1,
			difficulty: 1,
			nTx: 0,
			tx: [],
		})

		await litecoinBlockResolver.resolve[
			'NetworkHeightHash'
		].resolve({
			$network: {
				slug: networkBySlug.litecoin.slug,
			},
			height: 2_700_000n,
			hash: 'litecoin-block',
		})

		expect(getBlock).toHaveBeenCalledWith({
			blockHash: 'litecoin-block',
		})
		await expect(litecoinBlockResolver.resolve[
			'NetworkHeightHash'
		].resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			height: 2_700_000n,
			hash: 'litecoin-block',
		})).rejects.toThrow('unsupported Litecoin network')
	})

	it('passes the exact public Lotus mainnet binding and rejects local semantics', async () => {
		getTipSet.mockResolvedValueOnce({
			Cids: [{
				'/': 'bafy-tipset',
			}],
			Blocks: [{
				Miner: 'f01234',
				Parents: [],
				ParentWeight: '0',
				Timestamp: 1_713_484_800,
				Messages: {
					'/': 'bafy-messages',
				},
			}],
			Height: 0,
		})

		await lotusTipsetResolver.resolve[
			'NetworkHeightTipsetKey'
		].resolve({
			$network: {
				slug: networkBySlug.filecoin.slug,
			},
			height: 0n,
			tipsetKey: 'bafy-tipset',
		})

		expect(getTipSet).toHaveBeenCalledWith({
			tipsetKey: [{ '/': 'bafy-tipset' }],
		})
		await expect(lotusTipsetResolver.resolve[
			'NetworkHeightTipsetKey'
		].resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			height: 0n,
			tipsetKey: 'bafy-tipset',
		})).rejects.toThrow('unsupported network')
	})

	it('passes the exact IPFS gateway binding without changing IPNS content identity', async () => {
		fetchBrowseResult.mockResolvedValueOnce({
			namespace: 'ipns',
			target: 'docs.ipfs.tech',
			contentPath: 'concepts',
			gatewayOrigin: 'https://ipfs.io',
			gatewayUrl: 'https://ipfs.io/ipns/docs.ipfs.tech/concepts',
			fileName: 'concepts',
			displayType: 'text',
			isContentTypeInferred: true,
			text: 'IPFS concepts',
		})

		await expect(ipfsResolvers.resolvers[0].resolve[
			'ResourceAddress'
		].resolve({
			namespace: 'ipns',
			target: 'docs.ipfs.tech',
			contentPath: 'concepts',
		})).resolves.toMatchObject({
			namespace: 'ipns',
			target: 'docs.ipfs.tech',
			contentPath: 'concepts',
			canonicalUri: 'ipns://docs.ipfs.tech/concepts',
			gatewayOrigin: 'https://ipfs.io',
			gatewayUrl: 'https://ipfs.io/ipns/docs.ipfs.tech/concepts',
			fileName: 'concepts',
			displayType: 'text',
			isContentTypeInferred: true,
			text: 'IPFS concepts',
		})
		expect(fetchBrowseResult).toHaveBeenCalledWith({
			namespace: 'ipns',
			target: 'docs.ipfs.tech',
			contentPath: 'concepts',
		})

		fetchBrowseResult.mockRejectedValueOnce(new Error('Ipfs_Rest: no configured gateway could fetch the resource'))

		await expect(ipfsResolvers.resolvers[0].resolve[
			'ResourceAddress'
		].resolve({
			namespace: 'ipns',
			target: 'docs.ipfs.tech',
			contentPath: 'missing',
		})).rejects.toThrow('Ipfs_Rest: no configured gateway could fetch the resource')
	})
})

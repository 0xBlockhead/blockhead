import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const threeXplBlockchain = (network: { namespace: string; reference: string }) => {
	if (
		network.namespace === NetworkNamespace.Bip122
		&& network.reference === '000000000019d6689c085ae165831e93'
	) return 'bitcoin'
	if (network.namespace === NetworkNamespace.Zcash && network.reference === '00040fe8ec8471911baa1db1266ea15') return 'zcash'
	if (network.namespace === NetworkNamespace.Solana && network.reference === '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp') return 'solana'
	if (network.namespace === NetworkNamespace.Polkadot && network.reference === '91b171bb158e2d3848fa23a9f1c25182') return 'polkadot'
	if (network.namespace === NetworkNamespace.Near && network.reference === 'mainnet') return 'near'
	if (network.namespace === NetworkNamespace.Monero && network.reference === '418015bb9ae982a1975da7d79277c270') return 'monero'
	if (network.namespace === NetworkNamespace.Litecoin && network.reference === '12a765e31ffd4059bada1e25190f6e98') return 'litecoin'
	if (network.namespace === NetworkNamespace.Dogecoin && network.reference === '1a91e3dace36e2be3bf030a65679fe82') return 'dogecoin'
	if (network.namespace === NetworkNamespace.BitcoinCash && network.reference === '000000000000000000651ef99cb9fcbe') return 'bitcoin-cash'
	if (network.namespace === NetworkNamespace.Tron && network.reference === '0x2b6653dc') return 'tron'
	throw new Error(`ThreeXpl_Rest: unsupported network ${network.namespace}:${network.reference}`)
}

const threeXplStats = async (entityId: { namespace: string; reference: string }) => {
	const { fetchThreeXplChainStats } = await import('$/sources/ThreeXpl/Rest/queries.ts')
	const blockchain = threeXplBlockchain(entityId)
	const stats = await fetchThreeXplChainStats({ from: blockchain })
	const row = stats.data.blockchains?.[blockchain]
	if (row == null) throw new Error(`ThreeXpl_Rest: missing stats for ${blockchain}`)
	return row
}

export default {
	source: Source.ThreeXpl_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: row.data.block?.hash,
					timestampMs: row.data.block?.time == null ? undefined : Date.parse(row.data.block.time),
					transactionCount: row.data.block?.events?.transactions,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				const { fetchThreeXplTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.txId,
				})
				return {
					...(row.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.data.transaction.block),
							},
						},
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [





	],
}

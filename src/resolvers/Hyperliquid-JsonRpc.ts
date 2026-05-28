import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const hyperliquidEvmRpcUrl = 'https://rpc.hyperliquid.xyz/evm'

const assertHyperliquidMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Hyperliquid || network.reference !== 'mainnet') {
		throw new Error(`Hyperliquid_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const hexToBigInt = (hex: string) => BigInt(hex)

const blockTransactionRows = (
	network: {
		namespace: string
		reference: string
	},
	transactions: { hash: string; blockNumber?: string | null; from?: string }[],
) => (
	transactions.map((transaction) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			txHash: transaction.hash,
		},
		actionType: 'evm',
		...(transaction.blockNumber == null ?
				{}
			:	{
				$block: {
					[EntityMetaKey.Id]: {
						$network: network,
						height: hexToBigInt(transaction.blockNumber),
					},
				},
			}
		),
		...(transaction.from == null ?
				{}
			:	{
				$account: {
					[EntityMetaKey.Id]: {
						$network: network,
						address: transaction.from,
					},
				},
			}
		),
	}))
)

export default {
	source: Source.Hyperliquid_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.HyperliquidBlock,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
					height: entityId.height,
					includeTransactions: true,
				})
				if (block == null) throw new Error(`Hyperliquid_JsonRpc: block not found for ${entityId.height.toString()}`)
				return {
					hash: block.hash,
					timestampMs: Number(hexToBigInt(block.timestamp)) * 1000,
					$$transactions: blockTransactionRows(
						entityId.$network,
						block.transactions,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.HyperliquidTransaction,
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const {
					getTransactionByHash,
					getTransactionReceipt,
				} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const transaction = await getTransactionByHash({
					rpcUrl: hyperliquidEvmRpcUrl,
					txHash: entityId.txHash,
				})
				if (transaction == null) throw new Error(`Hyperliquid_JsonRpc: transaction not found for ${entityId.txHash}`)
				const receipt = await getTransactionReceipt({
					rpcUrl: hyperliquidEvmRpcUrl,
					txHash: entityId.txHash,
				})
				return {
					...(transaction.blockNumber != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: hexToBigInt(transaction.blockNumber),
							},
						},
					}),
					...(transaction.from != null && {
						$account: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: transaction.from,
							},
						},
					}),
					actionType: 'evm',
					...(receipt?.status != null && {
						status: receipt.status === '0x1' ? 'success' : 'failed',
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [






		defineEntityFieldResolver({
			entityType: EntityType.HyperliquidBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				assertHyperliquidMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
				const block = await getBlockByNumber({
					rpcUrl: hyperliquidEvmRpcUrl,
					height: entityId.height,
					includeTransactions: true,
				})
				if (block == null) throw new Error(`Hyperliquid_JsonRpc: block not found for ${entityId.height.toString()}`)
				return blockTransactionRows(
					entityId.$network,
					block.transactions,
				)
			},
		}),
	],
}

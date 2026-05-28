import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { PolkadotRpcBlock } from '$/sources/Polkadot/JsonRpc/types.ts'

const polkadotRpcUrl = 'https://rpc.polkadot.io'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertPolkadotMainnet = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'polkadot' || network.caip2.reference !== '91b171bb158e2d3848fa23a9f1c25182') {
		throw new Error('Polkadot_JsonRpc: unsupported network')
	}
}

const blockNumberFromHeader = (header: { number: string }) => BigInt(header.number)

const polkadotExtrinsicRows = (
	network: NetworkId,
	block: PolkadotRpcBlock,
) => (
	block.block.extrinsics.map((_extrinsic, extrinsicIndex) => ({
		[EntityMetaKey.Id]: {
			$block: {
				$network: network,
				blockNumber: blockNumberFromHeader(block.block.header),
			},
			extrinsicIndex,
		},
	}))
)

export default {
	source: Source.Polkadot_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const hash = entityId.hash ?? await getBlockHash({
					rpcUrl: polkadotRpcUrl,
					blockNumber: entityId.blockNumber,
				})
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
					blockHash: hash,
				})
				return {
					hash,
					...(entityId.blockNumber > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: blockNumberFromHeader(block.block.header) - 1n,
								hash: block.block.header.parentHash,
							},
						},
					}),
					stateRoot: block.block.header.stateRoot,
					extrinsicsRoot: block.block.header.extrinsicsRoot,
					$$extrinsics: polkadotExtrinsicRows(
						entityId.$network,
						block,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
					blockHash: entityId.$block.hash ?? await getBlockHash({
						rpcUrl: polkadotRpcUrl,
						blockNumber: entityId.$block.blockNumber,
					}),
				})
				if (block.block.extrinsics[entityId.extrinsicIndex] == null) {
					throw new Error(`Polkadot_JsonRpc: extrinsic not found for ${entityId.$block.blockNumber.toString()}:${entityId.extrinsicIndex}`)
				}
				return {}
			},
		}),
	],

	entityFieldResolvers: [




		defineEntityFieldResolver({
			entityType: EntityType.PolkadotBlock,
			fieldName: '$parent',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				if (entityId.blockNumber === 0n) throw new Error('Polkadot_JsonRpc: genesis block has no parent')
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: polkadotRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: polkadotRpcUrl,
						blockNumber: entityId.blockNumber,
					}),
				})
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						blockNumber: blockNumberFromHeader(block.block.header) - 1n,
						hash: block.block.header.parentHash,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotBlock,
			fieldName: '$$extrinsics',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Polkadot/JsonRpc/queries.ts')
				return polkadotExtrinsicRows(
					entityId.$network,
					await getBlock({
						rpcUrl: polkadotRpcUrl,
						blockHash: entityId.hash ?? await getBlockHash({
							rpcUrl: polkadotRpcUrl,
							blockNumber: entityId.blockNumber,
						}),
					}),
				)
			},
		}),
	],
}

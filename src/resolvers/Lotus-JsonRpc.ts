import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	filecoinMainnetCaip2,
	lotusMainnetRpcUrl as lotusRpcUrl,
} from '$/constants/FilecoinNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { LotusTipset } from '$/sources/Lotus/JsonRpc/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertFilecoinMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== filecoinMainnetCaip2.namespace
		|| network.caip2.reference !== filecoinMainnetCaip2.reference
	) {
		throw new Error('Lotus_JsonRpc: unsupported network')
	}
}

const tipsetKey = (tipsetKeyCids: { '/': string }[]) => (
	tipsetKeyCids.map((cid) => cid['/']).join(',')
)

const blockRows = (
	network: NetworkId,
	tipset: LotusTipset,
) => (
	tipset.Blocks.map((block, blockIndex) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			cid: tipset.Cids[blockIndex]?.['/'] ?? block.Messages['/'],
		},
		$tipset: {
			[EntityMetaKey.Id]: {
				$network: network,
				height: BigInt(tipset.Height),
				tipsetKey: tipsetKey(tipset.Cids),
			},
		},
		$miner: {
			[EntityMetaKey.Id]: {
				$network: network,
				minerAddress: block.Miner,
			},
		},
		ticketVrFProof: block.Ticket?.VRFProof,
		winCount: block.ElectionProof?.WinCount,
	}))
)

const minerRows = (
	network: NetworkId,
	tipset: LotusTipset,
) => (
	tipset.Blocks.map((block) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			minerAddress: block.Miner,
		},
	}))
)

const sectorRows = async (entityId: {
	$network: NetworkId
	minerAddress: string
}) => {
	assertFilecoinMainnet(entityId.$network)
	const { getMinerSectors } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	return (await getMinerSectors({
		rpcUrl: lotusRpcUrl,
		minerAddress: entityId.minerAddress,
	})).map((sector) => ({
		[EntityMetaKey.Id]: {
			$miner: entityId,
			sectorNumber: BigInt(sector.SectorNumber),
		},
		...(sector.SealedCID != null && {
			sealedCid: sector.SealedCID['/'],
		}),
		activationEpoch: BigInt(sector.Activation),
		expirationEpoch: BigInt(sector.Expiration),
	}))
}

export default {
	source: Source.Lotus_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FilecoinNetwork,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					rpcEndpoints: [
						{
							url: lotusRpcUrl,
							transportType: TransportType.Http,
							providerName: 'GLIF',
						},
					],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinNetwork_Timestamp,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const {
					getHead,
					getMinerPower,
					getNetworkVersion,
					getVersion,
				} = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				const [
					lotusVersion,
					networkVersion,
					power,
				] = await Promise.all([
					getVersion({ rpcUrl: lotusRpcUrl }),
					getNetworkVersion({
						rpcUrl: lotusRpcUrl,
						tipsetKey: head.Cids,
					}),
					head.Blocks[0]?.Miner == null ?
						undefined
					:
						getMinerPower({
							rpcUrl: lotusRpcUrl,
							minerAddress: head.Blocks[0].Miner,
							tipsetKey: head.Cids,
						}).catch(() => undefined),
				])
				return {
					headHeight: BigInt(head.Height),
					headTipsetKey: tipsetKey(head.Cids),
					headBlockCount: head.Blocks.length,
					headTimestampMs: head.Blocks[0]?.Timestamp == null ? undefined : head.Blocks[0].Timestamp * 1000,
					networkVersion,
					lotusVersion: lotusVersion.Version,
					lotusAgent: lotusVersion.Agent,
					blockDelaySeconds: lotusVersion.BlockDelay,
					...(power?.TotalPower.RawBytePower != null && {
						totalRawBytePower: BigInt(power.TotalPower.RawBytePower),
					}),
					...(power?.TotalPower.QualityAdjPower != null && {
						totalQualityAdjustedPower: BigInt(power.TotalPower.QualityAdjPower),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinTipset,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const tipset = await getTipSetByHeight({
					rpcUrl: lotusRpcUrl,
					height: entityId.height,
				})
				return {
					...(entityId.height > 0n && tipset.Blocks[0]?.Parents != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
								tipsetKey: tipsetKey(tipset.Blocks[0].Parents),
							},
						},
						parentWeight: BigInt(tipset.Blocks[0].ParentWeight),
					}),
					timestampMs: tipset.Blocks[0]?.Timestamp == null ? undefined : tipset.Blocks[0].Timestamp * 1000,
					$$blocks: blockRows(
						entityId.$network,
						tipset,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinBlock,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				const block = blockRows(
					entityId.$network,
					head,
				).find((sector) => sector[EntityMetaKey.Id].cid === entityId.cid)
				if (block == null) throw new Error(`Lotus_JsonRpc: block not found for ${entityId.cid}`)
				return block
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinSector,
			resolve: async (entityId) => {
				const sector = (await sectorRows(entityId.$miner)).find((sector) => (
					sector[EntityMetaKey.Id].sectorNumber === entityId.sectorNumber
				))
				if (sector == null) throw new Error(`Lotus_JsonRpc: sector not found for ${entityId.$miner.minerAddress}:${entityId.sectorNumber.toString()}`)
				return sector
			},
		}),

		defineEntityResolver({
			entityType: EntityType.FilecoinActor,
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { stateGetActor } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const actor = await stateGetActor({
					rpcUrl: lotusRpcUrl,
					address: entityId.address,
				})
				return {
					actorCodeCid: actor.Code['/'],
					nonce: BigInt(actor.Nonce),
					balanceAttoFil: BigInt(actor.Balance),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FilecoinNetwork,
			fieldName: 'rpcEndpoints',
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId)
				return [
					{
						url: lotusRpcUrl,
						transportType: TransportType.Http,
						providerName: 'GLIF',
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FilecoinNetwork,
			fieldName: '$headTipset',
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: BigInt(head.Height),
						tipsetKey: tipsetKey(head.Cids),
					},
					timestampMs: head.Blocks[0]?.Timestamp == null ? undefined : head.Blocks[0].Timestamp * 1000,
					$$blocks: blockRows(
						entityId,
						head,
					),
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FilecoinNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FilecoinNetwork,
			fieldName: '$$headMiners',
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				return minerRows(
					entityId,
					await getHead({ rpcUrl: lotusRpcUrl }),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FilecoinNetwork,
			fieldName: '$$tipsets',
			resolve: async (entityId, context) => {
				assertFilecoinMainnet(entityId)
				const {
					getTipSetByHeight,
					getHead,
				} = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				return Promise.all(Array.from({
					length: Math.min(
						Number(BigInt(head.Height) + 1n),
						resolverLoadSubsetRowLimit(context),
					),
				}, async (_value, tipsetOffset) => {
					const tipset = (
						tipsetOffset === 0 ?
							head
						:
							await getTipSetByHeight({
								rpcUrl: lotusRpcUrl,
								height: BigInt(head.Height) - BigInt(tipsetOffset),
							})
					)
					return {
						[EntityMetaKey.Id]: {
							$network: entityId,
							height: BigInt(tipset.Height),
							tipsetKey: tipsetKey(tipset.Cids),
						},
						timestampMs: tipset.Blocks[0]?.Timestamp == null ? undefined : tipset.Blocks[0].Timestamp * 1000,
						$$blocks: blockRows(
							entityId,
							tipset,
						),
					}
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FilecoinTipset,
			fieldName: '$$blocks',
			resolve: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				return blockRows(
					entityId.$network,
					await getTipSetByHeight({
						rpcUrl: lotusRpcUrl,
						height: entityId.height,
					}),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FilecoinMiner,
			fieldName: '$$sectors',
			resolve: async (entityId, context) => (
				(await sectorRows(entityId)).slice(
					0,
					resolverLoadSubsetRowLimit(context),
				)
			),
		}),
	],
}

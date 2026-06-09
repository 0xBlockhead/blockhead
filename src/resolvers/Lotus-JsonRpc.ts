import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	filecoinMainnetCaip2,
	lotusMainnetRpcUrl as lotusRpcUrl,
} from '$/constants/FilecoinNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
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

	resolvers: [
		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			}
		})({
				fields: {
			$network: (network) => network.$network,
			rpcEndpoints: (network) => network.rpcEndpoints,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
					headTimestampMs: head.Blocks[0].Timestamp * 1000,
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
			}
			}
		})({
				fields: {
			headHeight: (timestamp) => timestamp.headHeight,
			headTipsetKey: (timestamp) => timestamp.headTipsetKey,
			headBlockCount: (timestamp) => timestamp.headBlockCount,
			headTimestampMs: (timestamp) => timestamp.headTimestampMs,
			networkVersion: (timestamp) => timestamp.networkVersion,
			lotusVersion: (timestamp) => timestamp.lotusVersion,
			lotusAgent: (timestamp) => timestamp.lotusAgent,
			blockDelaySeconds: (timestamp) => timestamp.blockDelaySeconds,
			totalRawBytePower: (timestamp) => timestamp.totalRawBytePower,
			totalQualityAdjustedPower: (timestamp) => timestamp.totalQualityAdjustedPower,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinTipset,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const tipset = await getTipSetByHeight({
					rpcUrl: lotusRpcUrl,
					height: entityId.height,
				})
				return {
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
								tipsetKey: tipsetKey(tipset.Blocks[0].Parents),
							},
						},
						parentWeight: BigInt(tipset.Blocks[0].ParentWeight),
					}),
					timestampMs: tipset.Blocks[0].Timestamp * 1000,
					$$blocks: blockRows(
						entityId.$network,
						tipset,
					),
				}
			}
			}
		})({
				fields: {
			$parent: (tipset) => tipset.$parent,
			parentWeight: (tipset) => tipset.parentWeight,
			timestampMs: (tipset) => tipset.timestampMs,
			$$blocks: (tipset) => tipset.$$blocks,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				const block = blockRows(
					entityId.$network,
					head,
				).find((sector) => sector[EntityMetaKey.Id].cid === entityId.cid)
				if (block == null) throw new Error(`Lotus_JsonRpc: block not found for ${entityId.cid}`)
				return block
			}
			}
		})({
				fields: {
			$tipset: (block) => block.$tipset,
			$miner: (block) => block.$miner,
			ticketVrFProof: (block) => block.ticketVrFProof,
			winCount: (block) => block.winCount,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinSector,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const sector = (await sectorRows(entityId.$miner)).find((sector) => (
					sector[EntityMetaKey.Id].sectorNumber === entityId.sectorNumber
				))
				if (sector == null) throw new Error(`Lotus_JsonRpc: sector not found for ${entityId.$miner.minerAddress}:${entityId.sectorNumber.toString()}`)
				return sector
			}
			}
		})({
				fields: {
			sealedCid: (sector) => sector.sealedCid,
			activationEpoch: (sector) => sector.activationEpoch,
			expirationEpoch: (sector) => sector.expirationEpoch,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinActor,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getActor } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const actor = await getActor({
					rpcUrl: lotusRpcUrl,
					address: entityId.address,
				})
				return {
					actorCodeCid: actor.Code['/'],
					nonce: BigInt(actor.Nonce),
					balanceAttoFil: BigInt(actor.Balance),
				}
			}
			}
		})({
				fields: {
			actorCodeCid: (actor) => actor.actorCodeCid,
			nonce: (actor) => actor.nonce,
			balanceAttoFil: (actor) => actor.balanceAttoFil,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId)
				return [
					{
						url: lotusRpcUrl,
						transportType: TransportType.Http,
						providerName: 'GLIF',
					},
				]
			}
			}
		})({
				fields: {
			rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: BigInt(head.Height),
						tipsetKey: tipsetKey(head.Cids),
					},
					timestampMs: head.Blocks[0].Timestamp * 1000,
					$$blocks: blockRows(
						entityId,
						head,
					),
				}
			}
			}
		})({
				fields: {
			$headTipset: (headTipset) => headTipset,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			}
			}
		})({
				fields: {
			$$timestamps: (timestamps) => timestamps,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				return minerRows(
					entityId,
					await getHead({ rpcUrl: lotusRpcUrl }),
				)
			}
			}
		})({
				fields: {
			$$headMiners: (headMiners) => headMiners,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertFilecoinMainnet(entityId)
				const {
					getTipSetByHeight,
					getHead,
				} = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				return Promise.all(Array.from({
					length: Math.min(
						Number(BigInt(head.Height) + 1n),
						resolverContextRowLimit(context),
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
						timestampMs: tipset.Blocks[0].Timestamp * 1000,
						$$blocks: blockRows(
							entityId,
							tipset,
						),
					}
				}))
			}
			}
		})({
				fields: {
			$$tipsets: (tipsets) => tipsets,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinTipset,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertFilecoinMainnet(entityId.$network)
				const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				return blockRows(
					entityId.$network,
					await getTipSetByHeight({
						rpcUrl: lotusRpcUrl,
						height: entityId.height,
					}),
				)
			}
			}
		})({
				fields: {
			$$blocks: (blocks) => blocks,
		},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinMiner,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => (
				(await sectorRows(entityId)).slice(
					0,
					resolverContextRowLimit(context),
				)
			)
			}
		})({
				fields: {
			$$sectors: (sectors) => sectors,
		},
			}),
	],
}

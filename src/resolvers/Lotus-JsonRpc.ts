import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	filecoinMainnetCaip2,
	lotusMainnetRpcUrl as lotusRpcUrl,
} from '$/constants/FilecoinNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { LotusTipset } from '$/sources/Lotus/JsonRpc/types.ts'
import { FilecoinNetworkSelector } from '$/schema/FilecoinNetwork.ts'
import { FilecoinNetwork_TimestampSelector } from '$/schema/FilecoinNetwork_Timestamp.ts'
import { FilecoinTipsetSelector } from '$/schema/FilecoinTipset.ts'
import { FilecoinBlockSelector } from '$/schema/FilecoinBlock.ts'
import { FilecoinSectorSelector } from '$/schema/FilecoinSector.ts'
import { FilecoinActorSelector } from '$/schema/FilecoinActor.ts'
import { FilecoinMinerSelector } from '$/schema/FilecoinMiner.ts'

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
		[EntityMetaKey.Selector]: {
			$network: network,
			cid: tipset.Cids[blockIndex]?.['/'] ?? block.Messages['/'],
		},
		$tipset: {
			[EntityMetaKey.Selector]: {
				$network: network,
				height: BigInt(tipset.Height),
				tipsetKey: tipsetKey(tipset.Cids),
			},
		},
		$miner: {
			[EntityMetaKey.Selector]: {
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
		[EntityMetaKey.Selector]: {
			$network: network,
			minerAddress: block.Miner,
		},
	}))
)

const sectorRows = async ({ $network, minerAddress }: {
	$network: NetworkId
	minerAddress: string
}) => {
	assertFilecoinMainnet($network)
	const { getMinerSectors } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	return (await getMinerSectors({
		rpcUrl: lotusRpcUrl,
		minerAddress: minerAddress,
	})).map((sector) => ({
		[EntityMetaKey.Selector]: {
			$miner: entitySelector,
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
				[FilecoinNetworkSelector.Network]: async (entitySelector) => {
				assertFilecoinMainnet(entitySelector)
				return {
					$network: {
						[EntityMetaKey.Selector]: entitySelector,
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
				[FilecoinNetwork_TimestampSelector.NetworkTimestampMs]: async ({ $network }) => {
				assertFilecoinMainnet($network)
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
				[FilecoinTipsetSelector.NetworkHeightTipsetKey]: async ({ $network, height }) => {
				assertFilecoinMainnet($network)
				const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const tipset = await getTipSetByHeight({
					rpcUrl: lotusRpcUrl,
					height: height,
				})
				return {
					...(height > 0n && {
						$parent: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: height - 1n,
								tipsetKey: tipsetKey(tipset.Blocks[0].Parents),
							},
						},
						parentWeight: BigInt(tipset.Blocks[0].ParentWeight),
					}),
					timestampMs: tipset.Blocks[0].Timestamp * 1000,
					$$blocks: blockRows(
						$network,
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
				[FilecoinBlockSelector.NetworkCid]: async ({ $network, cid }) => {
				assertFilecoinMainnet($network)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				const block = blockRows(
					$network,
					head,
				).find((sector) => sector[EntityMetaKey.Selector].cid === entitySelector.cid)
				if (block == null) throw new Error(`Lotus_JsonRpc: block not found for ${cid}`)
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
				[FilecoinSectorSelector.FilecoinMinerSectorNumber]: async ({ $miner, sectorNumber }) => {
				const sector = (await sectorRows($miner)).find((sector) => (
					sector[EntityMetaKey.Selector].sectorNumber === entitySelector.sectorNumber
				))
				if (sector == null) throw new Error(`Lotus_JsonRpc: sector not found for ${$miner.minerAddress}:${sectorNumber.toString()}`)
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
				[FilecoinActorSelector.NetworkAddress]: async ({ $network, address }) => {
				assertFilecoinMainnet($network)
				const { getActor } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const actor = await getActor({
					rpcUrl: lotusRpcUrl,
					address: address,
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
				[FilecoinNetworkSelector.Network]: async (entitySelector) => {
				assertFilecoinMainnet(entitySelector)
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
				[FilecoinNetworkSelector.Network]: async (entitySelector) => {
				assertFilecoinMainnet(entitySelector)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				const head = await getHead({ rpcUrl: lotusRpcUrl })
				return {
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						height: BigInt(head.Height),
						tipsetKey: tipsetKey(head.Cids),
					},
					timestampMs: head.Blocks[0].Timestamp * 1000,
					$$blocks: blockRows(
						entitySelector,
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
				[FilecoinNetworkSelector.Network]: async (entitySelector) => {
				assertFilecoinMainnet(entitySelector)
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
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
				[FilecoinNetworkSelector.Network]: async (entitySelector) => {
				assertFilecoinMainnet(entitySelector)
				const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				return minerRows(
					entitySelector,
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
				[FilecoinNetworkSelector.Network]: async (entitySelector, context) => {
				assertFilecoinMainnet(entitySelector)
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
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							height: BigInt(tipset.Height),
							tipsetKey: tipsetKey(tipset.Cids),
						},
						timestampMs: tipset.Blocks[0].Timestamp * 1000,
						$$blocks: blockRows(
							entitySelector,
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
				[FilecoinTipsetSelector.NetworkHeightTipsetKey]: async ({ $network, height }) => {
				assertFilecoinMainnet($network)
				const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
				return blockRows(
					$network,
					await getTipSetByHeight({
						rpcUrl: lotusRpcUrl,
						height: height,
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
				[FilecoinMinerSelector.NetworkMinerAddress]: async (entitySelector, context) => (
				(await sectorRows(entitySelector)).slice(
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

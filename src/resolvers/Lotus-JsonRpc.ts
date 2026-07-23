import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	filecoinNetworkBySlug,
} from '$/constants/FilecoinNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { LotusTipset } from '$/sources/Lotus/JsonRpc/types.ts'
import { FilecoinNetworkSelector } from '$/schema/FilecoinNetwork.ts'
import { FilecoinNetwork_TimestampSelector } from '$/schema/FilecoinNetwork_Timestamp.ts'
import { FilecoinTipsetSelector } from '$/schema/FilecoinTipset.ts'
import { FilecoinBlockSelector } from '$/schema/FilecoinBlock.ts'
import { FilecoinSectorSelector } from '$/schema/FilecoinSector.ts'
import { FilecoinActorSelector } from '$/schema/FilecoinActor.ts'
import { FilecoinMinerSelector } from '$/schema/FilecoinMiner.ts'
import { FilecoinActor_TimestampSelector } from '$/schema/FilecoinActor_Timestamp.ts'
import { FilecoinMiner_TimestampSelector } from '$/schema/FilecoinMiner_Timestamp.ts'
import { FilecoinSector_TimestampSelector } from '$/schema/FilecoinSector_Timestamp.ts'
import { NetworkSelector } from '$/schema/Network.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertFilecoinMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== filecoinNetworkBySlug.filecoin.caip2.namespace
				|| network.caip2.reference !== filecoinNetworkBySlug.filecoin.caip2.reference
			)
		:
			network.slug !== filecoinNetworkBySlug.filecoin.slug
	)
		throw new Error('Lotus_JsonRpc: unsupported network')
}

const tipsetKey = (tipsetKeyCids: { '/': string }[]) => (
	tipsetKeyCids.map((cid) => cid['/']).join(',')
)

const blockRows = (
	network: NetworkId,
	tipset: LotusTipset
) => (
	tipset.Blocks.map((block, blockIndex) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			cid: tipset.Cids[blockIndex]?.['/'] ?? block.Messages['/'],
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(tipset.Height),
					tipsetKey: tipsetKey(tipset.Cids),
				},
			},
			[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					minerAddress: block.Miner,
				},
			},
			...(block.Ticket?.VRFProof != null && {
				[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'ticketVrFProof')]: block.Ticket.VRFProof,
			}),
			...(block.ElectionProof?.WinCount != null && {
				[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'winCount')]: block.ElectionProof.WinCount,
			}),
		},
	}))
)

const sectorRows = async ({ $network, minerAddress, tipsetKey }: {
	$network: NetworkId
	minerAddress: string
	tipsetKey: LotusTipset['Cids']
}) => {
	assertFilecoinMainnet($network)
	const { getMinerSectors } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	return (await getMinerSectors({
		rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
		minerAddress: minerAddress,
		tipsetKey,
	})).map((sector) => ({
		[EntityMetaKey.Selector]: {
			$miner: {
				$network,
				minerAddress,
			},
			sectorNumber: BigInt(sector.SectorNumber),
		},
		[EntityMetaKey.Fields]: {
			...(sector.SealedCID != null && {
				[entityFieldAddressKey(EntityType.FilecoinSector, [], 'sealedCid')]: sector.SealedCID['/'],
			}),
			[entityFieldAddressKey(EntityType.FilecoinSector, [], 'activationEpoch')]: BigInt(sector.Activation),
			[entityFieldAddressKey(EntityType.FilecoinSector, [], 'expirationEpoch')]: BigInt(sector.Expiration),
		},
	}))
}

export default {
	source: Source.Lotus_JsonRpc,

	resolvers: [
		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[FilecoinNetworkSelector.Network]: {
					resolve: async ({ $network }) => {
						assertFilecoinMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							rpcEndpoints: [
								{
									url: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
									transportType: TransportType.Http,
									providerName: 'GLIF',
								},
							],
						}
					},
				}
			},
		})({
				$network: (network) => network.$network,
				rpcEndpoints: (network) => network.rpcEndpoints,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: {
					resolve: async (network) => {
						assertFilecoinMainnet(network)
						return {
							filecoinRpcEndpoints: [
								{
									url: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
									transportType: TransportType.Http,
									providerName: 'GLIF',
								},
							],
						}
					},
				}
			},
		})({
				Filecoin: {
					rpcEndpoints: (network) => network.filecoinRpcEndpoints,
				},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork_Timestamp,
			resolve: {
				[FilecoinNetwork_TimestampSelector.NetworkTimestampMsSource]: {
					resolve: async ({ $network }) => {
						assertFilecoinMainnet($network)
						const {
							getHead,
							getMinerPower,
							getNetworkVersion,
							getVersion,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						const [
							lotusVersion,
							networkVersion,
							power,
						] = await Promise.all([
							getVersion({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl }),
							getNetworkVersion({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								tipsetKey: head.Cids,
							}),
							getMinerPower({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								minerAddress: head.Blocks[0].Miner,
								tipsetKey: head.Cids,
							}).catch(() => undefined),
						])
						return {
							headHeight: BigInt(head.Height),
							headTipsetKey: tipsetKey(head.Cids),
							headBlockCount: head.Blocks.length,
							headTimestampMs: head.Blocks[0].Timestamp * 1000,
							$headTipset: {
								[EntityMetaKey.Selector]: {
									$network,
									height: BigInt(head.Height),
									tipsetKey: tipsetKey(head.Cids),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FilecoinTipset, [], 'timestampMs')]: head.Blocks[0].Timestamp * 1000,
									[entityFieldAddressKey(EntityType.FilecoinTipset, [], '$$blocks')]: blockRows(
										$network,
										head
									),
								},
							},
							$$headMiners: head.Blocks.map((block) => ({
								[EntityMetaKey.Selector]: {
									$network,
									minerAddress: block.Miner,
								},
							})),
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
				}
			},
		})({
				headHeight: (timestamp) => timestamp.headHeight,
				headTipsetKey: (timestamp) => timestamp.headTipsetKey,
				headBlockCount: (timestamp) => timestamp.headBlockCount,
				headTimestampMs: (timestamp) => timestamp.headTimestampMs,
				$headTipset: (timestamp) => timestamp.$headTipset,
				$$headMiners: (timestamp) => timestamp.$$headMiners,
				networkVersion: (timestamp) => timestamp.networkVersion,
				lotusVersion: (timestamp) => timestamp.lotusVersion,
				lotusAgent: (timestamp) => timestamp.lotusAgent,
				blockDelaySeconds: (timestamp) => timestamp.blockDelaySeconds,
				totalRawBytePower: (timestamp) => timestamp.totalRawBytePower,
				totalQualityAdjustedPower: (timestamp) => timestamp.totalQualityAdjustedPower,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinTipset,
			resolve: {
				[FilecoinTipsetSelector.NetworkHeightTipsetKey]: {
					resolve: async ({ $network, height }) => {
						assertFilecoinMainnet($network)
						const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const tipset = await getTipSetByHeight({
							rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
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
							}),
							[EntityMetaKey.Fields]: {
								...(height > 0n && {
									[entityFieldAddressKey(EntityType.FilecoinTipset, [], 'parentWeight')]: BigInt(tipset.Blocks[0].ParentWeight),
								}),
								[entityFieldAddressKey(EntityType.FilecoinTipset, [], 'timestampMs')]: tipset.Blocks[0].Timestamp * 1000,
								[entityFieldAddressKey(EntityType.FilecoinTipset, [], '$$blocks')]: blockRows($network, tipset),
							},
						}
					},
				}
			},
		})({
				$parent: (tipset) => tipset.$parent,
				parentWeight: (tipset) => tipset.parentWeight,
				timestampMs: (tipset) => tipset.timestampMs,
				$$blocks: (tipset) => tipset.$$blocks,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinBlock,
			resolve: {
				[FilecoinBlockSelector.NetworkCid]: {
					resolve: async ({ $network, cid }) => {
						assertFilecoinMainnet($network)
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						const block = blockRows(
							$network,
							head
						).find((sector) => sector[EntityMetaKey.Selector].cid === cid)
						if (block == null) throw new Error(`Lotus_JsonRpc: block not found for ${cid}`)
						return block
					},
				}
			},
		})({
				$tipset: (block) => block[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')],
				$miner: (block) => block[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')],
				ticketVrFProof: (block) => block[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinBlock, [], 'ticketVrFProof')],
				winCount: (block) => block[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinBlock, [], 'winCount')],
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinSector,
			resolve: {
				[FilecoinSectorSelector.FilecoinMinerSectorNumber]: {
					resolve: async ({ $miner, sectorNumber }) => {
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						const sector = (await sectorRows({
							...$miner,
							tipsetKey: head.Cids,
						})).find((sector) => (
							sector[EntityMetaKey.Selector].sectorNumber === sectorNumber
						))
						if (sector == null) throw new Error(`Lotus_JsonRpc: sector not found for ${$miner.minerAddress}:${sectorNumber.toString()}`)
						return sector
					},
				}
			},
		})({
				sealedCid: (sector) => sector[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinSector, [], 'sealedCid')],
				activationEpoch: (sector) => sector[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinSector, [], 'activationEpoch')],
				expirationEpoch: (sector) => sector[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.FilecoinSector, [], 'expirationEpoch')],
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinActor,
			resolve: {
				[FilecoinActorSelector.NetworkAddress]: {
					resolve: async ({ $network, address }) => {
						assertFilecoinMainnet($network)
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						return {
							$$timestamps: [{
								$actor: {
									$network,
									address,
								},
								height: BigInt(head.Height),
								tipsetKey: tipsetKey(head.Cids),
								source: Source.Lotus_JsonRpc,
							}],
						}
					},
				}
			},
		})({
				$$timestamps: (actor) => actor.$$timestamps,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinActor_Timestamp,
			resolve: {
				[FilecoinActor_TimestampSelector.ActorHeightTipsetKeySource]: {
					resolve: async ({ $actor, height, tipsetKey: selectorTipsetKey, source }) => {
						assertFilecoinMainnet($actor.$network)
						if (source !== Source.Lotus_JsonRpc)
							throw new Error(`Lotus_JsonRpc: unsupported actor observation source ${source}`)

						const {
							getActor,
							getIdAddress,
							getTipSetByHeight,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const tipset = await getTipSetByHeight({
							rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
							height,
						})
						if (BigInt(tipset.Height) !== height || tipsetKey(tipset.Cids) !== selectorTipsetKey)
							throw new Error(`Lotus_JsonRpc: actor observation does not match ${height.toString()}/${selectorTipsetKey}`)
						const timestamp = tipset.Blocks.at(0)?.Timestamp
						if (timestamp == null)
							throw new Error(`Lotus_JsonRpc: actor observation ${height.toString()}/${selectorTipsetKey} has no timestamp`)
						const [actor, idAddress] = await Promise.all([
							getActor({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								address: $actor.address,
								tipsetKey: tipset.Cids,
							}),
							getIdAddress({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								address: $actor.address,
								tipsetKey: tipset.Cids,
							}),
						])
						return {
							timestampMs: timestamp * 1000,
							height: BigInt(tipset.Height),
							tipsetKey: tipsetKey(tipset.Cids),
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network: $actor.$network,
									height: BigInt(tipset.Height),
									tipsetKey: tipsetKey(tipset.Cids),
								},
							},
							idAddress,
							actorCodeCid: actor.Code['/'],
							nonce: BigInt(actor.Nonce),
							balanceAttoFil: BigInt(actor.Balance),
							stateRootCid: actor.Head['/'],
						}
					},
				}
			},
		})({
				timestampMs: (timestamp) => timestamp.timestampMs,
				height: (timestamp) => timestamp.height,
				tipsetKey: (timestamp) => timestamp.tipsetKey,
				$tipset: (timestamp) => timestamp.$tipset,
				idAddress: (timestamp) => timestamp.idAddress,
				actorCodeCid: (timestamp) => timestamp.actorCodeCid,
				nonce: (timestamp) => timestamp.nonce,
				balanceAttoFil: (timestamp) => timestamp.balanceAttoFil,
				stateRootCid: (timestamp) => timestamp.stateRootCid,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinSector_Timestamp,
			resolve: {
				[FilecoinSector_TimestampSelector.SectorTimestampMsSource]: {
					resolve: async ({ $sector }) => {
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						const sector = (await sectorRows({
							$network: $sector.$miner.$network,
							minerAddress: $sector.$miner.minerAddress,
							tipsetKey: head.Cids,
						})).find((sector) => (
							sector[EntityMetaKey.Selector].sectorNumber === $sector.sectorNumber
						))
						if (sector == null) throw new Error(`Lotus_JsonRpc: sector not found for ${$sector.$miner.minerAddress}:${$sector.sectorNumber.toString()}`)
						return sector
					},
				}
			},
		})({
				sealedCid: (timestamp) => timestamp.sealedCid,
				activationEpoch: (timestamp) => timestamp.activationEpoch,
				expirationEpoch: (timestamp) => timestamp.expirationEpoch,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinMiner_Timestamp,
			resolve: {
				[FilecoinMiner_TimestampSelector.MinerHeightTipsetKeySource]: {
					resolve: async ({ $miner, height, tipsetKey: selectorTipsetKey, source }) => {
						assertFilecoinMainnet($miner.$network)
						if (source !== Source.Lotus_JsonRpc)
							throw new Error(`Lotus_JsonRpc: unsupported miner observation source ${source}`)

						const {
							getHead,
							getMinerInfo,
							getMinerPower,
							getMinerSectorCount,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						if (BigInt(head.Height) !== height || tipsetKey(head.Cids) !== selectorTipsetKey)
							throw new Error(`Lotus_JsonRpc: miner observation ${height.toString()}/${selectorTipsetKey} is not the current head`)

						const [
							minerInfo,
							minerPower,
							sectorCount,
						] = await Promise.all([
							getMinerInfo({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								minerAddress: $miner.minerAddress,
								tipsetKey: head.Cids,
							}),
							getMinerPower({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								minerAddress: $miner.minerAddress,
								tipsetKey: head.Cids,
							}),
							getMinerSectorCount({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								minerAddress: $miner.minerAddress,
								tipsetKey: head.Cids,
							}),
						])
						return {
							height: BigInt(head.Height),
							tipsetKey: tipsetKey(head.Cids),
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network: $miner.$network,
									height: BigInt(head.Height),
									tipsetKey: tipsetKey(head.Cids),
								},
							},
							$owner: {
								[EntityMetaKey.Selector]: {
									$network: $miner.$network,
									address: minerInfo.Owner,
								},
							},
							$worker: {
								[EntityMetaKey.Selector]: {
									$network: $miner.$network,
									address: minerInfo.Worker,
								},
							},
							peerId: minerInfo.PeerId,
							rawBytePower: BigInt(minerPower.MinerPower.RawBytePower),
							qualityAdjustedPower: BigInt(minerPower.MinerPower.QualityAdjPower),
							networkRawBytePower: BigInt(minerPower.TotalPower.RawBytePower),
							networkQualityAdjustedPower: BigInt(minerPower.TotalPower.QualityAdjPower),
							liveSectorCount: sectorCount.Live,
							faultySectorCount: sectorCount.Faulty,
						}
					},
				}
			},
		})({
				height: (timestamp) => timestamp.height,
				tipsetKey: (timestamp) => timestamp.tipsetKey,
				$tipset: (timestamp) => timestamp.$tipset,
				$owner: (timestamp) => timestamp.$owner,
				$worker: (timestamp) => timestamp.$worker,
				peerId: (timestamp) => timestamp.peerId,
				rawBytePower: (timestamp) => timestamp.rawBytePower,
				qualityAdjustedPower: (timestamp) => timestamp.qualityAdjustedPower,
				networkRawBytePower: (timestamp) => timestamp.networkRawBytePower,
				networkQualityAdjustedPower: (timestamp) => timestamp.networkQualityAdjustedPower,
				liveSectorCount: (timestamp) => timestamp.liveSectorCount,
				faultySectorCount: (timestamp) => timestamp.faultySectorCount,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[FilecoinNetworkSelector.Network]: {
					resolve: async ({ $network }) => {
						assertFilecoinMainnet($network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: $network,
									timestampMs: Date.now(),
									source: Source.Lotus_JsonRpc,
								},
							},
						]
					},
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: {
					resolve: async (network) => {
						assertFilecoinMainnet(network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: Date.now(),
									source: Source.Lotus_JsonRpc,
								},
							},
						]
					},
				}
			},
		})({
				Filecoin: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				[FilecoinNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertFilecoinMainnet($network)
						const {
							getTipSetByHeight,
							getHead,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						return Promise.all(Array.from({
							length: Math.min(
								Number(BigInt(head.Height) + 1n),
								resolverContextRowLimit(context)
							),
						}, async (_value, tipsetOffset) => {
							const tipset = (
								tipsetOffset === 0 ?
									head
								:
									await getTipSetByHeight({
										rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
										height: BigInt(head.Height) - BigInt(tipsetOffset),
									})
							)
							return {
								[EntityMetaKey.Selector]: {
									$network: $network,
									height: BigInt(tipset.Height),
									tipsetKey: tipsetKey(tipset.Cids),
								},
								timestampMs: tipset.Blocks[0].Timestamp * 1000,
								$$blocks: blockRows(
									$network,
									tipset
								),
							}
						}))
					},
				}
			},
		})({
				$$tipsets: (tipsets) => tipsets,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: {
					resolve: async (network, context) => {
						assertFilecoinMainnet(network)
						const {
							getTipSetByHeight,
							getHead,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						return Promise.all(Array.from({
							length: Math.min(
								Number(BigInt(head.Height) + 1n),
								resolverContextRowLimit(context)
							),
						}, async (_value, tipsetOffset) => {
							const tipset = (
								tipsetOffset === 0 ?
									head
								:
									await getTipSetByHeight({
										rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
										height: BigInt(head.Height) - BigInt(tipsetOffset),
									})
							)

							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									height: BigInt(tipset.Height),
									tipsetKey: tipsetKey(tipset.Cids),
								},
								timestampMs: tipset.Blocks[0].Timestamp * 1000,
							}
						}))
					},
				}
			},
		})({
				Filecoin: {
					$$tipsets: (tipsets) => tipsets,
				},
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinTipset,
			resolve: {
				[FilecoinTipsetSelector.NetworkHeightTipsetKey]: {
					resolve: async ({ $network, height }) => {
						assertFilecoinMainnet($network)
						const { getTipSetByHeight } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						return blockRows(
							$network,
							await getTipSetByHeight({
								rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
								height: height,
							})
						)
					},
				}
			},
		})({
				$$blocks: (blocks) => blocks,
			}),

		defineResolver(Source.Lotus_JsonRpc, {
			entityType: EntityType.FilecoinMiner,
			resolve: {
				[FilecoinMinerSelector.NetworkMinerAddress]: {
					resolve: async (entitySelector, context) => {
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead({ rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl })
						return (await sectorRows({
							...entitySelector,
							tipsetKey: head.Cids,
						})).slice(
							0,
							resolverContextRowLimit(context)
						)
					},
				}
			},
		})({
				$$sectors: (sectors) => sectors,
			}),
	],
}

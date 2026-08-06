import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { LotusTipset } from '$/sources/Lotus/JsonRpc/types.ts'

type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>

const assertFilecoinMainnet = (network: NetworkSelector) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug.filecoin.caip2.namespace
				|| network.caip2.reference !== networkBySlug.filecoin.caip2.reference
			)
		:
			network.slug !== networkBySlug.filecoin.slug
	)
		throw new Error('Lotus_JsonRpc: unsupported network')
}

const tipsetKey = (tipsetKeyCids: { '/': string }[]) => (
	tipsetKeyCids.map((cid) => cid['/']).join(',')
)

const getSelectedTipset = async (
	network: NetworkSelector,
	height: bigint,
	selectorTipsetKey: string
) => {
	assertFilecoinMainnet(network)
	const { getTipSet } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	const tipset = await getTipSet({
		tipsetKey: selectorTipsetKey.split(',').map((cid) => ({
			'/': cid,
		})),
	})
	if (BigInt(tipset.Height) !== height || tipsetKey(tipset.Cids) !== selectorTipsetKey)
		throw new Error(`Lotus_JsonRpc: tipset does not match ${height.toString()}/${selectorTipsetKey}`)

	return tipset
}

const blockSnapshots = (
	network: NetworkSelector,
	tipset: LotusTipset
) => (
	tipset.Blocks.map((block, blockIndex) => ({
		cid: tipset.Cids[blockIndex]?.['/'] ?? block.Messages['/'],
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
		...(block.Ticket?.VRFProof != null && {
			ticketVrFProof: block.Ticket.VRFProof,
		}),
		...(block.ElectionProof?.WinCount != null && {
			winCount: block.ElectionProof.WinCount,
		}),
	}))
)

const blockReferences = (
	network: NetworkSelector,
	tipset: LotusTipset
) => (
	blockSnapshots(network, tipset).map((block) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			cid: block.cid,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: block.$tipset,
			[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: block.$miner,
			...(block.ticketVrFProof != null && {
				[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'ticketVrFProof')]: block.ticketVrFProof,
			}),
			...(block.winCount != null && {
				[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'winCount')]: block.winCount,
			}),
		},
	}))
)

const tipsetReference = (
	network: NetworkSelector,
	tipset: LotusTipset,
	includeBlocks = true
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		height: BigInt(tipset.Height),
		tipsetKey: tipsetKey(tipset.Cids),
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.FilecoinTipset, [], 'timestampMs')]: tipset.Blocks[0].Timestamp * 1000,
		...(includeBlocks && {
			[entityFieldAddressKey(EntityType.FilecoinTipset, [], '$$blocks')]: blockReferences(
				network,
				tipset
			),
		}),
	},
})

const sectorSnapshots = async ({ $network, minerAddress, tipsetKey }: {
	$network: NetworkSelector
	minerAddress: string
	tipsetKey: LotusTipset['Cids']
}) => {
	assertFilecoinMainnet($network)
	const { getMinerSectors } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	return (await getMinerSectors({
		minerAddress,
		tipsetKey,
	})).map((sector) => ({
		$miner: {
			$network,
			minerAddress,
		},
		sectorNumber: BigInt(sector.SectorNumber),
		...(sector.SealedCID != null && {
			sealedCid: sector.SealedCID['/'],
		}),
		activationEpoch: BigInt(sector.Activation),
		expirationEpoch: BigInt(sector.Expiration),
	}))
}

const latestNetworkTimestampReference = async (network: NetworkSelector) => {
	assertFilecoinMainnet(network)
	const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
	const head = await getHead()
	return [{
		[EntityMetaKey.Selector]: {
			$network: network,
			timestampMs: head.Blocks[0].Timestamp * 1000,
			height: BigInt(head.Height),
			tipsetKey: tipsetKey(head.Cids),
			source: Source.Lotus_JsonRpc,
		},
	}]
}

const recentTipsetReferences = async (
	network: NetworkSelector,
	limit: number,
	includeBlocks = true
) => {
	assertFilecoinMainnet(network)
	const {
		getTipSetByHeight,
		getHead,
	} = await import('$/sources/Lotus/JsonRpc/queries.ts')
	const head = await getHead()
	return Promise.all(Array.from({
		length: Math.min(
			Number(BigInt(head.Height) + 1n),
			limit
		),
	}, async (_value, tipsetOffset) => {
		const tipset = (
			tipsetOffset === 0 ?
				head
			:
				await getTipSetByHeight({
					height: BigInt(head.Height) - BigInt(tipsetOffset),
				})
		)
		return tipsetReference(network, tipset, includeBlocks)
	}))
}

export default {
	source: Source.Lotus_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertFilecoinMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							rpcEndpoints: (await import('$/sources/Lotus/JsonRpc/queries.ts')).rpcEndpoints,
						}
					},
				}
			},
		})({
				$network: (network) => network.$network,
				rpcEndpoints: (network) => network.rpcEndpoints,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertFilecoinMainnet(network)
						return {
							filecoinRpcEndpoints: (await import('$/sources/Lotus/JsonRpc/queries.ts')).rpcEndpoints,
						}
					},
				}
			},
		})({
				Filecoin: {
					rpcEndpoints: (network) => network.filecoinRpcEndpoints,
				},
			}),

		defineResolver({
			entityType: EntityType.FilecoinNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, height, tipsetKey: selectorTipsetKey, source }) => {
						assertFilecoinMainnet($network)
						if (source !== Source.Lotus_JsonRpc)
							throw new Error(`Lotus_JsonRpc: unsupported network observation source ${source}`)

						const {
							getMinerPower,
							getNetworkVersion,
							getVersion,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getSelectedTipset($network, height, selectorTipsetKey)
						const [
							lotusVersion,
							networkVersion,
							power,
						] = await Promise.all([
							getVersion(),
							getNetworkVersion({
								tipsetKey: head.Cids,
							}),
							getMinerPower({
								minerAddress: head.Blocks[0].Miner,
								tipsetKey: head.Cids,
							}).catch(() => undefined),
						])
						if (head.Blocks[0].Timestamp * 1000 !== timestampMs)
							throw new Error(`Lotus_JsonRpc: network observation does not match ${timestampMs.toString()}`)

						return {
							headHeight: BigInt(head.Height),
							headTipsetKey: tipsetKey(head.Cids),
							headBlockCount: head.Blocks.length,
							headTimestampMs: head.Blocks[0].Timestamp * 1000,
							$headTipset: tipsetReference($network, head),
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

		defineResolver({
			entityType: EntityType.FilecoinTipset,
			resolve: {
				NetworkHeightTipsetKey: {
					resolve: async ({ $network, height, tipsetKey: selectorTipsetKey }) => {
						const tipset = await getSelectedTipset($network, height, selectorTipsetKey)
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
							...(height > 0n && {
								parentWeight: BigInt(tipset.Blocks[0].ParentWeight),
							}),
							timestampMs: tipset.Blocks[0].Timestamp * 1000,
							$$blocks: blockReferences($network, tipset),
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

		defineResolver({
			entityType: EntityType.FilecoinBlock,
			resolve: {
				NetworkCid: {
					resolve: async ({ $network, cid }) => {
						assertFilecoinMainnet($network)
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						const block = blockSnapshots(
							$network,
							head
						).find((block) => block.cid === cid)
						if (block == null) throw new Error(`Lotus_JsonRpc: block not found for ${cid}`)
						return block
					},
				}
			},
		})({
				$tipset: (block) => block.$tipset,
				$miner: (block) => block.$miner,
				ticketVrFProof: (block) => block.ticketVrFProof,
				winCount: (block) => block.winCount,
			}),

		defineResolver({
			entityType: EntityType.FilecoinMessage,
			resolve: {
				NetworkCid: {
					resolve: async ({ $network, cid }) => {
						assertFilecoinMainnet($network)
						const { getMessage } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const message = await getMessage({
							messageCid: cid,
						})
						return {
							$from: {
								[EntityMetaKey.Selector]: {
									$network,
									address: message.From,
								},
							},
							$to: {
								[EntityMetaKey.Selector]: {
									$network,
									address: message.To,
								},
							},
							method: message.Method,
							nonce: BigInt(message.Nonce),
							valueAttoFil: BigInt(message.Value),
							gasLimit: BigInt(message.GasLimit),
						}
					},
				},
			},
		})({
			$from: (message) => message.$from,
			$to: (message) => message.$to,
			method: (message) => message.method,
			nonce: (message) => message.nonce,
			valueAttoFil: (message) => message.valueAttoFil,
			gasLimit: (message) => message.gasLimit,
		}),

		defineResolver({
			entityType: EntityType.FilecoinSector,
			resolve: {
				FilecoinMinerSectorNumber: {
					resolve: async ({ $miner, sectorNumber }) => {
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						const sector = (await sectorSnapshots({
							...$miner,
							tipsetKey: head.Cids,
						})).find((sector) => (
							sector.sectorNumber === sectorNumber
						))
						if (sector == null) throw new Error(`Lotus_JsonRpc: sector not found for ${$miner.minerAddress}:${sectorNumber.toString()}`)
						return sector
					},
				}
			},
		})({
				sealedCid: (sector) => sector.sealedCid,
				activationEpoch: (sector) => sector.activationEpoch,
				expirationEpoch: (sector) => sector.expirationEpoch,
			}),

		defineResolver({
			entityType: EntityType.FilecoinActor,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertFilecoinMainnet($network)
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$actor: {
										$network,
										address,
									},
									timestampMs: head.Blocks[0].Timestamp * 1000,
									height: BigInt(head.Height),
									tipsetKey: tipsetKey(head.Cids),
									source: Source.Lotus_JsonRpc,
								},
							}],
						}
					},
				}
			},
		})({
				$$timestamps: (actor) => actor.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.FilecoinActor_Timestamp,
			resolve: {
				ActorHeightTipsetKeySource: {
					resolve: async ({ $actor, timestampMs, height, tipsetKey: selectorTipsetKey, source }) => {
						assertFilecoinMainnet($actor.$network)
						if (source !== Source.Lotus_JsonRpc)
							throw new Error(`Lotus_JsonRpc: unsupported actor observation source ${source}`)

						const {
							getActor,
							getIdAddress,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const tipset = await getSelectedTipset($actor.$network, height, selectorTipsetKey)
						const timestamp = tipset.Blocks.at(0)?.Timestamp
						if (timestamp == null)
							throw new Error(`Lotus_JsonRpc: actor observation ${height.toString()}/${selectorTipsetKey} has no timestamp`)
						if (timestamp * 1000 !== timestampMs)
							throw new Error(`Lotus_JsonRpc: actor observation does not match ${timestampMs.toString()}`)

						const [actor, idAddress] = await Promise.all([
							getActor({
								address: $actor.address,
								tipsetKey: tipset.Cids,
							}),
							getIdAddress({
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

		defineResolver({
			entityType: EntityType.FilecoinSector_Timestamp,
			resolve: {
				SectorTimestampMsSource: {
					resolve: async ({ $sector, timestampMs, source }) => {
						assertFilecoinMainnet($sector.$miner.$network)
						if (source !== Source.Lotus_JsonRpc)
							throw new Error(`Lotus_JsonRpc: unsupported sector observation source ${source}`)

						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						if (head.Blocks[0].Timestamp * 1000 !== timestampMs)
							throw new Error(`Lotus_JsonRpc: sector observation does not match ${timestampMs.toString()}`)

						const sector = (await sectorSnapshots({
							$network: $sector.$miner.$network,
							minerAddress: $sector.$miner.minerAddress,
							tipsetKey: head.Cids,
						})).find((sector) => (
							sector.sectorNumber === $sector.sectorNumber
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

		defineResolver({
			entityType: EntityType.FilecoinMiner_Timestamp,
			resolve: {
				MinerHeightTipsetKeySource: {
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
						const head = await getHead()
						if (BigInt(head.Height) !== height || tipsetKey(head.Cids) !== selectorTipsetKey)
							throw new Error(`Lotus_JsonRpc: miner observation ${height.toString()}/${selectorTipsetKey} is not the current head`)

						const [
							minerInfo,
							minerPower,
							sectorCount,
						] = await Promise.all([
							getMinerInfo({
								minerAddress: $miner.minerAddress,
								tipsetKey: head.Cids,
							}),
							getMinerPower({
								minerAddress: $miner.minerAddress,
								tipsetKey: head.Cids,
							}),
							getMinerSectorCount({
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
							activeSectorCount: sectorCount.Active,
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
				activeSectorCount: (timestamp) => timestamp.activeSectorCount,
				liveSectorCount: (timestamp) => timestamp.liveSectorCount,
				faultySectorCount: (timestamp) => timestamp.faultySectorCount,
			}),

		defineResolver({
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => latestNetworkTimestampReference($network),
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: latestNetworkTimestampReference,
				}
			},
		})({
				Filecoin: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver({
			entityType: EntityType.FilecoinNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => recentTipsetReferences(
						$network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
				$$tipsets: (tipsets) => tipsets,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => recentTipsetReferences(
						network,
						resolverContextRowLimit(context),
						false
					),
				}
			},
		})({
				Filecoin: {
					$$tipsets: (tipsets) => tipsets,
				},
			}),

		defineResolver({
			entityType: EntityType.FilecoinMiner,
			resolve: {
				NetworkMinerAddress: {
					resolve: async (entitySelector, context) => {
						const { getHead } = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						return {
							sectors: (await sectorSnapshots({
								...entitySelector,
								tipsetKey: head.Cids,
							})).slice(0, resolverContextRowLimit(context)).map((sector) => ({
								[EntityMetaKey.Selector]: {
									$miner: sector.$miner,
									sectorNumber: sector.sectorNumber,
								},
								[EntityMetaKey.Fields]: {
									...(sector.sealedCid != null && {
										[entityFieldAddressKey(EntityType.FilecoinSector, [], 'sealedCid')]: sector.sealedCid,
									}),
									[entityFieldAddressKey(EntityType.FilecoinSector, [], 'activationEpoch')]: sector.activationEpoch,
									[entityFieldAddressKey(EntityType.FilecoinSector, [], 'expirationEpoch')]: sector.expirationEpoch,
								},
							})),
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$miner: entitySelector,
									height: BigInt(head.Height),
									tipsetKey: tipsetKey(head.Cids),
									source: Source.Lotus_JsonRpc,
								},
							}],
						}
					},
				}
			},
		})({
				$$sectors: (miner) => miner.sectors,
				$$timestamps: (miner) => miner.timestamps,
			}),

		defineResolver({
			entityType: EntityType.FilecoinDeal,
			resolve: {
				NetworkDealId: {
					resolve: async ({ $network, dealId }) => {
						assertFilecoinMainnet($network)
						const {
							getHead,
							getMarketStorageDeal,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						const deal = await getMarketStorageDeal({
							dealId,
							tipsetKey: head.Cids,
						})
						return {
							$provider: {
								[EntityMetaKey.Selector]: {
									$network,
									minerAddress: deal.Proposal.Provider,
								},
							},
							$client: {
								[EntityMetaKey.Selector]: {
									$network,
									address: deal.Proposal.Client,
								},
							},
							pieceCid: deal.Proposal.PieceCID['/'],
							pieceSizeBytes: BigInt(deal.Proposal.PieceSize),
							verifiedDeal: deal.Proposal.VerifiedDeal,
							startEpoch: BigInt(deal.Proposal.StartEpoch),
							endEpoch: BigInt(deal.Proposal.EndEpoch),
							storagePricePerEpochAttoFil: BigInt(deal.Proposal.StoragePricePerEpoch),
							providerCollateralAttoFil: BigInt(deal.Proposal.ProviderCollateral),
							clientCollateralAttoFil: BigInt(deal.Proposal.ClientCollateral),
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$deal: {
										$network,
										dealId,
									},
									timestampMs: head.Blocks[0]?.Timestamp != null ?
										head.Blocks[0].Timestamp * 1000
									:
										Date.now(),
									source: Source.Lotus_JsonRpc,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'height')]: BigInt(head.Height),
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'tipsetKey')]: tipsetKey(head.Cids),
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], '$tipset')]: {
										[EntityMetaKey.Selector]: {
											$network,
											height: BigInt(head.Height),
											tipsetKey: tipsetKey(head.Cids),
										},
									},
									...(deal.State.SectorStartEpoch >= 0 && {
										[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'sectorStartEpoch')]: BigInt(deal.State.SectorStartEpoch),
									}),
									...(deal.State.LastUpdatedEpoch >= 0 && {
										[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'lastUpdatedEpoch')]: BigInt(deal.State.LastUpdatedEpoch),
									}),
									...(deal.State.SlashEpoch >= 0 && {
										[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'slashEpoch')]: BigInt(deal.State.SlashEpoch),
									}),
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'verifiedDeal')]: deal.Proposal.VerifiedDeal,
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'providerCollateralAttoFil')]: BigInt(deal.Proposal.ProviderCollateral),
									[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'clientCollateralAttoFil')]: BigInt(deal.Proposal.ClientCollateral),
								},
							}],
						}
					},
				},
			},
		})({
			$provider: (deal) => deal.$provider,
			$client: (deal) => deal.$client,
			pieceCid: (deal) => deal.pieceCid,
			pieceSizeBytes: (deal) => deal.pieceSizeBytes,
			verifiedDeal: (deal) => deal.verifiedDeal,
			startEpoch: (deal) => deal.startEpoch,
			endEpoch: (deal) => deal.endEpoch,
			storagePricePerEpochAttoFil: (deal) => deal.storagePricePerEpochAttoFil,
			providerCollateralAttoFil: (deal) => deal.providerCollateralAttoFil,
			clientCollateralAttoFil: (deal) => deal.clientCollateralAttoFil,
			$$timestamps: (deal) => deal.timestamps,
		}),

		defineResolver({
			entityType: EntityType.FilecoinDeal_Timestamp,
			resolve: {
				DealTimestampMsSource: {
					resolve: async ({
						$deal,
						timestampMs,
						source,
					}) => {
						assertFilecoinMainnet($deal.$network)
						if (source !== Source.Lotus_JsonRpc)
							throw new Error(`Lotus_JsonRpc: unsupported source ${source}`)

						const {
							getHead,
							getMarketStorageDeal,
						} = await import('$/sources/Lotus/JsonRpc/queries.ts')
						const head = await getHead()
						const deal = await getMarketStorageDeal({
							dealId: $deal.dealId,
							tipsetKey: head.Cids,
						})
						return {
							$deal: {
								[EntityMetaKey.Selector]: $deal,
							},
							timestampMs,
							source,
							height: BigInt(head.Height),
							tipsetKey: tipsetKey(head.Cids),
							$tipset: {
								[EntityMetaKey.Selector]: {
									$network: $deal.$network,
									height: BigInt(head.Height),
									tipsetKey: tipsetKey(head.Cids),
								},
							},
							...(deal.State.SectorStartEpoch >= 0 && {
								sectorStartEpoch: BigInt(deal.State.SectorStartEpoch),
							}),
							...(deal.State.LastUpdatedEpoch >= 0 && {
								lastUpdatedEpoch: BigInt(deal.State.LastUpdatedEpoch),
							}),
							...(deal.State.SlashEpoch >= 0 && {
								slashEpoch: BigInt(deal.State.SlashEpoch),
							}),
							verifiedDeal: deal.Proposal.VerifiedDeal,
							providerCollateralAttoFil: BigInt(deal.Proposal.ProviderCollateral),
							clientCollateralAttoFil: BigInt(deal.Proposal.ClientCollateral),
						}
					},
				},
			},
		})({
			$deal: (observation) => observation.$deal,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			height: (observation) => observation.height,
			tipsetKey: (observation) => observation.tipsetKey,
			$tipset: (observation) => observation.$tipset,
			sectorStartEpoch: (observation) => observation.sectorStartEpoch,
			lastUpdatedEpoch: (observation) => observation.lastUpdatedEpoch,
			slashEpoch: (observation) => observation.slashEpoch,
			verifiedDeal: (observation) => observation.verifiedDeal,
			providerCollateralAttoFil: (observation) => observation.providerCollateralAttoFil,
			clientCollateralAttoFil: (observation) => observation.clientCollateralAttoFil,
		}),
	],
} satisfies RegisteredSourceResolverModule

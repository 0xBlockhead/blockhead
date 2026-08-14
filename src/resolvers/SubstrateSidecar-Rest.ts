import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	NetworkExecutionModel,
	NetworkLedgerModel,
	networkBySlug,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	SidecarBlock,
	SidecarBlockEvent,
} from '$/sources/SubstrateSidecar/Rest/types.ts'

type PolkadotNetworkId = EntitySelector<typeof schema, EntityType.Network>

type NetworkId = PolkadotNetworkId | { $network: PolkadotNetworkId }

type SidecarBlockEventWithExtrinsic = SidecarBlockEvent & {
	extrinsicIndex?: number
}

const assertPolkadotMainnet = (network: NetworkId) => {
	if ('$network' in network) {
		assertPolkadotMainnet(network.$network)
		return
	}
	if ('slug' in network) {
		if (network.slug !== 'polkadot')
			throw new Error('SubstrateSidecar_Rest: unsupported network')

		return
	}
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== networkBySlug.polkadot.caip2.namespace
		|| network.caip2.reference !== networkBySlug.polkadot.caip2.reference
	) {
		throw new Error('SubstrateSidecar_Rest: unsupported network')
	}
}

const extrinsicSignerAccountId = (
	signer: NonNullable<NonNullable<SidecarBlock['extrinsics'][number]['signature']>['signer']>
) => (
	typeof signer === 'string' ?
		signer
	: typeof signer.id === 'string' ?
		signer.id
	: typeof signer.address === 'string' ?
		signer.address
	:
		undefined
)

const polkadotExtrinsicFields = (
	network: PolkadotNetworkId,
	extrinsic: SidecarBlock['extrinsics'][number]
) => {
	const signerAccountId = (
		extrinsic.signature?.signer != null ?
			extrinsicSignerAccountId(extrinsic.signature.signer)
		:
			undefined
	)

	return {
		...(extrinsic.hash != null && {
			hash: extrinsic.hash,
		}),
		...(signerAccountId != null && {
			$signer: {
				[EntityMetaKey.Selector]: {
					$network: network,
					accountId: signerAccountId,
				},
			},
		}),
		$pallet: {
			[EntityMetaKey.Selector]: {
				$network: network,
				palletName: extrinsic.method.pallet,
			},
		},
		callName: extrinsic.method.method,
		...(extrinsic.success != null && {
			success: extrinsic.success,
		}),
	}
}

const polkadotBlockEvents = (
	block: SidecarBlock
): SidecarBlockEventWithExtrinsic[] => [
	...(block.onInitialize?.events ?? []),
	...block.extrinsics.flatMap((extrinsic, extrinsicIndex) => (
		(extrinsic.events ?? []).map((event) => ({
			...event,
			extrinsicIndex,
		}))
	)),
	...(block.onFinalize?.events ?? []),
]

const polkadotEventIdentity = (
	event: SidecarBlockEventWithExtrinsic
) => {
	if (typeof event.method === 'string') {
		const [
			palletName,
			...eventNameParts
		] = event.method.split('.')
		const eventName = eventNameParts.join('.')
		if (palletName.length === 0 || eventName.length === 0)
			throw new Error('SubstrateSidecar_Rest: malformed event method')

		return {
			palletName,
			eventName,
		}
	}

	if (event.method.pallet.length === 0 || event.method.method.length === 0)
		throw new Error('SubstrateSidecar_Rest: malformed event method')

	return {
		palletName: event.method.pallet,
		eventName: event.method.method,
	}
}

const polkadotEventFields = (
	network: PolkadotNetworkId,
	block: SidecarBlock,
	event: SidecarBlockEventWithExtrinsic
) => {
	const {
		palletName,
		eventName,
	} = polkadotEventIdentity(event)

	return {
		...(event.extrinsicIndex != null && {
			$extrinsic: {
				[EntityMetaKey.Selector]: {
					$block: {
						$network: network,
						blockNumber: BigInt(block.number),
						hash: block.hash,
					},
					indexInBlock: event.extrinsicIndex,
				},
			},
		}),
		$pallet: {
			[EntityMetaKey.Selector]: {
				$network: network,
				palletName,
			},
		},
		eventName,
	}
}

const polkadotBlockSnapshot = (
	network: PolkadotNetworkId,
	block: SidecarBlock
) => ({
	hash: block.hash,
	...(BigInt(block.number) > 0n && {
		$parent: {
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: BigInt(block.number) - 1n,
				hash: block.parentHash,
			},
		},
	}),
	stateRoot: block.stateRoot,
	extrinsicsRoot: block.extrinsicsRoot,
	$$extrinsics: block.extrinsics.map((extrinsic, extrinsicIndex) => ({
		[EntityMetaKey.Selector]: {
			$block: {
				$network: network,
				blockNumber: BigInt(block.number),
				hash: block.hash,
			},
			indexInBlock: extrinsicIndex,
		},
		...polkadotExtrinsicFields(network, extrinsic),
	})),
	$$events: polkadotBlockEvents(block).map((event, eventIndex) => ({
		[EntityMetaKey.Selector]: {
			$block: {
				$network: network,
				blockNumber: BigInt(block.number),
				hash: block.hash,
			},
			indexInBlock: eventIndex,
		},
		...polkadotEventFields(
			network,
			block,
			event
		),
	})),
})

const polkadotPalletIndex = (
	index: number | string | undefined
) => {
	if (index == null)
		return undefined
	if (typeof index === 'number') {
		if (!Number.isSafeInteger(index) || index < 0)
			throw new Error('SubstrateSidecar_Rest: malformed pallet index')

		return index
	}
	if (!/^(?:0|[1-9]\d*)$/.test(index))
		throw new Error('SubstrateSidecar_Rest: malformed pallet index')

	return Number(index)
}

const polkadotAccountTimestampFields = (
	accountId: {
		$network: PolkadotNetworkId
		accountId: string
	},
	account: {
		at: {
			hash: string
			height: string
		}
		nonce: string
		free: string
		reserved: string
	},
	timestampMs: number
) => {
	if (
		account.at.hash.length === 0
		|| !/^(?:0|[1-9]\d*)$/.test(account.at.height)
	)
		throw new Error('SubstrateSidecar_Rest: malformed account state identity')
	if (
		![account.nonce, account.free, account.reserved].every((value) => (
			/^\d+$/.test(value)
		))
	)
		throw new Error('SubstrateSidecar_Rest: malformed account balance')
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('SubstrateSidecar_Rest: malformed account observation time')

	return {
		[EntityMetaKey.Selector]: {
			$account: accountId,
			timestampMs,
			source: Source.SubstrateSidecar_Rest,
		},
		$account: {
			[EntityMetaKey.Selector]: accountId,
		},
		timestampMs,
		source: Source.SubstrateSidecar_Rest,
		nonce: BigInt(account.nonce),
		freeBalancePlancks: BigInt(account.free),
	}
}

const polkadotAssetKind = {
	assets: 'assets',
	foreignAssets: 'foreignAssets',
} as const

const foreignAssetId = (
	multiLocation: unknown
) => (
	JSON.stringify(multiLocation)
)

const polkadotAssetAt = (
	at: {
		hash: string
		height: string
	}
) => {
	if (
		at.hash.length === 0
		|| !/^(?:0|[1-9]\d*)$/.test(at.height)
	)
		throw new Error('SubstrateSidecar_Rest: malformed asset state identity')

	return {
		blockNumber: BigInt(at.height),
		blockHash: at.hash,
	}
}

const polkadotAssetBalanceTimestampFields = (
	accountId: {
		$network: PolkadotNetworkId
		accountId: string
	},
	assetId: {
		$network: PolkadotNetworkId
		assetKind: string
		assetId: string
	},
	at: {
		hash: string
		height: string
	},
	balance: {
		balance: string
		isFrozen?: boolean
	},
	timestampMs: number
) => {
	const {
		blockNumber,
		blockHash,
	} = polkadotAssetAt(at)
	if (!/^\d+$/.test(balance.balance))
		throw new Error('SubstrateSidecar_Rest: malformed asset balance')
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('SubstrateSidecar_Rest: malformed asset balance observation time')

	return {
		[EntityMetaKey.Selector]: {
			$account: accountId,
			$asset: assetId,
			timestampMs,
			source: Source.SubstrateSidecar_Rest,
		},
		$account: {
			[EntityMetaKey.Selector]: accountId,
		},
		$asset: {
			[EntityMetaKey.Selector]: assetId,
		},
		timestampMs,
		source: Source.SubstrateSidecar_Rest,
		blockNumber,
		blockHash,
		freeBalancePlancks: BigInt(balance.balance),
		...(balance.isFrozen != null && {
			status: (
				balance.isFrozen ?
					'Frozen'
				:
					'Live'
			),
		}),
	}
}

const polkadotAssetTimestampFields = (
	assetId: {
		$network: PolkadotNetworkId
		assetKind: string
		assetId: string
	},
	asset: {
		at: {
			hash: string
			height: string
		}
		owner: string
		issuer: string
		admin: string
		freezer: string
		supply: string
		minBalance: string
		accounts: string
		status: string
		name: string
		symbol: string
		decimals: number
	},
	timestampMs: number
) => {
	const {
		blockNumber,
		blockHash,
	} = polkadotAssetAt(asset.at)
	if (
		![asset.supply, asset.minBalance, asset.accounts].every((value) => (
			/^\d+$/.test(value)
		))
	)
		throw new Error('SubstrateSidecar_Rest: malformed asset info amounts')
	if (!Number.isSafeInteger(asset.decimals) || asset.decimals < 0)
		throw new Error('SubstrateSidecar_Rest: malformed asset decimals')
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('SubstrateSidecar_Rest: malformed asset observation time')

	const holderCount = Number(asset.accounts)
	if (!Number.isSafeInteger(holderCount) || holderCount < 0)
		throw new Error('SubstrateSidecar_Rest: malformed asset holder count')

	return {
		[EntityMetaKey.Selector]: {
			$asset: assetId,
			timestampMs,
			source: Source.SubstrateSidecar_Rest,
		},
		$asset: {
			[EntityMetaKey.Selector]: assetId,
		},
		timestampMs,
		source: Source.SubstrateSidecar_Rest,
		blockNumber,
		blockHash,
		supply: BigInt(asset.supply),
		holderCount,
		status: asset.status,
		symbol: asset.symbol,
		name: asset.name,
		decimals: asset.decimals,
		existentialDepositPlancks: BigInt(asset.minBalance),
		owner: asset.owner,
		issuer: asset.issuer,
		admin: asset.admin,
		freezer: asset.freezer,
	}
}

const polkadotAssetTimestampProjectionFields = (
	timestamp: ReturnType<typeof polkadotAssetTimestampFields>
) => ({
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], '$asset')]: timestamp.$asset,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'source')]: timestamp.source,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'blockNumber')]: timestamp.blockNumber,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'blockHash')]: timestamp.blockHash,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'supply')]: timestamp.supply,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'holderCount')]: timestamp.holderCount,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'status')]: timestamp.status,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'symbol')]: timestamp.symbol,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'name')]: timestamp.name,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'decimals')]: timestamp.decimals,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'existentialDepositPlancks')]: timestamp.existentialDepositPlancks,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'owner')]: timestamp.owner,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'issuer')]: timestamp.issuer,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'admin')]: timestamp.admin,
	[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'freezer')]: timestamp.freezer,
})

const polkadotValidatorStakePlancks = (
	totalStake: string | undefined
) => {
	if (totalStake == null)
		return undefined
	if (!/^\d+$/.test(totalStake))
		throw new Error('SubstrateSidecar_Rest: malformed validator stake')

	return BigInt(totalStake)
}

const polkadotAssetBalanceTimestampProjectionFields = (
	timestamp: ReturnType<typeof polkadotAssetBalanceTimestampFields>
) => ({
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], '$account')]: timestamp.$account,
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], '$asset')]: timestamp.$asset,
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'source')]: timestamp.source,
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'blockNumber')]: timestamp.blockNumber,
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'blockHash')]: timestamp.blockHash,
	[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'freeBalancePlancks')]: timestamp.freeBalancePlancks,
	...(timestamp.status != null && {
		[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'status')]: timestamp.status,
	}),
})

export default {
	source: Source.SubstrateSidecar_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						assertPolkadotMainnet($network)
						const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const block = await getBlock({
							blockId: blockNumber,
						})
						if (BigInt(block.number) !== blockNumber)
							throw new Error(`SubstrateSidecar_Rest: block number mismatch for ${blockNumber}`)

						return polkadotBlockSnapshot($network, block)
					},
				},
				NetworkBlockNumberHash: {
					resolve: async ({ $network, blockNumber, hash }) => {
						assertPolkadotMainnet($network)
						const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const block = await getBlock({
							blockId: hash,
						})
						if (BigInt(block.number) !== blockNumber)
							throw new Error(`SubstrateSidecar_Rest: block number mismatch for ${hash}`)
						if (block.hash !== hash)
							throw new Error(`SubstrateSidecar_Rest: block hash mismatch for ${hash}`)

						return polkadotBlockSnapshot($network, block)
					},
				},
			},
		})({
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			$$extrinsics: {
				select: (block) => block.$$extrinsics.map((extrinsic) => ({
					[EntityMetaKey.Selector]: extrinsic[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')]: extrinsic.hash,
						[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$signer')]: extrinsic.$signer,
						[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$pallet')]: extrinsic.$pallet,
						[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'callName')]: extrinsic.callName,
						[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'success')]: extrinsic.success,
					},
				})),
				resolveCount: (block) => block.$$extrinsics.length,
			},
			$$events: {
				select: (block) => block.$$events.map((event) => ({
					[EntityMetaKey.Selector]: event[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.PolkadotEvent, [], '$extrinsic')]: event.$extrinsic,
						[entityFieldAddressKey(EntityType.PolkadotEvent, [], '$pallet')]: event.$pallet,
						[entityFieldAddressKey(EntityType.PolkadotEvent, [], 'eventName')]: event.eventName,
					},
				})),
				resolveCount: (block) => block.$$events.length,
			},
		}),

		defineResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				BlockIndexInBlock: {
					resolve: async ({ $block, indexInBlock }) => {
						assertPolkadotMainnet($block.$network)
						const { getBlockExtrinsic } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const {
							extrinsic,
						} = await getBlockExtrinsic({
							blockId: $block.hash ?? $block.blockNumber.toString(),
							extrinsicIndex: indexInBlock,
						})
						return polkadotExtrinsicFields(
							$block.$network,
							extrinsic
						)
					},
				},
			},
		})({
			hash: (extrinsic) => extrinsic.hash,
			$signer: (extrinsic) => extrinsic.$signer,
			$pallet: (extrinsic) => extrinsic.$pallet,
			callName: (extrinsic) => extrinsic.callName,
			success: (extrinsic) => extrinsic.success,
		}),

		defineResolver({
			entityType: EntityType.PolkadotEvent,
			resolve: {
				BlockIndexInBlock: {
					resolve: async ({ $block, indexInBlock }) => {
						assertPolkadotMainnet($block.$network)
						const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const block = await getBlock({
							blockId: $block.hash ?? $block.blockNumber.toString(),
						})
						const event = polkadotBlockEvents(block).at(indexInBlock)
						if (event == null)
							throw new Error(`SubstrateSidecar_Rest: missing event ${indexInBlock}`)
						return polkadotEventFields(
							$block.$network,
							block,
							event
						)
					},
				},
			},
		})({
			$extrinsic: (event) => event.$extrinsic,
			$pallet: (event) => event.$pallet,
			eventName: (event) => event.eventName,
		}),

		defineResolver({
			entityType: EntityType.PolkadotAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						assertPolkadotMainnet($network)
						const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const account = await getAccountBalanceInfo({
							accountId: accountId,
						})
						return {
							$$timestamps: [
								polkadotAccountTimestampFields(
									{
										$network,
										accountId,
									},
									account,
									Date.now()
								),
							],
						}
					},
				}
			},
		})({
				$$timestamps: (account) => account.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], '$account')]: timestamp.$account,
						[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
						[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'source')]: timestamp.source,
						[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'nonce')]: timestamp.nonce,
						[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'freeBalancePlancks')]: timestamp.freeBalancePlancks,
					},
				})),
			}),

		defineResolver({
			entityType: EntityType.PolkadotAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account, timestampMs, source }) => {
						if (source !== Source.SubstrateSidecar_Rest) throw new Error(`SubstrateSidecar_Rest: unsupported source ${source}`)
						assertPolkadotMainnet($account.$network)
						const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const account = await getAccountBalanceInfo({
							accountId: $account.accountId,
						})
						return polkadotAccountTimestampFields(
							$account,
							account,
							timestampMs
						)
					},
				},
			},
		})({
				$account: (timestamp) => timestamp.$account,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				nonce: (timestamp) => timestamp.nonce,
				freeBalancePlancks: (timestamp) => timestamp.freeBalancePlancks,
			}),

		defineResolver({
			entityType: EntityType.PolkadotAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						assertPolkadotMainnet($network)
						const {
							getAccountAssetBalances,
							getAccountForeignAssetBalances,
							polkadotAssetHubSidecarBinding,
						} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const accountSelector = {
							$network,
							accountId,
						}
						const timestampMs = Date.now()
						const [
							assetBalances,
							foreignAssetBalances,
						] = await Promise.all([
							getAccountAssetBalances({
								accountId,
								binding: polkadotAssetHubSidecarBinding,
							}),
							getAccountForeignAssetBalances({
								accountId,
								binding: polkadotAssetHubSidecarBinding,
							}),
						])
						return {
							$$assetBalanceTimestamps: [
								...assetBalances.assets.map((asset) => (
									polkadotAssetBalanceTimestampFields(
										accountSelector,
										{
											$network,
											assetKind: polkadotAssetKind.assets,
											assetId: String(asset.assetId),
										},
										assetBalances.at,
										asset,
										timestampMs
									)
								)),
								...foreignAssetBalances.foreignAssets.map((asset) => (
									polkadotAssetBalanceTimestampFields(
										accountSelector,
										{
											$network,
											assetKind: polkadotAssetKind.foreignAssets,
											assetId: foreignAssetId(asset.multiLocation),
										},
										foreignAssetBalances.at,
										asset,
										timestampMs
									)
								)),
							],
						}
					},
				},
			},
		})({
			$$assetBalanceTimestamps: (account) => account.$$assetBalanceTimestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				[EntityMetaKey.Fields]: polkadotAssetBalanceTimestampProjectionFields(timestamp),
			})),
		}),

		defineResolver({
			entityType: EntityType.PolkadotAsset,
			resolve: {
				NetworkAssetKindAssetId: {
					resolve: async ({ $network, assetKind, assetId }) => {
						assertPolkadotMainnet($network)
						if (
							assetKind !== polkadotAssetKind.assets
							&& assetKind !== polkadotAssetKind.foreignAssets
						)
							throw new Error(`SubstrateSidecar_Rest: unsupported assetKind ${assetKind}`)
						if (assetId.length === 0)
							throw new Error('SubstrateSidecar_Rest: asset ID must not be empty')

						const {
							getAssetInfo,
							getForeignAssetInfo,
							polkadotAssetHubSidecarBinding,
						} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const asset = (
							assetKind === polkadotAssetKind.assets ?
								await getAssetInfo({
									assetId,
									binding: polkadotAssetHubSidecarBinding,
								})
							:
								await getForeignAssetInfo({
									assetId,
									binding: polkadotAssetHubSidecarBinding,
								})
						)
						const assetSelector = {
							$network,
							assetKind,
							assetId,
						}
						return {
							$$timestamps: [
								polkadotAssetTimestampFields(
									assetSelector,
									asset,
									Date.now()
								),
							],
						}
					},
				},
			},
		})({
			$$timestamps: (asset) => asset.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				[EntityMetaKey.Fields]: polkadotAssetTimestampProjectionFields(timestamp),
			})),
		}),

		defineResolver({
			entityType: EntityType.PolkadotAsset_Timestamp,
			resolve: {
				AssetTimestampMsSource: {
					resolve: async ({ $asset, timestampMs, source }) => {
						if (source !== Source.SubstrateSidecar_Rest)
							throw new Error(`SubstrateSidecar_Rest: unsupported source ${source}`)
						assertPolkadotMainnet($asset.$network)
						if (
							$asset.assetKind !== polkadotAssetKind.assets
							&& $asset.assetKind !== polkadotAssetKind.foreignAssets
						)
							throw new Error(`SubstrateSidecar_Rest: unsupported assetKind ${$asset.assetKind}`)
						if ($asset.assetId.length === 0)
							throw new Error('SubstrateSidecar_Rest: asset ID must not be empty')

						const {
							getAssetInfo,
							getForeignAssetInfo,
							polkadotAssetHubSidecarBinding,
						} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const asset = (
							$asset.assetKind === polkadotAssetKind.assets ?
								await getAssetInfo({
									assetId: $asset.assetId,
									binding: polkadotAssetHubSidecarBinding,
								})
							:
								await getForeignAssetInfo({
									assetId: $asset.assetId,
									binding: polkadotAssetHubSidecarBinding,
								})
						)
						return polkadotAssetTimestampFields(
							$asset,
							asset,
							timestampMs
						)
					},
				},
			},
		})({
			$asset: (timestamp) => timestamp.$asset,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			blockNumber: (timestamp) => timestamp.blockNumber,
			blockHash: (timestamp) => timestamp.blockHash,
			supply: (timestamp) => timestamp.supply,
			holderCount: (timestamp) => timestamp.holderCount,
			status: (timestamp) => timestamp.status,
			symbol: (timestamp) => timestamp.symbol,
			name: (timestamp) => timestamp.name,
			decimals: (timestamp) => timestamp.decimals,
			existentialDepositPlancks: (timestamp) => timestamp.existentialDepositPlancks,
			owner: (timestamp) => timestamp.owner,
			issuer: (timestamp) => timestamp.issuer,
			admin: (timestamp) => timestamp.admin,
			freezer: (timestamp) => timestamp.freezer,
		}),

		defineResolver({
			entityType: EntityType.PolkadotAssetBalance_Timestamp,
			resolve: {
				AccountAssetTimestampMsSource: {
					resolve: async ({ $account, $asset, timestampMs, source }) => {
						if (source !== Source.SubstrateSidecar_Rest)
							throw new Error(`SubstrateSidecar_Rest: unsupported source ${source}`)
						assertPolkadotMainnet($account.$network)
						assertPolkadotMainnet($asset.$network)

						if ($asset.assetKind === polkadotAssetKind.assets) {
							const {
								getAccountAssetBalances,
								polkadotAssetHubSidecarBinding,
							} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
							const balances = await getAccountAssetBalances({
								accountId: $account.accountId,
								assets: [
									$asset.assetId,
								],
								binding: polkadotAssetHubSidecarBinding,
							})
							const balance = balances.assets.find((asset) => (
								String(asset.assetId) === $asset.assetId
							))
							if (balance == null)
								throw new Error(`SubstrateSidecar_Rest: asset balance not found for ${$asset.assetId}`)

							return polkadotAssetBalanceTimestampFields(
								$account,
								$asset,
								balances.at,
								balance,
								timestampMs
							)
						}

						if ($asset.assetKind === polkadotAssetKind.foreignAssets) {
							const {
								getAccountForeignAssetBalances,
								polkadotAssetHubSidecarBinding,
							} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
							const balances = await getAccountForeignAssetBalances({
								accountId: $account.accountId,
								binding: polkadotAssetHubSidecarBinding,
							})
							const balance = balances.foreignAssets.find((asset) => (
								foreignAssetId(asset.multiLocation) === $asset.assetId
							))
							if (balance == null)
								throw new Error(`SubstrateSidecar_Rest: foreign asset balance not found for ${$asset.assetId}`)

							return polkadotAssetBalanceTimestampFields(
								$account,
								$asset,
								balances.at,
								balance,
								timestampMs
							)
						}

						throw new Error(`SubstrateSidecar_Rest: unsupported assetKind ${$asset.assetKind}`)
					},
				},
			},
		})({
			$account: (timestamp) => timestamp.$account,
			$asset: (timestamp) => timestamp.$asset,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			blockNumber: (timestamp) => timestamp.blockNumber,
			blockHash: (timestamp) => timestamp.blockHash,
			freeBalancePlancks: (timestamp) => timestamp.freeBalancePlancks,
			status: (timestamp) => timestamp.status,
		}),

		defineResolver({
			entityType: EntityType.PolkadotPallet,
			resolve: {
				NetworkPalletName: {
					resolve: async ({ $network, palletName }) => {
						assertPolkadotMainnet($network)
						const { getRuntimeMetadata } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const pallet = (await getRuntimeMetadata()).pallets
							.find((runtimePallet) => runtimePallet.name === palletName)
						if (pallet == null) throw new Error(`SubstrateSidecar_Rest: pallet not found for ${palletName}`)
						return {
							index: polkadotPalletIndex(pallet.index),
						}
					},
				}
			},
		})({
				index: (pallet) => pallet.index,
			}),

		defineResolver({
			entityType: EntityType.PolkadotValidator,
			resolve: {
				NetworkStashAccountId: {
					resolve: async ({ $network, stashAccountId }) => {
						assertPolkadotMainnet($network)
						if (stashAccountId.length === 0)
							throw new Error('SubstrateSidecar_Rest: stash account ID must not be empty')
						const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const validators = (await getStakingValidators()).validators
						if (validators == null)
							throw new Error('SubstrateSidecar_Rest: validators unavailable')
						const validator = validators.find((candidate) => (
							candidate.accountId === stashAccountId
							|| candidate.address === stashAccountId
							|| candidate.stashId === stashAccountId
						))
						if (validator == null)
							throw new Error(`SubstrateSidecar_Rest: validator not found for ${stashAccountId}`)

						return {
							stashAccountId,
						}
					},
				},
			},
		})({
			stashAccountId: (validator) => validator.stashAccountId,
		}),

		defineResolver({
			entityType: EntityType.PolkadotValidator_Era,
			resolve: {
				ValidatorEraIndexSource: {
					resolve: async ({
						$validator,
						eraIndex,
						source,
					}) => {
						if (source !== Source.SubstrateSidecar_Rest)
							throw new Error(`SubstrateSidecar_Rest: unsupported source ${source}`)
						assertPolkadotMainnet($validator.$network)
						if ($validator.stashAccountId.length === 0)
							throw new Error('SubstrateSidecar_Rest: stash account ID must not be empty')
						const {
							getStakingProgress,
							getStakingValidators,
						} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const progress = await getStakingProgress()
						const validators = await getStakingValidators({
							at: progress.at.hash,
						})
						if (BigInt(progress.activeEra) !== eraIndex)
							throw new Error('SubstrateSidecar_Rest: requested validator era is not the active era')
						if (
							validators.at?.hash != null
							&& validators.at.hash !== progress.at.hash
						)
							throw new Error('SubstrateSidecar_Rest: validator set block does not match staking progress')
						const validator = validators.validators?.find((candidate) => (
							candidate.accountId === $validator.stashAccountId
							|| candidate.address === $validator.stashAccountId
							|| candidate.stashId === $validator.stashAccountId
						))
						if (validator == null)
							throw new Error(`SubstrateSidecar_Rest: validator not found for ${$validator.stashAccountId}`)
						const commissionPerBillion = validator.commission == null ?
							undefined
						:
							Number(validator.commission)
						if (
							commissionPerBillion != null
							&& (
								!Number.isSafeInteger(commissionPerBillion)
								|| commissionPerBillion < 0
								|| commissionPerBillion > 1_000_000_000
							)
						)
							throw new Error('SubstrateSidecar_Rest: invalid validator commission')

						const totalStakePlancks = polkadotValidatorStakePlancks(validator.totalStake)
						const $controller = (
							validator.controllerId != null && validator.controllerId !== '' ?
								{
									[EntityMetaKey.Selector]: {
										$network: $validator.$network,
										accountId: validator.controllerId,
									},
								}
							:
								undefined
						)

						return {
							$validator: {
								[EntityMetaKey.Selector]: $validator,
							},
							eraIndex,
							source,
							...(commissionPerBillion != null && {
								commissionPerBillion,
							}),
							...($controller != null && {
								$controller,
							}),
							...(totalStakePlancks != null && {
								totalStakePlancks,
							}),
							...(validator.status != null && {
								active: validator.status === 'active',
							}),
							slashed: progress.unappliedSlashes?.some(({ validator }) => (
								validator === $validator.stashAccountId
							)) ?? false,
						}
					},
				},
			},
		})({
			$validator: (observation) => observation.$validator,
			eraIndex: (observation) => observation.eraIndex,
			source: (observation) => observation.source,
			$controller: (observation) => observation.$controller,
			commissionPerBillion: (observation) => observation.commissionPerBillion,
			totalStakePlancks: (observation) => observation.totalStakePlancks,
			active: (observation) => observation.active,
			slashed: (observation) => observation.slashed,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertPolkadotMainnet(network)
						const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const validators = (await getStakingValidators()).validators
						if (validators == null)
							throw new Error('SubstrateSidecar_Rest: validators unavailable')

						const stashAccountIds = validators.map((validator) => (
							validator.stashId ?? validator.accountId ?? validator.address
						))
						if (stashAccountIds.some((stashAccountId) => stashAccountId == null))
							throw new Error('SubstrateSidecar_Rest: staking validator missing account identity')
						if (new Set(stashAccountIds).size !== stashAccountIds.length)
							throw new Error('SubstrateSidecar_Rest: staking validators contain duplicate identities')

						const offset = context.pagination.offset ?? 0
						return {
							rows: stashAccountIds
								.slice(offset, offset + resolverContextRowLimit(context))
								.map((stashAccountId) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										stashAccountId,
									},
								})),
							totalCount: stashAccountIds.length,
						}
					},
				},
			},
		})({
			Polkadot: {
				$$validators: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.SubstrateSidecar_Rest)
							throw new Error(`SubstrateSidecar_Rest: unsupported source ${source}`)
						assertPolkadotMainnet($network)
						const {
							getBlockHead,
							getNodeNetwork,
							getRuntimeSpec,
						} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const [
							head,
							runtime,
							nodeNetwork,
						] = await Promise.all([
							getBlockHead(),
							getRuntimeSpec(),
							getNodeNetwork(),
						])
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Account],
							executionModels: [NetworkExecutionModel.PolkadotRuntime],
							finalizedBlockNumber: BigInt(head.number),
							finalizedBlockHash: head.hash,
							finalizedExtrinsicCount: head.extrinsics.length,
							runtimeSpecName: runtime.specName,
							runtimeSpecVersion: runtime.specVersion,
							...(runtime.transactionVersion != null && {
								transactionVersion: runtime.transactionVersion,
							}),
							...(runtime.stateVersion != null && {
								stateVersion: runtime.stateVersion,
							}),
							peerCount: Number(nodeNetwork.numPeers),
							isSyncing: nodeNetwork.isSyncing,
							shouldHavePeers: nodeNetwork.shouldHavePeers,
						}
					},
				},
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				ledgerModels: (timestamp) => timestamp.ledgerModels,
				executionModels: (timestamp) => timestamp.executionModels,
				Polkadot: {
					finalizedBlockNumber: (timestamp) => timestamp.finalizedBlockNumber,
					finalizedBlockHash: (timestamp) => timestamp.finalizedBlockHash,
					finalizedExtrinsicCount: (timestamp) => timestamp.finalizedExtrinsicCount,
					runtimeSpecName: (timestamp) => timestamp.runtimeSpecName,
					runtimeSpecVersion: (timestamp) => timestamp.runtimeSpecVersion,
					transactionVersion: (timestamp) => timestamp.transactionVersion,
					stateVersion: (timestamp) => timestamp.stateVersion,
					peerCount: (timestamp) => timestamp.peerCount,
					isSyncing: (timestamp) => timestamp.isSyncing,
					shouldHavePeers: (timestamp) => timestamp.shouldHavePeers,
				},
			}),

		defineResolver({
			entityType: EntityType.PolkadotReferendum,
			resolve: {
				NetworkReferendumId: {
					resolve: async ({ $network, referendumId }) => {
						assertPolkadotMainnet($network)
						if (referendumId.length === 0)
							throw new Error('SubstrateSidecar_Rest: referendum ID must not be empty')
						const { getOngoingReferenda } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const response = await getOngoingReferenda()
						const referendum = response.referenda
							.find((candidate) => candidate.id === referendumId)
						if (referendum == null)
							throw new Error(`SubstrateSidecar_Rest: ongoing referendum not found for ${referendumId}`)

						const timestampMs = Date.now()
						const timestampSelector = {
							$referendum: {
								$network,
								referendumId,
							},
							timestampMs,
							source: Source.SubstrateSidecar_Rest,
						}
						const enactmentAtBlockNumber = (
							typeof referendum.enactment === 'string' ?
								BigInt(referendum.enactment)
							: referendum.enactment?.at != null ?
								BigInt(referendum.enactment.at)
							:
								undefined
						)
						const confirmationStartedAtBlockNumber = (
							referendum.deciding?.confirming != null ?
								BigInt(referendum.deciding.confirming)
							:
								undefined
						)
						return {
							...(referendum.submitted != null && {
								submittedAtBlockNumber: BigInt(referendum.submitted),
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: timestampSelector,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], '$referendum')]: {
										[EntityMetaKey.Selector]: timestampSelector.$referendum,
									},
									[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'timestampMs')]: timestampMs,
									[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'source')]: Source.SubstrateSidecar_Rest,
									[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockNumber')]: BigInt(response.at.height),
									[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockHash')]: response.at.hash,
									[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'status')]: 'Ongoing',
									...(confirmationStartedAtBlockNumber != null && {
										[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'confirmationStartedAtBlockNumber')]: confirmationStartedAtBlockNumber,
									}),
									...(enactmentAtBlockNumber != null && {
										[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'enactmentAtBlockNumber')]: enactmentAtBlockNumber,
									}),
								},
							}],
						}
					},
				},
			},
		})({
				submittedAtBlockNumber: (referendum) => referendum.submittedAtBlockNumber,
				$$timestamps: (referendum) => referendum.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertPolkadotMainnet(network)
						const { getOngoingReferenda } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const response = await getOngoingReferenda()
						const referendumIds = response.referenda.map(({ id }) => id)
						if (new Set(referendumIds).size !== referendumIds.length)
							throw new Error('SubstrateSidecar_Rest: ongoing referenda contain duplicate identities')

						const offset = context.pagination.offset ?? 0
						return {
							rows: referendumIds
								.slice(offset, offset + resolverContextRowLimit(context))
								.map((referendumId) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										referendumId,
									},
								})),
							totalCount: referendumIds.length,
						}
					},
				},
			},
		})({
			Polkadot: {
				$$referenda: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertPolkadotMainnet(network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: Date.now(),
									source: Source.SubstrateSidecar_Rest,
								},
							},
						]
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertPolkadotMainnet(network)
						const {
							getBlockHeadHeader,
							getBlocks,
						} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const head = await getBlockHeadHeader()
						const limit = resolverContextRowLimit(context)
						const headNumber = BigInt(head.number)
						if (
							context.providerContinuationToken != null
							&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
						)
							throw new Error(`${Source.SubstrateSidecar_Rest}: invalid blocks continuation`)

						const firstBlockNumber = context.providerContinuationToken == null ?
							headNumber - BigInt(context.pagination.offset ?? 0)
						:
							BigInt(context.providerContinuationToken)
						if (firstBlockNumber > headNumber)
							throw new Error(`${Source.SubstrateSidecar_Rest}: blocks continuation exceeds finalized head`)

						const rowCount = Math.min(
							limit,
							Math.max(
								Number(firstBlockNumber + 1n),
								0
							)
						)
						if (rowCount === 0)
							return {
								blocks: [],
							}

						const blocks = await getBlocks({
							from: firstBlockNumber - BigInt(rowCount - 1),
							to: firstBlockNumber,
						})
						return {
							blocks: [...blocks]
								.reverse()
								.map((block) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
								})),
						}
					},
				},
			},
		})({
				Polkadot: {
					$$blocks: {
						select: (snapshot) => snapshot.blocks,
						continuation: (snapshot) => {
							const lastBlockNumber = snapshot.blocks.at(-1)?.[EntityMetaKey.Selector].blockNumber
							return {
								operation: 'network-blocks',
								terminal: lastBlockNumber == null || lastBlockNumber === 0n,
								...(lastBlockNumber != null && lastBlockNumber > 0n && {
									token: String(lastBlockNumber - 1n),
								}),
							}
						},
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertPolkadotMainnet(network)
						const { getBlockHeadHeader } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						return BigInt((await getBlockHeadHeader()).number) + 1n
					},
				},
			},
		})({
				Polkadot: {
					$$blocks: {
						resolveCount: (count) => count,
					},
				},
			}),

	],
} satisfies RegisteredSourceResolverModule

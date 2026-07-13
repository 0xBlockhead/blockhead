import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { PolkadotExtrinsicSelector } from '$/schema/PolkadotExtrinsic.ts'
import { PolkadotEventSelector } from '$/schema/PolkadotEvent.ts'
import { PolkadotAccountSelector } from '$/schema/PolkadotAccount.ts'
import { PolkadotAccount_TimestampSelector } from '$/schema/PolkadotAccount_Timestamp.ts'
import { PolkadotPalletSelector } from '$/schema/PolkadotPallet.ts'
import { NetworkSelector } from '$/schema/Network.ts'

type SidecarBlockEvent = {
	method: string
	extrinsicIndex?: number
}

type PolkadotNetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

type NetworkId = PolkadotNetworkId | { $network: PolkadotNetworkId }

const substrateSidecarRestBaseUrl = async () => (
	(await import('$/sources/SubstrateSidecar/Rest/queries.ts')).substrateSidecarRestEndpoints[0].url
)

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

const polkadotAccountTimestampFields = (
	accountId: {
		$network: PolkadotNetworkId
		accountId: string
	},
	account: {
		nonce?: string | number
		free?: string
	},
	timestampMs: number
) => ({
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
	...(account.nonce != null && {
		nonce: BigInt(account.nonce),
	}),
	...(account.free != null && {
		freeBalancePlancks: BigInt(account.free),
	}),
})

export default {
	source: Source.SubstrateSidecar_Rest,

	resolvers: [
		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
					assertPolkadotMainnet($network)
					const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						blockId: hash,
					})
					return {
						hash: block.hash,
						...(BigInt(block.number) > 0n && {
							$parent: {
								[EntityMetaKey.Selector]: {
									$network: $network,
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
									$network: $network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
								indexInBlock: extrinsicIndex,
							},
							...(extrinsic.hash != null && {
								hash: extrinsic.hash,
							}),
							...(extrinsic.signature?.signer != null && {
								$signer: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										accountId: extrinsic.signature.signer,
									},
								},
							}),
							$pallet: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									palletName: extrinsic.method.pallet,
								},
							},
							callName: extrinsic.method.method,
							...(extrinsic.success != null && {
								success: extrinsic.success,
							}),
						})),
						$$events: ([
							...(block.onInitialize?.events ?? []),
							...block.extrinsics.flatMap((extrinsic, extrinsicIndex) => (
							(extrinsic.events ?? []).map((event) => ({
								...event,
								extrinsicIndex,
							}))
							)),
							...(block.onFinalize?.events ?? []),
						]).map((event: SidecarBlockEvent, eventIndex) => {
						const [
							palletName,
							eventName,
						] = event.method.split('.')

						return {
							[EntityMetaKey.Selector]: {
								$block: {
									$network: $network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
								indexInBlock: eventIndex,
							},
							...(event.extrinsicIndex != null && {
								$extrinsic: {
									[EntityMetaKey.Selector]: {
										$block: {
										$network: $network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
										indexInBlock: event.extrinsicIndex,
									},
								},
							}),
							$pallet: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									palletName,
								},
							},
							eventName: eventName,
						}
						}),
					}
				}
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				stateRoot: (block) => block.stateRoot,
				extrinsicsRoot: (block) => block.extrinsicsRoot,
				$$extrinsics: (block) => block.$$extrinsics,
				$$events: (block) => block.$$events,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				[PolkadotExtrinsicSelector.BlockIndexInBlock]: async ({ $block, indexInBlock }) => {
					assertPolkadotMainnet($block.$network)
					const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						blockId: $block.blockNumber.toString(),
					})
					const extrinsic = block.extrinsics.at(indexInBlock)
					if (extrinsic == null)
						throw new Error(`SubstrateSidecar_Rest: missing extrinsic ${indexInBlock}`)
					return {
						...(extrinsic.hash != null && {
							hash: extrinsic.hash,
						}),
						...(extrinsic.signature?.signer != null && {
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: $block.$network,
									accountId: extrinsic.signature.signer,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Selector]: {
								$network: $block.$network,
								palletName: extrinsic.method.pallet,
							},
						},
						callName: extrinsic.method.method,
						...(extrinsic.success != null && {
							success: extrinsic.success,
						}),
					}
				}
			},
		})({
				hash: (extrinsic) => extrinsic.hash,
				$signer: (extrinsic) => extrinsic.$signer,
				$pallet: (extrinsic) => extrinsic.$pallet,
				callName: (extrinsic) => extrinsic.callName,
				success: (extrinsic) => extrinsic.success,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotEvent,
			resolve: {
				[PolkadotEventSelector.BlockIndexInBlock]: async ({ $block, indexInBlock }) => {
					assertPolkadotMainnet($block.$network)
					const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						blockId: $block.blockNumber.toString(),
					})
					const event: SidecarBlockEvent | undefined = [
						...(block.onInitialize?.events ?? []),
						...block.extrinsics.flatMap((extrinsic, extrinsicIndex) => (
						(extrinsic.events ?? []).map((extrinsicEvent) => ({
							...extrinsicEvent,
							extrinsicIndex,
						}))
						)),
						...(block.onFinalize?.events ?? []),
					].at(indexInBlock)
					if (event == null)
						throw new Error(`SubstrateSidecar_Rest: missing event ${indexInBlock}`)
					const [
						palletName,
					eventName,
					] = event.method.split('.')
					return {
						...(event.extrinsicIndex != null && {
							$extrinsic: {
								[EntityMetaKey.Selector]: {
									$block: {
										$network: $block.$network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
									indexInBlock: event.extrinsicIndex,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Selector]: {
								$network: $block.$network,
								palletName,
							},
						},
						eventName: eventName,
					}
				}
			},
		})({
				$extrinsic: (event) => event.$extrinsic,
				$pallet: (event) => event.$pallet,
				eventName: (event) => event.eventName,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotAccount,
			resolve: {
				[PolkadotAccountSelector.NetworkAccountId]: async ({ $network, accountId }) => {
					assertPolkadotMainnet($network)
					const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const account = await getAccountBalanceInfo({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
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
				}
			},
		})({
				$$timestamps: (account) => account.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotAccount_Timestamp,
			resolve: {
				[PolkadotAccount_TimestampSelector.AccountTimestampMsSource]: async ({ $account, timestampMs, source }) => {
					if (source !== Source.SubstrateSidecar_Rest) throw new Error(`SubstrateSidecar_Rest: unsupported source ${source}`)
					assertPolkadotMainnet($account.$network)
					const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const account = await getAccountBalanceInfo({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						accountId: $account.accountId,
					})
					return polkadotAccountTimestampFields(
						$account,
						account,
						timestampMs
					)
				},
			},
		})({
				$account: (timestamp) => timestamp.$account,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				nonce: (timestamp) => timestamp.nonce,
				freeBalancePlancks: (timestamp) => timestamp.freeBalancePlancks,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotPallet,
			resolve: {
				[PolkadotPalletSelector.NetworkPalletName]: async ({ $network, palletName }) => {
					assertPolkadotMainnet($network)
					const { getRuntimeMetadata } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const pallet = (await getRuntimeMetadata({ restBaseUrl: await substrateSidecarRestBaseUrl() })).pallets
						.find((runtimePallet) => runtimePallet.name === palletName)
					if (pallet == null) throw new Error(`SubstrateSidecar_Rest: pallet not found for ${palletName}`)
					return {
						index: pallet.index,
					}
				}
			},
		})({
				index: (pallet) => pallet.index,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertPolkadotMainnet(network)
					const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const validators = (await getStakingValidators({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
					})).validators
					if (validators == null)
						throw new Error('SubstrateSidecar_Rest: validators unavailable')

					return validators
						.slice(0, resolverContextRowLimit(context))
						.flatMap((validator) => {
						const stashAccountId = validator.accountId ?? validator.address ?? validator.stashId
						return stashAccountId == null ?
							[]
						:
							[
								{
									[EntityMetaKey.Selector]: {
										$network: network,
										stashAccountId,
									},
								},
							]
						})
				}
			},
		})({
				Polkadot: {
					$$validators: (validators) => validators.map((validator) => ({
						[EntityMetaKey.Selector]: validator[EntityMetaKey.Selector],
					})),
				},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertPolkadotMainnet(network)
					const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const validators = (await getStakingValidators({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
					})).validators
					if (validators == null)
						throw new Error('SubstrateSidecar_Rest: validator count unavailable')

					return validators.length
				}
			},
		})({
				Polkadot: {
					$$validators: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
					assertPolkadotMainnet($network)
					const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						blockId: hash,
					})
					if (BigInt(block.number) === 0n) return undefined
					return {
						[EntityMetaKey.Selector]: {
							$network: $network,
							blockNumber: BigInt(block.number) - 1n,
							hash: block.parentHash,
						},
					}
				}
			},
		})({
				$parent: (parent) => parent,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
					assertPolkadotMainnet($network)
					const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						blockId: hash,
					})
					return block.extrinsics.map((extrinsic, extrinsicIndex) => ({
						[EntityMetaKey.Selector]: {
								$block: {
									$network: $network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
							indexInBlock: extrinsicIndex,
						},
						...(extrinsic.hash != null && {
							hash: extrinsic.hash,
						}),
						...(extrinsic.signature?.signer != null && {
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									accountId: extrinsic.signature.signer,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								palletName: extrinsic.method.pallet,
							},
						},
						callName: extrinsic.method.method,
						...(extrinsic.success != null && {
							success: extrinsic.success,
						}),
					}))
				}
			},
		})({
				$$extrinsics: (extrinsics) => extrinsics,
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
					assertPolkadotMainnet($network)
					const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
					const block = await getBlock({
						restBaseUrl: await substrateSidecarRestBaseUrl(),
						blockId: hash,
					})
					return ([
						...(block.onInitialize?.events ?? []),
						...block.extrinsics.flatMap((extrinsic, extrinsicIndex) => (
						(extrinsic.events ?? []).map((event) => ({
							...event,
							extrinsicIndex,
						}))
						)),
						...(block.onFinalize?.events ?? []),
					]).map((event: SidecarBlockEvent, eventIndex) => {
						const [
							palletName,
						eventName,
					] = event.method.split('.')

						return {
							[EntityMetaKey.Selector]: {
								$block: {
									$network: $network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
								indexInBlock: eventIndex,
							},
							...(event.extrinsicIndex != null && {
								$extrinsic: {
									[EntityMetaKey.Selector]: {
										$block: {
										$network: $network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
										indexInBlock: event.extrinsicIndex,
									},
								},
							}),
							$pallet: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									palletName,
								},
							},
							eventName: eventName,
						}
					})
				}
			},
		})({
				$$events: (events) => events,
			}),
	],
}

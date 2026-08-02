import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { SidecarBlock } from '$/sources/SubstrateSidecar/Rest/types.ts'

type SidecarBlockEvent = {
	method: string
	extrinsicIndex?: number
}

type PolkadotNetworkId = EntitySelector<typeof schema, EntityType.Network>

type NetworkId = PolkadotNetworkId | { $network: PolkadotNetworkId }

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

const polkadotExtrinsicFields = (
	network: PolkadotNetworkId,
	extrinsic: SidecarBlock['extrinsics'][number]
) => ({
	...(extrinsic.hash != null && {
		hash: extrinsic.hash,
	}),
	...(extrinsic.signature?.signer != null && {
		$signer: {
			[EntityMetaKey.Selector]: {
				$network: network,
				accountId: extrinsic.signature.signer,
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
})

const polkadotBlockEvents = (block: SidecarBlock) => [
	...(block.onInitialize?.events ?? []),
	...block.extrinsics.flatMap((extrinsic, extrinsicIndex) => (
		(extrinsic.events ?? []).map((event) => ({
			...event,
			extrinsicIndex,
		}))
	)),
	...(block.onFinalize?.events ?? []),
]

const polkadotEventFields = (
	network: PolkadotNetworkId,
	block: SidecarBlock,
	event: SidecarBlockEvent
) => {
	const [
		palletName,
		eventName,
	] = event.method.split('.')

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

export default {
	source: Source.SubstrateSidecar_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				NetworkBlockNumberHash: {
					resolve: async ({ $network, hash }) => {
						assertPolkadotMainnet($network)
						const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const block = await getBlock({
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
										$network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
									indexInBlock: extrinsicIndex,
								},
								...polkadotExtrinsicFields($network, extrinsic),
							})),
							$$events: polkadotBlockEvents(block).map((event, eventIndex) => ({
								[EntityMetaKey.Selector]: {
									$block: {
										$network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
									indexInBlock: eventIndex,
								},
								...polkadotEventFields(
									$network,
									block,
									event
								),
							})),
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			$$extrinsics: (block) => block.$$extrinsics.map((extrinsic) => ({
				[EntityMetaKey.Selector]: extrinsic[EntityMetaKey.Selector],
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')]: extrinsic.hash,
					[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$signer')]: extrinsic.$signer,
					[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$pallet')]: extrinsic.$pallet,
					[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'callName')]: extrinsic.callName,
					[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'success')]: extrinsic.success,
				},
			})),
			$$events: (block) => block.$$events.map((event) => ({
				[EntityMetaKey.Selector]: event[EntityMetaKey.Selector],
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.PolkadotEvent, [], '$extrinsic')]: event.$extrinsic,
					[entityFieldAddressKey(EntityType.PolkadotEvent, [], '$pallet')]: event.$pallet,
					[entityFieldAddressKey(EntityType.PolkadotEvent, [], 'eventName')]: event.eventName,
				},
			})),
		}),

		defineResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				BlockIndexInBlock: {
					resolve: async ({ $block, indexInBlock }) => {
						assertPolkadotMainnet($block.$network)
						const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const block = await getBlock({
							blockId: $block.blockNumber.toString(),
						})
						const extrinsic = block.extrinsics.at(indexInBlock)
						if (extrinsic == null)
							throw new Error(`SubstrateSidecar_Rest: missing extrinsic ${indexInBlock}`)
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
							blockId: $block.blockNumber.toString(),
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
							index: pallet.index,
						}
					},
				}
			},
		})({
				index: (pallet) => pallet.index,
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
					},
				}
			},
		})({
				Polkadot: {
					$$validators: (validators) => validators.map((validator) => ({
						[EntityMetaKey.Selector]: validator[EntityMetaKey.Selector],
					})),
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertPolkadotMainnet(network)
						const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
						const validators = (await getStakingValidators()).validators
						if (validators == null)
							throw new Error('SubstrateSidecar_Rest: validator count unavailable')

						return validators.length
					},
				}
			},
		})({
				Polkadot: {
					$$validators: {
						resolveCount: (count) => count,
					},
				},
			}),

	],
} satisfies RegisteredSourceResolverModule

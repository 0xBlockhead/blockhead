import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	polkadotMainnetCaip2,
	substrateSidecarDefaultLocalRestUrl,
} from '$/constants/PolkadotNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { PolkadotExtrinsicSelector } from '$/schema/PolkadotExtrinsic.ts'
import { PolkadotEventSelector } from '$/schema/PolkadotEvent.ts'
import { PolkadotAccountSelector } from '$/schema/PolkadotAccount.ts'
import { PolkadotPalletSelector } from '$/schema/PolkadotPallet.ts'
import { PolkadotValidatorSelector } from '$/schema/PolkadotValidator.ts'
import { PolkadotNetworkSelector } from '$/schema/PolkadotNetwork.ts'

type SidecarBlockEvent = {
	method: string
	extrinsicIndex?: number
}

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertPolkadotMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== polkadotMainnetCaip2.namespace
		|| network.caip2.reference !== polkadotMainnetCaip2.reference
	) {
		throw new Error('SubstrateSidecar_Rest: unsupported network')
	}
}

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
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
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
								$network: entitySelector.$network,
								blockNumber: BigInt(block.number),
								hash: block.hash,
							},
							extrinsicIndex,
						},
						...(extrinsic.hash != null && {
							hash: extrinsic.hash,
						}),
						...(extrinsic.signature?.signer != null && {
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									accountId: extrinsic.signature.signer,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
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
									$network: entitySelector.$network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
								eventIndex,
							},
							...(event.extrinsicIndex != null && {
								$extrinsic: {
									[EntityMetaKey.Selector]: {
										$block: {
											$network: entitySelector.$network,
											blockNumber: BigInt(block.number),
											hash: block.hash,
										},
										extrinsicIndex: event.extrinsicIndex,
									},
								},
							}),
							$pallet: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									palletName,
								},
							},
							eventName: eventName,
						}
					}),
				}
			}
			}
		})({
				fields: {
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			$$extrinsics: (block) => block.$$extrinsics,
			$$events: (block) => block.$$events,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				[PolkadotExtrinsicSelector.PolkadotBlockExtrinsicIndex]: async ({ $block, extrinsicIndex }) => {
				assertPolkadotMainnet($block.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: $block.hash,
				})
				const extrinsic = block.extrinsics.at(extrinsicIndex)
				if (extrinsic == null) {
					throw new Error(`SubstrateSidecar_Rest: missing extrinsic ${extrinsicIndex}`)
				}
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
			}
		})({
				fields: {
			hash: (extrinsic) => extrinsic.hash,
			$signer: (extrinsic) => extrinsic.$signer,
			$pallet: (extrinsic) => extrinsic.$pallet,
			callName: (extrinsic) => extrinsic.callName,
			success: (extrinsic) => extrinsic.success,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotEvent,
			resolve: {
				[PolkadotEventSelector.PolkadotBlockEventIndex]: async ({ $block, eventIndex }) => {
				assertPolkadotMainnet($block.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: $block.hash,
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
				].at(eventIndex)
				if (event == null) {
					throw new Error(`SubstrateSidecar_Rest: missing event ${eventIndex}`)
				}
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
								extrinsicIndex: event.extrinsicIndex,
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
			}
		})({
				fields: {
			$extrinsic: (event) => event.$extrinsic,
			$pallet: (event) => event.$pallet,
			eventName: (event) => event.eventName,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotAccount,
			resolve: {
				[PolkadotAccountSelector.NetworkAccountId]: async ({ $network, accountId }) => {
				assertPolkadotMainnet($network)
				const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const account = await getAccountBalanceInfo({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					accountId: accountId,
				})
				return {
					...(account.nonce != null && {
						nonce: BigInt(account.nonce),
					}),
					...(account.free != null && {
						freeBalancePlancks: BigInt(account.free),
					}),
				}
			}
			}
		})({
				fields: {
			nonce: (account) => account.nonce,
			freeBalancePlancks: (account) => account.freeBalancePlancks,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotPallet,
			resolve: {
				[PolkadotPalletSelector.NetworkPalletName]: async ({ $network, palletName }) => {
				assertPolkadotMainnet($network)
				const { getRuntimeMetadata } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const pallet = (await getRuntimeMetadata({ restBaseUrl: substrateSidecarDefaultLocalRestUrl })).pallets
					.find((runtimePallet) => runtimePallet.name === entitySelector.palletName)
				if (pallet == null) throw new Error(`SubstrateSidecar_Rest: pallet not found for ${palletName}`)
				return {
					index: pallet.index,
				}
			}
			}
		})({
				fields: {
			index: (pallet) => pallet.index,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotValidator,
			resolve: {
				[PolkadotValidatorSelector.NetworkStashAccountId]: async ({ $network, stashAccountId }) => {
				assertPolkadotMainnet($network)
				const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const validator = (await getStakingValidators({ restBaseUrl: substrateSidecarDefaultLocalRestUrl })).validators
					?.find((stakingValidator) => (
						stakingValidator.accountId === entitySelector.stashAccountId
						|| stakingValidator.address === entitySelector.stashAccountId
						|| stakingValidator.stashId === entitySelector.stashAccountId
					))
				if (validator == null) throw new Error(`SubstrateSidecar_Rest: validator not found for ${stashAccountId}`)
				return {
					...(validator.controllerId != null && {
						$controller: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								accountId: validator.controllerId,
							},
						},
					}),
					...(validator.commission != null && {
						commissionPerBillion: Number(validator.commission),
					}),
					...(validator.totalStake != null && {
						totalStakePlancks: BigInt(validator.totalStake),
					}),
				}
			}
			}
		})({
				fields: {
			$controller: (validator) => validator.$controller,
			commissionPerBillion: (validator) => validator.commissionPerBillion,
			totalStakePlancks: (validator) => validator.totalStakePlancks,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[PolkadotNetworkSelector.Network]: async (entitySelector) => {
				assertPolkadotMainnet(entitySelector)
				const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				return ((await getStakingValidators({ restBaseUrl: substrateSidecarDefaultLocalRestUrl })).validators ?? [])
					.slice(0, 64)
					.flatMap((validator) => {
						const stashAccountId = validator.accountId ?? validator.address ?? validator.stashId
						return stashAccountId == null ?
							[]
						:
							[
								{
									[EntityMetaKey.Selector]: {
										$network: entitySelector,
										stashAccountId,
									},
									...(validator.controllerId != null && {
										$controller: {
											[EntityMetaKey.Selector]: {
												$network: entitySelector,
												accountId: validator.controllerId,
											},
										},
									}),
									...(validator.commission != null && {
										commissionPerBillion: Number(validator.commission),
									}),
									...(validator.totalStake != null && {
										totalStakePlancks: BigInt(validator.totalStake),
									}),
								},
							]
					})
			}
			}
		})({
				fields: {
			$$validators: (validators) => validators,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
				assertPolkadotMainnet($network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
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
			}
		})({
				fields: {
			$parent: (parent) => parent,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
				assertPolkadotMainnet($network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: hash,
				})
				return block.extrinsics.map((extrinsic, extrinsicIndex) => ({
					[EntityMetaKey.Selector]: {
						$block: {
							$network: entitySelector.$network,
							blockNumber: BigInt(block.number),
							hash: block.hash,
						},
						extrinsicIndex,
					},
					...(extrinsic.hash != null && {
						hash: extrinsic.hash,
					}),
					...(extrinsic.signature?.signer != null && {
						$signer: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								accountId: extrinsic.signature.signer,
							},
						},
					}),
					$pallet: {
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							palletName: extrinsic.method.pallet,
						},
					},
					callName: extrinsic.method.method,
					...(extrinsic.success != null && {
						success: extrinsic.success,
					}),
				}))
			}
			}
		})({
				fields: {
			$$extrinsics: (extrinsics) => extrinsics,
		},
			}),

		defineResolver(Source.SubstrateSidecar_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, hash }) => {
				assertPolkadotMainnet($network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
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
								$network: entitySelector.$network,
								blockNumber: BigInt(block.number),
								hash: block.hash,
							},
							eventIndex,
						},
						...(event.extrinsicIndex != null && {
							$extrinsic: {
								[EntityMetaKey.Selector]: {
									$block: {
										$network: entitySelector.$network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
									extrinsicIndex: event.extrinsicIndex,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								palletName,
							},
						},
						eventName: eventName,
					}
				})
			}
			}
		})({
				fields: {
			$$events: (events) => events,
		},
			}),
	],
}

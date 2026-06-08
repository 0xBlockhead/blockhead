import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	polkadotMainnetCaip2,
	substrateSidecarDefaultLocalRestUrl,
} from '$/constants/PolkadotNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

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
		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: entityId.hash ?? entityId.blockNumber,
				})
				return {
					hash: block.hash,
					...(BigInt(block.number) > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: BigInt(block.number) - 1n,
								hash: block.parentHash,
							},
						},
					}),
					stateRoot: block.stateRoot,
					extrinsicsRoot: block.extrinsicsRoot,
					$$extrinsics: block.extrinsics.map((extrinsic, extrinsicIndex) => ({
						[EntityMetaKey.Id]: {
							$block: {
								$network: entityId.$network,
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
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									accountId: extrinsic.signature.signer,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
							[EntityMetaKey.Id]: {
								$block: {
									$network: entityId.$network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
								eventIndex,
							},
							...(event.extrinsicIndex != null && {
								$extrinsic: {
									[EntityMetaKey.Id]: {
										$block: {
											$network: entityId.$network,
											blockNumber: BigInt(block.number),
											hash: block.hash,
										},
										extrinsicIndex: event.extrinsicIndex,
									},
								},
							}),
							$pallet: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									palletName,
								},
							},
							eventName: eventName,
						}
					}),
				}
			}
			},
			fields: {
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			stateRoot: (block) => block.stateRoot,
			extrinsicsRoot: (block) => block.extrinsicsRoot,
			$$extrinsics: (block) => block.$$extrinsics,
			$$events: (block) => block.$$events,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: entityId.$block.hash ?? entityId.$block.blockNumber,
				})
				const extrinsic = block.extrinsics.at(entityId.extrinsicIndex)
				if (extrinsic == null) {
					throw new Error(`SubstrateSidecar_Rest: missing extrinsic ${entityId.extrinsicIndex}`)
				}
				return {
					...(extrinsic.hash != null && {
						hash: extrinsic.hash,
					}),
					...(extrinsic.signature?.signer != null && {
						$signer: {
							[EntityMetaKey.Id]: {
								$network: entityId.$block.$network,
								accountId: extrinsic.signature.signer,
							},
						},
					}),
					$pallet: {
						[EntityMetaKey.Id]: {
							$network: entityId.$block.$network,
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
			fields: {
			hash: (extrinsic) => extrinsic.hash,
			$signer: (extrinsic) => extrinsic.$signer,
			$pallet: (extrinsic) => extrinsic.$pallet,
			callName: (extrinsic) => extrinsic.callName,
			success: (extrinsic) => extrinsic.success,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotEvent,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: entityId.$block.hash ?? entityId.$block.blockNumber,
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
				].at(entityId.eventIndex)
				if (event == null) {
					throw new Error(`SubstrateSidecar_Rest: missing event ${entityId.eventIndex}`)
				}
				const [
					palletName,
					eventName,
				] = event.method.split('.')
				return {
					...(event.extrinsicIndex != null && {
						$extrinsic: {
							[EntityMetaKey.Id]: {
								$block: {
									$network: entityId.$block.$network,
									blockNumber: BigInt(block.number),
									hash: block.hash,
								},
								extrinsicIndex: event.extrinsicIndex,
							},
						},
					}),
					$pallet: {
						[EntityMetaKey.Id]: {
							$network: entityId.$block.$network,
							palletName,
						},
					},
					eventName: eventName,
				}
			}
			},
			fields: {
			$extrinsic: (event) => event.$extrinsic,
			$pallet: (event) => event.$pallet,
			eventName: (event) => event.eventName,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const account = await getAccountBalanceInfo({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					accountId: entityId.accountId,
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
			},
			fields: {
			nonce: (account) => account.nonce,
			freeBalancePlancks: (account) => account.freeBalancePlancks,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotPallet,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getRuntimeMetadata } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const pallet = (await getRuntimeMetadata({ restBaseUrl: substrateSidecarDefaultLocalRestUrl })).pallets
					.find((runtimePallet) => runtimePallet.name === entityId.palletName)
				if (pallet == null) throw new Error(`SubstrateSidecar_Rest: pallet not found for ${entityId.palletName}`)
				return {
					index: pallet.index,
				}
			}
			},
			fields: {
			index: (pallet) => pallet.index,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotValidator,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const validator = (await getStakingValidators({ restBaseUrl: substrateSidecarDefaultLocalRestUrl })).validators
					?.find((stakingValidator) => (
						stakingValidator.accountId === entityId.stashAccountId
						|| stakingValidator.address === entityId.stashAccountId
						|| stakingValidator.stashId === entityId.stashAccountId
					))
				if (validator == null) throw new Error(`SubstrateSidecar_Rest: validator not found for ${entityId.stashAccountId}`)
				return {
					...(validator.controllerId != null && {
						$controller: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
			},
			fields: {
			$controller: (validator) => validator.$controller,
			commissionPerBillion: (validator) => validator.commissionPerBillion,
			totalStakePlancks: (validator) => validator.totalStakePlancks,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId)
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
									[EntityMetaKey.Id]: {
										$network: entityId,
										stashAccountId,
									},
									...(validator.controllerId != null && {
										$controller: {
											[EntityMetaKey.Id]: {
												$network: entityId,
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
			},
			fields: {
			$$validators: (validators) => validators,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: entityId.hash ?? entityId.blockNumber,
				})
				if (BigInt(block.number) === 0n) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						blockNumber: BigInt(block.number) - 1n,
						hash: block.parentHash,
					},
				}
			}
			},
			fields: {
			$parent: (parent) => parent,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: entityId.hash ?? entityId.blockNumber,
				})
				return block.extrinsics.map((extrinsic, extrinsicIndex) => ({
					[EntityMetaKey.Id]: {
						$block: {
							$network: entityId.$network,
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
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								accountId: extrinsic.signature.signer,
							},
						},
					}),
					$pallet: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
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
			fields: {
			$$extrinsics: (extrinsics) => extrinsics,
		}
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: substrateSidecarDefaultLocalRestUrl,
					blockId: entityId.hash ?? entityId.blockNumber,
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
						[EntityMetaKey.Id]: {
							$block: {
								$network: entityId.$network,
								blockNumber: BigInt(block.number),
								hash: block.hash,
							},
							eventIndex,
						},
						...(event.extrinsicIndex != null && {
							$extrinsic: {
								[EntityMetaKey.Id]: {
									$block: {
										$network: entityId.$network,
										blockNumber: BigInt(block.number),
										hash: block.hash,
									},
									extrinsicIndex: event.extrinsicIndex,
								},
							},
						}),
						$pallet: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								palletName,
							},
						},
						eventName: eventName,
					}
				})
			}
			},
			fields: {
			$$events: (events) => events,
		}
		}),
	],
}

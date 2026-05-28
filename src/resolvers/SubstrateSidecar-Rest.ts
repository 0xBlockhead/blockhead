import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type SidecarBlockEvent = {
	method: string
	extrinsicIndex?: number
}

const sidecarRestUrl = 'http://127.0.0.1:8080'

const assertPolkadotMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Polkadot || network.reference !== '91b171bb158e2d3848fa23a9f1c25182') {
		throw new Error(`SubstrateSidecar_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

export default {
	source: Source.SubstrateSidecar_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: sidecarRestUrl,
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
							eventName: eventName ?? event.method,
						}
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotExtrinsic,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: sidecarRestUrl,
					blockId: entityId.$block.hash ?? entityId.$block.blockNumber,
				})
				const extrinsic = block.extrinsics[entityId.extrinsicIndex]
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotEvent,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$block.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: sidecarRestUrl,
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
				][entityId.eventIndex]
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
					eventName: eventName ?? event.method,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotAccount,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getAccountBalanceInfo } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const account = await getAccountBalanceInfo({
					restBaseUrl: sidecarRestUrl,
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotPallet,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getRuntimeMetadata } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const pallet = (await getRuntimeMetadata({ restBaseUrl: sidecarRestUrl })).pallets
					.find((runtimePallet) => runtimePallet.name === entityId.palletName)
				if (pallet == null) throw new Error(`SubstrateSidecar_Rest: pallet not found for ${entityId.palletName}`)
				return {
					index: pallet.index,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotValidator,
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getStakingValidators } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const validator = (await getStakingValidators({ restBaseUrl: sidecarRestUrl })).validators
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
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.PolkadotBlock,
			fieldName: '$parent',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: sidecarRestUrl,
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotBlock,
			fieldName: '$$extrinsics',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: sidecarRestUrl,
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.PolkadotBlock,
			fieldName: '$$events',
			resolve: async (entityId) => {
				assertPolkadotMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/SubstrateSidecar/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: sidecarRestUrl,
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
						eventName: eventName ?? event.method,
					}
				})
			},
		}),
	],
}

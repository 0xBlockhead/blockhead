import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { StarknetContractSelector } from '$/schema/StarknetContract.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

type NetworkIdentity = EntitySelector<typeof schema, EntityType.Network>

const starkscanBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Starkscan_Rest
		&& binding.target.kind === SourceTargetKind.Global
		&& binding.target.key === 'starkscan-api'
	))

if (starkscanBindings.length !== 1)
	throw new Error('Starkscan_Rest: canonical Starkscan API binding is missing or ambiguous')

const [starkscanBinding] = starkscanBindings

const starknetContractApplicability = [
	{
		$network: {
			$network: {
				caip2: networkBySlug.starknet.caip2,
			},
		},
	},
	{
		$network: {
			$network: {
				slug: networkBySlug.starknet.slug,
			},
		},
	},
] as const

const assertStarknetMainnet = (network: NetworkIdentity) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.starknet.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.starknet.caip2.namespace
			&& network.caip2.reference === networkBySlug.starknet.caip2.reference
		)
	)
		return

	throw new Error('Starkscan_Rest: unsupported network')
}

const canonicalFelt = (
	value: string,
	label: string
) => {
	if (!/^0[xX][\da-fA-F]{1,64}$/.test(value) || BigInt(value) >= 2n ** 251n)
		throw new Error(`Starkscan_Rest: malformed ${label}`)

	return `0x${BigInt(value).toString(16)}`
}

export default {
	source: Source.Starkscan_Rest,

	resolvers: [
		defineResolver(Source.Starkscan_Rest, {
			entityType: EntityType.StarknetContract,
			resolve: {
				[StarknetContractSelector.NetworkAddress]: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract, context) => {
						assertStarknetMainnet(contract.$network.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const { getAddressTransactions } = await import('$/sources/Starkscan/Rest/queries.ts')

						return {
							limit,
							page: await getAddressTransactions(
								starkscanBinding,
								{
									address: canonicalFelt(contract.address, 'contract address'),
									limit,
									cursor: context.providerContinuationToken,
								}
							),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, contract) => page.items.map((transaction) => {
					const transactionSelector = {
						$network: contract.$network,
						transactionHash: canonicalFelt(transaction.txHash, 'transaction hash'),
					}
					const senderAddress = (
						transaction.fromAddress == null ?
							undefined
						:
							canonicalFelt(transaction.fromAddress, 'sender address')
					)

					return {
						[EntityMetaKey.Selector]: transactionSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'transactionKind')]: transaction.txType ?? undefined,
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
								[EntityMetaKey.Selector]: {
									$network: contract.$network,
									blockNumber: BigInt(transaction.blockNumber),
								},
							},
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'senderAddress')]: senderAddress,
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$senderContract')]: (
								senderAddress == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: (
											BigInt(senderAddress) === BigInt(contract.address) ?
												contract
											:
												{
													$network: contract.$network,
													address: senderAddress,
												}
										),
									}
							),
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$$timestamps')]: (
								transaction.timestampIso == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$transaction: transactionSelector,
											timestampMs: Date.parse(transaction.timestampIso),
											source: Source.Starkscan_Rest,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: BigInt(transaction.blockNumber),
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: transaction.finalityStatus ?? undefined,
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: transaction.executionStatus ?? undefined,
										},
									}]
							),
						},
					}
				}),
				continuation: ({ limit, page }, contract) => (
					limit === 0 || page.nextCursor == null ?
						{
							operation: 'contract-transactions',
							target: contract.address,
							terminal: true,
						}
					:
						{
							operation: 'contract-transactions',
							target: contract.address,
							terminal: false,
							token: page.nextCursor,
						}
				),
			},
		}),
	],
}

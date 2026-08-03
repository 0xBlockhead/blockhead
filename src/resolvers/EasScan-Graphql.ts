import { networks } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>

const zeroAddress = `0x${'0'.repeat(40)}`
const zeroUid = `0x${'0'.repeat(64)}`

const zeroExHex = (value: string): `0x${string}` => (
	`0x${value.slice(2).toLowerCase()}`
)

const easScanNetwork = ($network: NetworkSelector) => {
	const network = (
		'caip2' in $network ?
			networks.find((network) => (
				'caip2' in network
				&& network.caip2.namespace === $network.caip2.namespace
				&& network.caip2.reference === $network.caip2.reference
			))
		:
			networks.find((network) => network.slug === $network.slug)
	)
	const networkKey = (
		'caip2' in $network ?
			`${$network.caip2.namespace}:${$network.caip2.reference}`
		:
			network != null && 'caip2' in network ?
				`${network.caip2.namespace}:${network.caip2.reference}`
			:
				undefined
	)
	if (networkKey == null)
		throw new Error('EasScan_Graphql: network has no CAIP-2 identity')

	return networkKey
}

const evmNetworkAccount = (
	$network: NetworkSelector,
	address: string
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		$actor: {
			address: zeroExHex(address),
		},
	},
})

const easAttestationResolver = defineResolver({
	entityType: EntityType.EasAttestation,
	resolve: {
		NetworkUid: {
			resolve: async (entitySelector) => {
				const network = easScanNetwork(entitySelector.$network)
				const { getAttestation } = await import('$/sources/EasScan/Graphql/queries.ts')
				const attestation = await getAttestation({
					network,
					uid: entitySelector.uid,
				})
				if (attestation == null)
					throw new Error('EasScan_Graphql: attestation not found')

				const schemaUid = zeroExHex(attestation.schemaId)
				const recipient = zeroExHex(attestation.recipient)
				const attester = zeroExHex(attestation.attester)
				const refUid = zeroExHex(attestation.refUID)

				return {
					schemaUid,
					$schema: {
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							schemaUid,
						},
					},
					recipient,
					$recipientAccount: evmNetworkAccount(entitySelector.$network, recipient),
					attester,
					$attesterAccount: evmNetworkAccount(entitySelector.$network, attester),
					...(refUid !== zeroUid && {
						refUid,
						$refAttestation: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								uid: refUid,
							},
						},
					}),
					attestedAt: attestation.time,
					...(attestation.expirationTime !== 0 && {
						expirationTime: attestation.expirationTime,
					}),
					revocable: attestation.revocable,
					data: zeroExHex(attestation.data),
					$$timestamps: [{
						[EntityMetaKey.Selector]: {
							$attestation: entitySelector,
							timestampMs: Date.now(),
							source: Source.EasScan_Graphql,
						},
					}],
				}
			},
		},
	},
})({
	schemaUid: (attestation) => attestation.schemaUid,
	$schema: (attestation) => attestation.$schema,
	recipient: (attestation) => attestation.recipient,
	$recipientAccount: (attestation) => attestation.$recipientAccount,
	attester: (attestation) => attestation.attester,
	$attesterAccount: (attestation) => attestation.$attesterAccount,
	refUid: (attestation) => attestation.refUid,
	$refAttestation: (attestation) => attestation.$refAttestation,
	attestedAt: (attestation) => attestation.attestedAt,
	expirationTime: (attestation) => attestation.expirationTime,
	revocable: (attestation) => attestation.revocable,
	data: (attestation) => attestation.data,
	$$timestamps: (attestation) => attestation.$$timestamps,
})

const easAttestationTimestampResolver = defineResolver({
	entityType: EntityType.EasAttestation_Timestamp,
	resolve: {
		AttestationTimestampMsSource: {
			resolve: async ({
				$attestation,
				timestampMs,
				source,
			}) => {
				if (source !== Source.EasScan_Graphql)
					throw new Error('EasScan_Graphql: observation source mismatch')

				const network = easScanNetwork($attestation.$network)
				const { getAttestation } = await import('$/sources/EasScan/Graphql/queries.ts')
				const attestation = await getAttestation({
					network,
					uid: $attestation.uid,
				})
				if (attestation == null)
					throw new Error('EasScan_Graphql: attestation not found')

				const expired = (
					attestation.expirationTime !== 0
					&& attestation.expirationTime * 1_000 <= timestampMs
				)

				return {
					revoked: attestation.revoked,
					...(attestation.revocationTime !== 0 && {
						revocationTime: attestation.revocationTime,
					}),
					valid: !attestation.revoked && !expired,
					expired,
					transactionHash: zeroExHex(attestation.txid),
				}
			},
		},
	},
})({
	revoked: (attestation) => attestation.revoked,
	revocationTime: (attestation) => attestation.revocationTime,
	valid: (attestation) => attestation.valid,
	expired: (attestation) => attestation.expired,
	transactionHash: (attestation) => attestation.transactionHash,
})

const easSchemaResolver = defineResolver({
	entityType: EntityType.EasSchema,
	resolve: {
		NetworkSchemaUid: {
			resolve: async (entitySelector, context) => {
				const network = easScanNetwork(entitySelector.$network)
				const {
					getAttestationsBySchema,
					getSchema,
				} = await import('$/sources/EasScan/Graphql/queries.ts')
				const schema = await getSchema({
					network,
					schemaUid: entitySelector.schemaUid,
				})
				if (schema == null)
					throw new Error('EasScan_Graphql: schema not found')

				const resolver = zeroExHex(schema.resolver)
				const registerer = zeroExHex(schema.creator)
				const registeredLogIndex = Number(schema.index)
				if (!Number.isSafeInteger(registeredLogIndex))
					throw new Error('EasScan_Graphql: schema log index exceeds safe integer range')

				return {
					schema: schema.schema,
					...(resolver !== zeroAddress && {
						resolver,
						$resolverContract: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								address: resolver,
							},
						},
					}),
					revocable: schema.revocable,
					registerer,
					$registererAccount: evmNetworkAccount(entitySelector.$network, registerer),
					registeredAt: schema.time,
					registeredTransactionHash: zeroExHex(schema.txid),
					registeredLogIndex,
					$$attestations: (
						await getAttestationsBySchema({
							network,
							schemaUid: entitySelector.schemaUid,
							skip: context.pagination.offset ?? 0,
							take: Math.min(resolverContextRowLimit(context), 100),
						})
					).map((attestation) => ({
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							uid: zeroExHex(attestation.id),
						},
					})),
				}
			},
		},
	},
})({
	schema: (schema) => schema.schema,
	resolver: (schema) => schema.resolver,
	$resolverContract: (schema) => schema.$resolverContract,
	revocable: (schema) => schema.revocable,
	registerer: (schema) => schema.registerer,
	$registererAccount: (schema) => schema.$registererAccount,
	registeredAt: (schema) => schema.registeredAt,
	registeredTransactionHash: (schema) => schema.registeredTransactionHash,
	registeredLogIndex: (schema) => schema.registeredLogIndex,
	$$attestations: (schema) => schema.$$attestations,
})

export {
	easAttestationResolver,
	easAttestationTimestampResolver,
	easSchemaResolver,
}

export default {
	source: Source.EasScan_Graphql,

	resolvers: [
		easAttestationResolver,
		easAttestationTimestampResolver,
		easSchemaResolver,
	],
} satisfies RegisteredSourceResolverModule

import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type SignatureObservation = {
	signatures: string[]
	filteredSignatureCount?: number
	verifiedCandidateCount?: number
	reachable: boolean
}

const getFunctionObservation = async (hex: `0x${string}`): Promise<SignatureObservation> => {
	const {
		getFunctionEntries,
		summarizeOpenchainEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getFunctionEntries({ hex })
	return {
		...summarizeOpenchainEntries(openchainEntries),
		reachable: true,
	}
}

const getEventObservation = async (hex: `0x${string}`): Promise<SignatureObservation> => {
	const {
		getEventEntries,
		summarizeOpenchainEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getEventEntries({ hex })
	return {
		...summarizeOpenchainEntries(openchainEntries),
		reachable: true,
	}
}

const isErrorSignature = (signature: string) => (
	signature.startsWith('Error(')
	|| signature.startsWith('Panic(')
	|| /^[A-Z][a-zA-Z0-9_]*\(/.test(signature)
)

const getErrorObservation = async (hex: `0x${string}`): Promise<SignatureObservation> => {
	const {
		getFunctionEntries,
		summarizeOpenchainEntries,
	} = await import('$/sources/Openchain/Rest/queries.ts')
	const openchainEntries = await getFunctionEntries({ hex })
	return {
		...summarizeOpenchainEntries(
			openchainEntries.filter((entry) => isErrorSignature(entry.name))
		),
		reachable: true,
	}
}

export default {
	source: Source.Openchain_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmSelector,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const observation = await getFunctionObservation(hex)
						return {
							signatures: observation.signatures,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$selector: { hex },
										timestampMs: Date.now(),
										source: Source.Openchain_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'signatures')]: observation.signatures,
										...(observation.filteredSignatureCount != null && {
											[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'filteredSignatureCount')]: observation.filteredSignatureCount,
										}),
										...(observation.verifiedCandidateCount != null && {
											[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'verifiedCandidateCount')]: observation.verifiedCandidateCount,
										}),
										[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'reachable')]: observation.reachable,
									},
								},
							],
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmTopic,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const observation = await getEventObservation(hex)
						return {
							signatures: observation.signatures,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$topic: { hex },
										timestampMs: Date.now(),
										source: Source.Openchain_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'signatures')]: observation.signatures,
										...(observation.filteredSignatureCount != null && {
											[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'filteredSignatureCount')]: observation.filteredSignatureCount,
										}),
										...(observation.verifiedCandidateCount != null && {
											[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'verifiedCandidateCount')]: observation.verifiedCandidateCount,
										}),
										[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'reachable')]: observation.reachable,
									},
								},
							],
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmError,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const observation = await getErrorObservation(hex)
						return {
							signatures: observation.signatures,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$error: { hex },
										timestampMs: Date.now(),
										source: Source.Openchain_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'signatures')]: observation.signatures,
										...(observation.filteredSignatureCount != null && {
											[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'filteredSignatureCount')]: observation.filteredSignatureCount,
										}),
										...(observation.verifiedCandidateCount != null && {
											[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'verifiedCandidateCount')]: observation.verifiedCandidateCount,
										}),
										[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'reachable')]: observation.reachable,
									},
								},
							],
						}
					},
				},
			},
		})({
			signatures: (snapshot) => snapshot.signatures,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule

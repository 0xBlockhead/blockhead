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

const isErrorSignature = (signature: string) => (
	signature.startsWith('Error(')
	|| signature.startsWith('Panic(')
	|| /^[A-Z][a-zA-Z0-9_]*\(/.test(signature)
)

export default {
	source: Source.FourByteDirectory_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmSelector,
			resolve: {
				Hex: {
					resolve: async ({ hex }) => {
						const { getFunctionEntries } = await import('$/sources/FourByteDirectory/Rest/queries.ts')
						const signatures = (await getFunctionEntries({ hex })).map((entry) => entry.text_signature)
						return {
							signatures,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$selector: { hex },
									timestampMs: Date.now(),
									source: Source.FourByteDirectory_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'signatures')]: signatures,
									[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'reachable')]: true,
								},
							}],
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
						const { getEventEntries } = await import('$/sources/FourByteDirectory/Rest/queries.ts')
						const signatures = (await getEventEntries({ hex })).map((entry) => entry.text_signature)
						return {
							signatures,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$topic: { hex },
									timestampMs: Date.now(),
									source: Source.FourByteDirectory_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'signatures')]: signatures,
									[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'reachable')]: true,
								},
							}],
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
						const { getFunctionEntries } = await import('$/sources/FourByteDirectory/Rest/queries.ts')
						const signatures = (
							await getFunctionEntries({ hex })
						).map((entry) => entry.text_signature).filter(isErrorSignature)
						return {
							signatures,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$error: { hex },
									timestampMs: Date.now(),
									source: Source.FourByteDirectory_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'signatures')]: signatures,
									[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'reachable')]: true,
								},
							}],
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

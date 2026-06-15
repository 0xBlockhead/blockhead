import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { EvmSelectorSelector } from '$/schema/EvmSelector.ts'
import { EvmTopicSelector } from '$/schema/EvmTopic.ts'
import { EvmErrorSelector } from '$/schema/EvmError.ts'

export default {
	source: Source.Openchain_Rest,

	resolvers: [
		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmSelector,
			resolve: {
				[EvmSelectorSelector.Hex]: async ({ hex }) => {
				const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await getFunctionEntries({ hex: hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			}
			}
		})({
				fields: {
			signatures: (snapshot) => snapshot.signatures,
		},
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmTopic,
			resolve: {
				[EvmTopicSelector.Hex]: async ({ hex }) => {
				const { getEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await getEventEntries({ hex: hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			}
			}
		})({
				fields: {
			signatures: (snapshot) => snapshot.signatures,
		},
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmError,
			resolve: {
				[EvmErrorSelector.Hex]: async ({ hex }) => {
				const { getErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
				return {
					signatures: (await getErrorEntries({ hex: hex })).map(
						(signatureEntry) => signatureEntry.name,
					),
				}
			}
			}
		})({
				fields: {
			signatures: (snapshot) => snapshot.signatures,
		},
			}),
	],
}

import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { EvmError_TimestampSelector } from '$/schema/EvmError_Timestamp.ts'
import { EvmSelectorSelector } from '$/schema/EvmSelector.ts'
import { EvmSelector_TimestampSelector } from '$/schema/EvmSelector_Timestamp.ts'
import { EvmTopicSelector } from '$/schema/EvmTopic.ts'
import { EvmTopic_TimestampSelector } from '$/schema/EvmTopic_Timestamp.ts'
import { EvmErrorSelector } from '$/schema/EvmError.ts'

export default {
	source: Source.Openchain_Rest,

	resolvers: [
		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmSelector,
			resolve: {
				[EvmSelectorSelector.Hex]: async ({ hex }) => {
					const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
					return [
						{
							[EntityMetaKey.Selector]: {
								$selector: { hex },
								timestampMs: Date.now(),
								source: Source.Openchain_Rest,
							},
							signatures: (await getFunctionEntries({ hex })).map((signatureEntry) => signatureEntry.name),
						},
					]
				},
			},
		})({
			fields: {
				signatures: (timestamps) => timestamps.flatMap((timestamp) => timestamp.signatures),
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmSelector_Timestamp,
			resolve: {
				[EvmSelector_TimestampSelector.SelectorTimestampMsSource]: async ({ $selector }) => {
					const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
					return {
						signatures: (await getFunctionEntries({ hex: $selector.hex })).map((signatureEntry) => signatureEntry.name),
					}
				},
			},
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
					return [
						{
							[EntityMetaKey.Selector]: {
								$topic: { hex },
								timestampMs: Date.now(),
								source: Source.Openchain_Rest,
							},
							signatures: (await getEventEntries({ hex })).map((signatureEntry) => signatureEntry.name),
						},
					]
				},
			},
		})({
			fields: {
				signatures: (timestamps) => timestamps.flatMap((timestamp) => timestamp.signatures),
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmTopic_Timestamp,
			resolve: {
				[EvmTopic_TimestampSelector.TopicTimestampMsSource]: async ({ $topic }) => {
					const { getEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
					return {
						signatures: (await getEventEntries({ hex: $topic.hex })).map((signatureEntry) => signatureEntry.name),
					}
				},
			},
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
					return [
						{
							[EntityMetaKey.Selector]: {
								$error: { hex },
								timestampMs: Date.now(),
								source: Source.Openchain_Rest,
							},
							signatures: (await getErrorEntries({ hex })).map((signatureEntry) => signatureEntry.name),
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmError_Timestamp,
			resolve: {
				[EvmError_TimestampSelector.ErrorTimestampMsSource]: async ({ $error }) => {
					const { getErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
					return {
						signatures: (await getErrorEntries({ hex: $error.hex })).map((signatureEntry) => signatureEntry.name),
					}
				},
			},
		})({
			fields: {
				signatures: (snapshot) => snapshot.signatures,
			},
		}),
	],
}

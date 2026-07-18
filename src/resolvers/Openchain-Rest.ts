import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
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
				[EvmSelectorSelector.Hex]: {
					resolve: async ({ hex }) => {
						const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
						return [
							{
								[EntityMetaKey.Selector]: {
									$selector: { hex },
									timestampMs: Date.now(),
									source: Source.Openchain_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'signatures')]: (await getFunctionEntries({ hex })).map((signatureEntry) => signatureEntry.name),
								},
							},
						]
					},
				},
			},
		})({
				signatures: (timestamps) => timestamps.flatMap((timestamp) => (
					timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'signatures')]
				)),
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmSelector_Timestamp,
			resolve: {
				[EvmSelector_TimestampSelector.SelectorTimestampMsSource]: {
					resolve: async ({ $selector }) => {
						const { getFunctionEntries } = await import('$/sources/Openchain/Rest/queries.ts')
						return {
							signatures: (await getFunctionEntries({ hex: $selector.hex })).map((signatureEntry) => signatureEntry.name),
						}
					},
				},
			},
		})({
				signatures: (snapshot) => snapshot.signatures,
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmTopic,
			resolve: {
				[EvmTopicSelector.Hex]: {
					resolve: async ({ hex }) => {
						const { getEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
						const topicObservation = await getEventEntries({ hex })
							.then((signatureEntries) => ({
								signatures: signatureEntries.map((signatureEntry) => signatureEntry.name),
							}))
							.catch(() => ({
								signatures: [] as string[],
							}))
						return [
							{
								[EntityMetaKey.Selector]: {
									$topic: { hex },
									timestampMs: Date.now(),
									source: Source.Openchain_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'signatures')]: topicObservation.signatures,
								},
							},
						]
					},
				},
			},
		})({
				signatures: (timestamps) => timestamps.flatMap((timestamp) => (
					timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTopic_Timestamp, [], 'signatures')]
				)),
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmTopic_Timestamp,
			resolve: {
				[EvmTopic_TimestampSelector.TopicTimestampMsSource]: {
					resolve: async ({ $topic }) => {
						const { getEventEntries } = await import('$/sources/Openchain/Rest/queries.ts')
						return getEventEntries({ hex: $topic.hex })
							.then((signatureEntries) => ({
								signatures: signatureEntries.map((signatureEntry) => signatureEntry.name),
								reachable: true,
							}))
							.catch(() => ({
								signatures: [] as string[],
								reachable: false,
							}))
					},
				},
			},
		})({
				signatures: (snapshot) => snapshot.signatures,
				filteredSignatureCount: () => undefined,
				verifiedCandidateCount: () => undefined,
				reachable: (snapshot) => snapshot.reachable,
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmError,
			resolve: {
				[EvmErrorSelector.Hex]: {
					resolve: async ({ hex }) => {
						const { getErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
						const errorObservation = await getErrorEntries({ hex })
							.then((signatureEntries) => ({
								signatures: signatureEntries.map((signatureEntry) => signatureEntry.name),
								reachable: true,
							}))
							.catch(() => ({
								signatures: [],
								reachable: false,
							}))
						return [
							{
								[EntityMetaKey.Selector]: {
									$error: { hex },
									timestampMs: Date.now(),
									source: Source.Openchain_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'signatures')]: errorObservation.signatures,
									[entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'reachable')]: errorObservation.reachable,
								},
							},
						]
					},
				},
			},
		})({
				signatures: (timestamps) => timestamps.flatMap((timestamp) => (
					timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmError_Timestamp, [], 'signatures')]
				)),
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Openchain_Rest, {
			entityType: EntityType.EvmError_Timestamp,
			resolve: {
				[EvmError_TimestampSelector.ErrorTimestampMsSource]: {
					resolve: async ({ $error }) => {
						const { getErrorEntries } = await import('$/sources/Openchain/Rest/queries.ts')
						return getErrorEntries({ hex: $error.hex })
							.then((signatureEntries) => ({
								signatures: signatureEntries.map((signatureEntry) => signatureEntry.name),
								reachable: true,
							}))
							.catch(() => ({
								signatures: [],
								reachable: false,
							}))
					},
				},
			},
		})({
				signatures: (snapshot) => snapshot.signatures,
				reachable: (snapshot) => snapshot.reachable,
			}),
	],
}

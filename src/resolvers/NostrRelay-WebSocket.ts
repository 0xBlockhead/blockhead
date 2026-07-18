import {
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { nostrNoteFieldValuesFromEvent } from '$/resolvers/NostrBand-Rest.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NostrRelaySelector } from '$/schema/NostrRelay.ts'
import { Source } from '$/sources/Source.ts'
import type { NostrRelayEvent } from '$/sources/NostrRelay/WebSocket/types.ts'
import {
	isJsonArray,
	isJsonNumber,
	isJsonString,
} from '$/typescript/JsonValue.ts'

const noteFromRelayEvent = (event: NostrRelayEvent) => {
	if (
		!isJsonString(event.id)
		|| !/^[0-9a-f]{64}$/i.test(event.id)
		|| !isJsonString(event.pubkey)
		|| !/^[0-9a-f]{64}$/i.test(event.pubkey)
		|| !isJsonNumber(event.kind)
		|| event.kind !== 1
		|| !isJsonNumber(event.created_at)
		|| !isJsonString(event.content)
		|| !isJsonString(event.sig)
		|| !/^[0-9a-f]{128}$/i.test(event.sig)
		|| !isJsonArray(event.tags)
		|| !event.tags.every((tag) => (
			isJsonArray(tag)
			&& tag.every(isJsonString)
		))
	) return undefined

	return nostrNoteFieldValuesFromEvent({
		id: event.id,
		pubkey: event.pubkey,
		kind: event.kind,
		created_at: event.created_at,
		content: event.content,
		sig: event.sig,
		tags: event.tags,
	})
}

export default {
	source: Source.NostrRelay_WebSocket,

	resolvers: [
		defineResolver(Source.NostrRelay_WebSocket, {
			entityType: EntityType.NostrRelay,
			resolve: {
				[NostrRelaySelector.RelayUrl]: {
					resolve: async ({ relayUrl }) => ({
						relayUrl,
					}),
				},
			},
			resolveLive: {
				notes: {
					facetPath: [],
					publishes: {
						'$$notes': true,
					},
					start: async ({
						fields,
						parentEntitySelector,
						signal,
						trigger,
					}) => {
						const notesByEventId = new Map<
							string,
							NonNullable<ReturnType<typeof noteFromRelayEvent>>
						>()
						const limit = resolverContextRowLimit(trigger)
						const { openRelaySubscription } = await import('$/sources/NostrRelay/WebSocket/queries.ts')
						const subscription = openRelaySubscription({
							relayUrl: parentEntitySelector.relayUrl,
							subscriptionId: 'blockhead-live-notes',
							filters: [{
								kinds: [1],
								limit,
							}],
							signal,
							maxSeenEventIds: Math.max(limit * 16, 1_024),
							onEvent: (subscriptionEvent) => {
								if (subscriptionEvent.type !== 'event')
									return

								const note = noteFromRelayEvent(subscriptionEvent.event)
								if (note == null || notesByEventId.has(note.eventId))
									return

								notesByEventId.set(note.eventId, note)
								if (notesByEventId.size > limit) {
									const oldestEventId = notesByEventId.keys().next().value
									if (oldestEventId != null)
										notesByEventId.delete(oldestEventId)
								}

								const notes = [...notesByEventId.values()].map((value) => ({
									[EntityMetaKey.Selector]: {
										eventId: value.eventId,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(value)
											.filter(([fieldName, fieldValue]) => (
												fieldName !== 'eventId'
												&& fieldValue !== undefined
											))
											.map(([fieldName, fieldValue]) => [
												entityFieldAddressKey(EntityType.NostrNote, [], fieldName),
												fieldValue,
											])
									),
								}))
								fields.$$notes.replaceRows([{
									source: Source.NostrRelay_WebSocket,
									value: notes,
								}])
								fields.$$notes.count.replaceRows([{
									source: Source.NostrRelay_WebSocket,
									value: notes.length,
								}])
							},
						})

						return subscription.close
					},
				},
			},
		})({
			relayUrl: (relay) => relay.relayUrl,
			$$notes: () => [],
		}),
	],
}

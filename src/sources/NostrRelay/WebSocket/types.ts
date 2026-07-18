import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'

export type NostrRelayMessage = readonly JsonValue[]

export type NostrRelayFilter = JsonObject & {
	since?: number
	until?: number
}

export type NostrRelayEvent = JsonObject & {
	id: string
	created_at: number
}

export type NostrRelaySubscriptionEvent =
	| {
		type: 'event'
		relayUrl: string
		subscriptionId: string
		event: NostrRelayEvent
	}
	| {
		type: 'eose'
		relayUrl: string
		subscriptionId: string
	}
	| {
		type: 'closed'
		relayUrl: string
		subscriptionId: string
		reason: string
	}

export type NostrRelaySocket = Pick<
	WebSocket,
	| 'readyState'
	| 'send'
	| 'close'
	| 'addEventListener'
	| 'removeEventListener'
>

import type {
	NostrRelayEvent,
	NostrRelayFilter,
	NostrRelayMessage,
	NostrRelaySocket,
	NostrRelaySubscriptionEvent,
} from '$/sources/NostrRelay/WebSocket/types.ts'
import bindings from '$/sources/NostrRelay/bindings.ts'
import {
	validateNostrEvent,
	validatedNostrEventFromContent,
} from '$/sources/NostrRelay/Nip01/event.ts'
import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import {
	isJsonArray,
	isJsonNumber,
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type NostrRelayList = {
	eventId: string
	pubkey: string
	createdAt: number
	relays: {
		relayUrl: string
		read: boolean
		write: boolean
	}[]
}

export type NostrZapRequest = {
	eventId: string
	senderPubkey: string
	recipientPubkey: string
	createdAt: number
	content: string
	relayUrls: string[]
	amountMillisats?: string
	lnurl?: string
	targetEventId?: string
	targetCoordinate?: string
	targetKind?: string
	receiptPubkey?: string
}

export type NostrZapReceipt = {
	eventId: string
	receiptPubkey: string
	createdAt: number
	request: NostrZapRequest
	bolt11: string
	preimage?: string
}

export type NostrCommentTarget =
	| {
		type: 'event'
		eventId: string
		kind: number
		authorPubkey: string
	}
	| {
		type: 'addressable'
		coordinate: string
		kind: number
		authorPubkey: string
		eventId?: string
	}
	| {
		type: 'external'
		identifier: string
		kind: string
	}

export type NostrComment = {
	eventId: string
	authorPubkey: string
	createdAt: number
	content: string
	tags: string[][]
	root: NostrCommentTarget
	parent: NostrCommentTarget
}

const lowercaseHex64 = /^[0-9a-f]{64}$/

function singleTagValue(
	tags: readonly string[][],
	name: string,
	required: true
): string
function singleTagValue(
	tags: readonly string[][],
	name: string,
	required?: false
): string | undefined
function singleTagValue(
	tags: readonly string[][],
	name: string,
	required = false
) {
	const matchingTags = tags.filter((tag) => tag[0] === name)
	if (matchingTags.length > 1 || (required && matchingTags.length !== 1))
		throw new Error(`NIP-57 ${name} tag cardinality is invalid`)
	const value = matchingTags[0]?.at(1)
	if (matchingTags.length === 1 && (value == null || value === ''))
		throw new Error(`NIP-57 ${name} tag value is invalid`)
	return value
}

const nostrZapTargetFromTags = (tags: readonly string[][]) => {
	const targetEventId = singleTagValue(tags, 'e')
	if (targetEventId != null && !lowercaseHex64.test(targetEventId))
		throw new Error('NIP-57 e tag must be a lowercase event id')
	const targetCoordinate = singleTagValue(tags, 'a')
	if (
		targetCoordinate != null
		&& !/^3[0-9]{4}:[0-9a-f]{64}:.+$/.test(targetCoordinate)
	) throw new Error('NIP-57 a tag must be an addressable event coordinate')
	const targetKind = singleTagValue(tags, 'k')
	if (
		targetKind != null
		&& (!/^(0|[1-9][0-9]*)$/.test(targetKind) || Number(targetKind) > 65_535)
	) throw new Error('NIP-57 k tag must be a valid event kind')
	return {
		targetEventId,
		targetCoordinate,
		targetKind,
	}
}

const nostrCommentKind = (value: string) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value) || Number(value) > 65_535)
		return undefined
	return Number(value)
}

const validExternalNostrIdentifier = (
	identifier: string,
	kind: string
) => (
	(
		kind === 'web'
		&& ['http:', 'https:'].includes(URL.parse(identifier)?.protocol ?? '')
	)
	|| (kind === 'isbn' && /^isbn:[0-9]+$/.test(identifier))
	|| (kind === 'geo' && /^geo:[a-z0-9]+$/.test(identifier))
	|| (kind === 'iso3166' && /^iso3166:[A-Z]{2}(?:-[A-Z0-9]+)?$/.test(identifier))
	|| (kind === 'isan' && /^isan:.+$/.test(identifier))
	|| (kind === 'doi' && /^doi:.+$/.test(identifier))
	|| (kind === '#' && /^#.+$/.test(identifier))
	|| (
		[
			'podcast:guid',
			'podcast:item:guid',
			'podcast:publisher:guid',
		].includes(kind)
		&& identifier.startsWith(`${kind}:`)
	)
	|| (
		/^[a-z0-9-]+:(?:tx|address)$/.test(kind)
		&& identifier.startsWith(`${kind.split(':')[0]}:`)
		&& identifier.includes(`:${kind.endsWith(':tx') ? 'tx' : 'address'}:`)
	)
)

const nostrCommentTargetFromTags = (
	tags: readonly string[][],
	root: boolean
): NostrCommentTarget => {
	const eventName = root ? 'E' : 'e'
	const addressName = root ? 'A' : 'a'
	const externalName = root ? 'I' : 'i'
	const kindName = root ? 'K' : 'k'
	const authorName = root ? 'P' : 'p'
	const eventTags = tags.filter((tag) => tag[0] === eventName)
	const addressTags = tags.filter((tag) => tag[0] === addressName)
	const externalTags = tags.filter((tag) => tag[0] === externalName)
	if (
		addressTags.length > 1
		|| externalTags.length > 1
		|| eventTags.length > 1
		|| (root && addressTags.length === 1 && eventTags.length > 0)
		|| externalTags.length + addressTags.length + (addressTags.length === 0 ? eventTags.length : 0) !== 1
	) throw new Error(`NIP-22 ${root ? 'root' : 'parent'} target cardinality is invalid`)
	const kindValue = singleTagValue(tags, kindName, true)
	const numericKind = nostrCommentKind(kindValue)

	if (externalTags.length === 1) {
		if (numericKind != null || !validExternalNostrIdentifier(externalTags[0][1] ?? '', kindValue))
			throw new Error(`NIP-22 ${root ? 'root' : 'parent'} external target is invalid`)
		return {
			type: 'external',
			identifier: externalTags[0][1],
			kind: kindValue,
		}
	}

	if (numericKind == null || numericKind === 1)
		throw new Error(`NIP-22 ${root ? 'root' : 'parent'} event kind is invalid`)
	const authorPubkey = singleTagValue(tags, authorName, true)
	if (!lowercaseHex64.test(authorPubkey))
		throw new Error(`NIP-22 ${root ? 'root' : 'parent'} author is invalid`)

	if (addressTags.length === 1) {
		const coordinate = addressTags[0].at(1) ?? ''
		const match = /^([0-9]+):([0-9a-f]{64}):(.*)$/.exec(coordinate)
		if (
			match == null
			|| Number(match[1]) !== numericKind
			|| match[2] !== authorPubkey
			|| !(
				numericKind === 0
				|| numericKind === 3
				|| (numericKind >= 10_000 && numericKind < 20_000)
				|| (numericKind >= 30_000 && numericKind < 40_000)
			)
		) throw new Error(`NIP-22 ${root ? 'root' : 'parent'} addressable target is invalid`)
		const supplementalEventId = eventTags[0]?.at(1)
		if (supplementalEventId != null && !lowercaseHex64.test(supplementalEventId))
			throw new Error('NIP-22 supplemental parent event id is invalid')
		return {
			type: 'addressable',
			coordinate,
			kind: numericKind,
			authorPubkey,
			...(supplementalEventId != null && { eventId: supplementalEventId }),
		}
	}

	const eventId = eventTags[0]?.at(1)
	if (eventId == null || !lowercaseHex64.test(eventId))
		throw new Error(`NIP-22 ${root ? 'root' : 'parent'} event id is invalid`)
	const hintedAuthor = eventTags[0].at(3)
	if (hintedAuthor != null && hintedAuthor !== '' && hintedAuthor !== authorPubkey)
		throw new Error(`NIP-22 ${root ? 'root' : 'parent'} author hint does not match`)
	return {
		type: 'event',
		eventId,
		kind: numericKind,
		authorPubkey,
	}
}

export const relayWebSocketUrl = (relayUrl: string) => {
	if (relayUrl.length === 0 || relayUrl.length > 2_048)
		throw new Error('Nostr relay URL length is invalid')
	if (/[\u0000-\u001f\u007f]/.test(relayUrl))
		throw new Error('Nostr relay URL contains control characters')
	if (
		/^[a-z][a-z0-9+.-]*:\/\/[^/?#]*(?:\/[^?#]*)?/i
			.exec(relayUrl)?.[0]
			.match(/%(?:0[0-9a-f]|1[0-9a-f]|2e|2f|5c|7f)/i)
	)
		throw new Error('Nostr relay URL contains encoded path traversal')

	const url = new URL(relayUrl)
	if (!['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol))
		throw new Error('Nostr relay URL must use ws, wss, http, or https')
	if (url.username !== '' || url.password !== '')
		throw new Error('Nostr relay URL must not contain credentials')
	if (url.hash !== '')
		throw new Error('Nostr relay URL must not contain a fragment')
	if (url.hostname.length === 0 || url.hostname.length > 253)
		throw new Error('Nostr relay URL host length is invalid')

	if (url.protocol === 'https:')
		url.protocol = 'wss:'
	else if (url.protocol === 'http:')
		url.protocol = 'ws:'

	return url.toString()
}

export const nostrRelayListFromEvent = (
	event: NostrRelayEvent,
	pubkey?: string
): NostrRelayList => {
	const validatedEvent = validateNostrEvent(event, {
		pubkey,
		kinds: [10_002],
	})
	const accessByRelayUrl = new Map<string, {
		read: boolean
		write: boolean
	}>()

	for (const tag of validatedEvent.tags) {
		const relayUrlValue = tag.at(1)
		const marker = tag.at(2)
		if (
			tag[0] !== 'r'
			|| relayUrlValue == null
			|| tag.length > 3
			|| (marker != null && marker !== 'read' && marker !== 'write')
		) continue

		let relayUrl: string
		try {
			relayUrl = relayWebSocketUrl(relayUrlValue)
		} catch {
			continue
		}

		const access = accessByRelayUrl.get(relayUrl) ?? {
			read: false,
			write: false,
		}
		accessByRelayUrl.set(relayUrl, {
			read: access.read || marker !== 'write',
			write: access.write || marker !== 'read',
		})
	}

	return {
		eventId: validatedEvent.id,
		pubkey: validatedEvent.pubkey,
		createdAt: validatedEvent.created_at,
		relays: [...accessByRelayUrl].map(([relayUrl, access]) => ({
			relayUrl,
			...access,
		})),
	}
}

export const latestNostrRelayListFromEvents = (
	events: readonly NostrRelayEvent[],
	pubkey: string
) => (
	events
		.flatMap((event) => {
			try {
				return [nostrRelayListFromEvent(event, pubkey)]
			} catch {
				return []
			}
		})
		.sort((left, right) => (
			right.createdAt - left.createdAt
			|| left.eventId.localeCompare(right.eventId)
		))[0]
)

export const nostrZapRequestFromEvent = (
	event: NostrRelayEvent
): NostrZapRequest => {
	const validatedEvent = validateNostrEvent(event, {
		kinds: [9_734],
	})
	const recipientPubkey = singleTagValue(validatedEvent.tags, 'p', true)
	if (!lowercaseHex64.test(recipientPubkey))
		throw new Error('NIP-57 p tag must be a lowercase pubkey')
	const receiptPubkey = singleTagValue(validatedEvent.tags, 'P')
	if (receiptPubkey != null && !lowercaseHex64.test(receiptPubkey))
		throw new Error('NIP-57 P tag must be a lowercase pubkey')
	const amountMillisats = singleTagValue(validatedEvent.tags, 'amount')
	if (amountMillisats != null && !/^[1-9][0-9]*$/.test(amountMillisats))
		throw new Error('NIP-57 amount tag must be positive integer millisats')
	const relayTags = validatedEvent.tags.filter((tag) => tag[0] === 'relays')
	if (relayTags.length !== 1)
		throw new Error('NIP-57 relays tag cardinality is invalid')
	const relayUrls = [
		...new Set(
			(relayTags[0].slice(1))
				.flatMap((relayUrl) => {
					try {
						return [relayWebSocketUrl(relayUrl)]
					} catch {
						return []
					}
				})
		),
	]
	if (relayUrls.length === 0)
		throw new Error('NIP-57 relays tag contains no valid relay URLs')

	return {
		eventId: validatedEvent.id,
		senderPubkey: validatedEvent.pubkey,
		recipientPubkey,
		createdAt: validatedEvent.created_at,
		content: validatedEvent.content,
		relayUrls,
		...nostrZapTargetFromTags(validatedEvent.tags),
		...(amountMillisats != null && { amountMillisats }),
		...((lnurl) => lnurl != null && { lnurl })(
			singleTagValue(validatedEvent.tags, 'lnurl')
		),
		...(receiptPubkey != null && { receiptPubkey }),
	}
}

export const nostrZapReceiptFromEvent = (
	event: NostrRelayEvent,
	expected: {
		receiptPubkey?: string
		recipientPubkey?: string
	} = {}
): NostrZapReceipt => {
	const validatedEvent = validateNostrEvent(event, {
		pubkey: expected.receiptPubkey,
		kinds: [9_735],
	})
	const description = singleTagValue(validatedEvent.tags, 'description', true)
	const embeddedRequest = validatedNostrEventFromContent(description, {
		kinds: [9_734],
	})
	if (embeddedRequest == null)
		throw new Error('NIP-57 description is not a valid signed zap request')
	const request = nostrZapRequestFromEvent(embeddedRequest)
	const recipientPubkey = singleTagValue(validatedEvent.tags, 'p', true)
	if (
		recipientPubkey !== request.recipientPubkey
		|| (expected.recipientPubkey != null && recipientPubkey !== expected.recipientPubkey)
	) throw new Error('NIP-57 receipt recipient does not match the zap request')
	const senderPubkey = singleTagValue(validatedEvent.tags, 'P')
	if (senderPubkey != null && senderPubkey !== request.senderPubkey)
		throw new Error('NIP-57 receipt sender does not match the zap request')
	if (request.receiptPubkey != null && request.receiptPubkey !== validatedEvent.pubkey)
		throw new Error('NIP-57 requested receipt pubkey does not match the receipt')
	const receiptTarget = nostrZapTargetFromTags(validatedEvent.tags)
	if (
		receiptTarget.targetEventId !== request.targetEventId
		|| receiptTarget.targetCoordinate !== request.targetCoordinate
	) throw new Error('NIP-57 receipt target does not match the zap request')

	return {
		eventId: validatedEvent.id,
		receiptPubkey: validatedEvent.pubkey,
		createdAt: validatedEvent.created_at,
		request,
		bolt11: singleTagValue(validatedEvent.tags, 'bolt11', true),
		...((preimage) => preimage != null && { preimage })(
			singleTagValue(validatedEvent.tags, 'preimage')
		),
	}
}

export const nostrCommentFromEvent = (
	event: NostrRelayEvent
): NostrComment => {
	const validatedEvent = validateNostrEvent(event, {
		kinds: [1_111],
	})
	return {
		eventId: validatedEvent.id,
		authorPubkey: validatedEvent.pubkey,
		createdAt: validatedEvent.created_at,
		content: validatedEvent.content,
		tags: validatedEvent.tags,
		root: nostrCommentTargetFromTags(validatedEvent.tags, true),
		parent: nostrCommentTargetFromTags(validatedEvent.tags, false),
	}
}

export const openRelaySocket = (relayUrl: string) => new WebSocket(relayWebSocketUrl(relayUrl))

export const sendRelayMessage = (
	socket: NostrRelaySocket,
	message: NostrRelayMessage
) => {
	socket.send(JSON.stringify(message))
}

export const listRelayEvents = ({
	relayUrl,
	filters,
	signal,
	timeoutMs = 10_000,
	socketFactory = openRelaySocket,
}: {
	relayUrl: string
	filters: readonly NostrRelayFilter[]
	signal?: AbortSignal
	timeoutMs?: number
	socketFactory?: (relayUrl: string) => NostrRelaySocket
}) => {
	if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1)
		throw new Error('Nostr relay snapshot timeout must be a positive integer')

	return new Promise<NostrRelayEvent[]>((resolve, reject) => {
		const timeoutController = new AbortController()
		const querySignal = signal == null ?
			timeoutController.signal
		:
			AbortSignal.any([
				signal,
				timeoutController.signal,
			])
		const events: NostrRelayEvent[] = []
		let settled = false
		let subscription: ReturnType<typeof openRelaySubscription> | undefined
		const timeout = setTimeout(() => {
			timeoutController.abort(new Error(`Nostr relay snapshot timed out after ${timeoutMs}ms`))
		}, timeoutMs)
		const settle = (
			settlement: () => void,
			closeSubscription = true
		) => {
			if (settled) return
			settled = true
			clearTimeout(timeout)
			querySignal.removeEventListener('abort', abort)
			if (closeSubscription)
				subscription?.close()
			settlement()
		}
		const abort = () => settle(() => reject(querySignal.reason))

		querySignal.addEventListener('abort', abort, {
			once: true,
		})
		subscription = openRelaySubscription({
			relayUrl,
			subscriptionId: 'blockhead-snapshot',
			filters,
			signal: querySignal,
			socketFactory,
			onEvent: (event) => {
				if (event.type === 'event') {
					events.push(event.event)
					return
				}
				if (event.type === 'eose') {
					settle(() => resolve(events))
					return
				}
				settle(
					() => reject(new Error(`Nostr relay snapshot closed: ${event.reason}`)),
					false
				)
			},
		})
		if (querySignal.aborted)
			abort()
	})
}

type NostrRelaySnapshotOperationGroup =
	| SourceOperationGroup.NostrRelayRead
	| SourceOperationGroup.NostrSearch

export const nostrRelaySnapshotBindings = (
	operationGroup: NostrRelaySnapshotOperationGroup = SourceOperationGroup.NostrRelayRead
) => {
	const selectedBindings = bindings[Source.NostrRelay_WebSocket].filter((binding) => (
		binding.operationGroups.some((candidate) => candidate === operationGroup)
	))
	if (selectedBindings.length === 0)
		throw new Error('Nostr relay snapshot has no selected WebSocket bindings')

	return selectedBindings
}

export const listNostrRelayEvents = async ({
	filters,
	operationGroup = SourceOperationGroup.NostrRelayRead,
	signal,
	timeoutMs = 10_000,
	readRelayEvents = listRelayEvents,
}: {
	filters: readonly NostrRelayFilter[]
	operationGroup?: NostrRelaySnapshotOperationGroup
	signal?: AbortSignal
	timeoutMs?: number
	readRelayEvents?: typeof listRelayEvents
}) => {
	const relayUrls = [...new Set(
		nostrRelaySnapshotBindings(operationGroup).flatMap((binding) => (
			binding.endpoints.map((endpoint) => endpoint.locator)
		))
	)]

	const results = await Promise.allSettled(relayUrls.map((relayUrl) => (
		readRelayEvents({
			relayUrl,
			filters,
			signal,
			timeoutMs,
		})
	)))
	const failures = results.flatMap((result) => (
		result.status === 'rejected' ?
			[result.reason]
		:
			[]
	))
	if (failures.length === results.length)
		throw new AggregateError(failures, 'All Nostr relay snapshot bindings failed')

	const eventById = new Map<string, NostrRelayEvent>()
	for (const result of results) {
		if (result.status === 'rejected') continue
		for (const event of result.value)
			if (!eventById.has(event.id))
				eventById.set(event.id, event)
	}

	return (
		[...eventById.values()]
			.sort((left, right) => (
				right.created_at - left.created_at
				|| left.id.localeCompare(right.id)
			))
			.slice(0, filters.reduce<number | undefined>((limit, filter) => (
				limit == null || filter.limit == null ?
					undefined
				:
					limit + filter.limit
			), 0))
	)
}

export const openRelaySubscription = ({
	relayUrl,
	subscriptionId,
	filters,
	signal,
	onEvent,
	socketFactory = openRelaySocket,
	initialReconnectDelayMs = 250,
	maxReconnectDelayMs = 10_000,
	maxSeenEventIds = 100_000,
}: {
	relayUrl: string
	subscriptionId: string
	filters: readonly NostrRelayFilter[]
	signal?: AbortSignal
	onEvent: (event: NostrRelaySubscriptionEvent) => void
	socketFactory?: (relayUrl: string) => NostrRelaySocket
	initialReconnectDelayMs?: number
	maxReconnectDelayMs?: number
	maxSeenEventIds?: number
}) => {
	if (subscriptionId === '')
		throw new Error('Nostr relay subscription id must not be empty')
	if (filters.length === 0)
		throw new Error('Nostr relay subscription requires at least one filter')
	if (
		initialReconnectDelayMs < 0
		|| maxReconnectDelayMs < initialReconnectDelayMs
		|| maxSeenEventIds < 1
	) throw new Error('Nostr relay subscription limits are invalid')

	const normalizedRelayUrl = relayWebSocketUrl(relayUrl)
	let activeSocket: NostrRelaySocket | undefined
	let reconnectTimeout: ReturnType<typeof setTimeout> | undefined
	let reconnectDelayMs = initialReconnectDelayMs
	let highestCreatedAt: number | undefined
	let stopped = false
	const seenEventIds = new Set<string>()

	const requestFilters = () => filters.map((filter) => ({
		...filter,
		...(highestCreatedAt != null && {
			since: Math.max(
				filter.since ?? highestCreatedAt,
				highestCreatedAt
			),
		}),
	}))

	const stop = (sendClose: boolean) => {
		if (stopped) return
		stopped = true
		if (reconnectTimeout != null)
			clearTimeout(reconnectTimeout)
		if (sendClose && activeSocket?.readyState === WebSocket.OPEN)
			sendRelayMessage(activeSocket, [
				'CLOSE',
				subscriptionId,
			])
		activeSocket?.close()
		signal?.removeEventListener('abort', close)
	}
	const close = () => stop(true)
	const closeWithEvent = (
		event: NostrRelaySubscriptionEvent,
		sendClose: boolean
	) => {
		try {
			onEvent(event)
		} finally {
			stop(sendClose)
		}
	}

	const connect = () => {
		if (stopped) return
		const socket = socketFactory(normalizedRelayUrl)
		activeSocket = socket
		let requestSent = false

		const handleOpen = () => {
			if (stopped || activeSocket !== socket || requestSent) return
			requestSent = true
			sendRelayMessage(socket, [
				'REQ',
				subscriptionId,
				...requestFilters(),
			])
		}
		const handleMessage = (messageEvent: MessageEvent) => {
			if (stopped || activeSocket !== socket) return

			let message: JsonValue
			try {
				message = JSON.parse(String(messageEvent.data))
			} catch {
				return
			}
			if (
				!isJsonArray(message)
				|| !isJsonString(message[0])
				|| !isJsonString(message[1])
				|| message[1] !== subscriptionId
			) return

			if (
				message[0] === 'EVENT'
				&& isJsonObject(message[2])
				&& isJsonString(message[2].id)
				&& isJsonNumber(message[2].created_at)
			) {
				const event = {
					...message[2],
					id: message[2].id,
					created_at: message[2].created_at,
				}
				if (seenEventIds.has(event.id)) return
				if (seenEventIds.size >= maxSeenEventIds) {
					closeWithEvent({
						type: 'closed',
						relayUrl: normalizedRelayUrl,
						subscriptionId,
						reason: 'client: event-id limit exceeded',
					}, true)
					return
				}
				seenEventIds.add(event.id)
				highestCreatedAt = Math.max(
					highestCreatedAt ?? event.created_at,
					event.created_at
				)
				onEvent({
					type: 'event',
					relayUrl: normalizedRelayUrl,
					subscriptionId,
					event,
				})
				return
			}

			if (message[0] === 'EOSE') {
				reconnectDelayMs = initialReconnectDelayMs
				onEvent({
					type: 'eose',
					relayUrl: normalizedRelayUrl,
					subscriptionId,
				})
				return
			}

			if (
				message[0] === 'CLOSED'
				&& isJsonString(message[2])
			) {
				closeWithEvent({
					type: 'closed',
					relayUrl: normalizedRelayUrl,
					subscriptionId,
					reason: message[2],
				}, false)
			}
		}
		const handleClose = () => {
			socket.removeEventListener('open', handleOpen)
			socket.removeEventListener('message', handleMessage)
			socket.removeEventListener('close', handleClose)
			if (stopped || activeSocket !== socket) return
			activeSocket = undefined
			reconnectTimeout = setTimeout(() => {
				reconnectTimeout = undefined
				connect()
			}, reconnectDelayMs)
			reconnectDelayMs = Math.min(
				Math.max(1, reconnectDelayMs * 2),
				maxReconnectDelayMs
			)
		}

		socket.addEventListener('open', handleOpen)
		socket.addEventListener('message', handleMessage)
		socket.addEventListener('close', handleClose)
	}

	signal?.addEventListener('abort', close, {
		once: true,
	})
	if (signal?.aborted)
		close()
	else
		connect()

	return {
		close,
	}
}

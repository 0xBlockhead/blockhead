import { sourceBindingId, type SourceBinding } from '$/sources/SourceBinding.ts'
import type { NostrRelaySocket } from './types.ts'
import { NostrReadRequest } from './live-request.ts'
import { isJsonArray, isJsonString, type JsonValue } from '$/typescript/JsonValue.ts'

// Preserve the NIP-01 state machine while the server owns the upstream socket.
// Only REQ is transported; CLOSE cancels the same-origin iterator.
export const openRelayReadSocket = (binding: SourceBinding): NostrRelaySocket => {
	const events = new EventTarget()
	let readyState = 0
	let subscriptionId: string | undefined
	let frames: AsyncIterator<{ type: string; payload?: string | Uint8Array }> | undefined
	let returned = false
	const release = () => {
		if (frames == null || returned) return
		returned = true
		return frames.return?.()
	}
	const close = () => {
		if (readyState === 3) return
		readyState = 3
		void release()?.catch(() => {})
		events.dispatchEvent(new Event('close'))
	}
	const fail = (error: unknown) => {
		if (readyState === 3) return
		events.dispatchEvent(new MessageEvent('message', { data: JSON.stringify([
			'CLOSED', subscriptionId,
			error instanceof Error ? error.message : String(error),
		]) }))
		close()
	}
	queueMicrotask(() => {
		if (readyState === 3) return
		readyState = 1
		events.dispatchEvent(new Event('open'))
	})
	return {
		get readyState() { return readyState },
		addEventListener: events.addEventListener.bind(events),
		removeEventListener: events.removeEventListener.bind(events),
		close,
		send(data) {
			if (readyState !== 1) throw new Error('Nostr read delivery is not open')
			const message: JsonValue = JSON.parse(String(data))
			if (!isJsonArray(message) || !isJsonString(message[1]))
				throw new Error('Nostr read delivery requires a subscription message')
			if (message[0] === 'CLOSE') { close(); return }
			if (message[0] !== 'REQ' || subscriptionId != null)
				throw new Error('Nostr read delivery accepts one REQ only')
			subscriptionId = message[1]
			void (async () => {
				const request = NostrReadRequest.assert({
					bindingId: sourceBindingId(binding),
					targetKey: binding.target.key,
					subscriptionId,
					filters: message.slice(2),
				})
				const { readRelay } = await import('./live.remote.ts')
				if (readyState === 3) return
				frames = readRelay(request)[Symbol.asyncIterator]()
				try {
					for (;;) {
						const frame = await frames.next()
						if (readyState === 3) return
						if (frame.done) throw new Error('Nostr live delivery ended before cancellation')
						if (frame.value.type === 'connected') continue
						if (frame.value.type !== 'message' || typeof frame.value.payload !== 'string')
							throw new Error('Nostr live delivery returned a non-text frame')
						events.dispatchEvent(new MessageEvent('message', { data: frame.value.payload }))
					}
				} finally {
					await release()
				}
			})().catch(fail)
		},
	}
}

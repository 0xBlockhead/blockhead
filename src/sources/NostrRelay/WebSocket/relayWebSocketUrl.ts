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

import { getJson } from '$/lib/http.ts'
import type { NostrRelayInformationDocument } from '$/sources/NostrRelay/Http/types.ts'

const relayInformationUrl = (relayUrl: string) => {
	const url = new URL(relayUrl)
	if (url.protocol === 'wss:')
		url.protocol = 'https:'
	else if (url.protocol === 'ws:')
		url.protocol = 'http:'

	return url.toString()
}

export const fetchRelayInformation = ({
	relayUrl,
	signal,
}: {
	relayUrl: string
	signal?: AbortSignal
}) => (
	getJson<NostrRelayInformationDocument>(relayInformationUrl(relayUrl), {
		origins: [
			{
				origin: new URL(relayInformationUrl(relayUrl)).origin,
				corsEnabled: false,
			},
		],
		init: {
			headers: {
				accept: 'application/nostr+json',
			},
			signal,
		},
	})
)

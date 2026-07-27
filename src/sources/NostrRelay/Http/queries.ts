import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/NostrRelay/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { NostrRelayInformationDocument } from '$/sources/NostrRelay/Http/types.ts'

const nostrRelayNip11BindingByRelayUrl = new Map(
	bindings[Source.NostrRelay_Nip11_Http].map((binding) => [
		binding.target.key,
		binding,
	])
)

export const fetchRelayInformation = ({
	relayUrl,
	signal,
}: {
	relayUrl: string
	signal?: AbortSignal
}) => {
	const binding = nostrRelayNip11BindingByRelayUrl.get(relayUrl)
	if (binding == null)
		throw new Error(`NostrRelay_Nip11_Http: source binding is missing for ${relayUrl}`)

	return sourceFetch(binding, firstHttpUrlForBinding(binding), {
			headers: {
				accept: 'application/nostr+json',
			},
			signal,
	})
		.then(async (response) => {
			if (!response.ok)
				throw new Error(`NostrRelay_Nip11_Http: request failed with ${response.status}`)

			return response.json<NostrRelayInformationDocument>()
		})
}

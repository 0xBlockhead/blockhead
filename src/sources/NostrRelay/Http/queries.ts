import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/NostrRelay/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	nostrRelayInformationDocumentEnvelope,
	type NostrRelayInformationDocument,
} from '$/sources/NostrRelay/Http/types.ts'

const nostrRelayNip11BindingByRelayUrl = new Map(
	bindings[Source.NostrRelay_Nip11_Http].map((binding) => [
		binding.target.key,
		binding,
	])
)

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`NostrRelay_Nip11_Http: invalid ${label} response envelope`)
	}
}

export const fetchRelayInformation = async ({
	relayUrl,
	signal,
}: {
	relayUrl: string
	signal?: AbortSignal
}): Promise<NostrRelayInformationDocument> => {
	const binding = nostrRelayNip11BindingByRelayUrl.get(relayUrl)
	if (binding == null)
		throw new Error(`NostrRelay_Nip11_Http: source binding is missing for ${relayUrl}`)

	const response = await sourceFetch(binding, firstHttpUrlForBinding(binding), {
		headers: {
			accept: 'application/nostr+json',
		},
		signal,
	})
	if (!response.ok)
		throw new Error(`NostrRelay_Nip11_Http: request failed with ${response.status}`)

	const document = await response.json()
	assertEnvelope(nostrRelayInformationDocumentEnvelope, document, 'NIP-11')
	return document as NostrRelayInformationDocument
}

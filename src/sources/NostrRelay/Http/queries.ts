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

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
): _Value => {
	try {
		return envelope.assert(value)
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

	const document = assertEnvelope(
		nostrRelayInformationDocumentEnvelope,
		await response.json(),
		'NIP-11'
	)

	if (
		document.supported_nips != null
		&& new Set(document.supported_nips).size !== document.supported_nips.length
	)
		throw new Error('NostrRelay_Nip11_Http: duplicate supported_nips')

	if (
		document.language_tags != null
		&& new Set(document.language_tags).size !== document.language_tags.length
	)
		throw new Error('NostrRelay_Nip11_Http: duplicate language_tags')

	if (
		document.relay_countries != null
		&& new Set(document.relay_countries).size !== document.relay_countries.length
	)
		throw new Error('NostrRelay_Nip11_Http: duplicate relay_countries')

	if (
		document.tags != null
		&& new Set(document.tags).size !== document.tags.length
	)
		throw new Error('NostrRelay_Nip11_Http: duplicate tags')

	if (
		document.limitation != null
		&& document.limitation.created_at_lower_limit != null
		&& document.limitation.created_at_upper_limit != null
		&& document.limitation.created_at_lower_limit > document.limitation.created_at_upper_limit
	)
		throw new Error('NostrRelay_Nip11_Http: reversed created_at clock limits')

	return document
}

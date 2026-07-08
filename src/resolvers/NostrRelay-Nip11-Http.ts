import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NostrRelaySelector } from '$/schema/NostrRelay.ts'
import { Source } from '$/sources/Source.ts'
import {
	isJsonArray,
	isJsonBoolean,
	isJsonNumber,
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'

const relayFieldValuesFromInformationDocument = (document: Awaited<ReturnType<typeof import('$/sources/NostrRelay/Http/queries.ts').fetchRelayInformation>>) => {
	if (!isJsonObject(document))
		throw new Error('NostrRelay_Nip11_Http: relay information document is not an object')

	const limitation = isJsonObject(document.limitation) ? document.limitation : undefined

	return {
		name: isJsonString(document.name) ? optionalNonemptyString(document.name) : undefined,
		description: isJsonString(document.description) ? optionalNonemptyString(document.description) : undefined,
		software: isJsonString(document.software) ? optionalNonemptyString(document.software) : undefined,
		version: isJsonString(document.version) ? optionalNonemptyString(document.version) : undefined,
		...(isJsonArray(document.supported_nips) && {
			supportedNipCount: document.supported_nips.length,
		}),
		...(isJsonBoolean(document.payment_required) && {
			isPaid: document.payment_required,
		}),
		...(limitation != null && isJsonNumber(limitation.max_limit) && {
			limit: limitation.max_limit,
		}),
	}
}

export default {
	source: Source.NostrRelay_Nip11_Http,

	resolvers: [
		defineResolver(Source.NostrRelay_Nip11_Http, {
			entityType: EntityType.NostrRelay,
			resolve: {
				[NostrRelaySelector.RelayUrl]: async ({ relayUrl }) => {
					const { fetchRelayInformation } = await import('$/sources/NostrRelay/Http/queries.ts')
					return relayFieldValuesFromInformationDocument(
						await fetchRelayInformation({ relayUrl })
					)
				},
			},
		})({
				name: (relay) => relay.name,
				description: (relay) => relay.description,
				software: (relay) => relay.software,
				version: (relay) => relay.version,
				supportedNipCount: (relay) => relay.supportedNipCount,
				isPaid: (relay) => relay.isPaid,
				limit: (relay) => relay.limit,
			}),
	],
}

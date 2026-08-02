import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const normalizeRelayUrl = (relayUrl: string) => {
	const url = new URL(relayUrl.includes('://') ? relayUrl : `wss://${relayUrl}`)
	if (url.protocol !== 'wss:' && url.protocol !== 'ws:')
		throw new Error('NostrRelay_Nip11_Http: relay url must use ws or wss')

	return `${url.protocol}//${url.host}${url.pathname.replace(/\/$/, '')}`
}

export default {
	source: Source.NostrRelay_Nip11_Http,

	resolvers: [
		defineResolver({
			entityType: EntityType.NostrRelay,
			resolve: {
				RelayUrl: {
					resolve: async ({ relayUrl }) => {
						const normalizedRelayUrl = normalizeRelayUrl(relayUrl)
						return {
							relayUrl: normalizedRelayUrl,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$relay: { relayUrl: normalizedRelayUrl },
									timestampMs: Date.now(),
									source: Source.NostrRelay_Nip11_Http,
								},
							}],
						}
					},
				},
			},
		})({
			relayUrl: (relay) => relay.relayUrl,
			$$timestamps: (relay) => relay.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.NostrRelay_Timestamp,
			resolve: {
				RelayTimestampMsSource: {
					appliesTo: [{
						source: Source.NostrRelay_Nip11_Http,
					}],
					resolve: async ({
						$relay,
						timestampMs,
						source,
					}) => {
						if (source !== Source.NostrRelay_Nip11_Http)
							throw new Error(`NostrRelay_Nip11_Http: unsupported source ${source}`)

						const relayUrl = normalizeRelayUrl($relay.relayUrl)
						try {
							const { fetchRelayInformation } = await import('$/sources/NostrRelay/Http/queries.ts')
							const document = await fetchRelayInformation({ relayUrl })
							return {
								$relay: { [EntityMetaKey.Selector]: { relayUrl } },
								timestampMs,
								source,
								reachable: true,
								name: optionalNonemptyString(document.name),
								description: optionalNonemptyString(document.description),
								software: optionalNonemptyString(document.software),
								version: optionalNonemptyString(document.version),
								pubkey: optionalNonemptyString(document.pubkey),
								contact: optionalNonemptyString(document.contact),
								paymentsUrl: optionalNonemptyString(document.payments_url),
								termsOfServiceUrl: optionalNonemptyString(document.terms_of_service),
								iconUrl: optionalNonemptyString(document.icon),
								bannerUrl: optionalNonemptyString(document.banner),
								...(document.supported_nips != null && { supportedNips: document.supported_nips }),
								...(document.limitation != null && {
									limitation: {
										...(document.limitation.max_message_length != null && { maxMessageLength: document.limitation.max_message_length }),
										...(document.limitation.max_subscriptions != null && { maxSubscriptions: document.limitation.max_subscriptions }),
										...(document.limitation.max_filters != null && { maxFilters: document.limitation.max_filters }),
										...(document.limitation.max_limit != null && { maxLimit: document.limitation.max_limit }),
										...(document.limitation.max_subid_length != null && { maxSubscriptionIdLength: document.limitation.max_subid_length }),
										...(document.limitation.max_event_tags != null && { maxEventTags: document.limitation.max_event_tags }),
										...(document.limitation.max_content_length != null && { maxContentLength: document.limitation.max_content_length }),
										...(document.limitation.min_pow_difficulty != null && { minimumProofOfWorkDifficulty: document.limitation.min_pow_difficulty }),
										...(document.limitation.auth_required != null && { authenticationRequired: document.limitation.auth_required }),
										...(document.limitation.payment_required != null && { paymentRequired: document.limitation.payment_required }),
										...(document.limitation.restricted_writes != null && { restrictedWrites: document.limitation.restricted_writes }),
										...(document.limitation.created_at_lower_limit != null && { createdAtLowerLimit: document.limitation.created_at_lower_limit }),
										...(document.limitation.created_at_upper_limit != null && { createdAtUpperLimit: document.limitation.created_at_upper_limit }),
									},
								}),
								...(document.fees != null && { fees: document.fees }),
								...(document.limitation?.payment_required != null && {
									isPaid: document.limitation.payment_required,
								}),
							}
						} catch (error) {
							return {
								$relay: { [EntityMetaKey.Selector]: { relayUrl } },
								timestampMs,
								source,
								reachable: false,
								error: error instanceof Error ? error.message : String(error),
								name: undefined,
								description: undefined,
								software: undefined,
								version: undefined,
								supportedNips: undefined,
								limitation: undefined,
								fees: undefined,
								paymentsUrl: undefined,
								termsOfServiceUrl: undefined,
								iconUrl: undefined,
								bannerUrl: undefined,
								pubkey: undefined,
								contact: undefined,
								isPaid: undefined,
							}
						}
					},
				},
			},
		})({
			$relay: (observation) => observation.$relay,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			name: (observation) => observation.name,
			description: (observation) => observation.description,
			software: (observation) => observation.software,
			version: (observation) => observation.version,
			supportedNips: (observation) => observation.supportedNips,
			limitation: (observation) => observation.limitation,
			fees: (observation) => observation.fees,
			paymentsUrl: (observation) => observation.paymentsUrl,
			termsOfServiceUrl: (observation) => observation.termsOfServiceUrl,
			iconUrl: (observation) => observation.iconUrl,
			bannerUrl: (observation) => observation.bannerUrl,
			pubkey: (observation) => observation.pubkey,
			contact: (observation) => observation.contact,
			isPaid: (observation) => observation.isPaid,
			reachable: (observation) => observation.reachable,
			error: (observation) => observation.error,
		}),
	],
} satisfies RegisteredSourceResolverModule

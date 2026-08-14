import { errorDisplayMessage } from '$/lib/errors.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const normalizeRelayUrl = (relayUrl: string) => {
	const url = new URL(relayUrl.includes('://') ? relayUrl : `wss://${relayUrl}`)
	if (url.protocol !== 'wss:' && url.protocol !== 'ws:')
		throw new Error('NostrRelay_Nip11_Http: relay url must use ws or wss')
	if (url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '')
		throw new Error('NostrRelay_Nip11_Http: relay url must not include credentials, query, or fragment')

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
						const { fetchRelayInformation } = await import('$/sources/NostrRelay/Http/queries.ts')
						try {
							const document = await fetchRelayInformation({ relayUrl: normalizedRelayUrl })
							return {
								relayUrl: normalizedRelayUrl,
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$relay: { relayUrl: normalizedRelayUrl },
										timestampMs: Date.now(),
										source: Source.NostrRelay_Nip11_Http,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'reachable')]: true,
										...(optionalNonemptyString(document.name) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'name')]: optionalNonemptyString(document.name),
										}),
										...(optionalNonemptyString(document.description) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'description')]: optionalNonemptyString(document.description),
										}),
										...(optionalNonemptyString(document.software) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'software')]: optionalNonemptyString(document.software),
										}),
										...(optionalNonemptyString(document.version) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'version')]: optionalNonemptyString(document.version),
										}),
										...(optionalNonemptyString(document.pubkey) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'pubkey')]: optionalNonemptyString(document.pubkey),
										}),
										...(optionalNonemptyString(document.contact) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'contact')]: optionalNonemptyString(document.contact),
										}),
										...(optionalNonemptyString(document.payments_url) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'paymentsUrl')]: optionalNonemptyString(document.payments_url),
										}),
										...(optionalNonemptyString(document.terms_of_service) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'termsOfServiceUrl')]: optionalNonemptyString(document.terms_of_service),
										}),
										...(optionalNonemptyString(document.icon) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'iconUrl')]: optionalNonemptyString(document.icon),
										}),
										...(optionalNonemptyString(document.banner) != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'bannerUrl')]: optionalNonemptyString(document.banner),
										}),
										...(document.supported_nips != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'supportedNips')]: document.supported_nips,
										}),
										...(document.limitation != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'limitation')]: {
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
										...(document.fees != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'fees')]: document.fees,
										}),
										...(document.limitation?.payment_required != null && {
											[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'isPaid')]: document.limitation.payment_required,
										}),
									},
								}],
							}
						} catch (error) {
							return {
								relayUrl: normalizedRelayUrl,
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$relay: { relayUrl: normalizedRelayUrl },
										timestampMs: Date.now(),
										source: Source.NostrRelay_Nip11_Http,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'reachable')]: false,
										[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'error')]: errorDisplayMessage(error),
									},
								}],
							}
						}
					},
				},
			},
		})({
			relayUrl: (relay) => relay.relayUrl,
			$$timestamps: (relay) => relay.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule

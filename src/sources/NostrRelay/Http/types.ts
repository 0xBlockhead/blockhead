export type NostrRelayLimitation = {
	max_message_length?: number
	max_subscriptions?: number
	max_filters?: number
	max_limit?: number
	max_subid_length?: number
	max_event_tags?: number
	max_content_length?: number
	min_pow_difficulty?: number
	auth_required?: boolean
	payment_required?: boolean
	restricted_writes?: boolean
	created_at_lower_limit?: number
	created_at_upper_limit?: number
}

export type NostrRelayFee = {
	amount: number
	unit: string
	period?: number
	kinds?: number[]
}

export type NostrRelayFees = {
	admission?: NostrRelayFee[]
	subscription?: NostrRelayFee[]
	publication?: NostrRelayFee[]
}

export type NostrRelayInformationDocument = {
	name?: string
	description?: string
	pubkey?: string
	contact?: string
	supported_nips?: number[]
	software?: string
	version?: string
	limitation?: NostrRelayLimitation
	fees?: NostrRelayFees
	payments_url?: string
	terms_of_service?: string
	icon?: string
	banner?: string
}

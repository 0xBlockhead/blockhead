export type OpenchainSignatureEntry = {
	name: string
	filtered?: boolean
	hasVerifiedContract?: boolean
}

export type OpenchainLookupResult = {
	function?: Record<string, OpenchainSignatureEntry[] | null>
	event?: Record<string, OpenchainSignatureEntry[]>
}

export type OpenchainLookupResponse = {
	ok?: boolean
	result?: OpenchainLookupResult
}

/** Ethereum Signature Database `GET /signatures/` or `/event-signatures/` */
export type FourbyteSignaturesList = {
	results?: { text_signature: string }[]
}

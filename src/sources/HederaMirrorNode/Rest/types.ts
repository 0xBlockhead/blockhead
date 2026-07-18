// https://docs.hedera.com/api-reference/blocks/get-block-by-hash-or-number
export type HederaMirrorNodeBlock = {
	count: number
	gas_used: number | null
	hapi_version: string | null
	hash: string
	logs_bloom: string | null
	name: string
	number: number
	previous_hash: string
	size: number | null
	timestamp: {
		from: string
		to: string
	}
}

export type HederaMirrorNodeBlocks = {
	blocks: HederaMirrorNodeBlock[]
	links: {
		next: string | null
	}
}

// https://docs.hedera.com/api-reference/accounts/get-account-by-alias-id-or-evm-address
export type HederaMirrorNodeAccount = {
	account: string
}

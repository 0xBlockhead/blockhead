export type Eip8004ScanAgentListItem = {
	token_id: string
	chain_id: number
	contract_address: string
	name?: string | null
	description?: string | null
	image_url?: string | null
	x402_supported?: boolean
	is_active?: boolean
	supported_trust_models?: string[]
}

export type Eip8004ScanAgentsListResponse = {
	success?: boolean
	data?: Eip8004ScanAgentListItem[]
	meta?: {
		pagination?: {
			page?: number
			limit?: number
			total?: number
			hasMore?: boolean
		}
	}
}

export type Eip8004ScanAgentDetail = Eip8004ScanAgentListItem & {
	raw_metadata?: {
		offchain_uri?: string
		offchain_content?: {
			type?: string
		}
	}
	services?: Record<string, {
		endpoint?: string
	}>
}

export type Eip8004ScanAgentDetailResponse = {
	success?: boolean
	data?: Eip8004ScanAgentDetail
}

export type NormalizedEip8004ScanAgent = {
	chainId: number
	identityId: string
	contractAddress: `0x${string}`
}

export type NormalizedEip8004ScanAgentDetail = NormalizedEip8004ScanAgent & {
	registrationUri: string
	fetchedAt: number
	name?: string
	description?: string
	image?: string
	registrationTypeIri?: string
	x402Support?: boolean
	active?: boolean
	contactEndpoint?: string
	supportedTrust?: string[]
}

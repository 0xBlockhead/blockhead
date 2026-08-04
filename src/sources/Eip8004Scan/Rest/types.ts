export type Eip8004ScanAgentListItem = {
	token_id: string
	chain_id: number
	contract_address: string
	agent_id?: string | null
	agent_wallet?: string | null
	owner_address?: string | null
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
			supportedTrust?: string[]
			active?: boolean
		}
	}
	services?: Record<string, {
		endpoint?: string
		name?: string
		version?: string
		protocol?: string
		active?: boolean
	}> | null
}

export type Eip8004ScanAgentDetailResponse = {
	success?: boolean
	data?: Eip8004ScanAgentDetail
}

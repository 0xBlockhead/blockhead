import type { JsonValue } from '$/typescript/JsonValue.ts'

export type MetaplexDASAssetInterface =
	| 'Custom'
	| 'Executable'
	| 'FungibleAsset'
	| 'FungibleToken'
	| 'Identity'
	| 'LEGACY_NFT'
	| 'MplCoreAsset'
	| 'MplCoreCollection'
	| 'ProgrammableNFT'
	| 'V1_NFT'
	| 'V1_PRINT'
	| 'V2_NFT'

export type MetaplexDASAsset = {
	interface: MetaplexDASAssetInterface
	id: string
	content?: {
		$schema?: string
		json_uri?: string
		files?: {
			uri?: string
			cdn_uri?: string
			mime?: string
		}[]
		metadata?: {
			name?: string
			symbol?: string
			description?: string
			token_standard?: string
			attributes?: JsonValue
		}
		links?: Record<string, string>
	}
	authorities?: {
		address: string
		scopes: string[]
	}[]
	compression: {
		eligible: boolean
		compressed: boolean
		data_hash?: string
		creator_hash?: string
		asset_hash?: string
		tree?: string
		seq?: number
		leaf_id?: number
	}
	grouping?: {
		group_key: 'collection'
		group_value: string
	}[]
	royalty: {
		royalty_model: 'creators' | 'fanout' | 'single'
		target?: string | null
		percent: number
		basis_points: number
		primary_sale_happened: boolean
		locked: boolean
	}
	creators?: {
		address: string
		share: number
		verified: boolean
	}[]
	ownership: {
		frozen: boolean
		delegated: boolean
		delegate?: string | null
		ownership_model: 'single' | 'token'
		owner: string
	}
	supply?: {
		print_max_supply?: number
		print_current_supply?: number
		edition_nonce?: number
	}
	mutable: boolean
	burnt: boolean
	token_info?: {
		symbol?: string
		balance?: number
		supply?: number
		decimals?: number
		token_program?: string
		associated_token_address?: string
		price_info?: {
			price_per_token?: number
			total_price?: number
			currency?: string
		}
	}
}

export type MetaplexDASAssetsByOwnerResult = {
	last_indexed_slot: number
	total: number
	limit: number
	page: number
	items: MetaplexDASAsset[]
}

export type MetaplexDASJsonRpcResponse<_Result> = {
	jsonrpc: string
	id: string
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

export type MetaplexDASAssetsByOwnerPage =
	| {
		page: number
		before?: never
		after?: never
	}
	| {
		page?: never
		before: string
		after?: never
	}
	| {
		page?: never
		before?: never
		after: string
	}

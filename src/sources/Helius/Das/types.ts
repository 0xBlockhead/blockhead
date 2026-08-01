/** Wire types for the canonical Metaplex DAS `getAssetsByOwner` operation. */

export type DasAssetInterface =
	| 'Custom'
	| 'Executable'
	| 'FungibleAsset'
	| 'FungibleToken'
	| 'Identity'
	| 'LEGACY_NFT'
	| 'MplBubblegumV2'
	| 'MplCoreAsset'
	| 'MplCoreCollection'
	| 'MplCoreGroup'
	| 'ProgrammableNFT'
	| 'V1_NFT'
	| 'V1_PRINT'
	| 'V2_NFT'

export type DasAsset = {
	interface: DasAssetInterface
	id: string
	content?: {
		$schema: string
		json_uri: string
		files?: ({
			contexts?: (
				| 'app'
				| 'app-desktop'
				| 'app-mobile'
				| 'vr'
				| 'wallet-default'
				| 'web-desktop'
				| 'web-mobile'
			)[] | null
			mime?: string | null
			quality?: {
				$$schema: string
			} | null
			uri?: string | null
			cdn_uri?: string | null
		} & Record<string, unknown>)[] | null
		metadata: {
			name?: string
			symbol?: string
			description?: string
			token_standard?: string
			attributes?: unknown
		} & Record<string, unknown>
		links?: Record<string, unknown> | null
	} | null
	authorities?: {
		address: string
		scopes: ('extension' | 'full' | 'metadata' | 'royalty')[]
	}[] | null
	compression?: {
		asset_data_hash?: string | null
		asset_hash: string
		collection_hash?: string | null
		compressed: boolean
		creator_hash: string
		data_hash: string
		eligible: boolean
		flags?: number | null
		leaf_id: number
		seq: number
		tree: string
	} | null
	creators?: {
		address: string
		share: number
		verified: boolean
	}[] | null
	grouping?: {
		collection_metadata?: Record<string, unknown> | null
		group_key: string
		group_value?: string | null
		verified?: boolean | null
	}[] | null
	inscription?: {
		authority: string
		content: string
		encoding: string
		inscription_data: string
		order: number
		root: string
		size: number
		validation_hash?: string | null
	} | null
	ownership?: {
		delegate?: string | null
		delegated: boolean
		frozen: boolean
		non_transferable?: boolean | null
		owner: string
		ownership_model: 'single' | 'token'
	} | null
	royalty?: {
		basis_points: number
		basis_points_raw?: number | null
		locked: boolean
		percent: number
		primary_sale_happened: boolean
		royalty_model: 'creators' | 'fanout' | 'single'
		sfbp_inherited?: boolean | null
		target?: string | null
	} | null
	supply?: {
		edition_nonce?: number | null
		print_current_supply: number
		print_max_supply: number
	} | null
	token_info?: {
		associated_token_address?: string
		balance?: number
		decimals?: number
		freeze_authority?: string | null
		mint_authority?: string | null
		price_info?: {
			currency?: string
			price_per_token?: number
			total_price?: number
		}
		supply?: number
		symbol?: string
		token_program?: string
	} | null
	uses?: {
		remaining: number
		total: number
		use_method: 'Burn' | 'Multiple' | 'Single'
	} | null
	agent_token?: string | null
	asset_signer?: string | null
	external_plugins?: unknown
	is_agent?: boolean | null
	mint_extensions?: unknown
	mpl_core_info?: {
		current_size?: number | null
		num_minted?: number | null
		plugins_json_version?: number | null
	} | null
	plugins?: unknown
	unknown_external_plugins?: unknown
	unknown_plugins?: unknown
	mutable: boolean
	burnt: boolean
}

export type GetAssetsByOwnerResult = {
	after?: string | null
	before?: string | null
	cursor?: string | null
	errors?: {
		error?: string
		id?: string
	}[]
	items: DasAsset[]
	last_indexed_slot?: number
	limit: number
	page: number
	total: number
}

export type JsonRpcResponse<_Result> = {
	jsonrpc: string
	id: string
	result?: _Result
	error?: {
		code: number
		message: string
		data?: unknown
	}
}

export type GetAssetsByOwnerPage =
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

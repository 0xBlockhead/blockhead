/** Wire types for Metaplex DAS operations, aliased from the checked-in OpenRPC schemas plus Helius fail-closed envelopes. */

import { type as arktype } from 'arktype'

import type { components } from '$/sources/_shared/interfaces/MetaplexDasJsonRpc/OpenRpc/openrpc.d.ts'


export type DasAsset = components['schemas']['Asset']

export type DasAssetInterface = DasAsset['interface']

export type DasAssetProof = components['schemas']['AssetProof']

export type GetAssetParams = components['schemas']['GetAsset']

export type GetAssetProofParams = components['schemas']['GetAssetProof']

export type GetAssetsParams = components['schemas']['GetAssets']

export type GetAssetsByOwnerParams = components['schemas']['GetAssetsByOwner']

export type GetAssetsByOwnerResult = components['schemas']['AssetList']

export type GetTokenAccountsParams = components['schemas']['GetTokenAccounts']

export type GetTokenAccountsResult = components['schemas']['TokenAccountList']

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

export type GetTokenAccountsPage =
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


const safeUnsignedInteger = 'number.integer >= 0 <= 9007199254740991'

export const dasAssetOwnershipWire = arktype({
	owner: 'string > 0',
	delegated: 'boolean',
	frozen: 'boolean',
	ownership_model: "'single' | 'token'",
	'delegate?': arktype('string > 0').or('null'),
	'non_transferable?': arktype('boolean').or('null'),
}).onUndeclaredKey('delete')

export const dasAssetTokenInfoWire = arktype({
	decimals: 'number.integer >= 0 <= 255',
	supply: safeUnsignedInteger,
	token_program: 'string > 0',
	'mint_authority?': arktype('string > 0').or('null'),
	'freeze_authority?': arktype('string > 0').or('null'),
}).onUndeclaredKey('delete')

export const dasAssetCompressionWire = arktype({
	eligible: 'boolean',
	compressed: 'boolean',
	data_hash: 'string > 0',
	creator_hash: 'string > 0',
	asset_hash: 'string > 0',
	tree: 'string > 0',
	seq: 'number.integer',
	leaf_id: 'number.integer',
	'asset_data_hash?': arktype('string > 0').or('null'),
	'collection_hash?': arktype('string > 0').or('null'),
	'flags?': arktype('number.integer >= 0').or('null'),
}).onUndeclaredKey('delete')

export const dasAssetWire = arktype({
	interface: 'string > 0',
	id: 'string > 0',
	burnt: 'boolean',
	mutable: 'boolean',
	// Helius DAS wraps every successful asset payload with an indexed-slot clock.
	'last_indexed_slot?': safeUnsignedInteger,
	'ownership?': dasAssetOwnershipWire.or('null'),
	'token_info?': dasAssetTokenInfoWire.or('null'),
	'compression?': dasAssetCompressionWire.or('null'),
	'content?': arktype({
		$schema: 'string',
		json_uri: 'string',
		metadata: 'Record<string, unknown>',
	}).or('null'),
}).onUndeclaredKey('delete')

export const dasAssetListWire = arktype({
	total: safeUnsignedInteger,
	limit: safeUnsignedInteger,
	items: dasAssetWire.array(),
	'page?': arktype(safeUnsignedInteger).or('null'),
	'cursor?': arktype('string').or('null'),
	'before?': arktype('string').or('null'),
	'after?': arktype('string').or('null'),
	// Helius DAS list responses include an indexed-slot clock outside Metaplex OpenRPC.
	'last_indexed_slot?': safeUnsignedInteger,
	'errors?': arktype({
		error: 'string',
		id: 'string',
	}).array(),
}).onUndeclaredKey('delete')

export const dasAssetProofWire = arktype({
	root: 'string > 0',
	proof: arktype('string > 0').array(),
	node_index: 'number.integer >= 0',
	leaf: 'string > 0',
	tree_id: 'string > 0',
}).onUndeclaredKey('delete')

export const dasTokenAccountWire = arktype({
	address: 'string > 0',
	mint: 'string > 0',
	owner: 'string > 0',
	amount: safeUnsignedInteger,
	delegated_amount: safeUnsignedInteger,
	frozen: 'boolean',
	'delegate?': arktype('string > 0').or('null'),
	'close_authority?': arktype('string > 0').or('null'),
	'extensions?': 'unknown',
}).onUndeclaredKey('delete')

export const dasTokenAccountListWire = arktype({
	token_accounts: dasTokenAccountWire.array(),
	total: safeUnsignedInteger,
	limit: safeUnsignedInteger,
	'page?': arktype(safeUnsignedInteger).or('null'),
	'cursor?': arktype('string').or('null'),
	'before?': arktype('string').or('null'),
	'after?': arktype('string').or('null'),
	'errors?': arktype({
		error: 'string',
		id: 'string',
	}).array(),
}).onUndeclaredKey('delete')

export type DasAssetWire = typeof dasAssetWire.infer
export type DasAssetListWire = typeof dasAssetListWire.infer
export type DasAssetProofWire = typeof dasAssetProofWire.infer
export type DasTokenAccountListWire = typeof dasTokenAccountListWire.infer

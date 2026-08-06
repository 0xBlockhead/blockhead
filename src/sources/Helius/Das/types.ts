/** Wire types for Metaplex DAS operations, aliased from the checked-in OpenRPC schemas. */

import type { components } from '$/sources/_shared/interfaces/MetaplexDasJsonRpc/OpenRpc/openrpc.d.ts'


export type DasAsset = components['schemas']['Asset']

export type DasAssetInterface = DasAsset['interface']

export type DasAssetProof = components['schemas']['AssetProof']

export type GetAssetParams = components['schemas']['GetAsset']

export type GetAssetProofParams = components['schemas']['GetAssetProof']

export type GetAssetsByOwnerParams = components['schemas']['GetAssetsByOwner']

export type GetAssetsByOwnerResult = components['schemas']['AssetList']

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

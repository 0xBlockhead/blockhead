/** Wire types for the canonical Metaplex DAS `getAssetsByOwner` operation. */

import type { components } from '$/sources/_shared/interfaces/MetaplexDasJsonRpc/OpenRpc/openrpc.d.ts'


export type DasAsset = components['schemas']['Asset']

export type DasAssetInterface = DasAsset['interface']

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

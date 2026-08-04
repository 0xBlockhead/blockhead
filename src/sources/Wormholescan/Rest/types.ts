import type { components } from '$/sources/Wormholescan/OpenApi/openapi.d.ts'

export type WormholescanOperation = components['schemas']['operations.OperationResponse']

export type WormholescanOperationsPage = {
	operations: WormholescanOperation[]
}

export type WormholescanWormholeChainId = components['schemas']['vaa.ChainID']

/**
 * Live `/api/v1/vaas/...` documents carry `sequence` and base64 `vaa` bytes;
 * OpenAPI `vaa.VaaDoc` omits `sequence` and types `vaa` as `number[]`.
 */
export type WormholescanVaa = components['schemas']['vaa.VaaDoc'] & {
	sequence?: number | string
	vaa?: string | number[]
}

/** Live `find-vaa-by-id` returns a single doc in `data` (OpenAPI incorrectly types an array). */
export type WormholescanVaaByIdResponse = {
	data?: WormholescanVaa
}

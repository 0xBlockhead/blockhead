import { beforeEach, expect, it, vi } from 'vitest'

import {
	getBlock,
	getLatestBlock,
	getLightdInfo,
	getTreeState,
	setZcashLightwalletdGrpcUnaryCall,
} from '$/sources/ZcashLightwalletd/Grpc/queries.ts'

const unaryCall = vi.fn()

beforeEach(() => {
	vi.clearAllMocks()
	setZcashLightwalletdGrpcUnaryCall(unaryCall)
})

it('uses the canonical lightwalletd service and preserves public block coordinates', async () => {
	const hash = new Uint8Array(32).fill(1)
	unaryCall.mockResolvedValueOnce({ height: 12n, hash })

	await expect(getLatestBlock()).resolves.toEqual({ height: 12n, hash })
	expect(unaryCall).toHaveBeenCalledWith({
		service: 'cash.z.wallet.sdk.rpc.CompactTxStreamer',
		method: 'GetLatestBlock',
		request: {},
	})
})

it('validates compact block identity before resolvers see it', async () => {
	const hash = new Uint8Array(32).fill(2)
	unaryCall.mockResolvedValue({
		height: 42n,
		hash,
		prevHash: new Uint8Array(32).fill(3),
		time: 1_700_000_000,
		vtx: [{ index: 0, txid: new Uint8Array(32).fill(4), spends: [], outputs: [], actions: [] }],
	})

	await expect(getBlock({ height: 42n })).resolves.toMatchObject({ height: 42n, hash })
	await expect(getBlock({ height: 43n })).rejects.toThrow('invalid compact block response')
})

it('rejects malformed public tree and server metadata', async () => {
	unaryCall
		.mockResolvedValueOnce({ height: 2n, hash: 'hash', time: 1, saplingTree: '', orchardTree: '' })
		.mockResolvedValueOnce({ version: '', chainName: 'test', blockHeight: 0n, estimatedHeight: 0n })

	await expect(getTreeState({ height: 2n })).rejects.toThrow('invalid tree-state response')
	await expect(getLightdInfo()).rejects.toThrow('invalid lightd-info response')
})

it('does not silently degrade when the server-only transport is unavailable', async () => {
	setZcashLightwalletdGrpcUnaryCall(undefined)
	await expect(getLatestBlock()).rejects.toThrow('gRPC unary call is not configured')
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Polkadot/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0].locator,
	sourceFetch,
}))

const { substrateJsonRpcQueries } = await import('$/sources/_shared/interfaces/SubstrateJsonRpc/queries.ts')
const queries = substrateJsonRpcQueries(bindings[Source.Polkadot_JsonRpc][0])

const jsonRpcResult = (
	result: unknown
) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}))
)

describe('Substrate JSON-RPC query envelopes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('accepts finalized head and fail-closes non-hex hashes', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResult('0xabc'))
		await expect(queries.getFinalizedHead()).resolves.toBe('0xabc')

		sourceFetch.mockResolvedValueOnce(jsonRpcResult('not-a-hash'))
		await expect(queries.getFinalizedHead()).rejects.toThrow('invalid finalized head response envelope')
	})

	it('accepts block / header / runtime / health envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			block: {
				header: {
					parentHash: '0xaaa1',
					number: '0xa',
					stateRoot: '0xbbb2',
					extrinsicsRoot: '0xccc3',
					digest: {
						logs: [],
					},
				},
				extrinsics: [
					'0x01',
				],
			},
		}))
		await expect(queries.getBlock({
			blockHash: '0xddd4',
		})).resolves.toMatchObject({
			block: {
				header: {
					number: '0xa',
				},
				extrinsics: [
					'0x01',
				],
			},
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			parentHash: '0xaaa1',
			number: '0xa',
			stateRoot: '0xbbb2',
			extrinsicsRoot: '0xccc3',
			digest: {
				logs: [],
			},
		}))
		await expect(queries.getHeader({
			blockHash: '0xddd4',
		})).resolves.toMatchObject({
			number: '0xa',
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			specName: 'polkadot',
			implName: 'parity-polkadot',
			authoringVersion: 0,
			specVersion: 1007001,
			implVersion: 0,
			transactionVersion: 26,
			stateVersion: 1,
		}))
		await expect(queries.getRuntimeVersion()).resolves.toMatchObject({
			specName: 'polkadot',
			specVersion: 1007001,
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			peers: 40,
			isSyncing: false,
			shouldHavePeers: true,
		}))
		await expect(queries.getSystemHealth()).resolves.toMatchObject({
			peers: 40,
			isSyncing: false,
		})
	})

	it('fail-closes malformed runtime versions', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			specName: '',
			implName: 'parity-polkadot',
			authoringVersion: 0,
			specVersion: 1,
			implVersion: 0,
		}))
		await expect(queries.getRuntimeVersion()).rejects.toThrow('invalid runtime version response envelope')
	})
})

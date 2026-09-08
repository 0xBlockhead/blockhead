import { describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { getBlocks } from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { getCurrentPdsOrigin } from '$/sources/AtprotoSync/Xrpc/identity.ts'
import { GET } from './+server.ts'

vi.mock('$/sources/AtprotoSync/Xrpc/queries.ts', () => ({
	getBlocks: vi.fn().mockResolvedValue(new Uint8Array()),
}))

vi.mock('$/sources/AtprotoSync/Xrpc/identity.ts', () => ({
	getCurrentPdsOrigin: vi.fn().mockResolvedValue('https://current-pds.example.com'),
}))

vi.mock('$/sources/AtprotoSync/Xrpc/commit.ts', () => ({
	projectAtprotoRepoCommitBlock: vi.fn().mockResolvedValue({
		rev: '3l2foo',
		dataCid: 'bafyreidata',
		carByteLength: 42,
	}),
}))


describe('AT Protocol decoded CAR manifest', () => {
	it('downloads verified decoded metadata without the source CAR bytes', async () => {
		const request = new Request('https://example.com/car-manifest.json')
		// oxlint-disable-next-line typescript/consistent-type-assertions -- The handler reads only route params; constructing a complete SvelteKit RequestEvent would add unrelated fixture state.
		const response = await GET({
			request,
			params: {
				repoDid: 'did:plc:alice',
				commitCid: 'bafyreiacommmit',
				source: Source.AtprotoSync_Xrpc,
			},
		} as Parameters<typeof GET>[0])

		expect(getCurrentPdsOrigin).toHaveBeenCalledWith({
			did: 'did:plc:alice',
			signal: request.signal,
		})
		expect(getBlocks).toHaveBeenCalledWith({
			serviceOrigin: 'https://current-pds.example.com',
			did: 'did:plc:alice',
			cids: ['bafyreiacommmit'],
			signal: request.signal,
		})

		expect(response.headers.get('content-disposition')).toBe(
			'attachment; filename="atproto-repo-commit-car-manifest.json"'
		)
		expect(await response.json()).toMatchObject({
			format: 'atproto-repo-commit-car-manifest/v1',
			provenance: {
				source: Source.AtprotoSync_Xrpc,
				serviceOrigin: 'https://current-pds.example.com',
			},
			verification: {
				carRootCid: 'bafyreiacommmit',
				commitCidDigest: 'verified',
			},
			originalCar: {
				included: false,
			},
		})
	})
})

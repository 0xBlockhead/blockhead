import { describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { GET } from './+server.ts'

vi.mock('$/sources/AtprotoSync/Xrpc/queries.ts', () => ({
	defaultAtprotoSyncRelayOrigin: 'https://bsky.network',
	getBlocks: vi.fn().mockResolvedValue(new Uint8Array()),
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
		// oxlint-disable-next-line typescript/consistent-type-assertions -- The handler reads only route params; constructing a complete SvelteKit RequestEvent would add unrelated fixture state.
		const response = await GET({
			params: {
				repoDid: 'did:plc:alice',
				commitCid: 'bafyreiacommmit',
				source: Source.AtprotoSync_Xrpc,
			},
		} as Parameters<typeof GET>[0])

		expect(response.headers.get('content-disposition')).toBe(
			'attachment; filename="atproto-repo-commit-car-manifest.json"'
		)
		expect(await response.json()).toMatchObject({
			format: 'atproto-repo-commit-car-manifest/v1',
			provenance: {
				source: Source.AtprotoSync_Xrpc,
				serviceOrigin: 'https://bsky.network',
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

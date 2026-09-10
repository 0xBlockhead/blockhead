import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { GET } from './+server.ts'


const getBlocks = vi.hoisted(() => vi.fn())
const getCurrentPdsOrigin = vi.hoisted(() => vi.fn())

vi.mock('$/sources/AtprotoSync/Xrpc/queries.ts', () => ({
	getBlocks,
}))
vi.mock('$/sources/AtprotoSync/Xrpc/identity.ts', () => ({
	getCurrentPdsOrigin,
}))

const canonicalCommitCid = 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya'
const routeParams: {
	repoDid: string
	commitCid: string
	source: string
} = {
	repoDid: 'did:plc:alice',
	commitCid: canonicalCommitCid,
	source: Source.AtprotoSync_Xrpc,
}
const routeRequest = new Request('https://example.test', {
	signal: new AbortController().signal,
})
const requestSignal = routeRequest.signal


// oxlint-disable-next-line typescript/consistent-type-assertions -- The handler reads only route params; constructing a complete SvelteKit RequestEvent would add unrelated fixture state.
const request = (params: typeof routeParams) => GET({
	params,
	request: routeRequest,
} as Parameters<typeof GET>[0])


	describe('AT Protocol raw CAR export', () => {
	beforeEach(() => {
		getCurrentPdsOrigin.mockReset()
		getBlocks.mockReset()
	})

	it('returns the exact source CAR bytes with download headers', async () => {
		const car = new Uint8Array([0, 1, 2, 255])
		getCurrentPdsOrigin.mockResolvedValueOnce('https://pds.example')
		getBlocks.mockResolvedValueOnce(car)

		const response = await request(routeParams)

		expect(new Uint8Array(await response.arrayBuffer())).toEqual(car)
		expect(response.headers.get('content-type')).toBe('application/vnd.ipld.car')
		expect(response.headers.get('content-disposition')).toBe(
			`attachment; filename="atproto-repo-commit-${canonicalCommitCid}.car"`
		)
		expect(getBlocks).toHaveBeenCalledWith({
			serviceOrigin: 'https://pds.example',
			did: 'did:plc:alice',
			cids: [canonicalCommitCid],
			signal: requestSignal,
		})
		expect(getCurrentPdsOrigin).toHaveBeenCalledWith({
			did: 'did:plc:alice',
			signal: requestSignal,
		})
	})

	it('rejects a source other than AtprotoSync_Xrpc before transport', async () => {
		await expect(request({
			...routeParams,
			source: 'OtherSource',
		})).rejects.toMatchObject({ status: 404 })

		expect(getCurrentPdsOrigin).not.toHaveBeenCalled()
		expect(getBlocks).not.toHaveBeenCalled()
	})

	it('rejects a malformed CID before transport', async () => {
		await expect(request({
			...routeParams,
			commitCid: 'not-a-cid',
		})).rejects.toMatchObject({ status: 400 })

		expect(getCurrentPdsOrigin).not.toHaveBeenCalled()
		expect(getBlocks).not.toHaveBeenCalled()
	})

	it('rejects a non-canonical CID before transport', async () => {
		await expect(request({
			...routeParams,
			commitCid: ` ${canonicalCommitCid} `,
		})).rejects.toMatchObject({ status: 400 })

		expect(getCurrentPdsOrigin).not.toHaveBeenCalled()
		expect(getBlocks).not.toHaveBeenCalled()
	})
})

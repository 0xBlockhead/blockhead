import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	getPeerId,
	listData,
} from '$/sources/CodexNode/Rest/queries.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson: vi.fn(),
}))

/** This transport-only fixture deliberately does not stand in for production binding metadata. */
const binding = {
	source: Source.Local_Internal,
	target: {
		kind: SourceTargetKind.LocalDevice,
		key: 'codex-node-test',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'http://127.0.0.1:8080',
		corsEnabled: true,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.OpenApiHttp,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
} satisfies SourceBinding
const peerId = '16Uiu2HAmJ3TSfPnrJNedHy2DMsjTqwBiVAQQqPo579DuMgGxmG99'
const dataItem = {
	cid: 'bafkreiebiy6fwcvo54p6hc4ckpqmzyq4jlgdjxhhbxnkebcrxzmb5aao4u',
	manifest: {
		treeCid: 'bafkreiebiy6fwcvo54p6hc4ckpqmzyq4jlgdjxhhbxnkebcrxzmb5aao4u',
		datasetSize: 1024,
		blockSize: 64,
		filename: null,
		mimetype: 'application/octet-stream',
	},
} as const

describe('Codex node REST transport', () => {
	beforeEach(() => {
		vi.mocked(sourceGetJson).mockReset()
	})

	it('uses GET for the exact v1 peer and local-data URLs', async () => {
		vi.mocked(sourceGetJson)
			.mockResolvedValueOnce({ id: peerId })
			.mockResolvedValueOnce({ content: [dataItem] })

		await expect(getPeerId(binding)).resolves.toBe(peerId)
		await expect(listData(binding)).resolves.toEqual([dataItem])

		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			binding,
			'http://127.0.0.1:8080/api/storage/v1/peerid'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			binding,
			'http://127.0.0.1:8080/api/storage/v1/data'
		)
	})

	it('rejects malformed peer-id and data-list envelopes', async () => {
		vi.mocked(sourceGetJson).mockResolvedValueOnce({ id: 42 })
		await expect(getPeerId(binding)).rejects.toThrow(
			'CodexNode_Rest: invalid peer id response envelope'
		)

		vi.mocked(sourceGetJson).mockResolvedValueOnce({
			content: [{ cid: dataItem.cid }],
		})
		await expect(listData(binding)).rejects.toThrow(
			'CodexNode_Rest: invalid data list response envelope'
		)
	})

	it('accepts an empty local membership without converting it to an error', async () => {
		vi.mocked(sourceGetJson).mockResolvedValueOnce({ content: [] })

		await expect(listData(binding)).resolves.toEqual([])
	})
})

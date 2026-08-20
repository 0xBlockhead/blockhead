import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import * as queries from '$/sources/SigstoreRekor/Rest/queries.ts'
import bindings from '$/sources/SigstoreRekor/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const binding = bindings[Source.SigstoreRekor][0]

describe('Sigstore Rekor public transparency log', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('reads typed log state from the canonical endpoint', async () => {
		const logInfo = {
			rootHash: 'a'.repeat(64),
			treeSize: 42,
			signedTreeHead: 'checkpoint',
			treeID: '123',
		}
		getJson.mockResolvedValue(logInfo)

		await expect(queries.getLogInfo()).resolves.toBe(logInfo)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/api/v1/log'
		)
	})

	it('encodes the official UUID path parameter', async () => {
		const entryUUID = `${'a'.repeat(64)}/child`
		const entry = {
			[entryUUID]: {
				logID: 'b'.repeat(64),
				logIndex: 42,
				body: {},
				integratedTime: 1_700_000_000,
			},
		}
		getJson.mockResolvedValue(entry)

		await expect(queries.getLogEntry({ entryUUID })).resolves.toBe(entry)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/api/v1/log/entries/${encodeURIComponent(entryUUID)}`
		)
	})

	it('rejects a response keyed by a different entry UUID', async () => {
		getJson.mockResolvedValue({
			other: {
				logID: 'b'.repeat(64),
				logIndex: 42,
				body: {},
				integratedTime: 1_700_000_000,
			},
		})

		await expect(queries.getLogEntry({
			entryUUID: 'requested',
		})).rejects.toThrow('foreign log entry response')
	})
})

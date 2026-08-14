import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/WakuNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const {
	getJson,
	getText,
} = vi.hoisted(() => ({
	getJson: vi.fn(),
	getText: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	getText,
}))

const queries = await import('$/sources/WakuNode/Rest/queries.ts')
const binding = bindings[Source.WakuNode][0]

describe('WakuNode REST operations', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads debug info through the binding-scoped path', async () => {
		const debugInfo = {
			listenAddresses: ['/ip4/127.0.0.1/tcp/60000'],
			enrUri: 'enr:test',
		}
		getJson.mockResolvedValue(debugInfo)

		await expect(queries.getDebugInfo()).resolves.toEqual(debugInfo)
		expect(getJson).toHaveBeenCalledWith(binding, '/debug/v1/info')
	})

	it.each([
		null,
		{},
		{
			listenAddresses: [],
		},
	])('fails closed when debug info has no listen addresses envelope: %j', async (debugInfo) => {
		getJson.mockResolvedValue(debugInfo)

		await expect(queries.getDebugInfo()).rejects.toThrow(
			'WakuNode_Rest: invalid debug info response envelope'
		)
	})

	it('loads health through the binding-scoped path', async () => {
		getText.mockResolvedValue('OK')

		await expect(queries.getHealth()).resolves.toBe('OK')
		expect(getText).toHaveBeenCalledWith(binding, '/health')
	})

	it('counts only peers the operator reports as connected', async () => {
		getJson.mockResolvedValue([
			{ connectedness: 'Connected' },
			{ connectedness: 'CanConnect' },
			{ connectedness: 'Connected' },
		])

		await expect(queries.getConnectedPeerCount()).resolves.toBe(2)
		expect(getJson).toHaveBeenCalledWith(binding, '/admin/v1/peers')
	})

	it.each([
		null,
		{},
		[{ peerId: '16Uiu2HAm' }],
	])('fails closed when peers have no connectedness envelope: %j', async (peers) => {
		getJson.mockResolvedValue(peers)

		await expect(queries.getConnectedPeerCount()).rejects.toThrow(
			'WakuNode_Rest: invalid peer response envelope'
		)
	})

	it('fails closed when the health envelope is empty', async () => {
		getText.mockResolvedValue('  ')

		await expect(queries.getHealth()).rejects.toThrow(
			'WakuNode_Rest: health response is empty'
		)
	})

	it('loads and normalizes the native nwaku version', async () => {
		getText.mockResolvedValue(' nwaku/v0.35.0\n')

		await expect(queries.getVersion()).resolves.toBe('nwaku/v0.35.0')
		expect(getText).toHaveBeenCalledWith(binding, '/debug/v1/version')
	})

	it('fails closed when the version envelope is empty', async () => {
		getText.mockResolvedValue('  ')

		await expect(queries.getVersion()).rejects.toThrow(
			'WakuNode_Rest: version response is empty'
		)
	})
})

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

		await expect(queries.getDebugInfo(binding)).resolves.toEqual(debugInfo)
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

		await expect(queries.getDebugInfo(binding)).rejects.toThrow(
			'WakuNode_Rest: invalid debug info response envelope'
		)
	})

	it('loads health through the binding-scoped path', async () => {
		getText.mockResolvedValue('OK')

		await expect(queries.getHealth(binding)).resolves.toBe('OK')
		expect(getText).toHaveBeenCalledWith(binding, '/health')
	})

	it('fails closed when the health envelope is empty', async () => {
		getText.mockResolvedValue('  ')

		await expect(queries.getHealth(binding)).rejects.toThrow(
			'WakuNode_Rest: health response is empty'
		)
	})

	it('loads and normalizes the native nwaku version', async () => {
		getText.mockResolvedValue(' nwaku/v0.35.0\n')

		await expect(queries.getVersion(binding)).resolves.toBe('nwaku/v0.35.0')
		expect(getText).toHaveBeenCalledWith(binding, '/debug/v1/version')
	})

	it('fails closed when the version envelope is empty', async () => {
		getText.mockResolvedValue('  ')

		await expect(queries.getVersion(binding)).rejects.toThrow(
			'WakuNode_Rest: version response is empty'
		)
	})
})

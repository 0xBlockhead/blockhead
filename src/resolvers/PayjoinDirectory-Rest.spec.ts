import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'

const getOhttpKeyConfigBase64 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Payjoin/Directory/Rest/queries.ts', () => ({
	getOhttpKeyConfigBase64,
	ohttpGatewayUrlForDirectory: (directoryUrl: string) => (
		`${directoryUrl.replace(/\/$/, '')}/.well-known/ohttp-gateway`
	),
}))

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
}

describe('Payjoin directory resolver', () => {
	beforeEach(() => {
		getOhttpKeyConfigBase64.mockReset()
	})

	it('connects canonical directory identity to its OHTTP gateway key document', async () => {
		getOhttpKeyConfigBase64.mockResolvedValueOnce('AAEC/f7/')
		const { default: payjoinDirectory } = await import('$/resolvers/PayjoinDirectory-Rest.ts')
		const resolver = payjoinDirectory.resolvers[0]
		const snapshot = await resolver.resolve.DirectoryUrl.resolve({
			directoryUrl: 'https://payjo.in',
		}, resolverContext)

		expect(resolver.projections.ohttpGatewayUrl(snapshot)).toBe(
			'https://payjo.in/.well-known/ohttp-gateway'
		)
		expect(resolver.projections.ohttpKeyConfig(snapshot)).toBe('AAEC/f7/')
		expect(getOhttpKeyConfigBase64).toHaveBeenCalledWith({
			directoryUrl: 'https://payjo.in',
		})
	})

	it('fails closed when the key document is unavailable', async () => {
		getOhttpKeyConfigBase64.mockRejectedValueOnce(new Error('key document unavailable'))
		const { default: payjoinDirectory } = await import('$/resolvers/PayjoinDirectory-Rest.ts')

		await expect(payjoinDirectory.resolvers[0].resolve.DirectoryUrl.resolve({
			directoryUrl: 'https://payjo.in',
		}, resolverContext)).rejects.toThrow('key document unavailable')
	})

	it('retains only passive directory read authority', async () => {
		const { default: payjoinDirectory } = await import('$/resolvers/PayjoinDirectory-Rest.ts')

		expect(payjoinDirectory.source).toBe(Source.PayjoinDirectory_Rest)
		expect(payjoinDirectory.resolvers).toHaveLength(1)
	})
})

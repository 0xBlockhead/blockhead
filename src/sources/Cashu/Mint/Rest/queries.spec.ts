import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
const { bindings, sourceGetJson } = vi.hoisted(() => ({
	bindings: {
		CashuMint_Rest: [
			{
				target: { key: 'https://first.mint' },
				endpoints: [{ locator: 'https://first.mint' }],
			},
			{
				target: { key: 'https://second.mint' },
				endpoints: [{ locator: 'https://second.mint/' }],
			},
		],
	},
	sourceGetJson: vi.fn(),
}))
vi.mock('$/sources/Cashu/bindings.ts', () => ({ default: bindings }))
vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof bindings.CashuMint_Rest[number]) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))
const {
	getMintInfo,
	getMintKeysets,
	getMintKeys,
	getMintKeysForKeyset,
} = await import('$/sources/Cashu/Mint/Rest/queries.ts')

beforeEach(() => {
	sourceGetJson.mockReset()
})

it('dispatches each Cashu endpoint through its exact binding and preserves keyset URL encoding', async () => {
	sourceGetJson
		.mockResolvedValueOnce({
			name: 'First mint',
		})
		.mockResolvedValueOnce({
			keysets: [],
		})
		.mockResolvedValueOnce({
			keysets: [],
		})
		.mockResolvedValueOnce({
			keysets: [],
		})

	await expect(getMintInfo('https://first.mint')).resolves.toEqual({
		name: 'First mint',
	})
	await expect(getMintKeysets('https://second.mint')).resolves.toEqual({
		keysets: [],
	})
	await expect(getMintKeys('https://second.mint')).resolves.toEqual({
		keysets: [],
	})
	await expect(getMintKeysForKeyset('https://second.mint', {
		keysetId: 'keyset/with spaces',
	})).resolves.toEqual({
		keysets: [],
	})

	expect(sourceGetJson.mock.calls).toEqual([
		[
			bindings.CashuMint_Rest[0],
			'https://first.mint/v1/info',
		],
		[
			bindings.CashuMint_Rest[1],
			'https://second.mint/v1/keysets',
		],
		[
			bindings.CashuMint_Rest[1],
			'https://second.mint/v1/keys',
		],
		[
			bindings.CashuMint_Rest[1],
			'https://second.mint/v1/keys/keyset%2Fwith%20spaces',
		],
	])
})

it('fails closed on unsupported mint info responses', async () => {
	sourceGetJson.mockResolvedValueOnce({})

	await expect(getMintInfo('https://first.mint')).rejects.toThrow(
		'CashuMint_Rest: unsupported mint info response for mint https://first.mint'
	)
})

it('fails closed on malformed mint keysets responses', async () => {
	sourceGetJson.mockResolvedValueOnce({
		keysets: [
			{
				id: 1,
				unit: 'sat',
				active: true,
			},
		],
	})

	await expect(getMintKeysets('https://first.mint')).rejects.toThrow(
		'CashuMint_Rest: invalid mint keysets response envelope for mint https://first.mint'
	)
})

it('fails closed on malformed mint keys responses', async () => {
	sourceGetJson.mockResolvedValueOnce({
		keysets: [
			{
				id: 'keyset-id',
				unit: 'sat',
				active: true,
				keys: {
					1: 2,
				},
			},
		],
	})

	await expect(getMintKeys('https://first.mint')).rejects.toThrow(
		'CashuMint_Rest: invalid mint keys response envelope for mint https://first.mint'
	)
})

it('strips undeclared mint info keys at the read boundary', async () => {
	sourceGetJson.mockResolvedValueOnce({
		name: 'Mint',
		extra_freestyle: true,
	})

	await expect(getMintInfo('https://first.mint')).resolves.toEqual({
		name: 'Mint',
	})
})

it('preserves source query rejections', async () => {
	sourceGetJson.mockRejectedValueOnce(new Error('network down'))

	await expect(getMintKeysets('https://first.mint')).rejects.toThrow('network down')
})

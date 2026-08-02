import { expect, it, vi } from 'vitest'
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
const { getMintInfo } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
it('dispatches a mint through its exact editable binding', () => {
	getMintInfo('https://first.mint')
	getMintInfo('https://second.mint')
	expect(sourceGetJson.mock.calls).toEqual(bindings.CashuMint_Rest.map((binding) => [
		binding,
		`${binding.target.key}/v1/info`,
	]))
})

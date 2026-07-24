import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const { fetchBrowseResult } = await import('$/sources/Ipfs/Rest/queries.ts')
const bindings = sourceProviderDefinitions.flatMap((provider) => provider.bindings)
const binding = bindings.find((candidate) => (
	candidate.source === Source.Ipfs_Rest
	&& candidate.target.kind === SourceTargetKind.ContentAddressScheme
	&& candidate.target.key === 'ipfs'
))
const swarmBinding = bindings.find((candidate) => (
	candidate.source === Source.Swarm_Rest
	&& candidate.target.kind === SourceTargetKind.ContentAddressScheme
	&& candidate.target.key === 'swarm'
))

if (binding == null || swarmBinding == null)
	throw new Error('Content gateway bindings are not registered')

describe('IPFS gateway binding transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the ordered HTTP endpoints from the canonical binding', async () => {
		sourceFetch.mockResolvedValue(new Response('hello', {
			status: 200,
			headers: {
				'content-type': 'text/plain',
			},
		}))

		await expect(fetchBrowseResult({
			binding,
			namespace: 'ipfs',
			target: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a',
		})).resolves.toMatchObject({
			gatewayOrigin: binding.endpoints[0].origin,
			text: 'hello',
		})
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(sourceFetch.mock.calls[0][0]).toBe(binding)
		expect(sourceFetch.mock.calls[0][1]).toBe(
			`${binding.endpoints[0].locator}/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a`
		)
	})

	it('rejects another provider binding before transport', async () => {
		await expect(fetchBrowseResult({
			binding: swarmBinding,
			namespace: 'ipfs',
			target: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a',
		})).rejects.toThrow('expected canonical IPFS gateway binding')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/OciRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'


const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	getManifest,
	manifestPath,
	ociRegistryOrigin,
} = await import('$/sources/OciRegistry/Distribution/queries.ts')

const digest = `sha256:${'a'.repeat(64)}`

describe('OCI distribution manifest transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the registered binding and explicit OCI accept negotiation for a concrete registry', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			schemaVersion: 2,
			config: {
				mediaType: 'application/vnd.oci.image.config.v1+json',
				digest,
				size: 42,
			},
			layers: [],
		}), {
			status: 200,
		}))

		await expect(getManifest({
			registry: 'ghcr.io',
			repository: 'openai/blockhead',
			reference: 'latest',
		})).resolves.toMatchObject({
			config: {
				digest,
			},
			layers: [],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[Source.OciRegistry_Distribution][0],
			'https://ghcr.io/v2/openai/blockhead/manifests/latest',
			{
				headers: {
					accept: expect.stringContaining('application/vnd.oci.image.manifest.v1+json'),
				},
			}
		)
	})

	it('retains an index as an index instead of fabricating an image manifest', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			schemaVersion: 2,
			manifests: [{
				mediaType: 'application/vnd.oci.image.manifest.v1+json',
				digest,
				size: 42,
			}],
		}), {
			status: 200,
		}))

		await expect(getManifest({
			registry: 'registry.example',
			repository: 'team/image',
			reference: 'stable',
		})).resolves.toMatchObject({
			manifests: [{
				digest,
			}],
		})
	})

	it('fails closed before transport for noncanonical registry, repository, and reference identities', async () => {
		expect(() => ociRegistryOrigin('ghcr.io/path')).toThrow('host or host:port')
		expect(() => manifestPath({
			repository: 'OpenAI/blockhead',
			reference: 'latest',
		})).toThrow('canonical lowercase')
		expect(() => manifestPath({
			repository: 'openai/blockhead',
			reference: '../latest',
		})).toThrow('tag or digest')

		await expect(getManifest({
			registry: 'ghcr.io',
			repository: 'openai/blockhead',
			reference: '../latest',
		})).rejects.toThrow('tag or digest')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('requires Docker-Content-Digest evidence when the selector is a digest', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			schemaVersion: 2,
			config: {
				mediaType: 'application/vnd.oci.image.config.v1+json',
				digest,
				size: 42,
			},
			layers: [],
		}), {
			status: 200,
			headers: {
				'Docker-Content-Digest': digest,
			},
		}))

		await expect(getManifest({
			registry: 'ghcr.io',
			repository: 'openai/blockhead',
			reference: digest,
		})).resolves.toMatchObject({
			config: {
				digest,
			},
		})
	})

	it('follows a standard anonymous bearer challenge before reading a public manifest', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(null, {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Bearer realm="https://auth.example/token",service="registry.example",scope="repository:team/image:pull"',
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				token: 'public-pull-token',
			}), {
				status: 200,
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				schemaVersion: 2,
				config: {
					mediaType: 'application/vnd.oci.image.config.v1+json',
					digest,
					size: 42,
				},
				layers: [],
			}), {
				status: 200,
			}))

		await expect(getManifest({
			registry: 'registry.example',
			repository: 'team/image',
			reference: 'latest',
		})).resolves.toMatchObject({
			config: { digest },
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			bindings[Source.OciRegistry_Distribution][0],
			'https://auth.example/token?service=registry.example&scope=repository%3Ateam%2Fimage%3Apull'
		)
		expect(sourceFetch).toHaveBeenNthCalledWith(
			3,
			bindings[Source.OciRegistry_Distribution][0],
			'https://registry.example/v2/team/image/manifests/latest',
			{
				headers: {
					accept: expect.any(String),
					authorization: 'Bearer public-pull-token',
				},
			}
		)
	})
})

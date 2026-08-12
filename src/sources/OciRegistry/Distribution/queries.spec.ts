import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/OciRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'


const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	getManifest,
	getReferrers,
	manifestPath,
	ociRegistryOrigin,
	referrersPath,
	referrersTag,
} = await import('$/sources/OciRegistry/Distribution/queries.ts')

const digest = `sha256:${'a'.repeat(64)}`

const digestForBody = async (body: string) => (
	`sha256:${[...new Uint8Array(await globalThis.crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(body)
	))]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')}`
)

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
			{
				...bindings[Source.OciRegistry_Distribution][0],
				endpoints: [{
					...bindings[Source.OciRegistry_Distribution][0].endpoints[0],
					locator: 'https://ghcr.io/v2',
				}],
			},
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
		const body = JSON.stringify({
			schemaVersion: 2,
			config: {
				mediaType: 'application/vnd.oci.image.config.v1+json',
				digest,
				size: 42,
			},
			layers: [],
		})
		const contentDigest = await digestForBody(body)
		sourceFetch.mockResolvedValueOnce(new Response(body, {
			status: 200,
			headers: {
				'Docker-Content-Digest': contentDigest,
			},
		}))

		await expect(getManifest({
			registry: 'ghcr.io',
			repository: 'openai/blockhead',
			reference: contentDigest,
		})).resolves.toMatchObject({
			config: {
				digest,
			},
		})
	})

	it('rejects a manifest whose bytes do not match the registry content digest', async () => {
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
			reference: 'latest',
		})).rejects.toThrow('manifest body does not match its content digest')
	})

	it('fails closed on a content digest algorithm the runtime cannot verify', async () => {
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
				'Docker-Content-Digest': `blake3:${'a'.repeat(64)}`,
			},
		}))

		await expect(getManifest({
			registry: 'ghcr.io',
			repository: 'openai/blockhead',
			reference: 'latest',
		})).rejects.toThrow('unsupported manifest digest algorithm blake3')
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
			{
				...bindings[Source.OciRegistry_Distribution][0],
				endpoints: [{
					...bindings[Source.OciRegistry_Distribution][0].endpoints[0],
					locator: 'https://auth.example',
				}],
			},
			'https://auth.example/token?service=registry.example&scope=repository%3Ateam%2Fimage%3Apull'
		)
		expect(sourceFetch).toHaveBeenNthCalledWith(
			3,
			{
				...bindings[Source.OciRegistry_Distribution][0],
				endpoints: [{
					...bindings[Source.OciRegistry_Distribution][0].endpoints[0],
					locator: 'https://registry.example/v2',
				}],
			},
			'https://registry.example/v2/team/image/manifests/latest',
			{
				headers: {
					accept: expect.any(String),
					authorization: 'Bearer public-pull-token',
				},
			}
		)
	})

	it('paginates typed attestation and signature referrers without leaving the repository', async () => {
		const signatureDigest = `sha256:${'b'.repeat(64)}`
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				schemaVersion: 2,
				mediaType: 'application/vnd.oci.image.index.v1+json',
				manifests: [{
					mediaType: 'application/vnd.oci.image.manifest.v1+json',
					digest,
					size: 42,
					artifactType: 'application/vnd.example.sbom.v1',
					annotations: {
						'org.opencontainers.image.created': '2026-08-12T00:00:00Z',
					},
				}],
			}), {
				status: 200,
				headers: {
					'Content-Type': 'application/vnd.oci.image.index.v1+json',
					Link: `</v2/team/image/referrers/${digest}?last=${digest}>; rel="next"`,
				},
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				schemaVersion: 2,
				mediaType: 'application/vnd.oci.image.index.v1+json',
				manifests: [{
					mediaType: 'application/vnd.oci.image.manifest.v1+json',
					digest: signatureDigest,
					size: 84,
					artifactType: 'application/vnd.example.signature.v1',
				}],
			}), {
				status: 200,
				headers: {
					'Content-Type': 'application/vnd.oci.image.index.v1+json',
				},
			}))

		await expect(getReferrers({
			registry: 'registry.example',
			repository: 'team/image',
			digest,
			limit: 20,
		})).resolves.toEqual([
			expect.objectContaining({
				digest,
				artifactType: 'application/vnd.example.sbom.v1',
			}),
			expect.objectContaining({
				digest: signatureDigest,
				artifactType: 'application/vnd.example.signature.v1',
			}),
		])
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			expect.any(Object),
			`https://registry.example/v2/team/image/referrers/${digest}?last=${digest}`,
			{
				headers: {
					accept: 'application/vnd.oci.image.index.v1+json',
				},
			}
		)
	})

	it('uses the OCI 1.1 fallback tag and rejects malformed cross-origin continuations', async () => {
		expect(() => referrersPath({
			repository: 'team/image',
			digest: 'latest',
		})).toThrow('canonical digest')
		expect(referrersTag(digest)).toBe(`sha256-${'a'.repeat(64)}`)

		sourceFetch.mockReset()
		sourceFetch
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				schemaVersion: 2,
				mediaType: 'application/vnd.oci.image.index.v1+json',
				manifests: [{
					mediaType: 'application/vnd.oci.image.manifest.v1+json',
					digest: `sha256:${'b'.repeat(64)}`,
					size: 84,
					artifactType: 'application/vnd.example.signature.v1',
				}],
			}), { status: 200 }))
		await expect(getReferrers({
			registry: 'registry.example',
			repository: 'team/image',
			digest,
			limit: 20,
		})).resolves.toEqual([expect.objectContaining({
			artifactType: 'application/vnd.example.signature.v1',
		})])
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			expect.any(Object),
			`https://registry.example/v2/team/image/manifests/sha256-${'a'.repeat(64)}`,
			{
				headers: {
					accept: expect.stringContaining('application/vnd.oci.image.index.v1+json'),
				},
			}
		)

		sourceFetch.mockReset()
		sourceFetch
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
		await expect(getReferrers({
			registry: 'registry.example',
			repository: 'team/image',
			digest,
			limit: 20,
		})).resolves.toEqual([])

		sourceFetch.mockReset()
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			schemaVersion: 2,
			mediaType: 'application/vnd.oci.image.index.v1+json',
			manifests: [],
		}), {
			status: 200,
			headers: {
				'Content-Type': 'application/vnd.oci.image.index.v1+json',
				Link: '<https://attacker.example/next>; rel="next"',
			},
		}))
		await expect(getReferrers({
			registry: 'registry.example',
			repository: 'team/image',
			digest,
			limit: 20,
		})).rejects.toThrow('invalid referrers continuation')
	})
})

import type { OciImageReference } from '$/sources/_shared/wire/OciDistribution/types.ts'
import bindings from '$/sources/OciRegistry/bindings.ts'
import {
	ociBearerTokenWire,
	ociDigestWire,
	ociImageIndexWire,
	ociImageManifestWire,
	type OciManifest,
} from '$/sources/OciRegistry/Distribution/types.ts'
import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


// Constants
const binding = bindings[Source.OciRegistry_Distribution][0]

const bindingForHttpUrl = (locator: string) => ({
	...binding,
	endpoints: [{
		...binding.endpoints[0],
		locator,
	}],
}) satisfies SourceBinding

const ociManifestAccept = [
	'application/vnd.oci.image.manifest.v1+json',
	'application/vnd.oci.image.index.v1+json',
	'application/vnd.docker.distribution.manifest.v2+json',
	'application/vnd.docker.distribution.manifest.list.v2+json',
].join(', ')


// Functions
export const ociRegistryOrigin = (registry: string) => {
	if (/[\u0000-\u001f\u007f/\\?#@]/.test(registry))
		throw new Error('OciRegistry_Distribution: registry must be a host or host:port')

	const origin = new URL(`https://${registry}`).origin
	if (new URL(origin).host !== registry.toLowerCase())
		throw new Error('OciRegistry_Distribution: registry identity is not canonical')

	return origin
}

const assertRepository = (repository: string) => {
	if (
		repository === ''
		|| repository.length > 255
		|| repository.split('/').some((segment) => (
			!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(segment)
		))
	)
		throw new Error('OciRegistry_Distribution: repository must use canonical lowercase path segments')

	return repository
}

const assertReference = (reference: string) => {
	if (ociDigestWire.allows(reference))
		return reference
	if (!/^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/.test(reference))
		throw new Error('OciRegistry_Distribution: reference must be a tag or digest')

	return reference
}

export const manifestPath = ({
	repository,
	reference,
}: Pick<OciImageReference, 'repository' | 'reference'>) => (
	`/v2/${assertRepository(repository)}/manifests/${encodeURIComponent(assertReference(reference))}`
)

const assertManifest = (value: JsonValue): OciManifest => {
	try {
		return (
			ociImageManifestWire.allows(value) ?
				ociImageManifestWire.assert(value)
			:
				ociImageIndexWire.assert(value)
		)
	} catch {
		throw new Error('OciRegistry_Distribution: invalid manifest or index response')
	}
}

const bearerAuthorization = async (response: Response) => {
	const challenge = response.headers.get('WWW-Authenticate')
	if (challenge == null || !/^Bearer\s/i.test(challenge))
		throw new Error('OciRegistry_Distribution: registry authentication challenge is unsupported')

	const challengeParameter = (name: string) => (
		new RegExp(`(?:^|[,\\s])${name}="([^"]*)"`, 'i').exec(challenge)?.[1]
	)
	const realmParameter = challengeParameter('realm')
	if (realmParameter == null)
		throw new Error('OciRegistry_Distribution: bearer challenge is missing a realm')

	const realm = new URL(realmParameter)
	if (realm.protocol !== 'https:')
		throw new Error('OciRegistry_Distribution: bearer realm must use HTTPS')

	const tokenUrl = new URL(realm)
	const service = challengeParameter('service')
	if (service != null)
		tokenUrl.searchParams.set('service', service)
	const scope = challengeParameter('scope')
	if (scope != null)
		tokenUrl.searchParams.set('scope', scope)

	const tokenResponse = await sourceFetch(bindingForHttpUrl(tokenUrl.origin), tokenUrl.href)
	if (!tokenResponse.ok)
		throw new Error(`OciRegistry_Distribution: bearer token request failed: ${tokenResponse.status} ${tokenResponse.statusText}`)

	const tokenEnvelope = ociBearerTokenWire.assert(await tokenResponse.json<JsonValue>())
	const token = tokenEnvelope.token ?? tokenEnvelope.access_token
	if (token == null)
		throw new Error('OciRegistry_Distribution: bearer token response is missing a token')

	return `Bearer ${token}`
}

export const getManifest = async ({
	registry,
	repository,
	reference,
}: OciImageReference & {
	registry: string
}) => {
	const registryOrigin = ociRegistryOrigin(registry)
	const url = `${registryOrigin}${manifestPath({
		repository,
		reference,
	})}`
	const registryBinding = bindingForHttpUrl(`${registryOrigin}/v2`)
	let response = await sourceFetch(registryBinding, url, {
		headers: {
			accept: ociManifestAccept,
		},
	})
	if (response.status === 401)
		response = await sourceFetch(registryBinding, url, {
			headers: {
				accept: ociManifestAccept,
				authorization: await bearerAuthorization(response),
			},
		})
	if (!response.ok)
		throw new Error(`OciRegistry_Distribution: manifest request failed: ${response.status} ${response.statusText}`)

	const manifest = assertManifest(await response.json<JsonValue>())
	const contentDigest = response.headers.get('Docker-Content-Digest')?.toLowerCase()
	if (ociDigestWire.allows(reference)) {
		if (contentDigest == null || contentDigest.toLowerCase() !== reference)
			throw new Error('OciRegistry_Distribution: digest reference response does not prove the requested manifest')
	}

	return {
		...manifest,
		...(contentDigest != null && { contentDigest }),
	}
}

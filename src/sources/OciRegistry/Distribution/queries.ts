import type { OciImageReference } from '$/sources/_shared/wire/OciDistribution/types.ts'
import bindings from '$/sources/OciRegistry/bindings.ts'
import {
	ociBearerTokenWire,
	ociDigestWire,
	ociImageIndexWire,
	ociImageManifestWire,
	type OciDescriptor,
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
const ociIndexMediaType = 'application/vnd.oci.image.index.v1+json'


// Functions
const isLocalNetworkHost = (hostname: string) => {
	if (hostname === 'localhost' || hostname.endsWith('.localhost'))
		return true
	if (
		hostname === '[::]'
		|| hostname === '[::1]'
		|| /^\[(?:fc|fd)[0-9a-f:]*\]$/i.test(hostname)
		|| /^\[fe[89ab][0-9a-f:]*\]$/i.test(hostname)
	)
		return true

	const ipv4 = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
	if (ipv4 == null)
		return false

	const [first, second] = ipv4.slice(1).map(Number)
	return (
		first === 0
		|| first === 10
		|| first === 127
		|| (first === 100 && second >= 64 && second <= 127)
		|| (first === 169 && second === 254)
		|| (first === 172 && second >= 16 && second <= 31)
		|| (first === 192 && second === 168)
		|| (first === 198 && second >= 18 && second <= 19)
	)
}

export const ociRegistryOrigin = (registry: string) => {
	if (/[\u0000-\u001f\u007f/\\?#@]/.test(registry))
		throw new Error('OciRegistry_Distribution: registry must be a host or host:port')

	const url = new URL(`https://${registry}`)
	if (isLocalNetworkHost(url.hostname))
		throw new Error('OciRegistry_Distribution: registry must not address a local network host')

	const origin = url.origin
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

export const referrersPath = ({
	repository,
	digest,
}: {
	repository: string
	digest: string
}) => {
	if (!ociDigestWire.allows(digest))
		throw new Error('OciRegistry_Distribution: referrers subject must use a canonical digest')

	return `/v2/${assertRepository(repository)}/referrers/${encodeURIComponent(digest)}`
}

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

const verifyManifestDigest = async (
	body: ArrayBuffer,
	digest: string
) => {
	const separatorIndex = digest.indexOf(':')
	const algorithm = digest.slice(0, separatorIndex)
	const expectedHex = digest.slice(separatorIndex + 1)
	const subtleAlgorithm = (
		algorithm === 'sha256' ? 'SHA-256'
		: algorithm === 'sha512' ? 'SHA-512'
		: undefined
	)
	if (subtleAlgorithm == null)
		throw new Error(`OciRegistry_Distribution: unsupported manifest digest algorithm ${algorithm}`)

	const actualHex = [...new Uint8Array(await globalThis.crypto.subtle.digest(subtleAlgorithm, body))]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')
	if (actualHex !== expectedHex)
		throw new Error('OciRegistry_Distribution: manifest body does not match its content digest')
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
	if (
		realm.protocol !== 'https:'
		|| realm.origin !== ociRegistryOrigin(realm.host)
		|| realm.username !== ''
		|| realm.password !== ''
		|| realm.hash !== ''
	)
		throw new Error('OciRegistry_Distribution: bearer realm must be a canonical public HTTPS URL')

	const tokenUrl = new URL(realm)
	const service = challengeParameter('service')
	if (service != null)
		tokenUrl.searchParams.set('service', service)
	const scope = challengeParameter('scope')
	if (scope != null)
		tokenUrl.searchParams.set('scope', scope)

	const tokenResponse = await sourceFetch(bindingForHttpUrl(tokenUrl.origin), tokenUrl.href, {
		redirect: 'manual',
	})
	if (!tokenResponse.ok)
		throw new Error(`OciRegistry_Distribution: bearer token request failed: ${tokenResponse.status} ${tokenResponse.statusText}`)

	const tokenEnvelope = ociBearerTokenWire.assert(await tokenResponse.json<JsonValue>())
	const token = tokenEnvelope.token ?? tokenEnvelope.access_token
	if (token == null)
		throw new Error('OciRegistry_Distribution: bearer token response is missing a token')

	return `Bearer ${token}`
}

const registryGet = async (
	registryBinding: SourceBinding,
	url: string,
	accept: string
) => {
	let response = await sourceFetch(registryBinding, url, {
		headers: { accept },
		redirect: 'manual',
	})
	if (response.status === 401)
		response = await sourceFetch(registryBinding, url, {
			headers: {
				accept,
				authorization: await bearerAuthorization(response),
			},
			redirect: 'manual',
		})

	return response
}

const nextReferrersUrl = (
	linkHeader: string | null,
	currentUrl: string,
	registryOrigin: string,
	pathname: string
) => {
	if (linkHeader == null)
		return undefined

	const linkValues: string[] = []
	let linkValueStart = 0
	let insideUri = false
	let insideQuotedParameter = false
	let quotedParameterEscape = false
	for (let index = 0; index < linkHeader.length; index++) {
		const character = linkHeader[index]
		if (insideQuotedParameter) {
			if (quotedParameterEscape)
				quotedParameterEscape = false
			else if (character === '\\')
				quotedParameterEscape = true
			else if (character === '"')
				insideQuotedParameter = false
		}
		else if (character === '<')
			insideUri = true
		else if (character === '>')
			insideUri = false
		else if (character === '"')
			insideQuotedParameter = true
		else if (character === ',' && !insideUri) {
			linkValues.push(linkHeader.slice(linkValueStart, index).trim())
			linkValueStart = index + 1
		}
	}
	if (insideUri || insideQuotedParameter || quotedParameterEscape)
		throw new Error('OciRegistry_Distribution: malformed referrers continuation')
	linkValues.push(linkHeader.slice(linkValueStart).trim())

	const nextUrls = linkValues.flatMap((linkValue) => {
		const match = /^<([^>]*)>(.*)$/.exec(linkValue)
		const relationValues = [...linkValue.matchAll(/;\s*rel\s*=\s*(?:"[^"]*"|[^;\s,]+)/gi)]
			.flatMap((relation) => relation[0]
				.slice(relation[0].indexOf('=') + 1)
				.trim()
				.replace(/^"|"$/g, '')
				.split(/\s+/))
		if (!relationValues.some((relation) => relation.toLowerCase() === 'next'))
			return []
		if (match == null || match[1] === '')
			throw new Error('OciRegistry_Distribution: malformed referrers continuation')

		return [new URL(match[1], currentUrl)]
	})
	if (nextUrls.length > 1)
		throw new Error('OciRegistry_Distribution: ambiguous referrers continuation')
	const nextUrl = nextUrls.at(0)
	if (nextUrl == null)
		return undefined
	if (
		nextUrl.origin !== registryOrigin
		|| decodeURIComponent(nextUrl.pathname) !== decodeURIComponent(pathname)
		|| nextUrl.username !== ''
		|| nextUrl.password !== ''
		|| nextUrl.hash !== ''
		|| nextUrl.href === currentUrl
	)
		throw new Error('OciRegistry_Distribution: invalid referrers continuation')

	return nextUrl.href
}

const getManifestOrUndefined = async ({
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
	const response = await registryGet(registryBinding, url, ociManifestAccept)
	if (response.status === 404)
		return undefined
	if (!response.ok)
		throw new Error(`OciRegistry_Distribution: manifest request failed: ${response.status} ${response.statusText}`)

	const manifestResponse = response.clone()
	const manifest = assertManifest(await response.json<JsonValue>())
	const contentDigest = response.headers.get('Docker-Content-Digest')?.toLowerCase()
	if (ociDigestWire.allows(reference)) {
		if (contentDigest == null || contentDigest.toLowerCase() !== reference)
			throw new Error('OciRegistry_Distribution: digest reference response does not prove the requested manifest')
	}
	if (contentDigest != null)
		await verifyManifestDigest(await manifestResponse.arrayBuffer(), contentDigest)

	return {
		...manifest,
		...(contentDigest != null && { contentDigest }),
	}
}

export const getManifest = async (identity: OciImageReference & { registry: string }) => {
	const manifest = await getManifestOrUndefined(identity)
	if (manifest == null)
		throw new Error('OciRegistry_Distribution: manifest request failed: 404 Not Found')

	return manifest
}

export const referrersTag = (digest: string) => {
	if (!ociDigestWire.allows(digest))
		throw new Error('OciRegistry_Distribution: referrers subject must use a canonical digest')
	const separatorIndex = digest.indexOf(':')
	return `${digest.slice(0, separatorIndex).slice(0, 32).replace(/[^A-Za-z0-9_.-]/g, '-')}-${digest.slice(separatorIndex + 1, separatorIndex + 65)}`
}

export const getReferrers = async ({
	registry,
	repository,
	digest,
	limit,
}: {
	registry: string
	repository: string
	digest: string
	limit: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('OciRegistry_Distribution: invalid referrers result limit')
	if (limit === 0)
		return []

	const registryOrigin = ociRegistryOrigin(registry)
	const pathname = referrersPath({ repository, digest })
	const registryBinding = bindingForHttpUrl(`${registryOrigin}/v2`)
	const descriptors: OciDescriptor[] = []
	const descriptorDigests = new Set<string>()
	let url: string | undefined = `${registryOrigin}${pathname}`
	while (url != null && descriptors.length < limit) {
		const response = await registryGet(registryBinding, url, ociIndexMediaType)
		if (response.status === 404) {
			if (descriptors.length !== 0 || url !== `${registryOrigin}${pathname}`)
				throw new Error('OciRegistry_Distribution: paginated referrers request disappeared')
			const fallback = await getManifestOrUndefined({
				registry,
				repository,
				reference: referrersTag(digest),
			})
			if (fallback == null || !('manifests' in fallback))
				return []
			for (const descriptor of fallback.manifests) {
				if (descriptorDigests.has(descriptor.digest))
					throw new Error('OciRegistry_Distribution: referrers response contains a duplicate digest')
				descriptorDigests.add(descriptor.digest)
				descriptors.push(descriptor)
			}
			break
		}
		if (!response.ok)
			throw new Error(`OciRegistry_Distribution: referrers request failed: ${response.status} ${response.statusText}`)
		if (response.headers.get('Content-Type')?.split(';')[0].trim() !== ociIndexMediaType)
			throw new Error('OciRegistry_Distribution: referrers response has an invalid content type')

		let index
		try {
			index = ociImageIndexWire.assert(await response.json<JsonValue>())
		} catch {
			throw new Error('OciRegistry_Distribution: invalid referrers response')
		}
		for (const descriptor of index.manifests) {
			if (descriptorDigests.has(descriptor.digest))
				throw new Error('OciRegistry_Distribution: referrers response contains a duplicate digest')
			descriptorDigests.add(descriptor.digest)
			descriptors.push(descriptor)
		}
		url = nextReferrersUrl(response.headers.get('Link'), url, registryOrigin, pathname)
	}

	return descriptors.slice(0, limit)
}

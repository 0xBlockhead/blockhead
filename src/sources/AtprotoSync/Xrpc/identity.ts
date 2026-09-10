import bindings from '$/sources/AtprotoSync/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { validateAtprotoServiceOrigin } from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { type } from 'arktype'


const plcBindingTargetKey = 'atproto-plc-directory'
const didWebBindingTargetKey = 'atproto-did-web'

const didDocumentServiceWire = type({
	id: 'string',
	type: 'string | string[]',
	serviceEndpoint: 'unknown',
}).onUndeclaredKey('delete')

const didDocumentWire = type({
	id: 'string',
	service: didDocumentServiceWire.array(),
}).onUndeclaredKey('delete')

const pdsEndpointWire = type('string')


const sourceBindings = bindings[Source.AtprotoSync_Xrpc]

const bindingForTarget = (targetKey: string) => {
	const binding = sourceBindings.find((candidate) => (
		candidate.target.kind === SourceTargetKind.Global
		&& candidate.target.key === targetKey
	))
	if (binding == null)
		throw new Error(`AtprotoSync_Xrpc: missing identity binding ${targetKey}`)
	if (
		binding.delivery !== SourceDelivery.RemoteQuery
		|| binding.wireProtocol !== WireProtocol.HttpRest
		|| binding.apiFamily !== ApiFamily.RestJson
	)
		throw new Error(`AtprotoSync_Xrpc: invalid identity binding ${targetKey}`)

	return binding
}

const resolvedBinding = (binding: ReturnType<typeof bindingForTarget>, origin: string) => {
	const resolveEndpoint = (endpoint: typeof binding.endpoints[number]) => ({
		...endpoint,
		locator: origin,
	})
	return {
		...binding,
		endpoints: [
			resolveEndpoint(binding.endpoints[0]),
			...binding.endpoints.slice(1).map(resolveEndpoint),
		] as const,
	}
}


export const parseAtprotoDidDocument = ({
	did,
	document,
}: {
	did: string
	document: unknown
}) => {
	const parsedDocument = didDocumentWire(document)
	if (parsedDocument instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed DID document: ${parsedDocument.summary}`)
	if (parsedDocument.id !== did)
		throw new Error(`AtprotoSync_Xrpc: DID document id ${parsedDocument.id} does not match ${did}`)

	const pdsService = parsedDocument.service.find((service) => (
		service.type === 'AtprotoPersonalDataServer'
		&& (service.id === '#atproto_pds' || service.id === `${did}#atproto_pds`)
	))
	if (pdsService == null)
		throw new Error(`AtprotoSync_Xrpc: DID document has no AtprotoPersonalDataServer service for ${did}`)

	const endpoint = pdsEndpointWire(pdsService.serviceEndpoint)
	if (endpoint instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed PDS service endpoint: ${endpoint.summary}`)

	return validateAtprotoServiceOrigin(endpoint)
}

const didWebDocumentUrl = (did: string) => {
	if (!did.startsWith('did:web:'))
		throw new Error(`AtprotoSync_Xrpc: unsupported DID method for ${did}`)

	const authority = did.slice('did:web:'.length)
	if (
		authority.length > 253
		|| !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(authority)
		|| /\.(?:arpa|invalid|local|localhost|onion)$/.test(authority)
	)
		throw new Error(`AtprotoSync_Xrpc: malformed did:web identifier ${did}`)

	let origin: string
	try {
		origin = validateAtprotoServiceOrigin(`https://${authority}`)
	} catch (error) {
		throw new Error(`AtprotoSync_Xrpc: invalid did:web authority ${authority}`, { cause: error })
	}

	return {
		origin,
		url: new URL('/.well-known/did.json', origin).toString(),
	}
}

const readDidDocument = (
	binding: SourceBinding,
	url: string,
	signal?: AbortSignal
) => sourceGetJson<unknown>(binding, url, [], {
	signal,
	redirect: 'error',
})


export const getCurrentPdsOrigin = async ({
	did,
	signal,
}: {
	did: string
	signal?: AbortSignal
}) => {
	signal?.throwIfAborted()
	if (typeof window !== 'undefined')
		throw new Error('AtprotoSync_Xrpc: DID identity must run through a SvelteKit query')

	if (did.length > 2048 || !/^did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-]$/.test(did))
		throw new Error(`AtprotoSync_Xrpc: malformed DID identifier ${did}`)

	if (did.startsWith('did:plc:')) {
		if (!/^did:plc:[a-z2-7]{24}$/.test(did))
			throw new Error(`AtprotoSync_Xrpc: malformed did:plc identifier ${did}`)

		const binding = bindingForTarget(plcBindingTargetKey)
		return parseAtprotoDidDocument({
			did,
			document: await readDidDocument(
				binding,
				new URL(`/${encodeURIComponent(did)}`, firstHttpUrlForBinding(binding)).toString(),
				signal
			),
		})
	}

	const didWeb = didWebDocumentUrl(did)
	const binding = bindingForTarget(didWebBindingTargetKey)
	return parseAtprotoDidDocument({
		did,
		document: await readDidDocument(
			resolvedBinding(binding, didWeb.origin),
			didWeb.url,
			signal
		),
	})
}

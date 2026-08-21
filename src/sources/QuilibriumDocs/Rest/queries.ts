import {
	quilibriumNodeInterfaces,
	quilibriumProtocolFacts,
	quilibriumServiceLayers,
} from '$/constants/QuilibriumNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	quilibriumDocsBaseUrl,
	quilibriumDocsPages,
	quilibriumProtocolDocuments,
} from '$/sources/QuilibriumDocs/Rest/constants.ts'
import type {
	QuilibriumDocsEndpoint,
	QuilibriumDocsNodeInterface,
	QuilibriumDocsProtocolDocument,
	QuilibriumDocsProtocolFact,
	QuilibriumDocsServiceLayer,
} from '$/sources/QuilibriumDocs/Rest/types.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/QuilibriumDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'

const docsBinding = () => {
	const binding = bindings[Source.QuilibriumDocs_Rest].find((candidate) => candidate.target.key === 'docs')
	if (binding == null)
		throw new Error('QuilibriumDocs_Rest: docs binding is unavailable')
	return binding
}

const assertQuilibriumNetwork = (networkSlug: string) => {
	if (networkSlug !== 'quilibrium')
		throw new Error(`QuilibriumDocs_Rest: unsupported network: ${networkSlug}`)
}

export const getDocsEndpoints = () => {
	const endpoints = docsBinding().endpoints
		.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		.filter((endpoint) => endpoint.locator === quilibriumDocsBaseUrl)
		.map((endpoint) => ({
			url: endpoint.locator,
			transportType: TransportType.Http,
			providerName: 'Quilibrium docs',
		})) satisfies QuilibriumDocsEndpoint[]

	if (endpoints.length === 0)
		throw new Error('QuilibriumDocs_Rest: no docs endpoints')

	return endpoints
}

export const getNodeInterfaces = ({
	networkSlug,
}: {
	networkSlug: string
}) => {
	assertQuilibriumNetwork(networkSlug)
	return quilibriumNodeInterfaces satisfies readonly QuilibriumDocsNodeInterface[]
}

export const getProtocolFacts = ({
	networkSlug,
}: {
	networkSlug: string
}) => {
	assertQuilibriumNetwork(networkSlug)
	return quilibriumProtocolFacts satisfies readonly QuilibriumDocsProtocolFact[]
}

export const getServiceLayers = ({
	networkSlug,
}: {
	networkSlug: string
}) => {
	assertQuilibriumNetwork(networkSlug)
	return quilibriumServiceLayers satisfies readonly QuilibriumDocsServiceLayer[]
}

export const listProtocolDocuments = () => (
	quilibriumProtocolDocuments
)

export const getProtocolDocument = ({
	number,
}: {
	number: number
}) => {
	const document = quilibriumProtocolDocuments.find((protocolDocument) => protocolDocument.number === number)
	if (document == null)
		throw new Error(`QuilibriumDocs_Rest: document not found ${number.toString()}`)

	return document
}

export const getPrimaryProtocolDocument = (): QuilibriumDocsProtocolDocument => {
	const document = quilibriumProtocolDocuments[0]
	if (document == null)
		throw new Error('QuilibriumDocs_Rest: primary protocol document is unavailable')
	return document
}

export const getPages = quilibriumDocsPages

export const getPage = ({
	url,
}: {
	url: string
}) => {
	if (!url.startsWith(`${quilibriumDocsBaseUrl}/`))
		throw new Error(`QuilibriumDocs_Rest: url outside docs origin: ${url}`)

	if (!quilibriumDocsPages.some((page) => page.url === url))
		throw new Error(`QuilibriumDocs_Rest: unknown docs page: ${url}`)

	return getText(docsBinding(), url.slice(quilibriumDocsBaseUrl.length) || '/')
}

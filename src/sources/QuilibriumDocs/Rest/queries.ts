import {
	quilibriumNodeInterfaces,
	quilibriumProtocolFacts,
	quilibriumServiceLayers,
} from '$/constants/QuilibriumNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import type {
	QuilibriumDocsEndpoint,
	QuilibriumDocsNodeInterface,
	QuilibriumDocsPage,
	QuilibriumDocsProtocolDocument,
	QuilibriumDocsProtocolFact,
	QuilibriumDocsServiceLayer,
} from '$/sources/QuilibriumDocs/Rest/types.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/QuilibriumDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'

const quilibriumDocsBaseUrl = 'https://docs.quilibrium.com'
const binding = bindings[Source.QuilibriumDocs_Rest][0]

const protocolDocuments = [
	{
		number: 1,
		documentBody: 'Quilibrium protocol whitepaper and architecture reference.',
		documentCategory: 'Protocol document',
		documentStatus: 'Published',
		documentTitle: 'Quilibrium peer-to-peer MPC platform whitepaper',
	},
] as const satisfies readonly QuilibriumDocsProtocolDocument[]

const assertQuilibriumNetwork = (networkSlug: string) => {
	if (networkSlug !== 'quilibrium')
		throw new Error(`QuilibriumDocs_Rest: unsupported network: ${networkSlug}`)
}

export const getDocsEndpoints = () => {
	const endpoints = bindings[Source.QuilibriumDocs_Rest]
		.flatMap((sourceBinding) => sourceBinding.endpoints)
		.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
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
	protocolDocuments
)

export const getProtocolDocument = ({
	number,
}: {
	number: number
}) => {
	const document = protocolDocuments.find((protocolDocument) => protocolDocument.number === number)
	if (document == null)
		throw new Error(`QuilibriumDocs_Rest: document not found ${number.toString()}`)

	return document
}

export const getPages = [
	{
		url: `${quilibriumDocsBaseUrl}/docs/discover/what-is-quilibrium/`,
		title: 'What is Quilibrium',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/protocol/overview/`,
		title: 'Protocol overview',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/protocol/consensus/`,
		title: 'Consensus mechanism',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/learn/oblivious-hypergraph/`,
		title: 'Oblivious hypergraph',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/discover/quilibrium-kms/`,
		title: 'Quilibrium KMS',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/api/q-storage/overview/`,
		title: 'QStorage overview',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/build/q-service-apis/`,
		title: 'Q service APIs',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/run-node/quick-start/`,
		title: 'Node quick start',
	},
] as const satisfies readonly QuilibriumDocsPage[]

export const getPage = ({
	url,
}: {
	url: string
}) => {
	if (!url.startsWith(`${quilibriumDocsBaseUrl}/`))
		throw new Error(`QuilibriumDocs_Rest: url outside docs origin: ${url}`)

	return getText(binding, url.slice(quilibriumDocsBaseUrl.length) || '/')
}
